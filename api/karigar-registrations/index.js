"use strict";

var http = require("../_lib/http");
var reg = require("../_lib/registrations");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  var body = await http.readBody(req);
  if (!body) {
    http.json(res, 400, { ok: false, error: "invalid_payload" });
    return;
  }
  var session = http.sessionFromRequest(req);
  var admin = session && session.role === "event_admin" && (body.assisted === true || body.assisted === "true");
  var parsed = reg.schema.sanitizeRegistration(body, { admin: admin });
  if (!parsed.ok) {
    if (parsed.errors.website === "honeypot") {
      http.json(res, 400, { ok: false, error: "invalid_payload" });
      return;
    }
    http.json(res, 400, { ok: false, error: "validation_failed", fields: parsed.errors });
    return;
  }
  var config = reg.supabaseConfig();
  if (!config) {
    http.json(res, 503, { ok: false, error: "configuration_missing" });
    return;
  }
  try {
    var ipHash = http.hashIp(http.getClientIp(req));
    if (http.rateLimit("reg:" + (ipHash || "none"), 8, 60 * 60 * 1000)) {
      http.json(res, 429, { ok: false, error: "rate_limited" });
      return;
    }
    var recent = await reg.countRecentByIp(config, ipHash);
    if (recent >= 8) {
      http.json(res, 429, { ok: false, error: "rate_limited" });
      return;
    }
    var existing = await reg.findByIdempotency(config, parsed.record.idempotency_key);
    var matches = existing ? [] : await reg.findDuplicateCandidates(config, parsed.record);
    var plan = reg.schema.planCreate(parsed.record, { byKey: existing, matches: matches });
    if (plan.action === "replay") {
      http.json(res, 200, { ok: true, registration_no: plan.registration_no, replayed: true });
      return;
    }
    if (plan.record.photo_storage_path) {
      var exists = await reg.photoExists(config, plan.record.photo_storage_path);
      if (!exists) {
        http.json(res, 400, { ok: false, error: "photo_missing" });
        return;
      }
    }
    var inserted = null;
    var attempt = 0;
    while (attempt < 3 && !inserted) {
      attempt += 1;
      plan.record.registration_no = reg.schema.registrationNo();
      var result = await reg.insertRegistration(config, plan.record, ipHash);
      if (result.conflict) {
        var again = await reg.findByIdempotency(config, parsed.record.idempotency_key);
        if (again) {
          http.json(res, 200, { ok: true, registration_no: again.registration_no, replayed: true });
          return;
        }
        continue;
      }
      inserted = result.row;
    }
    if (!inserted) {
      http.json(res, 500, { ok: false, error: "server_error" });
      return;
    }
    http.json(res, 201, Object.assign({ ok: true }, reg.schema.publicView(inserted)));
    return;
  } catch (err) {
    http.json(res, 500, { ok: false, error: "server_error" });
  }
};
