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
  var config = reg.supabaseConfig();
  if (!config) {
    http.json(res, 503, { ok: false, error: "configuration_missing" });
    return;
  }
  var query = req.query || {};
  var built = reg.listFilters(query, session.role);
  try {
    var response = await reg.sb(config, built.path, {
      headers: { Prefer: "count=exact" }
    });
    if (!response.ok) {
      http.json(res, 500, { ok: false, error: "server_error" });
      return;
    }
    var rows = await response.json();
    var range = response.headers.get("content-range") || "";
    var total = 0;
    var slash = range.split("/")[1];
    if (slash && slash !== "*") total = parseInt(slash, 10) || 0;
    http.json(res, 200, {
      ok: true,
      role: session.role,
      page: built.page,
      total: total,
      rows: (Array.isArray(rows) ? rows : []).map(function (row) {
        return reg.shapeRow(row, session.role);
      })
    });
  } catch (err) {
    http.json(res, 500, { ok: false, error: "server_error" });
  }
};
