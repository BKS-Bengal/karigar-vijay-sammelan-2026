import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const schema = require("../js/schema.js");
const handler = require("../api/karigar-registrations/index.js");

const KEY = "11111111-1111-4111-8111-111111111111";

function validBody(extra) {
  return Object.assign({
    idempotency_key: KEY,
    full_name: "Test Karigar",
    mobile: "9876543210",
    address_locality: "Test Para",
    address_district: "North 24 Parganas",
    work_categories: ["structure_bamboo"],
    team_unknown: true,
    sardar_unknown: true,
    attendance_status: "yes",
    photo_follow_up: true,
    data_use_consent: true,
    consent_version: schema.CONSENT_VERSION,
    locale: "bn-IN",
    website: ""
  }, extra || {});
}

function mockRes() {
  return {
    statusCode: 0,
    headers: {},
    body: "",
    setHeader(name, value) { this.headers[name] = value; },
    end(payload) { this.body = payload; }
  };
}

async function callHandlerWith(target, req) {
  const res = mockRes();
  await target(req, res);
  return { status: res.statusCode, data: JSON.parse(res.body), headers: res.headers };
}

async function callHandler(req) {
  return callHandlerWith(handler, req);
}

test("schema accepts a follow-up registration and does not invent a reference", () => {
  const parsed = schema.sanitizeRegistration(validBody());
  assert.equal(parsed.ok, true);
  assert.equal(parsed.record.status, "pending_verification");
  assert.equal(parsed.record.photo_follow_up, true);
  assert.equal(parsed.record.photo_storage_path, null);
  assert.equal(Object.hasOwn(parsed.record, "registration_no"), false);
});

test("schema rejects a honeypot and a missing consent", () => {
  const honeypot = schema.sanitizeRegistration(validBody({ website: "http://spam.example" }));
  assert.equal(honeypot.ok, false);
  assert.equal(honeypot.errors.website, "honeypot");

  const consent = schema.sanitizeRegistration(validBody({ data_use_consent: false }));
  assert.equal(consent.ok, false);
  assert.equal(consent.errors.data_use_consent, "required");
});

test("schema normalizes a mobile number and blocks idol-making", () => {
  const parsed = schema.sanitizeRegistration(validBody({ mobile: "+91 98765 43210" }));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.record.mobile_normalized, "9876543210");

  const idol = schema.sanitizeRegistration(validBody({ work_categories: ["idol_making"] }));
  assert.equal(idol.ok, false);
  assert.equal(idol.errors.work_categories, "not_allowed");
});

test("planCreate replays the same key and flags a duplicate mobile", () => {
  const parsed = schema.sanitizeRegistration(validBody());
  const replay = schema.planCreate(parsed.record, {
    byKey: { id: "abc", registration_no: "KVS26-ABCDEF" }
  });
  assert.equal(replay.action, "replay");
  assert.equal(replay.registration_no, "KVS26-ABCDEF");
  assert.equal(replay.record, undefined);

  const insert = schema.planCreate(parsed.record, {
    matches: [{ mobile_normalized: "9876543210", full_name: "Other", address_district: "Other" }]
  });
  assert.equal(insert.action, "insert");
  assert.equal(insert.record.possible_duplicate, true);
});

test("public view exposes only the confirmed reference", () => {
  const view = schema.publicView({
    registration_no: "KVS26-ABCDEF",
    full_name: "Hidden",
    mobile: "9876543210"
  });
  assert.deepEqual(view, { registration_no: "KVS26-ABCDEF" });
});

test("invalid JSON is rejected without throwing", async () => {
  const result = await callHandler({
    method: "POST",
    headers: {},
    get body() { throw new Error("Invalid JSON"); }
  });
  assert.equal(result.status, 400);
  assert.equal(result.data.error, "invalid_payload");
  assert.equal(result.data.registration_no, undefined);
});

