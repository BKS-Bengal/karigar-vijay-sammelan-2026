"use strict";

var http = require("../_lib/http");
var reg = require("../_lib/registrations");
var gemini = require("../_lib/gemini");

var VOICES = {
  "bn-IN": "bn-IN-TanishaaNeural",
  "hi-IN": "hi-IN-SwaraNeural",
  "en-IN": "en-IN-NeerjaNeural"
};

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    http.json(res, 405, { ok: false, error: "method_not_allowed" });
    return;
  }
  var ip = http.hashIp(http.getClientIp(req)) || "none";
  if (http.rateLimit("tts:" + ip, 40, 60 * 60 * 1000)) {
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
  var text = body && typeof body.text === "string" ? body.text.trim() : "";
  var lang = body && VOICES[body.language] ? body.language : "bn-IN";
  if (!text || text.length > 400) {
    http.json(res, 400, { ok: false, error: "invalid_payload" });
    return;
  }
  if (google) {
    try {
      var spoken = await fetch(gemini.HOST + "/models/" + gemini.TTS_MODEL + ":generateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": google.key
        },
        body: JSON.stringify(gemini.ttsBody(text, lang)),
        signal: AbortSignal.timeout(20000)
      });
      if (spoken.ok) {
        var payload = gemini.audioFromGenerate(await spoken.json());
        if (payload && payload.bytes.length) {
          res.statusCode = 200;
          res.setHeader("Content-Type", payload.mime || "audio/wav");
          res.setHeader("Cache-Control", "no-store");
          res.end(payload.bytes);
          return;
        }
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
  var ssml = "<speak version='1.0' xml:lang='" + lang + "'><voice name='" + VOICES[lang] + "'>"
    + escapeXml(text) + "</voice></speak>";
  try {
    var response = await fetch("https://" + speech.region + ".tts.speech.microsoft.com/cognitiveservices/v1", {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": speech.key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-128kbitrate-mono-mp3",
        "User-Agent": "kvs-2026"
      },
      body: ssml,
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) {
      http.json(res, 502, { ok: false, error: "speech_failed" });
      return;
    }
    var audio = Buffer.from(await response.arrayBuffer());
    res.statusCode = 200;
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.end(audio);
  } catch (err) {
    http.json(res, 502, { ok: false, error: "speech_failed" });
  }
};
