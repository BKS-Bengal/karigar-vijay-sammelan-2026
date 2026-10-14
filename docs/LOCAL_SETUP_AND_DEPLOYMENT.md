# Local setup and deployment

Run commands from `specialist-sites/bks-karigar-vijay-sammelan-2026`. The longer Supabase note is `docs/local-api-and-supabase.md`. This file does not contain secret values.

## Start the local site

Python’s static server cannot run `api/`. Use Vercel CLI:

```text
vercel dev --local --listen 127.0.0.1:3000
```

`--local` does not link a project and does not deploy. Do not add `--yes`. Open `http://127.0.0.1:3000/karigar-vijaya-sammelan/`.

Restart the process after `.env.local` changes. Do not commit `.env.local`.

## Environment names

Copy `.env.example` to `.env.local` only if that file is missing. Never paste the values into chat.

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` — database and private photos. Both are empty, so a real registration cannot be saved yet.
- `REGISTRATION_IP_SALT`, `KARIGAR_SESSION_SECRET`, `KARIGAR_EVENT_ADMIN_TOKEN`, `KARIGAR_EVENT_VIEWER_TOKEN` — already set locally. Values are not recorded here.
- `GEMINI_API_KEY` — primary voice. The browser receives only a short-lived Live token. Playback uses `gemini-3.8-flash-tts`. A recorded answer uses `gemini-3.5-transcribe`. This key is empty, so live voice is not confirmed.
- `AZURE_SPEECH_KEY` and `AZURE_SPEECH_REGION` — optional fallback when Gemini is unset. The region must be a name such as `centralindia`.

## Tests

```text
npm test
```

## Deploy

No Vercel project is linked from this folder. Do not deploy to an existing production project. A hosted preview needs a separate project and the owner’s Vercel access. Until then the preview is the local command above.
