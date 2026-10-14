"use strict";

var crypto = require("crypto");

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.end(JSON.stringify(body));
}

function readBody(req) {
  try {
    if (req.body && typeof req.body === "object") return Promise.resolve(req.body);
    if (typeof req.body === "string" && req.body) {
      try { return Promise.resolve(JSON.parse(req.body)); } catch (err) { return Promise.resolve(null); }
    }
  } catch (err) {
    return Promise.resolve(null);
  }
  return new Promise(function (resolve) {
    var chunks = [];
    req.on("data", function (chunk) { chunks.push(chunk); });
    req.on("end", function () {
      if (!chunks.length) return resolve(null);
      try { resolve(JSON.parse(Buffer.concat(chunks).toString("utf8"))); }
      catch (err) { resolve(null); }
    });
    req.on("error", function () { resolve(null); });
  });
}

function getClientIp(req) {
  var forwarded = req.headers && req.headers["x-forwarded-for"];
  if (forwarded) return String(forwarded).split(",")[0].trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : "";
}

function hashIp(ip) {
  if (!ip) return null;
  return crypto.createHash("sha256").update(String(ip) + (process.env.REGISTRATION_IP_SALT || "kvs-2026")).digest("hex");
}

function sameSecret(given, expected) {
  if (!given || !expected) return false;
  var left = crypto.createHash("sha256").update(String(given)).digest();
  var right = crypto.createHash("sha256").update(String(expected)).digest();
  return crypto.timingSafeEqual(left, right);
}

function tokenRole(given) {
  if (sameSecret(given, process.env.KARIGAR_EVENT_ADMIN_TOKEN || "")) return "event_admin";
  if (sameSecret(given, process.env.KARIGAR_EVENT_VIEWER_TOKEN || "")) return "event_viewer";
  return null;
}

function sessionSecret() {
  return process.env.KARIGAR_SESSION_SECRET || "";
}

function signSession(role) {
  var secret = sessionSecret();
  if (!secret || (role !== "event_admin" && role !== "event_viewer")) return null;
  var payload = Buffer.from(JSON.stringify({
    role: role,
    exp: Date.now() + 8 * 60 * 60 * 1000
  })).toString("base64url");
  var sig = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return payload + "." + sig;
}

function readSession(token) {
  var secret = sessionSecret();
  if (!secret || !token || token.indexOf(".") === -1) return null;
  var parts = String(token).split(".");
  if (parts.length !== 2) return null;
  var expected = crypto.createHmac("sha256", secret).update(parts[0]).digest("base64url");
  if (!sameSecret(parts[1], expected)) return null;
  try {
    var data = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    if (!data || !data.exp || Date.now() > data.exp) return null;
    if (data.role !== "event_admin" && data.role !== "event_viewer") return null;
    return { role: data.role };
  } catch (err) {
    return null;
  }
}

function cookieValue(req, name) {
  var header = req.headers && req.headers.cookie;
  if (!header) return "";
  var parts = String(header).split(";");
  for (var i = 0; i < parts.length; i += 1) {
    var bit = parts[i].trim();
    if (bit.indexOf(name + "=") === 0) return decodeURIComponent(bit.slice(name.length + 1));
  }
  return "";
}

function sessionFromRequest(req) {
  return readSession(cookieValue(req, "karigar_session"));
}

function setSessionCookie(req, res, token) {
  var secure = false;
  var proto = req.headers && (req.headers["x-forwarded-proto"] || "");
  if (String(proto).indexOf("https") === 0) secure = true;
  var cookie = "karigar_session=" + encodeURIComponent(token) + "; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800";
  if (secure) cookie += "; Secure";
  res.setHeader("Set-Cookie", cookie);
}

function clearSessionCookie(res) {
  res.setHeader("Set-Cookie", "karigar_session=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0");
}

var buckets = {};

function rateLimit(key, limit, windowMs) {
  var now = Date.now();
  var bucket = buckets[key];
  if (!bucket || now - bucket.start > windowMs) {
    buckets[key] = { start: now, count: 1 };
    return false;
  }
  bucket.count += 1;
  return bucket.count > limit;
}

function resetRateLimits() {
  buckets = {};
}

module.exports = {
  json: json,
  readBody: readBody,
  getClientIp: getClientIp,
  hashIp: hashIp,
  tokenRole: tokenRole,
  signSession: signSession,
  readSession: readSession,
  sessionFromRequest: sessionFromRequest,
  setSessionCookie: setSessionCookie,
  clearSessionCookie: clearSessionCookie,
  rateLimit: rateLimit,
  resetRateLimits: resetRateLimits
};
