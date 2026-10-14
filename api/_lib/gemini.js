"use strict";

var LIVE_MODEL = "gemini-3.8-live";
var TTS_MODEL = "gemini-3.8-flash-tts";
var STT_MODEL = "gemini-3.5-transcribe";
var HOST = "https://generativelanguage.googleapis.com/v1beta";

var AUDIO_MIME = {
  "audio/webm": true,
  "audio/wav": true,
  "audio/mp3": true,
  "audio/mpeg": true,
  "audio/ogg": true,
  "audio/aac": true,
  "audio/flac": true,
  "audio/m4a": true,
  "audio/opus": true,
  "audio/aiff": true,
  "audio/l16": true
};

function geminiConfig() {
  var key = String(process.env.GEMINI_API_KEY || "").trim();
  if (!key) return null;
  return { key: key };
}

function isoIn(ms) {
  return new Date(Date.now() + ms).toISOString().replace(/\.\d{3}Z$/, "Z");
}

function liveTokenBody() {
  return {
    uses: 1,
    expireTime: isoIn(30 * 60 * 1000),
    newSessionExpireTime: isoIn(60 * 1000),
    liveConnectConstraints: {
      model: "models/" + LIVE_MODEL,
      config: {
        sessionResumption: {},
        responseModalities: ["AUDIO"]
      }
    }
  };
}

function ttsStyle(language) {
  if (language === "hi-IN") {
    return "Speak slowly, clearly and respectfully in Hindi, as if guiding an artisan through one question.";
  }
  if (language === "en-IN") {
    return "Speak slowly, clearly and respectfully in simple Indian English, as if guiding an artisan through one question.";
  }
  return "Speak slowly, clearly and respectfully in Bengali, as if guiding an artisan through one question.";
}

function ttsBody(text, language) {
  return {
    contents: [{
      role: "user",
      parts: [{
        text: text,
        speech_metadata: { style: ttsStyle(language) }
      }]
    }],
    generationConfig: {
      responseModalities: ["AUDIO"],
      speechConfig: { voiceConfig: { voice: "Kore" } }
    }
  };
}

function audioMime(mime) {
  var base = String(mime || "").split(";")[0].trim().toLowerCase();
  if (base === "audio/mp4" || base === "audio/x-m4a") return "audio/m4a";
  return AUDIO_MIME[base] ? base : "audio/webm";
}

function sttBody(audioBase64, mime, language) {
  return {
    model: STT_MODEL,
    input: [{
      type: "audio",
      data: audioBase64,
      mime_type: audioMime(mime)
    }],
    generation_config: {
      transcription_config: {
        language_codes: [language || "bn-IN"],
        mode: { type: "verbatim" }
      }
    }
  };
}

async function createLiveToken(config) {
  var response = await fetch(HOST + "/auth_tokens", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": config.key
    },
    body: JSON.stringify(liveTokenBody()),
    signal: AbortSignal.timeout(10000)
  });
  if (!response.ok) return null;
  var data = await response.json();
  var name = data && typeof data.name === "string" ? data.name : "";
  if (!name || name.indexOf(config.key) !== -1) return null;
  return { name: name, model: LIVE_MODEL };
}

function audioFromGenerate(data) {
  var candidates = data && data.candidates;
  if (!candidates || !candidates[0] || !candidates[0].content) return null;
  var parts = candidates[0].content.parts || [];
  for (var i = 0; i < parts.length; i += 1) {
    var inline = parts[i].inlineData || parts[i].inline_data;
    if (inline && inline.data) {
      return {
        bytes: Buffer.from(String(inline.data), "base64"),
        mime: inline.mimeType || inline.mime_type || "audio/wav"
      };
    }
  }
  return null;
}

function textFromInteraction(data) {
  var chunks = [];
  var outputs = data && (data.outputs || data.output) || [];
  if (!Array.isArray(outputs)) outputs = [outputs];
  outputs.forEach(function (item) {
    if (!item || typeof item.text !== "string") return;
    if (!item.type || item.type === "text") chunks.push(item.text);
  });
  if (!chunks.length && data && typeof data.output_text === "string") chunks.push(data.output_text);
  return chunks.join(" ").replace(/\s+/g, " ").trim();
}

module.exports = {
  LIVE_MODEL: LIVE_MODEL,
  TTS_MODEL: TTS_MODEL,
  STT_MODEL: STT_MODEL,
  HOST: HOST,
  geminiConfig: geminiConfig,
  liveTokenBody: liveTokenBody,
  ttsBody: ttsBody,
  sttBody: sttBody,
  audioMime: audioMime,
  createLiveToken: createLiveToken,
  audioFromGenerate: audioFromGenerate,
  textFromInteraction: textFromInteraction
};
