# Karigar Vijay Sammelan 2026 — completion report

Date: 14 October 2026
Folder: `specialist-sites/bks-karigar-vijay-sammelan-2026`
Repository: `C:\Users\asits\Projects\bks-durga-puja-2026`
Branch: `main`, tracking `origin/main`

This report matches the checks that were actually run. A checkbox is complete only where the evidence is named below.

## 22. Final pass — artisan GIF, public notes, page slide

Local checks only. A hosted Vercel URL is not claimed in this section.

| Check | Result |
| --- | --- |
| Production notes on public HTML and `js/i18n.js` | PASS. A search found none of the local-video or “not a portrait” captions. Rendered pages in `preview/2026-10-14-final/report.json` also recorded `notes: false`. |
| Hero GIF file | PASS. Pillow: 720×405, 48 frames, 2,144,897 bytes, loop 0. Delays 120 ms × 23 and 130 ms × 25. Total 6.01 s, about 8 fps. Not 1600×900 and not 10–15 fps. |
| Hero GIF in the browser | PASS. `gif-loop-a.jpg` and `gif-loop-b.jpg`, one second apart, hero crop changed by 20,751 pixels. |
| Static master and reduced-motion still | PASS as files. Master 1280×720, 165,560 bytes. Static 1280×720, 120,418 bytes. Reduced motion in Edge loaded the static WebP. Pause click swapped to that still. |
| Right-to-left route change | PASS for the JavaScript fallback in this Edge. `transition-leaving.jpg` plus an entering transform of about 262 px on `/karigar-vijaya-sammelan/story/`. CSS `@view-transition` is in the stylesheet. `CSS.supports` for that at-rule was false here, so the native cross-document transition was not observed. |
| `npm test` | PASS. 20 passed, 0 failed, after the pause-button and transition-gate edits. |
| Portrait match | NOT VERIFIED. |
| Full YouTube video | NOT WATCHED. The local thumbnail and oEmbed title were already on file. |
| rocket.new, Pehchaan, Pinterest, Behance, Dribbble | NOT OPENED. |
| Database write, Gemini live voice, camera, microphone, admin sign-in | NOT TESTED. |
| Hosted Vercel deployment | BLOCKED for this pass. `vercel whoami` is signed in. This folder has no `.vercel/project.json`, only a local dev cache. No project was guessed and `vercel` was not given `--yes`. |

Screenshots: `preview/2026-10-14-final/`.

## 21. Evening pass — event homepage

No commit and no push.

Homepage sections, in order: poster hero with the event name, the core line, 1 November 2026 and the Puja grounds; YouTube thumbnail for `BKrUP5Froy4`; official 2026 gallery; registration steps; facts; help. The story article is only on `/karigar-vijaya-sammelan/story/`, linked as “গড়ে ওঠার গল্প”.

| Check | Result |
| --- | --- |
| `npm test` | PASS. 20 passed, 0 failed. |
| Thumbnail file | PASS. `maxresdefault.jpg` 1280×720, 298162 bytes, HTTP 200. Page links to the watch URL. Full video not played. |
| Gallery load at 390 and 1440 | PASS. 15 images, zero broken. |
| Story absent from home, present on its route | PASS. |
| Reduced motion | PASS. `currentSrc` was `event-poster.jpg`, 1280×720. |
| GIF file frames differ | PASS. Twelve extracted frames, twelve hashes. 960×540, 271584 bytes, 250 ms × 12. |
| GIF frame change inside headless Edge | NOT OBSERVED. Canvas pixels did not change. |
| Languages bn / en / hi | PASS. |
| Voice and typed registration routes | PASS. Saathi present on the voice route. No Gemini live-voice claim. |
| Overflow 320–1440 | PASS. 0 or −15. No horizontal page overflow. |
| Portrait match | NOT VERIFIED. Unchanged. |
| Database write, Gemini key, camera, microphone, admin, Vercel deploy | NOT TESTED. Still blocked as before. |

