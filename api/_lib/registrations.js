"use strict";

var schema = require("../../js/schema.js");

function supabaseConfig() {
  var url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  var key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ""), key: key };
}

function speechConfig() {
  var key = process.env.AZURE_SPEECH_KEY;
  var region = String(process.env.AZURE_SPEECH_REGION || "").trim();
  if (!key || !/^[a-z0-9-]{2,40}$/i.test(region)) return null;
  return { key: key, region: region };
}

async function sb(config, path, options) {
  options = options || {};
  var headers = Object.assign({
    apikey: config.key,
    Authorization: "Bearer " + config.key
  }, options.headers || {});
  return fetch(config.url + path, {
    method: options.method || "GET",
    headers: headers,
    body: options.body
  });
}

async function findByIdempotency(config, key) {
  var response = await sb(
    config,
    "/rest/v1/karigar_registrations?idempotency_key=eq." + encodeURIComponent(key) + "&select=id,registration_no&limit=1"
  );
  if (!response.ok) throw new Error("lookup_failed");
  var rows = await response.json();
  return Array.isArray(rows) && rows.length ? rows[0] : null;
}

async function findDuplicateCandidates(config, record) {
  var mobileQuery = "/rest/v1/karigar_registrations?mobile_normalized=eq."
    + encodeURIComponent(record.mobile_normalized)
    + "&select=id,full_name,mobile_normalized,address_district,registration_no&limit=5";
  var nameQuery = "/rest/v1/karigar_registrations?full_name=eq."
    + encodeURIComponent(record.full_name)
    + "&address_district=eq." + encodeURIComponent(record.address_district)
    + "&select=id,full_name,mobile_normalized,address_district,registration_no&limit=5";
  var mobileRes = await sb(config, mobileQuery);
  var nameRes = await sb(config, nameQuery);
  if (!mobileRes.ok || !nameRes.ok) throw new Error("duplicate_check_failed");
  var mobileRows = await mobileRes.json();
  var nameRows = await nameRes.json();
  return []
    .concat(Array.isArray(mobileRows) ? mobileRows : [])
    .concat(Array.isArray(nameRows) ? nameRows : []);
}

async function countRecentByIp(config, ipHash) {
  if (!ipHash) return 0;
  var since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  var query = "/rest/v1/karigar_registrations?submitter_ip_hash=eq." + encodeURIComponent(ipHash)
    + "&created_at=gte." + encodeURIComponent(since)
    + "&select=id";
  var response = await sb(config, query);
  if (!response.ok) return 0;
  var rows = await response.json();
  return Array.isArray(rows) ? rows.length : 0;
}

async function photoExists(config, path) {
  var response = await sb(config, "/storage/v1/object/karigar-photos/" + path, { method: "HEAD" });
  return response.ok;
}

async function insertRegistration(config, record, ipHash) {
  var now = new Date().toISOString();
  var payload = Object.assign({}, record, {
    data_use_consent_at: now,
    photo_publicity_consent_at: record.photo_publicity_consent ? now : null,
    submitter_ip_hash: ipHash || null
  });
  var response = await sb(config, "/rest/v1/karigar_registrations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(payload)
  });
  if (response.status === 409) return { conflict: true };
  if (!response.ok) {
    var text = await response.text();
    if (text.indexOf("idempotency") !== -1 || text.indexOf("registration_no") !== -1) return { conflict: true };
    throw new Error("insert_failed");
  }
  var rows = await response.json();
  return { ok: true, row: Array.isArray(rows) ? rows[0] : rows };
}

