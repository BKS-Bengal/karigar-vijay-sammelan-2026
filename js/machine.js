(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory(root);
  else root.KVSMachine = factory(root);
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  var schema = typeof module === "object" && module.exports
    ? require("./schema.js")
    : root.KVSSchema;

  var ORDER = [
    "INTRO_AND_CONSENT",
    "FULL_NAME",
    "MOBILE_NUMBER",
    "ADDRESS_LOCALITY",
    "ADDRESS_POST_OFFICE_OPTIONAL",
    "ADDRESS_POLICE_STATION_OPTIONAL",
    "ADDRESS_DISTRICT",
    "ADDRESS_PIN_OPTIONAL",
    "WORK_CATEGORY",
    "WORK_DESCRIPTION",
    "TEAM_NAME",
    "SARDAR_NAME",
    "SARDAR_MOBILE_OPTIONAL",
    "ATTENDANCE_STATUS",
    "PHOTO_CAPTURE",
    "DATA_USE_CONSENT",
    "PHOTO_PUBLICITY_CONSENT_OPTIONAL",
    "REVIEW_SUMMARY",
    "SUBMITTING",
    "SUCCESS"
  ];

  var EDITABLE = [
    "FULL_NAME",
    "MOBILE_NUMBER",
    "ADDRESS_LOCALITY",
    "ADDRESS_POST_OFFICE_OPTIONAL",
    "ADDRESS_POLICE_STATION_OPTIONAL",
    "ADDRESS_DISTRICT",
    "ADDRESS_PIN_OPTIONAL",
    "WORK_CATEGORY",
    "WORK_DESCRIPTION",
    "TEAM_NAME",
    "SARDAR_NAME",
    "SARDAR_MOBILE_OPTIONAL",
    "ATTENDANCE_STATUS",
    "PHOTO_CAPTURE",
    "DATA_USE_CONSENT",
    "PHOTO_PUBLICITY_CONSENT_OPTIONAL"
  ];

  function blankAnswers() {
    return {
      full_name: "",
      mobile: "",
      address_locality: "",
      address_post_office: "",
      address_police_station: "",
      address_district: "",
      address_pin: "",
      work_categories: [],
      work_description: "",
      team_name: "",
      team_unknown: false,
      sardar_name: "",
      sardar_unknown: false,
      sardar_mobile: "",
      attendance_status: "",
      photo_storage_path: "",
      photo_preview: "",
      photo_follow_up: false,
      data_use_consent: false,
      photo_publicity_consent: false,
      publicity_chosen: false
    };
  }

  function create(options) {
    options = options || {};
    var mode = options.mode === "voice" ? "voice" : "chat";
    return {
      state: "INTRO_AND_CONSENT",
      mode: mode,
      answers: blankAnswers(),
      buffer: "",
      idempotencyKey: options.idempotencyKey || ""
    };
  }

  function stageOf(state) {
    if (state === "INTRO_AND_CONSENT") return 1;
    if (state === "FULL_NAME" || state === "MOBILE_NUMBER") return 2;
    if (state.indexOf("ADDRESS_") === 0) return 3;
    if (state === "WORK_CATEGORY" || state === "WORK_DESCRIPTION") return 4;
    if (state === "TEAM_NAME" || state.indexOf("SARDAR_") === 0) return 5;
    if (state === "ATTENDANCE_STATUS" || state === "PHOTO_CAPTURE") return 6;
    return 7;
  }

  function setMode(draft, mode) {
    if (mode === "voice" || mode === "chat") draft.mode = mode;
    return draft;
  }

  function jumpTo(draft, state) {
    if (ORDER.indexOf(state) === -1) return { ok: false, error: "invalid_state" };
    draft.state = state;
    draft.buffer = "";
    return { ok: true, draft: draft };
  }

  function indexOf(state) {
    return ORDER.indexOf(state);
  }

  function neighbor(state, delta) {
    var i = indexOf(state);
    if (i < 0) return state;
    var next = i + delta;
    if (next < 0) next = 0;
    if (next >= ORDER.length) next = ORDER.length - 1;
    return ORDER[next];
  }

  function isUnknownPhrase(text) {
    var value = schema.fold(text);
    return value === "জানি না" || value === "jani na" || value === "जानता नहीं" || value === "जानती नहीं" || value === "पता नहीं" || value === "don't know" || value === "dont know" || value === "unknown";
  }

  function isSkipPhrase(text) {
    var value = schema.fold(text);
    return isUnknownPhrase(text) || value === "এখন বলব না" || value === "পরে বলব" || value === "skip" || value === "छोड़ दें" || value === "बाद में";
  }

  function mapWorkUtterance(text) {
    var value = String(text || "").toLowerCase();
    var rules = [
      { id: "structure_bamboo", words: ["বাঁশ", "bamboo", "কাঠামো বাঁধ", "frame", "बांस"] },
      { id: "fabrication", words: ["ফ্যাব্রিকেশন", "fabrication", "welding", "ঝালাই", "फैब्रिकेशन"] },
      { id: "decoration_draping", words: ["সাজ", "কাপড়", "drap", "cloth", "সজ্জা", "सजावट", "कपड़"] },
      { id: "painting_finishing", words: ["রং", "রঙ", "finish", "পেইন্ট", "paint", "डेकॉर", "फिनिश"] },
      { id: "lighting_installation", words: ["আলো", "লাইট", "light", "বাতি", "लाइट", "बिजली"] },
      { id: "other_pandal_work", words: ["অন্য", "other", "अन्य"] }
    ];
    var hits = [];
    for (var i = 0; i < rules.length; i += 1) {
      for (var w = 0; w < rules[i].words.length; w += 1) {
        if (value.indexOf(rules[i].words[w]) !== -1) {
          hits.push(rules[i].id);
          break;
        }
      }
    }
    if (value.indexOf("প্রতিমা") !== -1 || value.indexOf("idol") !== -1) {
      return { uncertain: true, values: [] };
    }
    if (!hits.length) return { uncertain: true, values: [] };
    return { uncertain: false, values: hits };
  }

  function applyStep(draft, input) {
    input = input || {};
    var answers = draft.answers;
    var state = draft.state;
    var value = typeof input.value === "string" ? input.value.trim() : "";

    if (state === "INTRO_AND_CONSENT") {
      if (input.mode === "voice" || input.mode === "chat") draft.mode = input.mode;
      draft.state = "FULL_NAME";
      draft.buffer = "";
      return { ok: true };
    }

    if (state === "FULL_NAME") {
      if (value.length < 2) return { ok: false, error: "required" };
      answers.full_name = value;
    } else if (state === "MOBILE_NUMBER") {
      var mobile = schema.normalizeMobile(value);
      if (!schema.isValidMobile(mobile)) return { ok: false, error: "invalid" };
      answers.mobile = mobile;
    } else if (state === "ADDRESS_LOCALITY") {
      if (!value) return { ok: false, error: "required" };
      answers.address_locality = value;
    } else if (state === "ADDRESS_POST_OFFICE_OPTIONAL") {
      answers.address_post_office = input.skip || isSkipPhrase(value) ? "" : value;
    } else if (state === "ADDRESS_POLICE_STATION_OPTIONAL") {
      answers.address_police_station = input.skip || isSkipPhrase(value) ? "" : value;
    } else if (state === "ADDRESS_DISTRICT") {
      if (!value || isSkipPhrase(value)) return { ok: false, error: "required" };
      answers.address_district = value;
    } else if (state === "ADDRESS_PIN_OPTIONAL") {
      if (input.skip || !value || isSkipPhrase(value)) answers.address_pin = "";
      else {
        var pin = schema.toAsciiDigits(value).replace(/\D/g, "");
        if (!/^\d{6}$/.test(pin)) return { ok: false, error: "invalid" };
        answers.address_pin = pin;
      }
    } else if (state === "WORK_CATEGORY") {
      var cats = Array.isArray(input.categories) ? input.categories : [];
      if (!cats.length && value) {
        var mapped = mapWorkUtterance(value);
        if (mapped.uncertain) return { ok: false, error: "uncertain" };
        cats = mapped.values;
      }
      if (!cats.length) return { ok: false, error: "required" };
      for (var i = 0; i < cats.length; i += 1) {
        if (cats[i] === "idol_making" || !schema.WORK_CATEGORIES[cats[i]]) return { ok: false, error: "not_allowed" };
      }
      answers.work_categories = cats.slice();
    } else if (state === "WORK_DESCRIPTION") {
      if (input.skip || isSkipPhrase(value)) answers.work_description = "";
      else answers.work_description = value;
    } else if (state === "TEAM_NAME") {
      if (input.unknown || isUnknownPhrase(value)) {
        answers.team_unknown = true;
        answers.team_name = "";
      } else if (!value) return { ok: false, error: "required" };
      else {
        answers.team_unknown = false;
        answers.team_name = value;
      }
    } else if (state === "SARDAR_NAME") {
      if (input.unknown || isUnknownPhrase(value)) {
        answers.sardar_unknown = true;
        answers.sardar_name = "";
      } else if (!value) return { ok: false, error: "required" };
      else {
        answers.sardar_unknown = false;
        answers.sardar_name = value;
      }
    } else if (state === "SARDAR_MOBILE_OPTIONAL") {
      if (input.skip || !value || isSkipPhrase(value)) answers.sardar_mobile = "";
      else {
        var sardarMobile = schema.normalizeMobile(value);
        if (!schema.isValidMobile(sardarMobile)) return { ok: false, error: "invalid" };
        answers.sardar_mobile = sardarMobile;
      }
    } else if (state === "ATTENDANCE_STATUS") {
      if (!schema.ATTENDANCE_PUBLIC[input.attendance || value]) return { ok: false, error: "invalid" };
      answers.attendance_status = input.attendance || value;
    } else if (state === "PHOTO_CAPTURE") {
      if (input.followUp) {
        answers.photo_follow_up = true;
        answers.photo_storage_path = "";
      } else if (!input.photoPath || !schema.photoPathOk(input.photoPath)) {
        return { ok: false, error: "required" };
      } else {
        answers.photo_follow_up = false;
        answers.photo_storage_path = input.photoPath;
        if (input.preview) answers.photo_preview = input.preview;
      }
    } else if (state === "DATA_USE_CONSENT") {
      if (input.consent !== true) return { ok: false, error: "required" };
      answers.data_use_consent = true;
    } else if (state === "PHOTO_PUBLICITY_CONSENT_OPTIONAL") {
      if (input.publicity !== true && input.publicity !== false) return { ok: false, error: "required" };
      answers.photo_publicity_consent = input.publicity === true;
      answers.publicity_chosen = true;
    } else if (state === "REVIEW_SUMMARY" || state === "SUBMITTING" || state === "SUCCESS") {
      return { ok: false, error: "not_a_field" };
    } else {
      return { ok: false, error: "invalid_state" };
    }

    draft.buffer = "";
    var at = indexOf(state);
    draft.state = ORDER[at + 1];
    return { ok: true };
  }

  function snapshot(draft) {
    return JSON.stringify({ state: draft.state, mode: draft.mode, answers: draft.answers });
  }

  return {
    ORDER: ORDER,
    EDITABLE: EDITABLE,
    STAGE_TOTAL: 7,
    create: create,
    stageOf: stageOf,
    setMode: setMode,
    jumpTo: jumpTo,
    neighbor: neighbor,
    applyStep: applyStep,
    mapWorkUtterance: mapWorkUtterance,
    isUnknownPhrase: isUnknownPhrase,
    isSkipPhrase: isSkipPhrase,
    snapshot: snapshot
  };
});
