(function () {
  var params = new URLSearchParams(location.search);
  var draft = KVSMachine.create({
    mode: params.get("mode") === "voice" ? "voice" : "chat",
    idempotencyKey: (crypto.randomUUID ? crypto.randomUUID() : "00000000-0000-4000-8000-000000000000")
  });
  var assisted = false;
  var assistedBy = "";
  var speechReady = false;
  var lastError = "";
  var listening = false;
  var listenGeneration = 0;
  var step = document.getElementById("step");
  var prompt = document.getElementById("prompt");
  var live = document.getElementById("live");
  var help = document.getElementById("help");

  var PROMPTS = {
    INTRO_AND_CONSENT: "prompt.intro",
    FULL_NAME: "prompt.name",
    MOBILE_NUMBER: "prompt.mobile",
    ADDRESS_LOCALITY: "prompt.locality",
    ADDRESS_POST_OFFICE_OPTIONAL: "prompt.post",
    ADDRESS_POLICE_STATION_OPTIONAL: "prompt.ps",
    ADDRESS_DISTRICT: "prompt.district",
    ADDRESS_PIN_OPTIONAL: "prompt.pin",
    WORK_CATEGORY: "prompt.work",
    WORK_DESCRIPTION: "prompt.workDetail",
    TEAM_NAME: "prompt.team",
    SARDAR_NAME: "prompt.sardar",
    SARDAR_MOBILE_OPTIONAL: "prompt.sardarMobile",
    ATTENDANCE_STATUS: "prompt.attendance",
    PHOTO_CAPTURE: "prompt.photo",
    DATA_USE_CONSENT: "prompt.consent",
    PHOTO_PUBLICITY_CONSENT_OPTIONAL: "prompt.publicity",
    REVIEW_SUMMARY: "prompt.review",
    SUBMITTING: "submitting",
    SUCCESS: "prompt.success"
  };

  var FIELDS = {
    FULL_NAME: ["full_name", "field.name"],
    MOBILE_NUMBER: ["mobile", "field.mobile"],
    ADDRESS_LOCALITY: ["address_locality", "field.locality"],
    ADDRESS_POST_OFFICE_OPTIONAL: ["address_post_office", "field.post"],
    ADDRESS_POLICE_STATION_OPTIONAL: ["address_police_station", "field.ps"],
    ADDRESS_DISTRICT: ["address_district", "field.district"],
    ADDRESS_PIN_OPTIONAL: ["address_pin", "field.pin"],
    WORK_CATEGORY: ["work_categories", "field.work"],
    WORK_DESCRIPTION: ["work_description", "field.workDetail"],
    TEAM_NAME: ["team_name", "field.team"],
    SARDAR_NAME: ["sardar_name", "field.sardar"],
    SARDAR_MOBILE_OPTIONAL: ["sardar_mobile", "field.sardarMobile"],
    ATTENDANCE_STATUS: ["attendance_status", "field.attendance"],
    PHOTO_CAPTURE: ["photo_storage_path", "field.photo"],
    DATA_USE_CONSENT: ["data_use_consent", "field.consent"],
    PHOTO_PUBLICITY_CONSENT_OPTIONAL: ["photo_publicity_consent", "field.publicity"]
  };

  function t(key, vars) { return KVSI18n.t(key, vars); }
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  var noticeKey = "";
  var noticeKind = "";
  var noticeVars = null;

  function clearNotice() {
    lastError = "";
    noticeKey = "";
    noticeKind = "";
    noticeVars = null;
  }

  function paintNotice() {
    var key = lastError ? ("error." + lastError) : noticeKey;
    var kind = lastError ? "error" : noticeKind;
    live.textContent = key ? t(key, noticeVars) : "";
    live.setAttribute("data-kind", kind);
    if (kind === "error" && live.textContent && window.KVSAvatar) KVSAvatar.setState("error");
  }

  function say(message, kind, key, vars) {
    if (!message && !key) {
      noticeKey = "";
      noticeKind = "";
      noticeVars = null;
      paintNotice();
      return;
    }
    if (key) {
      noticeKey = key;
      noticeKind = kind || "";
      noticeVars = vars || null;
      paintNotice();
      return;
    }
    noticeKey = "";
    noticeKind = kind || "";
    noticeVars = null;
    live.textContent = message || "";
    live.setAttribute("data-kind", noticeKind);
    if (noticeKind === "error" && window.KVSAvatar) KVSAvatar.setState("error");
  }
  function capture() {
    var field = document.getElementById("answer");
    if (field) draft.buffer = field.value;
  }
  function displayValue(state) {
    var answers = draft.answers;
    if (state === "MOBILE_NUMBER" || state === "SARDAR_MOBILE_OPTIONAL") return KVSSchema.groupDigits(draft.buffer || answers.mobile && state === "MOBILE_NUMBER" ? answers.mobile : answers.sardar_mobile);
    var meta = FIELDS[state];
    if (!meta) return draft.buffer || "";
    var stored = answers[meta[0]];
    if (Array.isArray(stored)) return stored.map(function (id) { return t("cat." + id); }).join(", ");
    return draft.buffer || stored || "";
  }

  function button(label, className, attrs) {
    return '<button type="button" class="' + className + '" ' + (attrs || "") + '>' + esc(label) + '</button>';
  }

  function isExplicitUnknown(text) {
    var value = String(text || "").trim();
    if (!value) return false;
    if (KVSMachine.isUnknownPhrase(value)) return true;
    return value === "জানি না" || value === "I don't know" || value === "Not known" || value === "पता नहीं" || value === "जानता नहीं" || value === "जानती नहीं";
  }

  function textStep(optional, unknown) {
    var meta = FIELDS[draft.state];
    var stored = meta ? draft.answers[meta[0]] : "";
    var isList = Array.isArray(stored);
    if (isList && draft.buffer === stored.join(",")) draft.buffer = "";
    var value = draft.buffer || "";
    if (!isList) {
      if (draft.state === "MOBILE_NUMBER") value = draft.buffer || KVSSchema.groupDigits(stored);
      else value = draft.buffer || stored || "";
    }
    var flaggedUnknown = (draft.state === "TEAM_NAME" && draft.answers.team_unknown) || (draft.state === "SARDAR_NAME" && draft.answers.sardar_unknown);
    if (flaggedUnknown && (!value || isExplicitUnknown(value))) {
      draft.buffer = "";
      value = t("actions.unknown");
    }
    var heardValue = "";
    if (isList && stored.length) heardValue = stored.map(function (id) { return t("cat." + id); }).join(", ");
    else if (draft.state === "MOBILE_NUMBER" && value) heardValue = KVSSchema.groupDigits(value);
    else if (!isList && value) heardValue = value;
    var heard = heardValue ? '<p>' + esc(t("confirm.heard", { value: heardValue })) + "</p>" : "";
    return heard +
      '<label for="answer">' + esc(t("label.answer")) + '</label>' +
      '<textarea id="answer">' + esc(value) + '</textarea>' +
      '<div class="stack-actions">' +
        (draft.mode === "voice" ? button(t("actions.repeat"), "btn btn-primary", 'data-act="mic"') : "") +
        button(t("actions.ok"), "btn btn-primary", 'data-act="ok"') +
        (optional ? button(t("actions.skip"), "ghost", 'data-act="skip"') : "") +
        (unknown ? button(t("actions.unknown"), "ghost", 'data-act="unknown"') : "") +
        button(t("actions.listen"), "ghost", 'data-act="speak"') +
        button(t("actions.help"), "ghost", 'data-act="help"') +
        button(t("actions.back"), "ghost", 'data-act="back"') +
        button(t("actions.editPrev"), "ghost", 'data-act="picker"') +
      "</div>" +
      (speechReady ? "" : '<p class="status" data-kind="error">' + esc(t("recovery.offline")) + "</p>") +
      (draft.mode === "voice" && !speechReady ? button(t("recovery.phoneSpeech"), "ghost", 'data-act="browser-mic"') : "");
  }

  function render() {
    var state = draft.state;
    var stage = KVSMachine.stageOf(state);
    document.getElementById("progress").textContent = t("progress", { n: stage, total: KVSMachine.STAGE_TOTAL });
    var meter = document.getElementById("meter");
    if (meter) meter.style.width = Math.max(8, Math.round(100 * stage / KVSMachine.STAGE_TOTAL)) + "%";
    document.getElementById("mode-voice").setAttribute("aria-pressed", draft.mode === "voice" ? "true" : "false");
    document.getElementById("mode-chat").setAttribute("aria-pressed", draft.mode === "chat" ? "true" : "false");
    var langNow = KVSI18n.get();
    document.querySelectorAll("[data-lang]").forEach(function (node) {
      node.setAttribute("aria-pressed", node.getAttribute("data-lang") === langNow ? "true" : "false");
    });
    document.getElementById("mode-voice").textContent = t("mode.voice");
    document.getElementById("mode-chat").textContent = t("mode.chat");
    prompt.textContent = t(PROMPTS[state] || "prompt.intro");
    KVSI18n.apply(document);

    if (state === "INTRO_AND_CONSENT") {
      step.innerHTML = '<div class="stack-actions">' +
        button(t("actions.startVoice"), "btn btn-primary", 'data-act="start-voice"') +
        button(t("actions.startType"), "btn btn-ink", 'data-act="start-type"') +
        button(t("actions.helpOrg"), "ghost", 'data-act="help"') +
        "</div>";
    } else if (state === "WORK_CATEGORY") {
      var cats = Object.keys(KVSSchema.WORK_CATEGORIES).map(function (id) {
        var on = draft.answers.work_categories.indexOf(id) !== -1;
        return '<button type="button" class="choice" data-cat="' + id + '" aria-pressed="' + (on ? "true" : "false") + '">' + esc(t("cat." + id)) + "</button>";
      }).join("");
      step.innerHTML = '<div class="choice-grid">' + cats + "</div>" + textStep(false, false);
    } else if (state === "ATTENDANCE_STATUS") {
      step.innerHTML = '<div class="stack-actions">' +
        button(t("attendance.yes"), "choice", 'data-attendance="yes" aria-pressed="false"') +
        button(t("attendance.unsure"), "choice", 'data-attendance="unsure" aria-pressed="false"') +
        button(t("attendance.no"), "choice", 'data-attendance="no" aria-pressed="false"') +
        button(t("actions.back"), "ghost", 'data-act="back"') +
        "</div>";
    } else if (state === "PHOTO_CAPTURE") {
      step.innerHTML = '<div class="stack-actions">' +
        button(t("photo.open"), "btn btn-primary", 'data-act="camera"') +
        '<video id="camera" hidden playsinline autoplay></video>' +
        button(t("photo.take"), "btn btn-primary", 'data-act="snap" hidden') +
        button(t("photo.close"), "ghost", 'data-act="close-camera" hidden') +
        '<img id="shot" class="preview-img" alt="" hidden>' +
        button(t("photo.retake"), "ghost", 'data-act="retake" hidden') +
        button(t("photo.use"), "btn btn-primary", 'data-act="use-photo" hidden') +
        '<label class="btn btn-ink">' + esc(t("photo.gallery")) + '<input id="gallery" class="sr-only" type="file" accept="image/*"></label>' +
        button(t("photo.assisted"), "ghost", 'data-act="follow-up"') +
        button(t("actions.back"), "ghost", 'data-act="back"') +
        "</div>";
    } else if (state === "DATA_USE_CONSENT") {
      step.innerHTML = '<p>' + esc(t("consent.text")) + '</p><p><a href="/karigar-vijaya-sammelan/privacy/">' + esc(t("trust.link")) + "</a></p>" +
        '<label class="check"><input id="consent" type="checkbox"' + (draft.answers.data_use_consent ? " checked" : "") + ">" + esc(t("consent.check")) + "</label>" +
        '<div class="stack-actions">' + button(t("actions.ok"), "btn btn-primary", 'data-act="consent"') + button(t("actions.back"), "ghost", 'data-act="back"') + "</div>" +
        (assisted ? '<label for="helper">' + esc(t("assisted.by")) + '</label><input id="helper" type="text" value="' + esc(assistedBy) + '">' : "");
    } else if (state === "PHOTO_PUBLICITY_CONSENT_OPTIONAL") {
      step.innerHTML = '<div class="stack-actions">' +
        button(t("publicity.yes"), "btn btn-primary", 'data-publicity="yes"') +
        button(t("publicity.no"), "btn btn-ink", 'data-publicity="no"') +
        button(t("actions.back"), "ghost", 'data-act="back"') +
        "</div>";
    } else if (state === "REVIEW_SUMMARY") {
      step.innerHTML = reviewHtml() + '<div class="stack-actions">' + button(t("actions.submit"), "btn btn-primary", 'data-act="submit"') + "</div>";
    } else if (state === "SUBMITTING") {
      step.innerHTML = "<p>" + esc(t("submitting")) + "</p>";
    } else if (state === "SUCCESS") {
      step.innerHTML = '<p>' + esc(t("success.keep")) + '</p><p class="ref" id="ref">' + esc(draft.registrationNo || "") + "</p>" +
        '<p>' + esc(t("success.note")) + "</p>" +
        '<div class="stack-actions">' + button(t("actions.copy"), "btn btn-primary", 'data-act="copy"') +
        '<a class="btn btn-ink" href="/karigar-vijaya-sammelan/complete/">' + esc(t("privacy.home")) + "</a></div>";
    } else {
      var optional = (/OPTIONAL/.test(state) || state === "WORK_DESCRIPTION") && state !== "PHOTO_PUBLICITY_CONSENT_OPTIONAL";
      var unknown = state === "TEAM_NAME" || state === "SARDAR_NAME";
      step.innerHTML = '<div class="step-card">' + textStep(optional && state !== "WORK_CATEGORY", unknown) + "</div>";
    }
    if (!lastError && !noticeKey && state === "SUCCESS" && window.KVSAvatar) KVSAvatar.setState("success");
    if (lastError || noticeKey) paintNotice();
    bind();
  }

  function reviewHtml() {
    var a = draft.answers;
    function row(label, value, target) {
      return '<section class="review-row"><h3>' + esc(label) + "</h3><p>" + esc(value || "—") + '</p><button type="button" class="ghost" data-jump="' + target + '">' + esc(t("review.change")) + "</button></section>";
    }
    var work = (a.work_categories || []).map(function (id) { return t("cat." + id); }).join(", ");
    return row(t("review.name"), a.full_name, "FULL_NAME") +
      row(t("review.mobile"), KVSSchema.groupDigits(a.mobile), "MOBILE_NUMBER") +
      row(t("review.locality"), a.address_locality, "ADDRESS_LOCALITY") +
      row(t("review.district"), a.address_district, "ADDRESS_DISTRICT") +
      row(t("field.pin"), a.address_pin || t("actions.skip"), "ADDRESS_PIN_OPTIONAL") +
      row(t("review.work"), work, "WORK_CATEGORY") +
      row(t("review.detail"), a.work_description, "WORK_DESCRIPTION") +
      row(t("review.team"), a.team_unknown ? t("review.unknown") : a.team_name, "TEAM_NAME") +
      row(t("review.sardar"), a.sardar_unknown ? t("review.unknown") : a.sardar_name, "SARDAR_NAME") +
      row(t("field.sardarMobile"), a.sardar_mobile || t("actions.skip"), "SARDAR_MOBILE_OPTIONAL") +
      row(t("review.attendance"), t("attendance." + a.attendance_status), "ATTENDANCE_STATUS") +
      row(t("review.photo"), a.photo_follow_up ? t("review.laterPhoto") : t("review.given"), "PHOTO_CAPTURE") +
      (a.photo_preview ? '<img class="preview-img" alt="" src="' + esc(a.photo_preview) + '">' : "") +
      row(t("review.consent"), a.data_use_consent ? t("review.given") : t("review.notGiven"), "DATA_USE_CONSENT") +
      row(t("review.publicity"), a.photo_publicity_consent ? t("review.yesPublish") : t("review.noPublish"), "PHOTO_PUBLICITY_CONSENT_OPTIONAL");
  }

  function afterStep(result) {
    if (!result.ok) {
      lastError = result.error || "required";
      say("", "error", "error." + lastError);
      return;
    }
    lastError = "";
    say("");
    render();
  }

  function currentValue() {
    var field = document.getElementById("answer");
    return field ? field.value.trim() : "";
  }

  function bind() {
    step.querySelectorAll("[data-act]").forEach(function (node) {
      node.addEventListener("click", onAct);
    });
    step.querySelectorAll("[data-cat]").forEach(function (node) {
      node.addEventListener("click", function () {
        var id = node.getAttribute("data-cat");
        var list = draft.answers.work_categories;
        var at = list.indexOf(id);
        if (at === -1) list.push(id);
        else list.splice(at, 1);
        node.setAttribute("aria-pressed", at === -1 ? "true" : "false");
      });
    });
    step.querySelectorAll("[data-attendance]").forEach(function (node) {
      node.addEventListener("click", function () {
        afterStep(KVSMachine.applyStep(draft, { attendance: node.getAttribute("data-attendance") }));
      });
    });
    step.querySelectorAll("[data-publicity]").forEach(function (node) {
      node.addEventListener("click", function () {
        afterStep(KVSMachine.applyStep(draft, { publicity: node.getAttribute("data-publicity") === "yes" }));
      });
    });
    step.querySelectorAll("[data-jump]").forEach(function (node) {
      node.addEventListener("click", function () {
        KVSMachine.jumpTo(draft, node.getAttribute("data-jump"));
        render();
      });
    });
    var gallery = document.getElementById("gallery");
    if (gallery) gallery.addEventListener("change", onGallery);
    var consent = document.getElementById("consent");
    if (consent) consent.addEventListener("change", function () { draft.answers.data_use_consent = consent.checked; });
  }

  function releaseListen() {
    listenGeneration += 1;
    if (!listening) return;
    listening = false;
    KVSSpeech.stop();
  }

  function onAct(event) {
    var act = event.currentTarget.getAttribute("data-act");
    if (act !== "mic") releaseListen();
    if (act === "start-voice") afterStep(KVSMachine.applyStep(draft, { mode: "voice" }));
    else if (act === "start-type") afterStep(KVSMachine.applyStep(draft, { mode: "chat" }));
    else if (act === "ok") {
      var extra = { value: currentValue() };
      if (draft.state === "WORK_CATEGORY") extra.categories = draft.answers.work_categories.slice();
      if ((draft.state === "TEAM_NAME" || draft.state === "SARDAR_NAME") && isExplicitUnknown(extra.value)) extra.unknown = true;
      afterStep(KVSMachine.applyStep(draft, extra));
    } else if (act === "skip") afterStep(KVSMachine.applyStep(draft, { skip: true, value: "" }));
    else if (act === "unknown") afterStep(KVSMachine.applyStep(draft, { unknown: true }));
    else if (act === "back") {
      draft.buffer = "";
      draft.state = KVSMachine.neighbor(draft.state, -1);
      render();
    } else if (act === "help") {
      help.hidden = !help.hidden;
      if (window.KVSAvatar) KVSAvatar.setState(help.hidden ? (speechReady ? "idle" : "paused") : "help");
    }
    else if (act === "speak") speakPrompt();
    else if (act === "mic") record();
    else if (act === "browser-mic") browserMic();
    else if (act === "picker") showPicker();
    else if (act === "camera") openCamera();
    else if (act === "snap") snap();
    else if (act === "close-camera" || act === "retake") closeCamera();
    else if (act === "use-photo") usePhoto();
    else if (act === "follow-up") afterStep(KVSMachine.applyStep(draft, { followUp: true }));
    else if (act === "consent") {
      var box = document.getElementById("consent");
      var helper = document.getElementById("helper");
      if (helper) assistedBy = helper.value.trim();
      afterStep(KVSMachine.applyStep(draft, { consent: box && box.checked }));
    } else if (act === "submit") submit();
    else if (act === "copy") copyRef();
  }

  function showPicker() {
    var buttons = KVSMachine.EDITABLE.map(function (state) {
      return '<button type="button" class="choice" data-jump="' + state + '">' + esc(t(FIELDS[state][1])) + "</button>";
    }).join("");
    step.insertAdjacentHTML("beforeend", '<div class="choice-grid" id="picker">' + buttons + "</div>");
    step.querySelectorAll("#picker [data-jump]").forEach(function (node) {
      node.addEventListener("click", function () {
        KVSMachine.jumpTo(draft, node.getAttribute("data-jump"));
        render();
      });
    });
  }

  function showHeard(text, uncertain) {
    var field = document.getElementById("answer");
    if (field) field.value = text;
    draft.buffer = text;
    say("", uncertain ? "error" : "ok", "confirm.heard", { value: text });
  }

  function startFileCapture() {
    var generation = listenGeneration;
    KVSSpeech.start(function (blob, mime) {
      listening = false;
      say("", "", "mic.working");
      KVSSpeech.transcribe(blob, mime, KVSI18n.get()).then(function (result) {
        if (generation !== listenGeneration) return;
        if (!result.ok || !result.data || !result.data.text) {
          say("", "error", result.status === 503 ? "recovery.offline" : "recovery.none");
          return;
        }
        showHeard(result.data.text, result.data.uncertain);
      }).catch(function () { say("", "error", "recovery.offline"); });
    }, function () {
      listening = false;
      say("", "error", "recovery.offline");
    });
  }

  function record() {
    if (listening) {
      listening = false;
      KVSSpeech.stop();
      return;
    }
    listening = true;
    var generation = ++listenGeneration;
    say("", "", "mic.listening");
    if (KVSSpeech.canLive && KVSSpeech.canLive()) {
      var heard = false;
      var began = KVSSpeech.startLive(KVSI18n.get(), prompt.textContent || "", function (text) {
        if (generation !== listenGeneration) return;
        heard = true;
        showHeard(text, false);
      }, function () {
        if (!listening || heard) return;
        startFileCapture();
      });
      if (began) return;
    }
    startFileCapture();
  }

  function browserMic() {
    say("", "", "mic.listening");
    var started = KVSSpeech.browserListen(KVSI18n.get(), function (text) {
      var field = document.getElementById("answer");
      if (field) field.value = text;
      draft.buffer = text;
      say("", "", "confirm.heard", { value: text });
    }, function (ok) {
      if (!ok) say("", "error", "recovery.none");
    });
    if (!started) say("", "error", "recovery.offline");
  }

  function speakPrompt() {
    KVSSpeech.speak(prompt.textContent, KVSI18n.get()).then(function (result) {
      if (!result.played) say("", "error", "recovery.offline");
    });
  }

  function openCamera() {
    var video = document.getElementById("camera");
    KVSPhoto.open(video).then(function () {
      video.hidden = false;
      step.querySelector('[data-act="snap"]').hidden = false;
      step.querySelector('[data-act="close-camera"]').hidden = false;
    }).catch(function () { say("", "error", "photo.denied"); });
  }

  function closeCamera() {
    KVSPhoto.stop();
    var video = document.getElementById("camera");
    if (video) { video.hidden = true; video.srcObject = null; }
  }

  function snap() {
    var video = document.getElementById("camera");
    KVSPhoto.capture(video).then(function (blob) {
      if (!blob) {
        say("", "error", "photo.failed");
        return;
      }
      draft.pendingPhoto = blob;
      closeCamera();
      var img = document.getElementById("shot");
      img.src = URL.createObjectURL(blob);
      img.hidden = false;
      step.querySelector('[data-act="retake"]').hidden = false;
      step.querySelector('[data-act="use-photo"]').hidden = false;
    });
  }

  function onGallery(event) {
    var file = event.target.files && event.target.files[0];
    if (!file) return;
    KVSPhoto.fileToJpeg(file).then(function (blob) {
      if (!blob) {
        say("", "error", "photo.failed");
        return;
      }
      draft.pendingPhoto = blob;
      var img = document.getElementById("shot");
      img.src = URL.createObjectURL(blob);
      img.hidden = false;
      step.querySelector('[data-act="use-photo"]').hidden = false;
      step.querySelector('[data-act="retake"]').hidden = false;
    }).catch(function () { say("", "error", "photo.failed"); });
  }

  function usePhoto() {
    if (!draft.pendingPhoto) return;
    say("", "", "photo.uploading");
    KVSPhoto.upload(draft.pendingPhoto).then(function (result) {
      if (!result.ok) {
        say("", "error", result.status === 503 ? "error.config" : "photo.failed");
        return;
      }
      draft.answers.photo_preview = result.preview;
      afterStep(KVSMachine.applyStep(draft, { photoPath: result.data.photo_storage_path, preview: result.preview }));
    }).catch(function () { say("", "error", "photo.failed"); });
  }

  function submit() {
    if (draft.state === "SUBMITTING" || draft.state === "SUCCESS") return;
    clearNotice();
    draft.state = "SUBMITTING";
    render();
    var body = Object.assign({
      idempotency_key: draft.idempotencyKey,
      consent_version: KVSSchema.CONSENT_VERSION,
      locale: KVSI18n.get(),
      website: ""
    }, draft.answers);
    delete body.photo_preview;
    delete body.publicity_chosen;
    if (assisted) {
      body.assisted = true;
      body.assisted_by = assistedBy;
    }
    fetch("/api/karigar-registrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(function (res) {
      return res.json().then(function (data) { return { status: res.status, data: data }; });
    }).then(function (result) {
      var confirmed = (result.status === 200 || result.status === 201)
        && result.data
        && result.data.ok === true
        && result.data.registration_no;
      if (confirmed) {
        clearNotice();
        draft.registrationNo = result.data.registration_no;
        draft.state = "SUCCESS";
        try { sessionStorage.setItem("kvs-registration-no", draft.registrationNo); } catch (err) { /* shared phone: number stays on screen */ }
        render();
        return;
      }
      draft.state = "REVIEW_SUMMARY";
      render();
      if (result.status === 503) say("", "error", "error.config");
      else if (result.status === 429) say("", "error", "error.rate");
      else if (result.data && result.data.error === "photo_missing") say("", "error", "error.photo");
      else say("", "error", "error.submit");
    }).catch(function () {
      draft.state = "REVIEW_SUMMARY";
      render();
      say("", "error", "error.submit");
    });
  }

  function copyRef() {
    var text = draft.registrationNo || "";
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { say("", "ok", "actions.copied"); });
    } else say(text, "ok");
  }

  document.getElementById("mode-voice").addEventListener("click", function () {
    capture();
    releaseListen();
    KVSMachine.setMode(draft, "voice");
    render();
  });
  document.getElementById("mode-chat").addEventListener("click", function () {
    capture();
    releaseListen();
    KVSMachine.setMode(draft, "chat");
    render();
  });
  document.querySelectorAll("[data-lang]").forEach(function (button) {
    button.addEventListener("click", function () {
      capture();
      releaseListen();
      KVSI18n.set(button.getAttribute("data-lang"));
      render();
    });
  });
  window.addEventListener("pagehide", function () { KVSPhoto.stop(); KVSSpeech.stop(); });

  var links = document.getElementById("help-links");
  if (window.KVS_PUBLIC && KVS_PUBLIC.helpTel) {
    links.innerHTML = '<a href="tel:' + esc(KVS_PUBLIC.helpTel) + '">' + esc(KVS_PUBLIC.helpTelDisplay) + "</a><br>" +
      '<a href="tel:' + esc(KVS_PUBLIC.helpTelAlt) + '">' + esc(KVS_PUBLIC.helpTelAltDisplay) + "</a>";
  }

  fetch("/api/admin/karigar-session").then(function (res) { return res.json(); }).then(function (data) {
    assisted = data && data.role === "event_admin";
  }).catch(function () { assisted = false; });

  KVSSpeech.status().then(function (data) {
    speechReady = Boolean(data && data.stt);
    if (window.KVSAvatar && (!data || data.tts === false)) KVSAvatar.setState("paused");
    render();
  });
  KVSI18n.set(KVSI18n.get());
  render();
})();
