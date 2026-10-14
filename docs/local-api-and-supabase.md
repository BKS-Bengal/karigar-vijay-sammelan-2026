# Local API and Supabase setup

This site is plain HTML, CSS and JavaScript, plus Vercel serverless functions in `api/`. It is not a Next.js app. Run commands from:

`specialist-sites/bks-karigar-vijay-sammelan-2026`

The repository root has no `package.json` for this site.

## Local server

Python’s static file server cannot run the API. `POST /api/karigar-registrations` there returns HTTP 501.

The supported local command, checked against Vercel CLI 59.11.2, is:

```text
vercel dev --local --listen 127.0.0.1:3000
```

`--local` does not link a Vercel project. Do not add `--yes`. Do not deploy from this command.

A server started this way was already listening at `http://127.0.0.1:3000` during the last checks. Do not start a second one. Restart it only after `.env.local` changes, because the running process does not reload those values.

## Environment names

Copy `.env.example` to `.env.local` if the file is missing. The current `.env.local` already exists and is ignored by Git (`.gitignore` rule `.env*`). Do not commit it. Do not paste its values into chat.

| Name | Used for | Where the value comes from | Last check |
| --- | --- | --- | --- |
| `SUPABASE_URL` | Database and private photo storage | Supabase → Project Settings → API → Project URL | empty |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only access. Never put this in browser JavaScript. | Same page → `service_role` secret | empty |
| `REGISTRATION_IP_SALT` | Hashing the submitter IP | Any long random local string | set |
| `KARIGAR_SESSION_SECRET` | Signed organiser session cookie | Any long random local string | set |
| `KARIGAR_EVENT_ADMIN_TOKEN` | Full organiser sign-in | A private token you choose | set |
| `KARIGAR_EVENT_VIEWER_TOKEN` | Read-only organiser sign-in | A different private token | set |
| `GEMINI_API_KEY` | Primary voice. Server only. Live token, playback and transcription. | Google AI Studio → API key | empty |
| `AZURE_SPEECH_KEY` | Optional fallback only when `GEMINI_API_KEY` is empty | Azure Speech resource → Keys | empty |
| `AZURE_SPEECH_REGION` | Region name such as `centralindia`, not a URL | Azure Speech resource → Region | empty |

`NEXT_PUBLIC_SUPABASE_URL` is accepted as a fallback for the URL only. The service role key has no public alias.

Use a development or staging Supabase project. Do not point this file at production until the owner has approved that project.

## Database

The migration file is `supabase/migrations/20261012000000_create_karigar_registrations.sql`. It creates `karigar_registrations`, an audit table, locks down anonymous access, and creates the private bucket `karigar-photos`.

It has not been applied from this workspace. Do not run it against production. After the URL and service-role key are filled, restart `vercel dev`, confirm the project is the approved non-production project, and only then apply the migration with the Supabase CLI or the SQL editor for that project.

Until both Supabase values are set, a real registration returns HTTP 503 `configuration_missing`. The page keeps the answers and does not show a registration number.

A body that is not JSON returns HTTP 400 `invalid_payload`. It must not throw. `AZURE_SPEECH_REGION` must be a region name such as `centralindia`. A URL is treated as speech not configured.

The read-only organiser role does not receive mobile numbers or PIN, on the list or on the record. The contact download stays limited to the full organiser role. CSV cells that begin with `=`, `+`, `-`, or `@` are prefixed before download.

The Supabase CLI is not installed on this machine. Do not apply the migration until the URL and service-role key are the approved non-production project. The SQL editor for that project can run the migration file.

## Checks that do not write data

From this folder:

```text
npm test
```

Safe requests against the local API:

- `GET /api/karigar-registrations/` → 405
- `POST` with the honeypot field filled → 400, nothing saved
- `GET /api/karigar-registrations/speech-token/` → `stt: false`, `tts: false` while Azure is empty
- `GET /api/admin/karigar-session/` → 401 until an organiser signs in

## Deploy

`vercel.json` turns on clean URLs, trailing slashes, and basic security headers. It does not set a framework. Do not link or deploy until the owner asks. A preview deploy still needs the same environment names in that Vercel project’s settings, not in Git.
