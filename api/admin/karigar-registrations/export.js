"use strict";

var http = require("../../_lib/http");
var reg = require("../../_lib/registrations");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  var session = http.sessionFromRequest(req);
  if (!session) {
    http.json(res, 401, { ok: false, error: "unauthenticated" });
    return;
  }
  var kind = (req.query && req.query.kind) || "";
  var plan = reg.schema.exportPlan(kind, session.role);
  if (!plan.ok) {
    http.json(res, plan.error === "forbidden" ? 403 : 400, { ok: false, error: plan.error });
    return;
  }
  var config = reg.supabaseConfig();
  if (!config) {
    http.json(res, 503, { ok: false, error: "configuration_missing" });
    return;
  }
  try {
    var response = await reg.sb(config, reg.exportQuery(kind));
    if (!response.ok) {
      http.json(res, 500, { ok: false, error: "server_error" });
      return;
    }
    var rows = await response.json();
    var shaped = (Array.isArray(rows) ? rows : []).map(function (row) {
      var view = reg.shapeRow(row, plan.adminOnly ? "event_admin" : session.role);
      view.photo_available = row.photo_storage_path ? "yes" : "no";
      if (kind === "gallery" && row.photo_publicity_consent !== true) return null;
      if ((kind === "verified" || kind === "roster" || kind === "checkin" || kind === "gallery")
        && row.status !== "verified" && row.status !== "confirmed") return null;
      return view;
    }).filter(Boolean);
    var csv = reg.schema.toCsv(shaped, plan.columns);
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", "attachment; filename=\"kvs-" + kind + ".csv\"");
    res.setHeader("Cache-Control", "no-store");
    res.end(csv);
  } catch (err) {
    http.json(res, 500, { ok: false, error: "server_error" });
  }
};
