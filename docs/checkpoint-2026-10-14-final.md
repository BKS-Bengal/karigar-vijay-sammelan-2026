# Checkpoint before the 14 October 2026 correction

Written before the public-note removal, the new artisan GIF, and the colour and transition edits.

- Parent repository: `C:\Users\asits\Projects\bks-durga-puja-2026`, branch `main`, origin `https://github.com/BKS-Bengal/bks-durga-puja-2026.git`. Do not commit or push this parent. The Karigar folder is untracked there. Sibling specialist sites have their own uncommitted edits and must stay untouched.
- Dedicated repository: `https://github.com/BKS-Bengal/karigar-vijay-sammelan-2026`, private, default branch `main`. Staging clone: `C:\Users\asits\Projects\karigar-vijay-sammelan-2026`, HEAD `526059a` at the time of this note. Do not reset that clone. Copy finished files into it without `/MIR` or `--delete`.
- Local preview was already listening on `http://127.0.0.1:3000/karigar-vijaya-sammelan/` (`vercel dev --local`). Do not start a second server. `--local` does not link a Vercel project. `.vercel/project.json` was absent.
- The public hero at this checkpoint was `assets/poster/event-poster.gif` (lights and particles only). Keep that file on disk. The replacement is a separate filename.
- Recovery: the working tree in the parent folder is the source of truth until a dedicated-repo commit exists. Do not `git reset --hard`, `git clean`, or force-push.