function listFilters(query, role) {
  var page = Math.max(1, parseInt(query.page, 10) || 1);
  var params = ["select=*", "order=created_at.desc", "limit=20", "offset=" + String((page - 1) * 20)];
  if (query.status && schema.STATUSES[query.status]) params.push("status=eq." + encodeURIComponent(query.status));
  if (query.attendance && schema.ATTENDANCE_ADMIN[query.attendance]) {
    params.push("attendance_status=eq." + encodeURIComponent(query.attendance));
  }
  if (query.category && schema.WORK_CATEGORIES[query.category]) {
    params.push("work_categories=cs.{" + query.category + "}");
  }
  if (query.publicity === "yes") params.push("photo_publicity_consent=eq.true");
  if (query.publicity === "no") params.push("photo_publicity_consent=eq.false");
  if (query.team) {
    var team = String(query.team).replace(/[%*,().]/g, "").slice(0, 80);
    if (team) params.push("or=(team_name.ilike.*" + encodeURIComponent(team) + "*,sardar_name.ilike.*" + encodeURIComponent(team) + "*)");
  }
  if (query.q) {
    var q = String(query.q).replace(/[%*,().]/g, "").slice(0, 80);
    if (q) {
      var parts = [
        "full_name.ilike.*" + encodeURIComponent(q) + "*",
        "registration_no.ilike.*" + encodeURIComponent(q) + "*"
      ];
      if (role === "event_admin" && /^\d{6,}$/.test(q.replace(/\D/g, "")) && q.replace(/\D/g, "").length >= 6) {
        parts.push("mobile_normalized.ilike.*" + encodeURIComponent(q.replace(/\D/g, "")) + "*");
      }
      params.push("or=(" + parts.join(",") + ")");
    }
  }
  return { path: "/rest/v1/karigar_registrations?" + params.join("&"), page: page };
}

function shapeRow(row, role) {
  if (!row) return null;
  var contact = ["mobile", "mobile_normalized", "sardar_mobile", "sardar_mobile_normalized", "address_pin"];
  var out = {};
  Object.keys(row).forEach(function (key) {
    if (key === "submitter_ip_hash") return;
    if (role !== "event_admin" && contact.indexOf(key) !== -1) return;
    out[key] = row[key];
  });
  out.photo_available = Boolean(row.photo_storage_path);
  delete out.photo_storage_path;
  return out;
}

function exportQuery(kind) {
  var plan = schema.exportPlan(kind, "event_admin");
  if (!plan.ok && kind !== "contacts") plan = schema.exportPlan(kind, "event_viewer");
  var params = ["select=*", "order=full_name.asc", "limit=5000"];
  if (kind === "verified" || kind === "roster" || kind === "checkin") {
    params.push("status=in.(verified,confirmed)");
  }
  if (kind === "gallery") {
    params.push("status=in.(verified,confirmed)");
    params.push("photo_publicity_consent=eq.true");
  }
  return "/rest/v1/karigar_registrations?" + params.join("&");
}

var PATCH_FIELDS = {
  full_name: true,
  mobile: true,
  address_locality: true,
  address_post_office: true,
  address_police_station: true,
  address_district: true,
  address_pin: true,
  work_categories: true,
  work_description: true,
  team_name: true,
  team_unknown: true,
  sardar_name: true,
  sardar_unknown: true,
  sardar_mobile: true,
  attendance_status: true,
  status: true,
  verification_note: true,
  assisted: true,
  assisted_by: true,
  photo_follow_up: true
};

function sanitizePatch(body, current) {
  var errors = {};
  var next = {};
  if (!body || typeof body !== "object") return { ok: false, errors: { body: "invalid" } };
  Object.keys(body).forEach(function (key) {
    if (key === "photo_publicity_consent") {
      if (body[key] === true && current && current.photo_publicity_consent !== true) {
        errors.photo_publicity_consent = "locked";
      } else if (body[key] === false) next.photo_publicity_consent = false;
      return;
    }
    if (!PATCH_FIELDS[key]) return;
    next[key] = body[key];
  });
  if (next.full_name != null) {
    next.full_name = String(next.full_name).trim();
    if (next.full_name.length < 2) errors.full_name = "required";
  }
  if (next.mobile != null) {
    next.mobile = schema.normalizeMobile(next.mobile);
    next.mobile_normalized = next.mobile;
    if (!schema.isValidMobile(next.mobile)) errors.mobile = "invalid";
  }
  if (next.work_categories) {
    if (!Array.isArray(next.work_categories) || !next.work_categories.length) errors.work_categories = "required";
    else {
      for (var i = 0; i < next.work_categories.length; i += 1) {
        if (!schema.WORK_CATEGORIES[next.work_categories[i]]) errors.work_categories = "not_allowed";
      }
    }
  }
  if (next.attendance_status && !schema.ATTENDANCE_ADMIN[next.attendance_status]) errors.attendance_status = "invalid";
  if (next.status && !schema.STATUSES[next.status]) errors.status = "invalid";
  if (next.verification_note != null && String(next.verification_note).length > 500) errors.verification_note = "too_long";
  if (next.address_pin) {
    var pin = schema.toAsciiDigits(next.address_pin).replace(/\D/g, "");
    if (pin && !/^\d{6}$/.test(pin)) errors.address_pin = "invalid";
    next.address_pin = pin || null;
  }
  if (next.sardar_mobile) {
    next.sardar_mobile = schema.normalizeMobile(next.sardar_mobile);
    next.sardar_mobile_normalized = next.sardar_mobile;
    if (!schema.isValidMobile(next.sardar_mobile)) errors.sardar_mobile = "invalid";
  }
  if (Object.keys(errors).length) return { ok: false, errors: errors };
  next.updated_at = new Date().toISOString();
  if (next.photo_publicity_consent === false) next.photo_publicity_consent_at = null;
  return { ok: true, patch: next };
}

