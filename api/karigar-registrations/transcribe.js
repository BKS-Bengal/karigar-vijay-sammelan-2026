"use strict";

var http = require("../_lib/http");
var reg = require("../_lib/registrations");
var gemini = require("../_lib/gemini");

var LANGS = { "bn-IN": true, "hi-IN": true, "en-IN": true };
var MAX_AUDIO = 1200000;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  var ip = http.hashIp(http.getClientIp(req)) || "none";
  if (http.rateLimit("stt:" + ip, 30, 60 * 60 * 1000)) {
    http.json(res, 429, { ok: false, error: "rate_limited" });
    return;
  }
  var google = gemini.geminiConfig();
  var speech = reg.speechConfig();
  if (!google && !speech) {
    http.json(res, 503, { ok: false, error: "speech_unconfigured" });
    return;
  }
  var body = await http.readBody(req);
  var lang = body && LANGS[body.language] ? body.language : "bn-IN";
  if (!body || !body.audio_base64) {
    http.json(res, 400, { ok: false, error: "invalid_payload" });
    return;
  }
  var audio;
  try { audio = Buffer.from(String(body.audio_base64), "base64"); }
  catch (err) { audio = Buffer.alloc(0); }
  if (!audio.length || audio.length > MAX_AUDIO) {
    http.json(res, 413, { ok: false, error: "too_large" });
    return;
  }
  var mime = typeof body.mime === "string" && body.mime.indexOf("audio/") === 0 ? body.mime : "audio/webm";
  if (google) {
    try {
      var heard = await fetch(gemini.HOST + "/interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": google.key
        },
        body: JSON.stringify(gemini.sttBody(String(body.audio_base64), mime, lang)),
        signal: AbortSignal.timeout(20000)
      });
      if (heard.ok) {
        var text = gemini.textFromInteraction(await heard.json());
        http.json(res, 200, {
          ok: true,
          provider: "gemini",
          text: text,
          confidence: null,
          uncertain: !text
        });
        return;
      }
    } catch (err) {
      if (!speech) {
        http.json(res, 502, { ok: false, error: "speech_failed" });
        return;
      }
    }
    if (!speech) {
      http.json(res, 502, { ok: false, error: "speech_failed" });
      return;
    }
  }
  try {
    var response = await fetch(
      "https://" + speech.region + ".stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language="
        + encodeURIComponent(lang) + "&format=detailed",
      {
        method: "POST",
        headers: {
          "Ocp-Apim-Subscription-Key": speech.key,
          "Content-Type": mime,
          Accept: "application/json"
        },
        body: audio,
        signal: AbortSignal.timeout(20000)
      }
    );
    if (!response.ok) {
      http.json(res, 502, { ok: false, error: "speech_failed" });
      return;
    }
    var data = await response.json();
    var text = data.DisplayText || (data.NBest && data.NBest[0] && data.NBest[0].Display) || "";
    var confidence = data.NBest && data.NBest[0] ? data.NBest[0].Confidence : null;
    http.json(res, 200, {
      ok: true,
      text: String(text || "").trim(),
      confidence: confidence,
      uncertain: !text || (typeof confidence === "number" && confidence < 0.45)
    });
  } catch (err) {
    http.json(res, 502, { ok: false, error: "speech_failed" });
  }
};
