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
  try {
    var found = await reg.sb(
      config,
      "/rest/v1/karigar_registrations?id=eq." + encodeURIComponent(id) + "&select=photo_storage_path&limit=1"
    );
    if (!found.ok) {
      http.json(res, 500, { ok: false, error: "server_error" });
      return;
    }
    var rows = await found.json();
    var path = rows[0] && rows[0].photo_storage_path;
    if (!path) {
      http.json(res, 404, { ok: false, error: "not_found" });
      return;
    }
    var file = await reg.sb(config, "/storage/v1/object/karigar-photos/" + path);
    if (!file.ok) {
      http.json(res, 404, { ok: false, error: "not_found" });
      return;
    }
    var bytes = Buffer.from(await file.arrayBuffer());
    var sniffed = reg.sniffImage(bytes);
    res.statusCode = 200;
    res.setHeader("Content-Type", sniffed ? sniffed.mime : "application/octet-stream");
    res.setHeader("Cache-Control", "private, no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.end(bytes);
  } catch (err) {
    http.json(res, 500, { ok: false, error: "server_error" });
  }
};
