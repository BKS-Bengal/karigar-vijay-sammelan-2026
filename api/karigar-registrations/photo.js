"use strict";

var crypto = require("crypto");
var http = require("../_lib/http");
var reg = require("../_lib/registrations");

var MAX_BYTES = 1800000;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  var ip = http.hashIp(http.getClientIp(req)) || "none";
  if (http.rateLimit("photo:" + ip, 20, 60 * 60 * 1000)) {
    http.json(res, 429, { ok: false, error: "rate_limited" });
    return;
  }
  var body = await http.readBody(req);
  if (!body || !body.image_base64) {
    http.json(res, 400, { ok: false, error: "invalid_payload" });
    return;
  }
  var raw;
  try { raw = Buffer.from(String(body.image_base64), "base64"); }
  catch (err) { raw = Buffer.alloc(0); }
  if (!raw.length || raw.length > MAX_BYTES) {
    http.json(res, 413, { ok: false, error: "too_large" });
    return;
  }
  var sniffed = reg.sniffImage(raw);
  var size = reg.imageSize(raw);
  if (!sniffed || !size || size.width < 16 || size.height < 16 || size.width > 4096 || size.height > 4096) {
    http.json(res, 400, { ok: false, error: "invalid_image" });
    return;
  }
  if (sniffed.ext === "jpg") raw = reg.stripJpegExif(raw);
  var config = reg.supabaseConfig();
  if (!config) {
    http.json(res, 503, { ok: false, error: "configuration_missing" });
    return;
  }
  var path = "photos/" + crypto.randomUUID() + "." + sniffed.ext;
  try {
    var response = await reg.sb(config, "/storage/v1/object/karigar-photos/" + path, {
      method: "POST",
      headers: {
        "Content-Type": sniffed.mime,
        "x-upsert": "false",
        "cache-control": "private, max-age=0"
      },
      body: raw
    });
    if (!response.ok) {
      http.json(res, 502, { ok: false, error: "storage_unavailable" });
      return;
    }
    http.json(res, 201, { ok: true, photo_storage_path: path });
  } catch (err) {
    http.json(res, 502, { ok: false, error: "storage_unavailable" });
  }
};
