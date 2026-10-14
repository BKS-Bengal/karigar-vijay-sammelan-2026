(function () {
  var recorder = null;
  var chunks = [];
  var stream = null;
  var recognition = null;
  var live = null;
  var liveReady = false;

  function avatar(state) {
    if (window.KVSAvatar && KVSAvatar.setState) KVSAvatar.setState(state);
  }

  function stopTracks() {
    if (!stream) return;
    stream.getTracks().forEach(function (track) { track.stop(); });
    stream = null;
  }

  function endLive() {
    if (!live) return;
    var current = live;
    live = null;
    current.closed = true;
    if (current.timer) window.clearTimeout(current.timer);
    if (current.processor) {
      try { current.processor.disconnect(); } catch (err) { /* ignore */ }
    }
    if (current.micStream) current.micStream.getTracks().forEach(function (track) { track.stop(); });
    if (current.audioCtx) {
      try { current.audioCtx.close(); } catch (err) { /* ignore */ }
    }
    if (current.playCtx) {
      try { current.playCtx.close(); } catch (err) { /* ignore */ }
    }
    if (current.socket && current.socket.readyState < 2) {
      try { current.socket.close(); } catch (err) { /* ignore */ }
    }
    avatar("idle");
  }

  function stop() {
    if (recorder && recorder.state === "recording") recorder.stop();
    if (recognition) {
      try { recognition.abort(); } catch (err) { /* ignore */ }
      recognition = null;
    }
    if (live && !live.stopping) {
      live.stopping = true;
      if (live.processor) {
        try { live.processor.disconnect(); } catch (err) { /* ignore */ }
      }
      if (live.micStream) live.micStream.getTracks().forEach(function (track) { track.stop(); });
      live.micStream = null;
      if (live.timer) {
        window.clearTimeout(live.timer);
        live.timer = null;
      }
      if (live.socket && live.socket.readyState === 1) {
        try { live.socket.send(JSON.stringify({ realtimeInput: { audioStreamEnd: true } })); } catch (err) { /* ignore */ }
        live.timer = window.setTimeout(endLive, 6000);
        avatar("thinking");
        return;
      }
    }
    endLive();
    avatar("idle");
  }

  function start(onBlob, onError) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") {
      onError("unsupported");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (next) {
      avatar("listening");
      stream = next;
      chunks = [];
      var mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recorder.ondataavailable = function (event) {
        if (event.data && event.data.size) chunks.push(event.data);
      };
      recorder.onstop = function () {
        var type = recorder.mimeType || "audio/webm";
        stopTracks();
        onBlob(new Blob(chunks, { type: type }), type);
      };
      recorder.start();
    }).catch(function () { avatar("error"); onError("denied"); });
  }

  function transcribe(blob, mime, language) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onerror = reject;
      reader.onload = function () {
        avatar("thinking");
        fetch("/api/karigar-registrations/transcribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audio_base64: String(reader.result).split(",")[1],
            mime: mime,
            language: language
          })
        }).then(function (res) {
          return res.json().then(function (data) { resolve({ ok: res.ok, status: res.status, data: data }); });
        }).catch(reject);
      };
      reader.readAsDataURL(blob);
    });
  }

  function status() {
    return fetch("/api/karigar-registrations/speech-token").then(function (res) {
      return res.json();
    }).then(function (data) {
      liveReady = Boolean(data && data.live && data.provider === "gemini");
      return data;
    }).catch(function () {
      liveReady = false;
      return { stt: false, tts: false, live: false };
    });
  }

  function canLive() {
    return liveReady && typeof WebSocket !== "undefined";
  }

  function speak(text, language) {
    return fetch("/api/karigar-registrations/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: text, language: language })
    }).then(function (res) {
      if (!res.ok) {
        avatar("paused");
        return { played: false };
      }
      return res.blob().then(function (blob) {
        var audio = new Audio(URL.createObjectURL(blob));
        audio.addEventListener("playing", function () { avatar("speaking"); });
        audio.addEventListener("ended", function () { avatar("idle"); });
        audio.addEventListener("error", function () { avatar("paused"); });
        return audio.play().then(function () { return { played: true }; }).catch(function () {
          avatar("paused");
          return { played: false };
        });
      });
    }).catch(function () {
      avatar("paused");
      return { played: false };
    });
  }

  function browserListen(language, onText, onEnd) {
    var Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Rec) return false;
    var failed = false;
    recognition = new Rec();
    recognition.lang = language || "bn-IN";
    recognition.onresult = function (event) {
      var said = event.results && event.results[0] && event.results[0][0] ? event.results[0][0].transcript : "";
      if (said) onText(said);
    };
    recognition.onerror = function (event) {
      if (event && event.error === "aborted") return;
      failed = true;
      avatar("error");
    };
    recognition.onend = function () {
      recognition = null;
      if (failed) onEnd(false);
      else {
        avatar("idle");
        onEnd(true);
      }
    };
    avatar("listening");
    try { recognition.start(); }
    catch (err) {
      recognition = null;
      avatar("error");
      return false;
    }
    return true;
  }

  function guide(language, question) {
    var name = language === "hi-IN" ? "Hindi" : language === "en-IN" ? "simple Indian English" : "Bengali";
    return "You are Karigar Saathi. Speak only in " + name + ". Speak slowly, clearly and respectfully, in words an artisan can follow. Say only this one question, then wait in silence: "
      + question
      + " Do not invent a name, number, attendance choice or consent. Do not say a registration was saved.";
  }

  function bytesToBase64(bytes) {
    var binary = "";
    for (var i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  function base64ToBytes(data) {
    var binary = atob(data);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }

  function playPcm(session, bytes, rate) {
    if (!session.playCtx) session.playCtx = new AudioContext();
    var ctx = session.playCtx;
    var samples = new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2));
    if (!samples.length) return;
    var buffer = ctx.createBuffer(1, samples.length, rate || 24000);
    var channel = buffer.getChannelData(0);
    for (var i = 0; i < samples.length; i += 1) channel[i] = samples[i] / 32768;
    var source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    var startAt = Math.max(ctx.currentTime, session.playAt || 0);
    source.start(startAt);
    session.playAt = startAt + buffer.duration;
    avatar("speaking");
    source.onended = function () {
      if (!live || live !== session) return;
      if (ctx.currentTime + 0.08 >= session.playAt) {
        avatar(session.hearing ? "listening" : "idle");
        if (session.turnDone && !session.hearing) openMic(session);
      }
    };
  }

  function openMic(session) {
    if (!live || live !== session || session.closed || session.hearing || session.micAsked || session.stopping) return;
    session.micAsked = true;
    if (session.timer) {
      window.clearTimeout(session.timer);
      session.timer = null;
    }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      fail(session, "unsupported");
      return;
    }
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (mic) {
      if (!live || live !== session || session.closed) {
        mic.getTracks().forEach(function (track) { track.stop(); });
        return;
      }
      session.hearing = true;
      session.micStream = mic;
      var ctx = new AudioContext();
      session.audioCtx = ctx;
      var source = ctx.createMediaStreamSource(mic);
      var processor = ctx.createScriptProcessor(4096, 1, 1);
      var mute = ctx.createGain();
      mute.gain.value = 0;
      session.processor = processor;
      processor.onaudioprocess = function (event) {
        if (!live || live !== session || !session.socket || session.socket.readyState !== 1) return;
        var input = event.inputBuffer.getChannelData(0);
        var ratio = ctx.sampleRate / 16000;
        var length = Math.max(1, Math.floor(input.length / ratio));
        var pcm = new Int16Array(length);
        for (var i = 0; i < length; i += 1) {
          var sample = Math.max(-1, Math.min(1, input[Math.floor(i * ratio)]));
          pcm[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
        }
        var bytes = new Uint8Array(pcm.buffer);
        session.socket.send(JSON.stringify({
          realtimeInput: {
            audio: { mimeType: "audio/pcm;rate=16000", data: bytesToBase64(bytes) }
          }
        }));
      };
      source.connect(processor);
      processor.connect(mute);
      mute.connect(ctx.destination);
      avatar("listening");
    }).catch(function () { fail(session, "denied"); });
  }

  function takeTranscript(session, next) {
    next = String(next || "").trim();
    if (!next) return;
    if (!session.heard || next.length >= session.heard.length) session.heard = next;
    session.onText(session.heard);
  }

  function handleMessage(session, raw) {
    var msg;
    try { msg = JSON.parse(raw); } catch (err) { return; }
    if (!msg || session.closed) return;
    if (msg.error) {
      fail(session, "closed");
      return;
    }
    if (msg.setupComplete) {
      session.socket.send(JSON.stringify({
        clientContent: {
          turns: [{ role: "user", parts: [{ text: session.guide }] }],
          turnComplete: true
        }
      }));
      return;
    }
    var content = msg.serverContent;
    if (!content) return;
    if (content.inputTranscription && content.inputTranscription.text) takeTranscript(session, content.inputTranscription.text);
    var parts = content.modelTurn && content.modelTurn.parts ? content.modelTurn.parts : [];
    parts.forEach(function (part) {
      var inline = part.inlineData || part.inline_data;
      if (!inline || !inline.data) return;
      var mime = String(inline.mimeType || inline.mime_type || "");
      var rate = /rate=(\d+)/.exec(mime);
      playPcm(session, base64ToBytes(inline.data), rate ? Number(rate[1]) : 24000);
    });
    if (content.turnComplete && !session.turnDone) {
      session.turnDone = true;
      var waiting = session.playCtx && session.playAt && session.playCtx.currentTime + 0.08 < session.playAt;
      if (!waiting) openMic(session);
    }
  }

  function fail(session, code) {
    if (!session || session.closed || session.stopping) return;
    var notify = session.onError;
    endLive();
    if (notify) notify(code || "closed");
  }

  function startLive(language, question, onText, onError) {
    if (!canLive()) return false;
    endLive();
    var session = {
      closed: false,
      stopping: false,
      hearing: false,
      turnDone: false,
      heard: "",
      guide: guide(language, question),
      onText: onText,
      onError: onError,
      playAt: 0
    };
    live = session;
    fetch("/api/karigar-registrations/speech-token", { method: "POST" }).then(function (res) {
      return res.json().then(function (data) { return { ok: res.ok, data: data }; });
    }).then(function (result) {
      if (!live || live !== session) return;
      if (!result.ok || !result.data || result.data.provider !== "gemini" || !result.data.token) {
        fail(session, "closed");
        return;
      }
      var socket = new WebSocket(
        "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token="
        + encodeURIComponent(result.data.token)
      );
      session.socket = socket;
      socket.onopen = function () {
        if (!live || live !== session) return;
        socket.send(JSON.stringify({
          setup: {
            model: "models/" + (result.data.model || "gemini-3.8-live"),
            generationConfig: { responseModalities: ["AUDIO"] },
            sessionResumption: {},
            inputAudioTranscription: {},
            systemInstruction: { parts: [{ text: session.guide }] }
          }
        }));
      };
      socket.onmessage = function (event) {
        if (typeof event.data === "string") handleMessage(session, event.data);
      };
      socket.onerror = function () { fail(session, "closed"); };
      socket.onclose = function () {
        if (live === session && !session.stopping && !session.heard) fail(session, "closed");
      };
      session.timer = window.setTimeout(function () {
        if (live === session && !session.turnDone && !session.hearing) openMic(session);
      }, 12000);
    }).catch(function () { fail(session, "closed"); });
    return true;
  }

  window.addEventListener("pagehide", function () { stop(); stopTracks(); });
  window.KVSSpeech = {
    start: start,
    stop: stop,
    transcribe: transcribe,
    status: status,
    speak: speak,
    browserListen: browserListen,
    canLive: canLive,
    startLive: startLive
  };
})();
