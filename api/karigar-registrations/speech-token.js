"use strict";

var http = require("../_lib/http");
var reg = require("../_lib/registrations");
var gemini = require("../_lib/gemini");

function capability() {
  var google = gemini.geminiConfig();
  var azure = reg.speechConfig();
  return {
    ok: true,
    provider: google ? "gemini" : azure ? "azure" : "none",
    live: Boolean(google),
    stt: Boolean(google || azure),
    tts: Boolean(google || azure)
  };
}

module.exports = async function handler(req, res) {
  if (req.method === "GET") {
    http.json(res, 200, capability());
    return;
  }
  if (req.method !== "POST") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  var ip = http.hashIp(http.getClientIp(req)) || "none";
  if (http.rateLimit("token:" + ip, 20, 60 * 60 * 1000)) {
    http.json(res, 429, { ok: false, error: "rate_limited" });
    return;
  }
  var google = gemini.geminiConfig();
  if (google) {
    try {
      var minted = await gemini.createLiveToken(google);
      if (!minted) {
        http.json(res, 502, { ok: false, error: "speech_failed", provider: "gemini" });
        return;
      }
      http.json(res, 200, {
        ok: true,
        provider: "gemini",
        live: true,
        token: minted.name,
        model: minted.model,
        expiresIn: 60
      });
    } catch (err) {
      http.json(res, 502, { ok: false, error: "speech_failed", provider: "gemini" });
    }
    return;
  }
  var speech = reg.speechConfig();
  if (!speech) {
    http.json(res, 503, { ok: false, error: "speech_unconfigured" });
    return;
  }
  try {
    var response = await fetch("https://" + speech.region + ".api.cognitive.microsoft.com/sts/v1.0/issueToken", {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": speech.key,
        "Content-Length": "0"
      },
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) {
      http.json(res, 502, { ok: false, error: "speech_failed" });
      return;
    }
    var token = await response.text();
    http.json(res, 200, { ok: true, token: token, region: speech.region, expiresIn: 540 });
  } catch (err) {
    http.json(res, 502, { ok: false, error: "speech_failed" });
  }
};