function imageSize(buffer) {
  if (!buffer || buffer.length < 10) return null;
  if (buffer.length >= 24 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer.toString("ascii", 12, 16) === "IHDR") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    var i = 2;
    while (i + 9 < buffer.length) {
      if (buffer[i] !== 0xff) return null;
      var marker = buffer[i + 1];
      if (marker === 0xda || marker === 0xd9) return null;
      var len = buffer.readUInt16BE(i + 2);
      if (len < 2) return null;
      if (marker >= 0xc0 && marker <= 0xc2) {
        return { height: buffer.readUInt16BE(i + 5), width: buffer.readUInt16BE(i + 7) };
      }
      i += 2 + len;
    }
  }
  if (buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP") {
    var chunk = buffer.toString("ascii", 12, 16);
    if (chunk === "VP8X" && buffer.length >= 30) {
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3)
      };
    }
    if (chunk === "VP8 " && buffer.length >= 30 && buffer[23] === 0x9d && buffer[24] === 0x01 && buffer[25] === 0x2a) {
      return {
        width: buffer.readUInt16LE(26) & 0x3fff,
        height: buffer.readUInt16LE(28) & 0x3fff
      };
    }
    if (chunk === "VP8L" && buffer.length >= 25 && buffer[20] === 0x2f) {
      var bits = buffer.readUInt32LE(21);
      return {
        width: (bits & 0x3fff) + 1,
        height: ((bits >> 14) & 0x3fff) + 1
      };
    }
  }
  return null;
}

function stripJpegExif(buffer) {
  if (!buffer || buffer.length < 4 || buffer[0] !== 0xff || buffer[1] !== 0xd8) return buffer;
  var parts = [buffer.slice(0, 2)];
  var i = 2;
  while (i + 1 < buffer.length && buffer[i] === 0xff) {
    var marker = buffer[i + 1];
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd9)) {
      parts.push(buffer.slice(i, i + 2));
      i += 2;
      if (marker === 0xd9) return Buffer.concat(parts);
      continue;
    }
    if (marker === 0xda) {
      parts.push(buffer.slice(i));
      return Buffer.concat(parts);
    }
    if (i + 3 >= buffer.length) break;
    var len = buffer.readUInt16BE(i + 2);
    if (len < 2 || i + 2 + len > buffer.length) break;
    if (marker !== 0xe1) parts.push(buffer.slice(i, i + 2 + len));
    i += 2 + len;
  }
  return buffer;
}

function sniffImage(buffer) {
  if (!buffer || buffer.length < 12) return null;
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { mime: "image/jpeg", ext: "jpg" };
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return { mime: "image/png", ext: "png" };
  if (buffer.slice(0, 4).toString("ascii") === "RIFF" && buffer.slice(8, 12).toString("ascii") === "WEBP") {
    return { mime: "image/webp", ext: "webp" };
  }
  return null;
}

module.exports = {
  schema: schema,
  supabaseConfig: supabaseConfig,
  speechConfig: speechConfig,
  sb: sb,
  findByIdempotency: findByIdempotency,
  findDuplicateCandidates: findDuplicateCandidates,
  countRecentByIp: countRecentByIp,
  photoExists: photoExists,
  insertRegistration: insertRegistration,
  listFilters: listFilters,
  shapeRow: shapeRow,
  exportQuery: exportQuery,
  sanitizePatch: sanitizePatch,
  sniffImage: sniffImage,
  imageSize: imageSize,
  stripJpegExif: stripJpegExif
};