Screenshots: `preview/2026-10-14-event/`.


## 1. What was already complete

The site was already a Bengali-first plain HTML/CSS/JS application with Vercel serverless functions, not Next.js.

Already in place before this pass:

- Landing page, story page, artisan profiles, registration wizard, privacy page and help phones.
- Warm ivory, sindoor, plum and marigold visual system, and the original Karigar Saathi drawing.
- Registration state machine, validation, answer retention, and a success screen that requires `ok: true` plus `registration_no`.
- API routes for registration, private photo upload, speech, and the organiser desk.
- Supabase migration file, not applied.
- `.env.local` present, Git-ignored, with Supabase and Azure values empty.
- Local API server: `vercel dev --local` at `http://127.0.0.1:3000`.
- Unit tests for schema, honeypot, duplicate replay, and the 503 configuration path.
- Organiser page scripts `js/admin-list.js` and `js/admin-detail.js`.
- Design research notes for the sites that had actually been opened.

The essential public line remains:

“আপনাদের হাতে গড়ে উঠেছে প্রত্যাবর্তন। এবার আপনাদের সম্মানে আমাদের বিজয়া সম্মিলনী।”

Puja dates stay 16–20 October 2026. The Sammelan stays Sunday, 1 November 2026. No event time and no guest list were added. Idol-making is not a work category.

## 2. What this pass completed

- Visitor story and profile text no longer reads like an editorial note, including the first paint before JavaScript.
- The bamboo photo is no longer dated 21 September. That date stays only in the official work calendar.
- Work description now has the same Skip control as the other optional answers. The state machine already treated it as optional.
- Attendance choices are three equal buttons. None is pre-selected. The browser confirmed `aria-pressed` was empty for yes, unsure and no.
- Error text is stored as a language key, so a later language change replaces the old sentence. The browser showed the Bengali configuration error after an English review.
- A second submit is ignored while a submit is already running.
- The help panel sets the avatar to `help`. The mouth still moves only while audio is actually playing.
- The browser speech fallback sets listening, then idle or error when recognition ends. Azure is still unconfigured, so this path was not spoken aloud.
- Photo uploads are checked for type, size and pixel bounds before storage. JPEG EXIF APP1 segments are stripped. A valid image with no database returns 503 and does not pretend the file was stored.
- Short public descriptions were added on registration and privacy. Admin and the post-submit page send `noindex`.
- Tests now cover the full wizard, photo rejection, and the speech-unavailable status.

## 3. Design research that was actually done

Recorded in `docs/karigar-saathi-design-research.md`.

Opened and used: the official Protyabortan site, Mudiali (thin), UNESCO, Sree Bhumi (as a counter-example), BookMyShow Kolkata (thin), Slush, Slush event info, Web Summit, TED AI, Adobe Summit, UX4G, W3C form labels, W3C form validation, Vercel CLI docs, and Azure viseme docs.

Not reviewed: Utsav (request failed), Disneyland Paris (access denied), MDN reduced-motion (page shell only), BookMyShow organiser entry, District Kolkata, District Howrah, and the Landingmetrics collection.

No layout was cloned. The landing, avatar and story layout were not redrawn.

## 4. Files and purpose

The whole Karigar folder is untracked. Other specialist sites were already dirty and were not edited.

Created or updated for this work:

| File | Purpose |
| --- | --- |
| `js/admin-list.js` | Organiser sign-in, filters, list, exports |
| `js/admin-detail.js` | Record view, photo, status update, audit |
| `js/register-app.js` | Language-safe errors, optional description skip, submit guard, help state |
| `js/speech.js` | Listening state for the browser microphone fallback |
| `js/i18n.js` | Visitor copy, placeholders, organiser labels |
| `css/site.css` | Help-state outline |
| `api/_lib/registrations.js` | Image dimensions and JPEG EXIF strip |
| `api/karigar-registrations/photo.js` | Reject bad images before storage |
| `scripts/test-karigar.mjs` | Schema, wizard, photo, speech and admin-script tests |
| Public and admin HTML | Captions, descriptions, `noindex` on private pages |
| `docs/karigar-saathi-design-research.md` | Sources actually opened |
| `docs/karigar-saathi-visual-spec.md` | Tokens, avatar states, motion |
| `docs/artisan-evidence-and-asset-map.md` | Names, photos, frames, publication limits |
| `docs/local-api-and-supabase.md` | Local API and safe Supabase setup |
| `docs/grok-master-work-log.md` | Checkpoint |
| `docs/FINAL_GROK_COMPLETION_REPORT.md` | This report |

