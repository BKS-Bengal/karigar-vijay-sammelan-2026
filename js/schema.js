(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.KVSSchema = factory();
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var CONSENT_VERSION = "kvs-2026-bn-v1";
  var WORK_CATEGORIES = {
    structure_bamboo: true,
    fabrication: true,
    decoration_draping: true,
    painting_finishing: true,
    lighting_installation: true,
    other_pandal_work: true
  };
  var ATTENDANCE_PUBLIC = { yes: true, unsure: true, no: true };
  var ATTENDANCE_ADMIN = { yes: true, unsure: true, no: true, attended: true, absent: true };
  var STATUSES = {
    pending_verification: true,
    needs_correction: true,
    verified: true,
    confirmed: true,
    waitlisted: true,
    cancelled: true
  };
  var LOCALES = { "bn-IN": true, "en-IN": true, "hi-IN": true };
  var MAX = {
    full_name: 120,
    locality: 120,
    post: 120,
    police: 120,
    district: 80,
    work_description: 500,
    team: 120,
    sardar: 120,
    note: 500,
    assisted_by: 120
  };
  var PHOTO_PATH = /^photos\/[0-9a-f-]{36}\.(jpg|png|webp)$/;
  var UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  function trim(value) {
    if (value == null) return "";
    return String(value).trim();
  }

  function toAsciiDigits(value) {
    var bn = "০১২৩৪৫৬৭৮৯";
    var hi = "०१२३४५६७८९";
    return String(value == null ? "" : value).replace(/[০-৯०-९]/g, function (ch) {
      var b = bn.indexOf(ch);
      if (b >= 0) return String(b);
      var h = hi.indexOf(ch);
      return h >= 0 ? String(h) : "";
    });
  }

  function normalizeMobile(mobile) {
    var digits = toAsciiDigits(mobile).replace(/\D/g, "");
    if (digits.length === 12 && digits.indexOf("91") === 0) digits = digits.slice(2);
    if (digits.length === 11 && digits.charAt(0) === "0") digits = digits.slice(1);
    return digits;
  }

  function isValidMobile(digits) {
    return /^[6-9]\d{9}$/.test(digits);
  }

  function groupDigits(digits) {
    var d = normalizeMobile(digits);
    if (d.length === 10) return d.slice(0, 5) + " " + d.slice(5);
    return d;
  }

  function isUuid(value) {
    return UUID.test(trim(value));
  }

  function photoPathOk(value) {
    return PHOTO_PATH.test(trim(value));
  }

  function fold(value) {
    return trim(value).toLowerCase().replace(/\s+/g, " ");
  }

  function randomBytes(n) {
    try {
      if (typeof require === "function") return require("crypto").randomBytes(n);
    } catch (err) { /* browser */ }
    var arr = new Uint8Array(n);
    globalThis.crypto.getRandomValues(arr);
    return arr;
  }

  function registrationNo() {
    var alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    var bytes = randomBytes(6);
    var out = "";
    for (var i = 0; i < 6; i += 1) out += alphabet[bytes[i] % alphabet.length];
    return "KVS26-" + out;
  }

  function optionalText(body, key, max, errors) {
    var value = trim(body[key]);
    if (!value) return null;
    if (value.length > max) errors[key] = "too_long";
    return value;
  }

  function flag(value) {
    return value === true || value === "true";
  }

  function sanitizeRegistration(body, options) {
    options = options || {};
    var admin = options.admin === true;
    var errors = {};
    if (!body || typeof body !== "object") return { ok: false, errors: { body: "invalid" } };
    if (trim(body.website)) return { ok: false, errors: { website: "honeypot" } };

    var key = trim(body.idempotency_key);
    if (!isUuid(key)) errors.idempotency_key = "invalid";

    var fullName = trim(body.full_name);
    if (fullName.length < 2 || fullName.length > MAX.full_name) errors.full_name = "required";

    var mobile = normalizeMobile(body.mobile);
    if (!isValidMobile(mobile)) errors.mobile = "invalid";

    var locality = trim(body.address_locality);
    if (!locality || locality.length > MAX.locality) errors.address_locality = "required";

    var postOffice = optionalText(body, "address_post_office", MAX.post, errors);
    var police = optionalText(body, "address_police_station", MAX.police, errors);
    var district = trim(body.address_district);
    if (!district || district.length > MAX.district) errors.address_district = "required";

    var pinRaw = trim(body.address_pin);
    var pin = null;
    if (pinRaw) {
      pin = toAsciiDigits(pinRaw).replace(/\D/g, "");
      if (!/^\d{6}$/.test(pin)) errors.address_pin = "invalid";
    }

    var catsIn = Array.isArray(body.work_categories) ? body.work_categories : [];
    var cats = [];
    var seen = {};
    for (var i = 0; i < catsIn.length; i += 1) {
      var cat = trim(catsIn[i]);
      if (!cat) continue;
      if (cat === "idol_making" || !WORK_CATEGORIES[cat]) {
        errors.work_categories = "not_allowed";
        continue;
      }
      if (!seen[cat]) {
        seen[cat] = true;
        cats.push(cat);
      }
    }
    if (!cats.length && !errors.work_categories) errors.work_categories = "required";

    var workDescription = trim(body.work_description);
    if (workDescription.length > MAX.work_description) errors.work_description = "too_long";

    var teamUnknown = flag(body.team_unknown);
    var teamName = trim(body.team_name);
    if (teamUnknown) teamName = "";
    else if (!teamName || teamName.length > MAX.team) errors.team_name = "required";

    var sardarUnknown = flag(body.sardar_unknown);
    var sardarName = trim(body.sardar_name);
    if (sardarUnknown) sardarName = "";
    else if (!sardarName || sardarName.length > MAX.sardar) errors.sardar_name = "required";

    var sardarMobileRaw = trim(body.sardar_mobile);
    var sardarMobile = "";
    if (sardarMobileRaw) {
      sardarMobile = normalizeMobile(sardarMobileRaw);
      if (!isValidMobile(sardarMobile)) errors.sardar_mobile = "invalid";
    }

    var attendance = trim(body.attendance_status);
    var attendanceSet = admin ? ATTENDANCE_ADMIN : ATTENDANCE_PUBLIC;
    if (!attendanceSet[attendance]) errors.attendance_status = "invalid";

    var followUp = flag(body.photo_follow_up);
    var photoPath = trim(body.photo_storage_path);
    if (photoPath && !photoPathOk(photoPath)) errors.photo_storage_path = "invalid";
    if (!photoPath && !followUp) errors.photo = "required";

    if (!flag(body.data_use_consent)) errors.data_use_consent = "required";
    if (trim(body.consent_version) !== CONSENT_VERSION) errors.consent_version = "invalid";

    var publicity = flag(body.photo_publicity_consent);
    var locale = trim(body.locale) || "bn-IN";
    if (!LOCALES[locale]) errors.locale = "invalid";

    var assisted = admin && flag(body.assisted);
    var assistedBy = trim(body.assisted_by);
    if (assisted && (!assistedBy || assistedBy.length > MAX.assisted_by)) errors.assisted_by = "required";

    if (Object.keys(errors).length) return { ok: false, errors: errors };

    return {
      ok: true,
      record: {
        idempotency_key: key,
        full_name: fullName,
        mobile: mobile,
        mobile_normalized: mobile,
        address_locality: locality,
        address_post_office: postOffice,
        address_police_station: police,
        address_district: district,
        address_pin: pin,
        work_categories: cats,
        work_description: workDescription || null,
        team_name: teamUnknown ? null : teamName,
        team_unknown: teamUnknown,
        sardar_name: sardarUnknown ? null : sardarName,
        sardar_unknown: sardarUnknown,
        sardar_mobile: sardarMobile || null,
        sardar_mobile_normalized: sardarMobile || null,
        attendance_status: attendance,
        photo_storage_path: photoPath || null,
        photo_follow_up: !photoPath && followUp,
        consent_version: CONSENT_VERSION,
        photo_publicity_consent: publicity,
        status: "pending_verification",
        assisted: assisted,
        assisted_by: assisted ? assistedBy : null,
        locale: locale,
        possible_duplicate: false
      }
    };
  }

  function planCreate(record, lookup) {
    lookup = lookup || {};
    if (lookup.byKey && lookup.byKey.registration_no) {
      return {
        action: "replay",
        registration_no: lookup.byKey.registration_no,
        id: lookup.byKey.id || null
      };
    }
    var duplicate = false;
    var matches = lookup.matches || [];
    for (var i = 0; i < matches.length; i += 1) {
      var row = matches[i];
      if (row.mobile_normalized && row.mobile_normalized === record.mobile_normalized) duplicate = true;
      if (fold(row.full_name) === fold(record.full_name) && fold(row.address_district) === fold(record.address_district)) {
        duplicate = true;
      }
    }
    return {
      action: "insert",
      record: Object.assign({}, record, { possible_duplicate: duplicate })
    };
  }

  var EXPORTS = {
    verified: {
      columns: ["registration_no", "full_name", "work_categories", "team_name", "sardar_name", "attendance_status", "status"]
    },
    team: {
      columns: ["registration_no", "full_name", "team_name", "team_unknown", "sardar_name", "sardar_unknown", "work_categories", "status"]
    },
    roster: {
      columns: ["registration_no", "full_name", "work_categories", "team_name", "photo_available", "status"]
    },
    checkin: {
      columns: ["registration_no", "full_name", "team_name", "sardar_name", "attendance_status", "status"]
    },
    gallery: {
      columns: ["registration_no", "full_name", "work_categories", "status"],
      gallery: true
    },
    contacts: {
      columns: ["registration_no", "full_name", "mobile", "address_locality", "address_district", "address_pin", "sardar_name", "sardar_mobile", "status"],
      adminOnly: true
    }
  };

  function exportPlan(kind, role) {
    var plan = EXPORTS[kind];
    if (!plan) return { ok: false, error: "invalid_export" };
    if (plan.adminOnly && role !== "event_admin") return { ok: false, error: "forbidden" };
    if (role !== "event_admin" && role !== "event_viewer") return { ok: false, error: "forbidden" };
    return {
      ok: true,
      kind: kind,
      columns: plan.columns.slice(),
      gallery: plan.gallery === true,
      adminOnly: plan.adminOnly === true
    };
  }

  function csvCell(value) {
    if (Array.isArray(value)) value = value.join("|");
    if (value == null) value = "";
    var text = String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
    if (/[",\n\r]/.test(text)) return '"' + text.replace(/"/g, '""') + '"';
    return text;
  }

  function toCsv(rows, columns) {
    var lines = [columns.join(",")];
    for (var i = 0; i < rows.length; i += 1) {
      var cells = [];
      for (var c = 0; c < columns.length; c += 1) cells.push(csvCell(rows[i][columns[c]]));
      lines.push(cells.join(","));
    }
    return "\uFEFF" + lines.join("\r\n");
  }

  function publicView(row) {
    if (!row) return null;
    return { registration_no: row.registration_no };
  }

  return {
    CONSENT_VERSION: CONSENT_VERSION,
    WORK_CATEGORIES: WORK_CATEGORIES,
    ATTENDANCE_PUBLIC: ATTENDANCE_PUBLIC,
    ATTENDANCE_ADMIN: ATTENDANCE_ADMIN,
    STATUSES: STATUSES,
    LOCALES: LOCALES,
    normalizeMobile: normalizeMobile,
    groupDigits: groupDigits,
    toAsciiDigits: toAsciiDigits,
    isValidMobile: isValidMobile,
    isUuid: isUuid,
    photoPathOk: photoPathOk,
    registrationNo: registrationNo,
    sanitizeRegistration: sanitizeRegistration,
    planCreate: planCreate,
    exportPlan: exportPlan,
    toCsv: toCsv,
    publicView: publicView,
    fold: fold
  };
});
