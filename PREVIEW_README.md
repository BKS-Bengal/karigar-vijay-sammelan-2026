# Local preview — Karigar Vijay Sammelan 2026

This file records a preview that was actually served and opened. It is not a hosted deployment.

## Launch

From this folder:

```
vercel dev --local --listen 127.0.0.1:3000
```

Do not add `--yes`. Do not deploy. The process does not reload `.env.local` until it is restarted.

On 14 October 2026 the same command was started again and left running. Before that start, nothing was listening on port 3000.

## Open this URL

http://127.0.0.1:3000/karigar-vijaya-sammelan/

## Event-page preview — 14 October 2026, evening

The listener on `127.0.0.1:3000` was still the earlier `vercel dev --local` process. It was not restarted. Headless Edge captured `preview/2026-10-14-event/`.

Checked routes: home, story, karigar, register chat, register voice. Widths 320, 360, 390, 430, 768 and 1440. Extra frames: film and gallery at 390 and 1440, artisan cards at 320 and 1440, reduced-motion home at 390.

Measured: horizontal overflow 0, or −15 where the scrollbar inset shows. Broken images: none. Gallery and thumbnail: 15 images, all non-zero. Homepage did not contain the transformation title. The story route still did. Reduced motion loaded `event-poster.jpg`. Language switch returned বাংলা, English and हिन्दी titles. Voice and typed registration URLs opened.

A headless canvas sample of the GIF did not change pixels. The GIF file itself has 12 different frames. Do not read that canvas result as proof the animation failed in a normal browser, and do not mark the animation as seen.

Checked with HTTP 200 while that server was running:

| Page | URL |
| --- | --- |
| Home | http://127.0.0.1:3000/karigar-vijaya-sammelan/ |
| Story | http://127.0.0.1:3000/karigar-vijaya-sammelan/story/ |
| Artisans | http://127.0.0.1:3000/karigar-vijaya-sammelan/karigar/ |
| Registration, typed | http://127.0.0.1:3000/karigar-vijaya-sammelan/register/?mode=chat |
| Registration, voice | http://127.0.0.1:3000/karigar-vijaya-sammelan/register/?mode=voice |

Headless Edge, at 390px, clicked the home links. Each landed on the matching URL above. The facts link landed on `http://127.0.0.1:3000/karigar-vijaya-sammelan/#tathya` and the `tathya` section was present. Overflow on those clicks was 0.

## Screenshots already on disk

All of these are PNG files (signature `89 50 4E 47`). They are browser captures, not generated mockups. Each frame is 900 pixels tall, so it is the top of the page, not a full scroll.

`preview/2026-10-14/` — 30 files. Home, story, karigar, register-chat and register-voice at 320, 360, 390, 430, 768 and 1440. Captured in an earlier local session.

`preview/2026-10-14-pass2/` — 18 files. Home, story and karigar at the same six widths. No registration shots in this folder. Captured in an earlier local session.

`preview/2026-10-14-live/` — captured this session from the running server:

- `home-320.png`, `home-390.png`, `home-1440.png`
- `story-320.png`, `story-390.png`, `story-1440.png`
- `karigar-320.png`, `karigar-390.png`, `karigar-1440.png`
- `register-chat-320.png`, `register-chat-390.png`, `register-chat-1440.png`
- `register-voice-320.png`, `register-voice-390.png`, `register-voice-1440.png`
- `register-chat-390-started.png` — after the typed-start button. The name question and answer box are on screen.
- `report.json` — the link-click and measurement log from this session.

At 320, 390 and 1440, horizontal overflow was 0, or −15 at 1440 on the long pages. Negative means the content is narrower than the window. Broken images: 0. Buttons and fields that were visible were at least 44 pixels tall. On the typed path at 390, the answer box was 322 pixels wide. At 320 the registration page stays usable: the intro, the selected mode, and the start buttons are on screen. The two mode labels wrap inside their buttons. That live pass did not change the layout.