test("registration handler rejects non-POST and honeypot without a database call", async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = function () {
    calls += 1;
    throw new Error("database call is not allowed in this test");
  };
  try {
    const method = await callHandler({ method: "GET", headers: {} });
    assert.equal(method.status, 405);
    assert.equal(method.data.ok, false);
    assert.equal(method.data.registration_no, undefined);

    const honeypot = await callHandler({
      method: "POST",
      headers: {},
      body: validBody({ website: "bot" })
    });
    assert.equal(honeypot.status, 400);
    assert.equal(honeypot.data.error, "invalid_payload");
    assert.equal(honeypot.data.registration_no, undefined);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("missing Supabase configuration returns 503 and no registration reference", async () => {
  delete process.env.SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = function () {
    calls += 1;
    throw new Error("database call is not allowed in this test");
  };
  try {
    const result = await callHandler({
      method: "POST",
      headers: {},
      body: validBody()
    });
    assert.equal(result.status, 503);
    assert.equal(result.data.ok, false);
    assert.equal(result.data.error, "configuration_missing");
    assert.equal(result.data.registration_no, undefined);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("visitor copy stays complete in three languages and avoids internal notes", () => {
  const i18n = require("../js/i18n.js");
  assert.equal(i18n.hasAllLanguages(), true);
  assert.equal(i18n.STR["hero.photoCaption"]["bn-IN"].includes("২১ সেপ্টেম্বর"), false);
  assert.equal(i18n.STR["steps.three"]["en-IN"].toLowerCase().includes("storage"), false);
  assert.equal(i18n.STR["people.santoshBody"]["bn-IN"].includes("প্রকাশের জন্য"), false);
});

test("admin desk scripts exist, parse, and stay off the public registration route", () => {
  const files = ["js/admin-list.js", "js/admin-detail.js", "js/i18n.js"];
  files.forEach((file) => {
    const path = fileURLToPath(new URL("../" + file, import.meta.url));
    const check = spawnSync(process.execPath, ["--check", path], { encoding: "utf8" });
    assert.equal(check.status, 0, file + "\n" + check.stderr);
  });
  const list = readFileSync(fileURLToPath(new URL("../js/admin-list.js", import.meta.url)), "utf8");
  const detail = readFileSync(fileURLToPath(new URL("../js/admin-detail.js", import.meta.url)), "utf8");
  assert.match(list, /\/api\/admin\/karigar-session/);
  assert.match(list, /\/api\/admin\/karigar-registrations\?/);
  assert.match(list, /export\?kind=/);
  assert.match(list, /role === "event_admin"/);
  assert.match(detail, /record\?id=/);
  assert.match(detail, /method: "PATCH"/);
  assert.doesNotMatch(list, /\/api\/karigar-registrations"/);
  assert.doesNotMatch(detail, /photo_storage_path/);
  assert.doesNotMatch(detail, /photo_publicity_consent:\s*true/);
});

test("the wizard keeps optional answers optional and requires a real attendance choice", () => {
  const machine = require("../js/machine.js");
  const draft = machine.create({ mode: "chat", idempotencyKey: KEY });
  assert.equal(draft.answers.attendance_status, "");
  assert.equal(draft.answers.data_use_consent, false);
  assert.equal(draft.answers.photo_publicity_consent, false);

  const steps = [
    [{ mode: "chat" }, "FULL_NAME"],
    [{ value: "Test Karigar" }, "MOBILE_NUMBER"],
    [{ value: "+91 98765 43210" }, "ADDRESS_LOCALITY"],
    [{ value: "Test Para" }, "ADDRESS_POST_OFFICE_OPTIONAL"],
    [{ skip: true }, "ADDRESS_POLICE_STATION_OPTIONAL"],
    [{ skip: true }, "ADDRESS_DISTRICT"],
    [{ value: "North 24 Parganas" }, "ADDRESS_PIN_OPTIONAL"],
    [{ skip: true }, "WORK_CATEGORY"],
    [{ categories: ["lighting_installation", "decoration_draping"] }, "WORK_DESCRIPTION"],
    [{ skip: true }, "TEAM_NAME"],
    [{ unknown: true }, "SARDAR_NAME"],
    [{ unknown: true }, "SARDAR_MOBILE_OPTIONAL"],
    [{ skip: true }, "ATTENDANCE_STATUS"]
  ];
  steps.forEach((pair) => {
    const result = machine.applyStep(draft, pair[0]);
    assert.equal(result.ok, true, draft.state);
    assert.equal(draft.state, pair[1]);
  });
  assert.equal(machine.applyStep(draft, { attendance: "maybe" }).ok, false);
  assert.equal(draft.answers.attendance_status, "");
  assert.equal(machine.applyStep(draft, { attendance: "yes" }).ok, true);
  assert.equal(machine.applyStep(draft, { followUp: true }).ok, true);
  assert.equal(machine.applyStep(draft, { consent: false }).ok, false);
  assert.equal(machine.applyStep(draft, { consent: true }).ok, true);
  assert.equal(machine.applyStep(draft, {}).ok, false);
  assert.equal(machine.applyStep(draft, { publicity: false }).ok, true);
  assert.equal(draft.state, "REVIEW_SUMMARY");
  assert.equal(draft.answers.mobile, "9876543210");
  assert.equal(draft.answers.address_post_office, "");
  assert.equal(draft.answers.team_unknown, true);
  assert.equal(draft.answers.sardar_unknown, true);
  assert.equal(draft.answers.photo_publicity_consent, false);
  assert.equal(draft.answers.data_use_consent, true);
  assert.deepEqual(draft.answers.work_categories, ["lighting_installation", "decoration_draping"]);

  const idol = machine.create();
  idol.state = "WORK_CATEGORY";
  assert.equal(machine.applyStep(idol, { categories: ["idol_making"] }).error, "not_allowed");

  machine.setMode(draft, "voice");
  assert.equal(draft.mode, "voice");
  assert.equal(draft.answers.full_name, "Test Karigar");
});

test("photo upload rejects a bad or tiny image before any storage call", async () => {
  const photo = require("../api/karigar-registrations/photo.js");
  delete process.env.SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = function () {
    calls += 1;
    throw new Error("storage call is not allowed in this test");
  };
  function png(width, height) {
    const buf = Buffer.alloc(32);
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf);
    buf.write("IHDR", 12);
    buf.writeUInt32BE(width, 16);
    buf.writeUInt32BE(height, 20);
    return buf.toString("base64");
  }
  try {
    const bad = await callHandlerWith(photo, { method: "POST", headers: {}, body: { image_base64: Buffer.from("not-an-image").toString("base64") } });
    assert.equal(bad.status, 400);
    assert.equal(bad.data.error, "invalid_image");

    const tiny = await callHandlerWith(photo, { method: "POST", headers: {}, body: { image_base64: png(8, 8) } });
    assert.equal(tiny.status, 400);
    assert.equal(tiny.data.error, "invalid_image");

    const ready = await callHandlerWith(photo, { method: "POST", headers: {}, body: { image_base64: png(32, 32) } });
    assert.equal(ready.status, 503);
    assert.equal(ready.data.error, "configuration_missing");
    assert.equal(ready.data.photo_storage_path, undefined);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("speech status reports unavailable without inventing audio", async () => {
  const savedKey = process.env.AZURE_SPEECH_KEY;
  const savedRegion = process.env.AZURE_SPEECH_REGION;
  const savedGemini = process.env.GEMINI_API_KEY;
  delete process.env.AZURE_SPEECH_KEY;
  delete process.env.AZURE_SPEECH_REGION;
  delete process.env.GEMINI_API_KEY;
  const token = require("../api/karigar-registrations/speech-token.js");
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = function () {
    calls += 1;
    throw new Error("speech provider call is not allowed in this test");
  };
  try {
    const result = await callHandlerWith(token, { method: "GET", headers: {} });
    assert.equal(result.status, 200);
    assert.equal(result.data.stt, false);
    assert.equal(result.data.tts, false);
    assert.equal(result.data.live, false);
    assert.equal(result.data.token, undefined);
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    if (savedKey == null) delete process.env.AZURE_SPEECH_KEY;
    else process.env.AZURE_SPEECH_KEY = savedKey;
    if (savedRegion == null) delete process.env.AZURE_SPEECH_REGION;
    else process.env.AZURE_SPEECH_REGION = savedRegion;
    if (savedGemini == null) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = savedGemini;
  }
});

test("a mocked save returns one reference and a second post replays it", async () => {
  const http = require("../api/_lib/http.js");
  process.env.SUPABASE_URL = "https://example.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  http.resetRateLimits();
  const saved = new Map();
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async function (url, options) {
    const href = String(url);
    const method = (options && options.method) || "GET";
    if (method === "POST" && href.includes("/rest/v1/karigar_registrations")) {
      const body = JSON.parse(options.body);
      if (saved.has(body.idempotency_key)) {
        return { ok: false, status: 409, text: async () => "idempotency", json: async () => ({}) };
      }
      const row = Object.assign({
        id: "22222222-2222-4222-8222-222222222222",
        created_at: "2026-10-14T00:00:00.000Z"
      }, body);
      saved.set(body.idempotency_key, row);
      return { ok: true, status: 201, json: async () => [row], text: async () => "" };
    }
    if (href.includes("idempotency_key=eq.")) {
      const key = decodeURIComponent(href.split("idempotency_key=eq.")[1].split("&")[0]);
      const row = saved.get(key);
      return { ok: true, status: 200, json: async () => (row ? [{ id: row.id, registration_no: row.registration_no }] : []) };
    }
    return { ok: true, status: 200, json: async () => [], text: async () => "" };
  };
  try {
    const first = await callHandler({ method: "POST", headers: {}, body: validBody() });
    assert.equal(first.status, 201);
    assert.equal(first.data.ok, true);
    assert.match(first.data.registration_no, /^KVS26-[A-Z2-9]{6}$/);
    assert.equal(first.data.full_name, undefined);
    assert.equal(first.data.mobile, undefined);
    const second = await callHandler({ method: "POST", headers: {}, body: validBody() });
    assert.equal(second.status, 200);
    assert.equal(second.data.ok, true);
    assert.equal(second.data.replayed, true);
    assert.equal(second.data.registration_no, first.data.registration_no);
    assert.equal(saved.size, 1);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    http.resetRateLimits();
  }
});

test("a missing stored photo is rejected and no reference is issued", async () => {
  const http = require("../api/_lib/http.js");
  process.env.SUPABASE_URL = "https://example.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  http.resetRateLimits();
  const originalFetch = globalThis.fetch;
  let posts = 0;
  globalThis.fetch = async function (url, options) {
    const href = String(url);
    const method = (options && options.method) || "GET";
    if (method === "POST") posts += 1;
    if (method === "HEAD") return { ok: false, status: 404, json: async () => [], text: async () => "" };
    return { ok: true, status: 200, json: async () => [], text: async () => "" };
  };
  try {
    const result = await callHandler({
      method: "POST",
      headers: {},
      body: validBody({
        photo_follow_up: false,
        photo_storage_path: "photos/11111111-1111-4111-8111-111111111111.jpg"
      })
    });
    assert.equal(result.status, 400);
    assert.equal(result.data.error, "photo_missing");
    assert.equal(result.data.registration_no, undefined);
    assert.equal(posts, 0);
  } finally {
    globalThis.fetch = originalFetch;
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    http.resetRateLimits();
  }
});

test("viewer records hide contact fields and publicity cannot be switched on", async () => {
  const http = require("../api/_lib/http.js");
  const reg = require("../api/_lib/registrations.js");
  const session = require("../api/admin/karigar-session.js");
  const record = require("../api/admin/karigar-registrations/record.js");
  const exportHandler = require("../api/admin/karigar-registrations/export.js");
  const saved = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    KARIGAR_SESSION_SECRET: process.env.KARIGAR_SESSION_SECRET,
    KARIGAR_EVENT_ADMIN_TOKEN: process.env.KARIGAR_EVENT_ADMIN_TOKEN,
    KARIGAR_EVENT_VIEWER_TOKEN: process.env.KARIGAR_EVENT_VIEWER_TOKEN
  };
  process.env.SUPABASE_URL = "https://example.test";
  process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role";
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  process.env.KARIGAR_SESSION_SECRET = "test-session-secret";
  process.env.KARIGAR_EVENT_ADMIN_TOKEN = "test-admin-token";
  process.env.KARIGAR_EVENT_VIEWER_TOKEN = "test-viewer-token";
  http.resetRateLimits();
  const row = {
    id: "22222222-2222-4222-8222-222222222222",
    registration_no: "KVS26-ABCDEF",
    full_name: "Test Karigar",
    mobile: "9876543210",
    mobile_normalized: "9876543210",
    address_pin: "700001",
    sardar_mobile: "9123456789",
    sardar_mobile_normalized: "9123456789",
    submitter_ip_hash: "hidden-hash",
    photo_storage_path: "photos/11111111-1111-4111-8111-111111111111.jpg",
    data_use_consent_at: "2026-10-14T00:00:00.000Z",
    consent_version: schema.CONSENT_VERSION,
    photo_publicity_consent: false,
    status: "pending_verification",
    attendance_status: "yes"
  };
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async function (url) {
    const href = String(url);
    if (href.includes("karigar_registration_audit")) return { ok: true, status: 200, json: async () => [] };
    if (href.includes("/rest/v1/karigar_registrations")) return { ok: true, status: 200, json: async () => [row] };
    throw new Error("unexpected database call");
  };
  function cookieFrom(setCookie) {
    return String(setCookie).split(";")[0];
  }
  try {
    const viewerView = reg.shapeRow(row, "event_viewer");
    assert.equal(viewerView.mobile, undefined);
    assert.equal(viewerView.address_pin, undefined);
    assert.equal(viewerView.sardar_mobile, undefined);
    assert.equal(viewerView.submitter_ip_hash, undefined);
    assert.equal(viewerView.photo_storage_path, undefined);
    assert.equal(viewerView.photo_available, true);
    assert.equal(viewerView.full_name, "Test Karigar");
    assert.equal(reg.shapeRow(row, "event_admin").mobile, "9876543210");

    const locked = reg.sanitizePatch({ photo_publicity_consent: true, status: "verified" }, row);
    assert.equal(locked.ok, false);
    assert.equal(locked.errors.photo_publicity_consent, "locked");
    const withdrawn = reg.sanitizePatch({ photo_publicity_consent: false }, Object.assign({}, row, { photo_publicity_consent: true }));
    assert.equal(withdrawn.ok, true);
    assert.equal(withdrawn.patch.photo_publicity_consent, false);

    const csv = schema.toCsv([{ full_name: "=HYPERLINK(\"http://evil.example\")", mobile: "9876543210" }], ["full_name", "mobile"]);
    assert.match(csv, /'=HYPERLINK/);
    assert.equal(schema.exportPlan("contacts", "event_viewer").error, "forbidden");

    const bad = await callHandlerWith(session, { method: "POST", headers: {}, body: { token: "wrong" } });
    assert.equal(bad.status, 401);
    const viewerLogin = await callHandlerWith(session, { method: "POST", headers: {}, body: { token: "test-viewer-token" } });
    assert.equal(viewerLogin.status, 200);
    assert.equal(viewerLogin.data.role, "event_viewer");
    const viewerCookie = cookieFrom(viewerLogin.headers["Set-Cookie"]);
    const viewerRecord = await callHandlerWith(record, {
      method: "GET",
      headers: { cookie: viewerCookie },
      query: { id: row.id }
    });
    assert.equal(viewerRecord.status, 200);
    assert.equal(viewerRecord.data.row.mobile, undefined);
    assert.equal(viewerRecord.data.row.full_name, "Test Karigar");
    const viewerPatch = await callHandlerWith(record, {
      method: "PATCH",
      headers: { cookie: viewerCookie },
      query: { id: row.id },
      body: { status: "cancelled" }
    });
    assert.equal(viewerPatch.status, 403);
    const contacts = await callHandlerWith(exportHandler, {
      method: "GET",
      headers: { cookie: viewerCookie },
      query: { kind: "contacts" }
    });
    assert.equal(contacts.status, 403);

    const adminLogin = await callHandlerWith(session, { method: "POST", headers: {}, body: { token: "test-admin-token" } });
    assert.equal(adminLogin.data.role, "event_admin");
    const adminRecord = await callHandlerWith(record, {
      method: "GET",
      headers: { cookie: cookieFrom(adminLogin.headers["Set-Cookie"]) },
      query: { id: row.id }
    });
    assert.equal(adminRecord.status, 200);
    assert.equal(adminRecord.data.row.mobile, "9876543210");
    assert.equal(adminRecord.data.row.submitter_ip_hash, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    Object.keys(saved).forEach((name) => {
      if (saved[name] == null) delete process.env[name];
      else process.env[name] = saved[name];
    });
    http.resetRateLimits();
  }
});

test("jpeg metadata is stripped and ordinary webp sizes are accepted", () => {
  const reg = require("../api/_lib/registrations.js");
  const jpeg = Buffer.concat([
    Buffer.from([0xff, 0xd8, 0xff, 0xe1, 0x00, 0x08]),
    Buffer.from("Exif\0\0"),
    Buffer.from([0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x20, 0x00, 0x20, 0x01, 0x01, 0x11, 0x00, 0xff, 0xd9])
  ]);
  assert.equal(reg.sniffImage(jpeg).ext, "jpg");
  assert.deepEqual(reg.imageSize(jpeg), { width: 32, height: 32 });
  const stripped = reg.stripJpegExif(jpeg);
  assert.equal(stripped.includes(Buffer.from("Exif")), false);
  assert.equal(stripped[0], 0xff);
  assert.equal(stripped[1], 0xd8);
  assert.deepEqual(reg.imageSize(stripped), { width: 32, height: 32 });

  const vp8 = Buffer.alloc(32);
  vp8.write("RIFF", 0);
  vp8.write("WEBP", 8);
  vp8.write("VP8 ", 12);
  vp8[23] = 0x9d;
  vp8[24] = 0x01;
  vp8[25] = 0x2a;
  vp8.writeUInt16LE(40, 26);
  vp8.writeUInt16LE(30, 28);
  assert.deepEqual(reg.imageSize(vp8), { width: 40, height: 30 });

  const vp8l = Buffer.alloc(25);
  vp8l.write("RIFF", 0);
  vp8l.write("WEBP", 8);
  vp8l.write("VP8L", 12);
  vp8l[20] = 0x2f;
  vp8l.writeUInt32LE((48 - 1) | ((36 - 1) << 14), 21);
  assert.deepEqual(reg.imageSize(vp8l), { width: 48, height: 36 });
});

test("speech routes stay closed when the region is empty or not a region name", async () => {
  const speak = require("../api/karigar-registrations/speak.js");
  const transcribe = require("../api/karigar-registrations/transcribe.js");
  const savedKey = process.env.AZURE_SPEECH_KEY;
  const savedRegion = process.env.AZURE_SPEECH_REGION;
  const savedGemini = process.env.GEMINI_API_KEY;
  delete process.env.GEMINI_API_KEY;
  process.env.AZURE_SPEECH_KEY = "test-speech-key";
  process.env.AZURE_SPEECH_REGION = "https://evil.example";
  const originalFetch = globalThis.fetch;
  let calls = 0;
  globalThis.fetch = function () {
    calls += 1;
    throw new Error("speech provider call is not allowed in this test");
  };
  try {
    const spoken = await callHandlerWith(speak, { method: "POST", headers: {}, body: { text: "নমস্কার", language: "bn-IN" } });
    assert.equal(spoken.status, 503);
    assert.equal(spoken.data.error, "speech_unconfigured");
    const heard = await callHandlerWith(transcribe, {
      method: "POST",
      headers: {},
      body: { audio_base64: Buffer.from("abc").toString("base64"), language: "bn-IN" }
    });
    assert.equal(heard.status, 503);
    assert.equal(heard.data.error, "speech_unconfigured");
    assert.equal(calls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    if (savedKey == null) delete process.env.AZURE_SPEECH_KEY;
    else process.env.AZURE_SPEECH_KEY = savedKey;
    if (savedRegion == null) delete process.env.AZURE_SPEECH_REGION;
    else process.env.AZURE_SPEECH_REGION = savedRegion;
    if (savedGemini == null) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = savedGemini;
  }
});

test("gemini voice stays on the server and does not return the permanent key", async () => {
  const http = require("../api/_lib/http.js");
  const gemini = require("../api/_lib/gemini.js");
  const token = require("../api/karigar-registrations/speech-token.js");
  const speak = require("../api/karigar-registrations/speak.js");
  const transcribe = require("../api/karigar-registrations/transcribe.js");
  const savedGemini = process.env.GEMINI_API_KEY;
  const savedKey = process.env.AZURE_SPEECH_KEY;
  const savedRegion = process.env.AZURE_SPEECH_REGION;
  const secret = "gemini-test-key-should-not-leak";
  process.env.GEMINI_API_KEY = secret;
  delete process.env.AZURE_SPEECH_KEY;
  delete process.env.AZURE_SPEECH_REGION;
  http.resetRateLimits();
  const originalFetch = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async function (url, options) {
    const headers = options && options.headers ? options.headers : {};
    calls.push({ url: String(url), body: options && options.body, key: headers["x-goog-api-key"] });
    if (String(url).indexOf("/auth_tokens") !== -1) {
      return { ok: true, json: async function () { return { name: "auth_tokens/short-lived" }; } };
    }
    if (String(url).indexOf("gemini-3.8-flash-tts") !== -1) {
      return {
        ok: true,
        json: async function () {
          return { candidates: [{ content: { parts: [{ inlineData: { mimeType: "audio/wav", data: Buffer.from("RIFF").toString("base64") } }] } }] };
        }
      };
    }
    if (String(url).indexOf("/interactions") !== -1) {
      return { ok: true, json: async function () { return { outputs: [{ type: "text", text: "অনিল" }] }; } };
    }
    throw new Error("unexpected speech url");
  };
  try {
    const status = await callHandlerWith(token, { method: "GET", headers: {} });
    assert.equal(status.data.provider, "gemini");
    assert.equal(status.data.live, true);
    assert.equal(status.data.stt, true);
    assert.equal(status.data.token, undefined);
    assert.equal(calls.length, 0);

    const minted = await callHandlerWith(token, { method: "POST", headers: {} });
    assert.equal(minted.status, 200);
    assert.equal(minted.data.token, "auth_tokens/short-lived");
    assert.equal(minted.data.model, "gemini-3.8-live");
    assert.equal(JSON.stringify(minted.data).indexOf(secret), -1);
    const tokenCall = calls[0];
    assert.match(tokenCall.url, /\/auth_tokens$/);
    assert.equal(tokenCall.key, secret);
    const locked = JSON.parse(tokenCall.body);
    assert.equal(locked.uses, 1);
    assert.equal(locked.liveConnectConstraints.model, "models/gemini-3.8-live");
    assert.deepEqual(locked.liveConnectConstraints.config.responseModalities, ["AUDIO"]);

    const res = mockRes();
    await speak({ method: "POST", headers: {}, body: { text: "নমস্কার", language: "bn-IN" } }, res);
    assert.equal(res.statusCode, 200);
    assert.equal(res.headers["Content-Type"], "audio/wav");
    assert.equal(Buffer.isBuffer(res.body), true);
    assert.equal(JSON.stringify(res.headers).indexOf(secret), -1);
    const speakCall = calls[1];
    assert.match(speakCall.url, /models\/gemini-3\.8-flash-tts:generateContent$/);
    const spoken = JSON.parse(speakCall.body);
    assert.equal(spoken.contents[0].parts[0].text, "নমস্কার");
    assert.equal(spoken.generationConfig.responseModalities[0], "AUDIO");

    const heard = await callHandlerWith(transcribe, {
      method: "POST",
      headers: {},
      body: { audio_base64: Buffer.from("abc").toString("base64"), mime: "audio/webm;codecs=opus", language: "bn-IN" }
    });
    assert.equal(heard.status, 200);
    assert.equal(heard.data.text, "অনিল");
    assert.equal(heard.data.provider, "gemini");
    assert.equal(JSON.stringify(heard.data).indexOf(secret), -1);
    const heardCall = JSON.parse(calls[2].body);
    assert.equal(heardCall.model, gemini.STT_MODEL);
    assert.equal(heardCall.input[0].mime_type, "audio/webm");
    assert.deepEqual(heardCall.generation_config.transcription_config.language_codes, ["bn-IN"]);
  } finally {
    globalThis.fetch = originalFetch;
    if (savedGemini == null) delete process.env.GEMINI_API_KEY;
    else process.env.GEMINI_API_KEY = savedGemini;
    if (savedKey == null) delete process.env.AZURE_SPEECH_KEY;
    else process.env.AZURE_SPEECH_KEY = savedKey;
    if (savedRegion == null) delete process.env.AZURE_SPEECH_REGION;
    else process.env.AZURE_SPEECH_REGION = savedRegion;
  }
});

test("registration and organiser pages keep the repaired confirmation and consent behaviour", () => {
  const register = readFileSync(fileURLToPath(new URL("../js/register-app.js", import.meta.url)), "utf8");
  const speech = readFileSync(fileURLToPath(new URL("../js/speech.js", import.meta.url)), "utf8");
  const detail = readFileSync(fileURLToPath(new URL("../js/admin-detail.js", import.meta.url)), "utf8");
  assert.match(register, /confirm\.heard/);
  assert.match(register, /clearNotice\(\)/);
  assert.match(register, /photo_follow_up/);
  assert.match(speech, /event\.error === "aborted"/);
  assert.match(speech, /bn-IN/);
  assert.match(speech, /BidiGenerateContentConstrained/);
  assert.match(speech, /inputTranscription/);
  assert.doesNotMatch(speech, /x-goog-api-key|GEMINI_API_KEY/);
  assert.doesNotMatch(speech, /\/api\/karigar-registrations["']/);
  assert.match(register, /listenGeneration/);
  assert.match(detail, /data_use_consent_at/);
  assert.doesNotMatch(detail, /photo_publicity_consent:\s*true/);
  const people = readFileSync(fileURLToPath(new URL("../karigar-vijaya-sammelan/karigar/index.html", import.meta.url)), "utf8");
  const story = readFileSync(fileURLToPath(new URL("../karigar-vijaya-sammelan/story/index.html", import.meta.url)), "utf8");
  const landing = readFileSync(fileURLToPath(new URL("../karigar-vijaya-sammelan/index.html", import.meta.url)), "utf8");
  const i18n = readFileSync(fileURLToPath(new URL("../js/i18n.js", import.meta.url)), "utf8");
  const publicText = people + story + landing + i18n;
  assert.match(story, /জঞ্জালের স্তূপ থেকে আলোর মণ্ডপ/);
  assert.match(story, /story\.c1Title/);
  assert.match(story, /story\.c7Title/);
  assert.match(i18n, /1 November 2026/);
  assert.match(i18n, /16 to 20 October 2026/);
  assert.doesNotMatch(publicText, /পলিট|পান্না|৫০০০|কর্মস্বীকৃতি|প্রাথমিক বিদ্যালয়|primary school/);
});
