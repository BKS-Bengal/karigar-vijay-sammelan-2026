"use strict";

var http = require("../_lib/http");

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    var session = http.sessionFromRequest(req);
    if (!session) {
      http.json(res, 401, { ok: false, error: "unauthenticated" });
      return;
    }
    http.json(res, 200, { ok: true, role: session.role });
    return;
  }
  if (req.method === "DELETE") {
    http.clearSessionCookie(res);
    http.json(res, 200, { ok: true });
    return;
  }
  if (req.method !== "POST") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  var body = await http.readBody(req);
  var role = http.tokenRole(body && body.token);
  if (!role || !process.env.KARIGAR_SESSION_SECRET) {
    http.json(res, 401, { ok: false, error: "unauthenticated" });
    return;
  }
  var cookie = http.signSession(role);
  if (!cookie) {
    http.json(res, 503, { ok: false, error: "configuration_missing" });
    return;
  }
  http.setSessionCookie(req, res, cookie);
  http.json(res, 200, { ok: true, role: role });
};