## 5. Commands and results

From the Karigar folder:

`npm test` → 12 passed, 0 failed. Re-run after the work-description skip change, from the Karigar folder, on 14 Oct 2026.

`node --check` passed for `js/register-app.js`, `js/speech.js`, `js/i18n.js`, `js/admin-list.js`, `js/admin-detail.js`, `api/karigar-registrations/photo.js` and `api/_lib/registrations.js` (the admin and i18n files through the test file).

Against `http://127.0.0.1:3000`:

| Request | Result |
| --- | --- |
| Honeypot `POST /api/karigar-registrations/` | 400 `invalid_payload` |
| `GET /api/karigar-registrations/speech-token/` | 200 `stt: false`, `tts: false` |
| Bad image `POST /api/karigar-registrations/photo/` | 400 `invalid_image` |
| `GET /api/admin/karigar-session/` | 401 `unauthenticated` |
| `GET /api/admin/karigar-registrations/` | 401 |

`git check-ignore` confirms `.env.local` is ignored. Names only: Supabase URL empty, service role empty, Azure key empty, Azure region empty, salt and the three organiser secrets set. Values were not printed.

## 6. Browser routes and viewports

Tool: Microsoft Edge headless, driven by the debugging port. No Playwright package was installed.

A first run measured blank pages and was discarded. The second run waited for each page load.

Routes with a real title, at 320, 360, 390, 430, 768 and 1440 pixels wide:

- `/karigar-vijaya-sammelan/`
- `/karigar-vijaya-sammelan/story/`
- `/karigar-vijaya-sammelan/karigar/`
- `/karigar-vijaya-sammelan/register/?mode=chat`
- `/karigar-vijaya-sammelan/privacy/`

On every one of those: horizontal overflow 0, broken images 0, and no measured link or button shorter than 44 pixels. Primary controls use the 48 pixel `--tap` size.

Registration at 390 pixels wide, typed path:

- Name পরীক্ষা কারিগর, mobile, locality, skipped post office and police station, district, skipped PIN.
- Bamboo work. Skipped description. Unknown team. Unknown sardar. Skipped sardar mobile.
- No attendance button was pre-selected. Chose unsure.
- Later-photo fallback. Required consent checked. Publicity set to no.
- Review text had the name and a human work label, not `structure_bamboo`.
- English switch changed the review prompt to: “Let us check what you gave…”
- Submit returned to the Bengali review and showed: “সংরক্ষণের ব্যবস্থা এখন যুক্ত নয়। আয়োজককে জানান। আপনার লেখা তথ্য এই পাতায় আছে।”
- No registration number appeared.

Reduced motion on the landing page: `prefers-reduced-motion: reduce` was active and the avatar body animation computed as `none`.

Not visually clicked: voice recording, camera preview, organiser sign-in, and the admin list after sign-in. Headless Edge had no microphone or camera exercise, and signing in would still have no database.

## 7. Integrations actually exercised

- Local Vercel dev server: yes.
- Registration validation and the 503 failure path: yes, in unit tests and in the browser.
- Speech provider: only the unconfigured status. No Bengali audio was produced or recognised.
- Camera: code inspected. Preview, permission and retake were not run.
- Supabase: not called. Missing URL and service-role key.
- Admin authentication: only the logged-out 401. No token was sent.

## 8. Registrations saved

None. No development or staging row was written.

## 9. Migrations

