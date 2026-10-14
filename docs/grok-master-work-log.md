# Karigar Vijay Sammelan 2026 — work log

Date: 14 October 2026
Folder: `specialist-sites/bks-karigar-vijay-sammelan-2026`
Branch: `main` (not committed). The Karigar folder is untracked. Other specialist-site edits were left untouched.

This log is the handoff. The completion report is `docs/FINAL_GROK_COMPLETION_REPORT.md`. Setup is in `docs/LOCAL_SETUP_AND_DEPLOYMENT.md` and `docs/local-api-and-supabase.md`.

## Latest checkpoint — 14 October 2026, story, Gemini, repository

The earlier registration fixes stay. This pass did not rebuild the wizard.

- The story page is now seven chapters, in Bengali, English and Hindi. Photographs are not dated to the official work log. Paritosh’s school sentence is off the public pages. Anil’s district stays unpublished.
- The night photograph still showed a device stamp. The bottom 78 pixels were cropped. The published file is 1280×590. The device name is not written here.
- Gemini is the primary voice path: server-minted Live token for `gemini-3.8-live`, server TTS `gemini-3.8-flash-tts`, server transcription `gemini-3.5-transcribe`. Azure remains only when `GEMINI_API_KEY` is empty. The permanent key is not in browser code. `GEMINI_API_KEY` is empty, so no live voice call was made.
- `npm test`: 20 passed, 0 failed.
- YouTube page title was fetched. The video was not played. The two local MP4 files were not opened again.
- Parent repository was not committed. Other specialist sites were not edited.

Still blocked: Supabase URL and service-role key are empty, so no registration row exists. Gemini and Azure speech keys are empty. Camera, live microphone, organiser sign-in and a hosted Vercel deploy were not confirmed. `vercel whoami` returned not authorized.

Checked after the code was in place:

- Local `vercel dev --local --listen 127.0.0.1:3000` answered the five public routes with HTTP 200. `GET /api/karigar-registrations/speech-token/` returned `provider: none`, `live: false`. A valid test registration returned HTTP 503 `configuration_missing` and no reference number. The server was then stopped. Port 3000 was free afterwards.
- Headless Edge screenshots at 320, 360, 390, 430, 768 and 1440 are in `preview/2026-10-14/`. Overflow was 0 and no image was broken on those shots. Reduced motion on the landing avatar computed as `none`. Registration language buttons switched the intro among English, Hindi and Bengali. Voice mode showed “কথা বলুন” selected.
- Separate private repository, confirmed by `gh repo view`: https://github.com/BKS-Bengal/karigar-vijay-sammelan-2026. The account’s organisations include `BKS-Bengal` (display name BKS Bengal). No organisation named GKS was found, so the repository was not created under a personal account. The parent repository was not committed. Its origin is still `https://github.com/BKS-Bengal/bks-durga-puja-2026.git`.

## Previous checkpoint — 14 October 2026, continuation

Already in place, and left in place: the Bengali-first pages, Karigar Saathi, the registration state machine, the API routes, the organiser desk, and the Supabase migration file. Supabase URL, service-role key, Azure key, and Azure region are still empty. No migration was applied. No registration was saved. No deploy. No commit. Other specialist-site edits were not touched.

This pass changed only the Karigar folder:

- A bad JSON body now returns HTTP 400 `invalid_payload`. Vercel’s body getter was throwing and taking down the local dev server.
- A mocked database save returns one `KVS26-` reference. The same key returns that same reference with `replayed: true`. A missing photo file returns 400 and no reference. This is not a live Supabase write.
- A read-only organiser no longer receives mobile, PIN, or sardar mobile, including on the record page. The full organiser still does. Photo-publication consent still cannot be turned on from the desk. CSV cells that start with `=`, `+`, `-`, or `@` are prefixed so a spreadsheet does not treat them as formulas.
- JPEG APP1 metadata is removed even when the file has no scan segment. Lossy and lossless WebP sizes are read, not only the extended WebP form.
- An uncertain or clear transcript shows “Did I hear this right?” with the words in the answer box. Stopping the phone’s own speech tool no longer counts as a failed hearing. A confirmed save clears an earlier error. The record page treats `data_use_consent_at` as consent given.
- Language buttons on the registration page now expose which language is selected. Attendance choices explicitly start unselected.
- The printed organiser table keeps its column headings.

Checks this pass:

- `npm test`: 19 passed, 0 failed, from the Karigar folder.
- Local `vercel dev --local --listen 127.0.0.1:3000`, then stopped. Honeypot 400, broken JSON 400, valid registration 503 `configuration_missing` with no reference number, tiny image 400, speech status `stt: false` / `tts: false`, logged-out organiser routes 401. The server stayed up after the broken JSON request.
- Headless Edge at 390 and 1440 pixels: landing, story, profiles, registration, privacy, and the organiser sign-in page. Overflow 0 and no broken images. Reduced motion computed as `none`. English and Bengali switching on the registration intro was clicked. The typed path was started, not finished in the browser.
- NOT TESTED: a real microphone, a real camera, a real photo stored in Supabase, a real saved registration, organiser sign-in against the live tokens, and any deploy.

Still blocked, in this order:

