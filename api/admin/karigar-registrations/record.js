"use strict";

var http = require("../../_lib/http");
var reg = require("../../_lib/registrations");

function changedFields(before, patch) {
  var diff = {};
  Object.keys(patch).forEach(function (key) {
    if (key === "updated_at") return;
    var previous = before ? before[key] : null;
    if (JSON.stringify(previous) !== JSON.stringify(patch[key])) {
      diff[key] = { from: previous == null ? null : previous, to: patch[key] };
    }
  });
  return diff;
}

module.exports = async function handler(req, res) {
  var session = http.sessionFromRequest(req);
  if (!session) {
    http.json(res, 401, { ok: false, error: "unauthenticated" });
    return;
  }
  var id = (req.query && req.query.id) || "";
  if (!reg.schema.isUuid(id)) {
    http.json(res, 400, { ok: false, error: "invalid_id" });
    return;
  }
  var config = reg.supabaseConfig();
  if (!config) {
    http.json(res, 503, { ok: false, error: "configuration_missing" });
    return;
  }
  if (req.method === "GET") {
    try {
      var response = await reg.sb(config, "/rest/v1/karigar_registrations?id=eq." + encodeURIComponent(id) + "&select=*&limit=1");
      if (!response.ok) {
        http.json(res, 500, { ok: false, error: "server_error" });
        return;
      }
      var rows = await response.json();
      if (!rows.length) {
        http.json(res, 404, { ok: false, error: "not_found" });
        return;
      }
      var auditRes = await reg.sb(
        config,
        "/rest/v1/karigar_registration_audit?registration_id=eq." + encodeURIComponent(id) + "&select=id,actor_role,action,changed_fields,created_at&order=created_at.desc&limit=50"
      );
      var audit = auditRes.ok ? await auditRes.json() : [];
      if (session.role !== "event_admin") {
        audit = (audit || []).map(function (item) {
          return {
            id: item.id,
            actor_role: item.actor_role,
            action: item.action,
            created_at: item.created_at,
            fields: item.changed_fields ? Object.keys(item.changed_fields) : []
          };
        });
      }
      http.json(res, 200, {
        ok: true,
        role: session.role,
        row: reg.shapeRow(rows[0], session.role),
        audit: audit
      });
    } catch (err) {
      http.json(res, 500, { ok: false, error: "server_error" });
    }
    return;
  }
  if (req.method !== "PATCH") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  if (session.role !== "event_admin") {
    http.json(res, 403, { ok: false, error: "forbidden" });
    return;
  }
  var body = await http.readBody(req);
  try {
    var currentRes = await reg.sb(config, "/rest/v1/karigar_registrations?id=eq." + encodeURIComponent(id) + "&select=*&limit=1");
    var currentRows = currentRes.ok ? await currentRes.json() : [];
    if (!currentRows.length) {
      http.json(res, 404, { ok: false, error: "not_found" });
      return;
    }
    var parsed = reg.sanitizePatch(body, currentRows[0]);
    if (!parsed.ok) {
      http.json(res, 400, { ok: false, error: "validation_failed", fields: parsed.errors });
      return;
    }
    var diff = changedFields(currentRows[0], parsed.patch);
    var saved = await reg.sb(config, "/rest/v1/karigar_registrations?id=eq." + encodeURIComponent(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify(parsed.patch)
    });
    if (!saved.ok) {
      http.json(res, 500, { ok: false, error: "server_error" });
      return;
    }
    var savedRows = await saved.json();
    if (Object.keys(diff).length) {
      await reg.sb(config, "/rest/v1/karigar_registration_audit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Prefer: "return=minimal" },
        body: JSON.stringify({
          registration_id: id,
          actor_role: session.role,
          action: "update",
          changed_fields: diff
        })
      });
    }
    http.json(res, 200, { ok: true, row: reg.shapeRow(savedRows[0], session.role) });
  } catch (err) {
    http.json(res, 500, { ok: false, error: "server_error" });
  }
};