Not applied. No database was contacted. The SQL file remains `supabase/migrations/20261012000000_create_karigar_registrations.sql`.

## 10. Blockers

1. Supabase: put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Karigar `.env.local`. Take them from the approved project’s Project Settings → API (Project URL and the `service_role` secret). Do not paste them into chat. Use a non-production project. Restart `vercel dev` after saving the file.
2. Migration: apply that SQL only after the project is confirmed. Do not run it on production from this workspace.
3. Azure Speech: `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` are empty. Text registration still works. Live Bengali recognition and playback were not tested.
4. Camera and a real photo upload need a browser with a camera and the Supabase bucket from the migration.
5. Publication: portraits are not approved. Family health, “Polit”, Panna Madam’s full name, the Karma Swikriti Card and any payment amount stay unpublished.
6. The YouTube interview was not played in this pass. Two local MP4s were probed and a few frames were looked at. Their audio was not transcribed. No local speech-to-text tool was installed.

## 11. Security limits that remain

- Organiser tokens in `.env.local` are shared secrets, not personal accounts. They are server-side. They were not tested end to end.
- The public site cannot list registrations without a session. That was checked only as HTTP 401.
- Photo publicity consent cannot be turned on from the organiser form. It was not tested against a live row.
- Service-role access is the intended server path. Anonymous database access is revoked in the migration, but that migration is not applied anywhere yet.
- Admin pages are `noindex`. They are still reachable by URL and depend on the session cookie.

## 12. Deployment status

Local only. `vercel.json` is ready for a later preview, and the environment names are documented in `docs/local-api-and-supabase.md`. The project was not linked and not deployed. It is not production-ready until the database, migration, one real save, speech if wanted, and a preview check are done.

## 13. Next action for the owner

Fill the two Supabase values in `.env.local` from the approved non-production project, then tell the next session that the file is saved. Do not send the values in chat. The next session should restart the local server, confirm the project, and only then apply the migration and try one registration.

## 14. Git

No commit was made. No reset, clean, or push was run.

## 15. Continuation on 14 October 2026

`docs/LOCAL_SETUP_AND_DEPLOYMENT.md` is not in the folder. Setup stays in `docs/local-api-and-supabase.md`.

The code, pages, and migration file from the report above were still present. `.env.local` was not overwritten. Supabase and Azure values were still empty. The Supabase CLI is not installed. No database was contacted, so no migration was applied and no registration row was written.

Changes in this continuation:

- Invalid JSON is now HTTP 400. The local dev server had been crashing on it.
- Reference-number behaviour was tested with a mocked database: one save, one replay of the same key, and no reference when the photo file is missing. This is not a live save.
- Read-only organiser responses omit phone numbers and PIN. Publication consent still cannot be switched on from the desk. Spreadsheet formulas in exports are neutralised.
- JPEG APP1 stripping and ordinary WebP sizes are covered by unit tests.
- Speech shows the heard words for correction. The phone speech tool no longer reports a failure when it is only stopped. A successful save clears an old error. The record page reads consent from `data_use_consent_at`.
- Registration language buttons report the selected language. Attendance buttons start with `aria-pressed="false"`.

`npm test`: 19 passed, 0 failed.

Local API, after `vercel dev --local --listen 127.0.0.1:3000`, then stopped:

| Request | Result |
| --- | --- |
| Honeypot `POST /api/karigar-registrations/` | 400 `invalid_payload` |
| Broken JSON to the same route | 400 `invalid_payload`, server stayed up |
| Valid registration | 503 `configuration_missing`, no reference number |
| Tiny image `POST /api/karigar-registrations/photo/` | 400 `invalid_image` |
| `GET /api/karigar-registrations/speech-token/` | 200, `stt: false`, `tts: false` |
| Logged-out organiser session and list | 401 |

Headless Edge, 390 and 1440 pixels wide: the five public routes and the organiser sign-in page loaded with overflow 0 and no broken images. Reduced motion was `none`. The registration intro was switched between Bengali and English by a click, and the typed path was started. The full wizard was not clicked through again. Microphone, camera, live speech, live storage, live sign-in, and deploy were NOT TESTED.