1. Put `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the existing Karigar `.env.local`, from the approved non-production project. Do not paste them into chat. The Supabase CLI is not installed here, so apply `supabase/migrations/20261012000000_create_karigar_registrations.sql` in that project’s SQL editor, or install the CLI and apply it only there. Then restart `vercel dev --local --listen 127.0.0.1:3000` and save one test registration.
2. For live Bengali speech, set `GEMINI_API_KEY` in the existing `.env.local`. Azure is only a fallback: `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` as a region name such as `centralindia`, not a URL. Do not paste either key into chat.
3. Camera preview, gallery capture, and a spoken session need a normal browser with those permissions. Headless Edge cannot do that.

## Previous checkpoint

- `npm test`: 12 passed, 0 failed. Re-run from the Karigar folder after the work-description skip change.
- Edge headless loaded the public pages at 320, 360, 390, 430, 768 and 1440. No horizontal overflow and no broken images on those routes.
- A typed registration reached review, switched to English without losing the name, then submit returned to review with the Bengali “saving is not connected” message and no registration number.
- Speech, camera preview, photo storage, database save, and organiser data access remain blocked by missing credentials or by the lack of a camera/microphone in the headless browser.
- No migration, no saved registration, no commit, no deploy.

The sections below are the earlier checkpoint. They are still true except where this latest checkpoint says a test count or a file now exists.

## Kept as-is

- Plain HTML, CSS and JavaScript site, plus Vercel serverless functions. Not Next.js.
- Bengali-first landing page, English and Hindi switching, warm ivory / sindoor / plum / marigold palette.
- Original Karigar Saathi character, story pages, and the registration state machine.
- Registration still posts to `POST /api/karigar-registrations`.
- A reference number is shown only after the API returns `ok: true` and `registration_no`.
- Idol-making is still rejected as a work category.
- Puja dates (16–20 October 2026) stay separate from the Sammelan date (Sunday, 1 November 2026).
- No event time and no guest list were added.
- `.env.local` was not overwritten and its values were not printed.
- No migration was run. No registration was submitted. No Vercel link or deploy.

## What changed in this pass

1. Visitor copy no longer reads like an editorial note.
   - Story and profile pages now use the same Bengali sentences as the language file, including the first paint before JavaScript runs.
   - The bamboo photograph is no longer captioned as 21 September 2026. The evidence file says the supplied photographs were not tied to the official work calendar. The official calendar remains in the story as the Protyabortan site’s own timeline.
   - The home-page step about photos no longer says saving works only when storage is connected.
2. Organiser desk scripts that the HTML already requested are now present:
   - `js/admin-list.js`
   - `js/admin-detail.js`
   - Sign-in uses `POST /api/admin/karigar-session`.
   - The list uses the existing filters. Downloads are normal links so the session cookie is sent. The contact download is offered only when the role is `event_admin`.
   - The record page can update status, attendance and the verification note. It does not turn photo-publication consent on.
   - The search button now says “খুঁজুন” / “Search” / “खोजें”. The filter menus have accessible names.
3. `docs/karigar-saathi-design-research.md` now records which reference sites were actually opened, which were blocked, and which were not opened.
4. The landing, avatar and story layout were not redesigned. The research supported the current worker-first direction.

Essential public line, unchanged:

“আপনাদের হাতে গড়ে উঠেছে প্রত্যাবর্তন। এবার আপনাদের সম্মানে আমাদের বিজয়া সম্মিলনী।”

Published names remain only Anil Samanta, Paritosh Kumar Mondal and Santosh Mondal. No portrait was attached to a name.

## Checks that passed

Run from the Karigar folder:

`npm test` → 9 passed, 0 failed.

The two new tests check that every language string has Bengali, English and Hindi, that the internal photo-date and storage notes are gone, and that both admin scripts parse with `node --check`.

Local server already running at `http://127.0.0.1:3000` (`vercel dev --local`). It was not restarted.

| Request | Result |
| --- | --- |
| `GET /karigar-vijaya-sammelan/` | 200 |
| `GET /karigar-vijaya-sammelan/story/` | 200. Old editorial phrases were absent. |
| `GET /karigar-vijaya-sammelan/karigar/` | 200. Old editorial phrases were absent. |
| `GET /admin/karigar-registrations/` | 200, and the page loads `/js/admin-list.js` |
| `GET /js/admin-list.js` and `/js/admin-detail.js` | 200 |
| `GET /api/admin/karigar-session/` | 401 JSON `unauthenticated` |
| `GET /api/admin/karigar-registrations/` | 401 JSON |

No browser click-through was possible in this session. The pages were checked over HTTP only. The organiser sign-in was not used, and no record was saved.

## Still blocked

The owner must add these in the Karigar `.env.local`, from the approved Supabase project’s API settings. Do not paste the values into chat.

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

After those two values change, stop the current `vercel dev` and start it again. The running process will not reload them. Do not apply the migration, and do not submit a registration, until that database is confirmed as the intended non-production target.

Also still unverified, because the credentials or a browser session are missing:

- A real registration save and a real reference number.
- Azure Bengali speech. `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` are empty.
- Live camera preview and a private photo upload.
- The full interview video `https://www.youtube.com/watch?v=BKrUP5Froy4` was not watched in this pass. Published profile text still follows the existing evidence note.

## If this work is interrupted

Stop point: the code and docs above are saved, and the 9 tests passed. The local API server can stay running. Do not reset, clean, commit, or deploy. The next safe step is the Supabase credential handoff described above. After a confirmed database, the next checks are one non-production registration, then the organiser list and record pages.