## Redesign preview — 14 October 2026

`preview/2026-10-14-redesign/` was captured after the invitation artwork and artisan-grid changes, from the same local server.

Thirty viewport shots, 900 pixels tall, not full-page scrolls:

- home, story, karigar, register-chat, register-voice
- widths 320, 360, 390, 430, 768, 1440

Extra shots after the hero alignment fix:

- `home-1440.png` and `home-768.png` were recaptured so the invitation sits beside the headline
- `karigar-1440-cards.png` and `karigar-320-cards.png` are scrolled to the profile cards

`report.json` records overflow, broken-image counts, and the Bengali/English/Hindi switch on the artisan page. Overflow was 0, or −15 at 1440. Broken images: 0. The English and Hindi profile text changed with the language buttons. Registration voice at 320 showed the helper, the intro, and the start buttons.

The landing hero is `assets/official-2026/krl-invite-1.jpg`, captioned as invitation artwork. It is not labelled as a photograph of the installed 2026 idol.

## Not working in this preview

These names are empty or absent in `.env.local`. Values are not written here.

- `SUPABASE_URL` — empty. A registration is not saved.
- `SUPABASE_SERVICE_ROLE_KEY` — empty.
- `GEMINI_API_KEY` — missing. Live voice is not connected.
- `GOOGLE_API_KEY` — missing.
- `GOOGLE_GENERATIVE_AI_API_KEY` — missing.
- `AZURE_SPEECH_KEY` — empty.
- `AZURE_SPEECH_REGION` — empty.

`REGISTRATION_IP_SALT`, `KARIGAR_SESSION_SECRET`, `KARIGAR_EVENT_ADMIN_TOKEN` and `KARIGAR_EVENT_VIEWER_TOKEN` are present. Organiser sign-in was not opened, so those tokens are not treated as tested.

Not tested: a real microphone, a real camera, a saved registration, an organiser sign-in, and any hosted Vercel preview.

Git remotes were not changed in the passes recorded above.

## Final local preview — 14 October 2026, artisan GIF

The same `vercel dev --local --listen 127.0.0.1:3000` process was still listening. It was not started a second time.

Open: http://127.0.0.1:3000/karigar-vijaya-sammelan/

| Page | URL |
| --- | --- |
| Home | http://127.0.0.1:3000/karigar-vijaya-sammelan/ |
| Story | http://127.0.0.1:3000/karigar-vijaya-sammelan/story/ |
| Artisans | http://127.0.0.1:3000/karigar-vijaya-sammelan/karigar/ |
| Registration, typed | http://127.0.0.1:3000/karigar-vijaya-sammelan/register/?mode=chat |
| Registration, voice | http://127.0.0.1:3000/karigar-vijaya-sammelan/register/?mode=voice |

Captures for this pass are JPEG files in `preview/2026-10-14-final/`. They are browser screenshots, 900 pixels tall, not full-page scrolls. `report.json` records overflow and that the rendered text did not contain the removed production notes. Overflow was 0, or −15 at 1440.

The hero file on the page is `assets/poster/karigar-vijay-sammelan-2026-hero.gif` (720×405, 48 frames, 6.01 seconds). `gif-loop-a.jpg` and `gif-loop-b.jpg` were taken one second apart. The hero crop changed. `home-paused-1440.jpg` is after the pause control. `home-reduced-1440.jpg` is reduced motion, which loads the static WebP. `transition-leaving.jpg` shows the home page leaving toward the left. The CSS cross-document view transition was not observed in this Edge. The slide that was seen is the JavaScript fallback.

`home-320-pause.jpg` and `home-390-pause.jpg`, when present, are the recapture after the pause button was moved under the picture on narrow screens.

`npm test` in this folder: 20 passed, 0 failed.

Still not working in this preview: empty Supabase and speech settings, so a registration is not saved and live voice is not connected. Values are not written here. A hosted Vercel deployment is a separate step and is not proven by this local URL.