Published names and the unpublished limits are unchanged. The YouTube interview was not played.

## Continuation checklist

- [x] Existing uncommitted work outside this folder was left as it was
- [x] Invalid JSON and the no-database registration path checked on the local API
- [x] Reference number behaviour checked with a mock, not with Supabase
- [ ] Live registration save — blocked, Supabase values empty
- [ ] Migration — not applied; Supabase CLI is not installed
- [x] Viewer contact fields hidden, including on the record route, in unit tests
- [ ] Organiser sign-in with the real tokens — NOT TESTED
- [ ] Live Bengali speech — blocked, Azure empty
- [ ] Camera and gallery capture — NOT TESTED in a browser with a camera
- [x] Language switch clicked in headless Edge
- [x] Tests passed: 19
- [ ] Deploy — not done

## 16. Git after the continuation

No commit, reset, clean, or push. Branch remains `main` tracking `origin/main`. The Karigar folder is still untracked. The other specialist-site modifications were not edited.

## 17. Story and Gemini — 14 October 2026

The story page now has a beginning, the clearing, the bamboo frame, paths and decoration, evening light, the people, and why the Sammelan exists. English and Hindi use the same facts. No photograph is assigned to an official construction date. Paritosh is described as coordinating and overseeing site work since 2009. The primary-school sentence is no longer public. Anil’s district, Santosh’s locality, the recognition card and any payment amount stay unpublished.

`npm test`: 20 passed, 0 failed. The new test checks that a mocked Gemini call keeps `GEMINI_API_KEY` on the server and that the Live token request is locked to `models/gemini-3.8-live` with audio only.

Live Gemini audio, a real registration insert, the migration, the camera and a hosted deploy were not confirmed. `GEMINI_API_KEY`, `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are empty. The parent repository was not committed.

## 18. Preview and separate repository

Local preview only. `vercel whoami` was not authorized, so no hosted preview was created.

`vercel dev --local --listen 127.0.0.1:3000` served the public routes with HTTP 200. Speech status was unconfigured. A valid registration body returned 503 `configuration_missing` and no reference number. The process was stopped.

Screenshots: `preview/2026-10-14/`. Widths 320, 360, 390, 430, 768 and 1440. Overflow 0. English, Hindi and Bengali intro text switched on the registration page.

Private repository, confirmed: https://github.com/BKS-Bengal/karigar-vijay-sammelan-2026. Organisation slug `BKS-Bengal`. No GKS organisation was on this account. The original folder was left in the parent workspace.

## 19. Local story and voice pass — 14 October 2026

This pass did not push, create a repository, change a remote, or change repository visibility.

The public story chapters were rewritten so they read as the transformation, not as production notes. A 56.2-second local night clip was reviewed by frames only. It shows potted plants, rail lights, and pink and yellow cloth on bamboo arches. A 9.3-second clip shows people under a lamp; those faces were not published and were not named. Audio was not played. The YouTube video was not played. oEmbed returned the title only.

The official site `https://karmyogdurgapuja.org/site/?lang=bn` was opened. The construction checkpoints match the calendar already on the story page, with two additions now printed: a raft on 24 September, and Dashami plus immersion on 21 October. The Sammelan date was not changed. Photographs were not tied to those dates. The fetch returned English even with `lang=bn`.

Gemini token minting now locks audio input transcription and a server-side instruction. The permanent key is still read only from `GEMINI_API_KEY`, which is empty. No live audio call was made. TTS remains `gemini-3.8-flash-tts`. File transcription remains `gemini-3.5-transcribe`.

`npm test`: 20 passed, 0 failed.

Local `vercel dev --local --listen 127.0.0.1:3000` served the five public routes with HTTP 200. Speech status was `provider: none`. A valid registration body returned 503 `configuration_missing` and no reference number. The process was stopped.

Screenshots: `preview/2026-10-14-pass2/`. Widths 320, 360, 390, 430, 768 and 1440 for home, story and karigar. Overflow was not positive. No broken image on those shots. Viewport height was 900 pixels.

The parent repository was not committed.

Status at the start of this pass, and unchanged for every site except the untracked Karigar folder:

- Branch `main...origin/main`
- Modified and left untouched: the chrome and index files under `bks-pujo-farmtech-agritech`, `bks-pujo-government`, `bks-pujo-nrb`, `bks-pujo-public`, and `bks-pujo-sponsor`
- Untracked: `specialist-sites/bks-karigar-vijay-sammelan-2026/`
- Untracked and untouched: `specialist-sites/bks-protyaborton-conclave-2026/.gitignore`

## Acceptance checklist

- [x] Correct repository, and existing uncommitted work kept
- [x] Design research recorded without claiming blocked sites
- [x] Landing page loaded in a real browser at the required widths
- [x] Avatar reduced-motion state checked; speaking mouth is tied to playback in code, not tested with real audio
- [x] Story and profiles stay inside the evidence limits
- [x] Assets and frames mapped, with audio verification marked incomplete
- [x] Registration field flow run in the browser through review and a failed submit
- [x] Language switch kept the review; chat/voice sharing is covered by the state-machine test, not by a spoken session
- [ ] Live Bengali recognition — blocked, Azure empty
- [ ] Live Bengali playback — blocked, Azure empty
- [ ] Speaking mouth heard against real audio — blocked with speech
- [ ] Camera preview and retake — not run
- [ ] Photo upload to storage — blocked, no Supabase; bad images return 400
- [x] Data-use consent and photo publicity stay separate
- [x] Local API server tested
- [x] Backend validation and the configuration error tested
- [ ] Supabase migration status — blocked, no credentials
- [ ] A real registration saved — none
- [x] Reference number appears only after a confirmed save; the failed submit showed none
- [x] Duplicate replay covered by unit test, not by two live writes
- [ ] Admin sign-in and listing — code present, only the logged-out 401 was tested
- [ ] Status, attendance and export against data — blocked, no database
- [x] Automated tests exist and passed
- [x] Responsive checks on the public routes listed above
- [x] Deployment readiness reviewed; not deployed
- [x] This report and the work log written
- [x] Git changes left uncommitted

## 20. Invitation artwork, profiles and layout — 14 October 2026

No parent commit, no push, no remote change.

The live official page listed invitation files `krl-invite-1.jpg`, `krl-invite-2.jpg` and `krl-invite-3.jpg`. All three were downloaded and viewed. Page 1 is the landing and story anchor, shown in full, captioned as invitation artwork. Page 2 is a letter and design views; it is stored and not used as a photograph. Page 3 is on the story page with a caption that its printed faces are the card’s dedication, not the three interviewed karigars. No installed-2026-idol photograph was found, so `maa-durga-2025.jpg` was removed from the hero.

Official progress files for 21 September, 28 September and 7 October were downloaded and viewed. The first two match existing project files by SHA-256. Captions now carry those file dates. Story photographs 01–06 are still not dated to the log.

The YouTube interview was not played. Five stills were extracted with FFmpeg from the two short local MP4 files. No name label was visible. No face is published as a portrait. The map is `docs/interview-still-map.md`.

Paritosh’s transcript statement that he had been a primary-school teacher is now in the public profile. Family health, district, Polit, the recognition card and ₹5,000 are not.

`npm test` was run again after the final copy, layout and hero-alignment edits: 20 passed, 0 failed. The alignment itself was also checked in the browser.

Screenshots: `preview/2026-10-14-redesign/`. Five routes at 320, 360, 390, 430, 768 and 1440, plus scrolled card shots. Overflow was not positive. Broken images: 0. Language switch was exercised on the artisan page. The local server was left running. Gemini, Supabase, camera, microphone, organiser sign-in and a hosted deploy were not tested.
