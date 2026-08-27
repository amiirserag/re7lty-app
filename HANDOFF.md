# HANDOFF — read this first

**Updated:** 2026-08-27 · Canonical app path: `/Users/home/Desktop/Re7lety-App-Updated`

Open this repo in Cursor → agent should treat this file + `AGENTS.md` as session start context. Do **not** start cold; do **not** reinvent the stack.

---

## One-line status

Teenybase auth scaffold exists; **cars / bookings / favorites schema + app wiring still pending**. iPhone still offline for Xcode install. Vite app data still lives in `localStorage` (`re7lety.v2`).

---

## What is the real app

| Path | Role |
|------|------|
| **`~/Desktop/Re7lety-App-Updated`** | **Canonical** — React 19 + Vite + Capacitor (iOS). Work here. **Website:** https://re7lety.pages.dev |
| `~/Projects/Re7lety/my-app` | Older Next.js rebuild attempt. **Superseded** — live site is now the Vite app above. |
| `~/Projects/Re7lety/re7lety-complete-2026-08-14` | Archive / media / old iOS bundles. Reference only. |
| Blitz.dev / Expo throwaway scaffolds | Ignore. |

Brand: **re7lety** (Al Omda Office, Egypt car rental). Dark HUD, accent **`#E9FF00`** (iOS archive reference). **Never** mix with **4X4 Cafe** or **Lumen Egypt**.

**UI reference:** `~/Desktop/re7lety-complete-2026-08-14/iOS-App` — web Home/CarCard/Detail aligned to that SwiftUI app (Aug 2026).

---

## Git

Initialized in this directory. Commits (as of handoff rewrite):

1. `af20efc` — Initial commit: re7lety app baseline  
2. `01430a7` — Add teenybase local backend (auth scaffold)  
3. `1c04600` — Add handoff notes for next agent  

Working tree may have further uncommitted edits after this rewrite.

---

## Backend (teenybase)

- Scaffolded with `npx teeny init -t with-auth --local`.
- Config: `teenybase.ts` — **`users` only** (auth). No `cars` / `bookings` / `favorites` yet.
- Worker entry: `src/index.ts` (teenyHono + OpenAPI + PocketUI). Coexists with Vite; Vite only bundles from `index.html` / `main.tsx`.
- Wrangler: `wrangler.jsonc` → worker name `re7lety`, D1 `re7lety-db`.
- Start local API from **this** directory:

  ```bash
  cd /Users/home/Desktop/Re7lety-App-Updated
  npx teeny generate --local && npx teeny deploy --local
  # or: npx teeny dev --local
  ```

  Default port **8787**. Health: `http://localhost:8787/api/v1/health`  
  Swagger: `/api/v1/doc/ui` · Admin: `/api/v1/pocket/` (passwords in `.dev.vars`, gitignored).

### Port conflict (important)

On this Mac, **8787 is often taken by other teeny projects** (e.g. `~/4x4-cafe` or `as-ipa` on 8788). If health returns `"appName":"4X4 Cafe"`, that is **not** re7lety — kill that worker or run re7lety on another port. Confirm `lsof -nP -iTCP:8787 -sTCP:LISTEN` cwd is this repo before wiring the app.

`teeny-dev.log` in this repo may be stale from an earlier successful local run.

---

## Frontend data (still client-side)

- Fleet: `src/data/cars.ts` (`Car`, `Booking` types) + `public/fleet/{car-id}/`.
- Persistence: `src/store/AppState.tsx` → `localStorage` key **`re7lety.v2`** (favorites, bookings, onboarding, profile, language).
- Auth: `src/core/auth.ts` — LocalAuthProvider by default; Supabase only if `VITE_SUPABASE_*` set. Supabase is lightly used (`auth`, trip-concierge); **not** the cars/bookings source of truth.

---

## iPhone

User wants physical device via Xcode (`IPHONE.md` Option B).  
`xcrun xctrace list devices` has shown real devices (e.g. “Adam iPhone”) as **Offline**. Pairing/Trust/USB issue — not fixable from shell alone. Fallback: Option A (Safari → Add to Home Screen on same Wi‑Fi).

---

## Pending next work (do this)

1. **Schema** in `teenybase.ts`: `cars`, `bookings`, `favorites` aligned to `Car` / `Booking` in `src/data/cars.ts` (and favorites as user↔carId). Regenerate + apply local migrations.
2. **Wire the app** off `localStorage` for cars/bookings/favorites → teeny API (`src/store/AppState.tsx` / `src/core/`). Keep offline fallback if reasonable.
3. **Verify** API is *this* worker (not 4x4-cafe) before pointing `VITE_*` / fetch base URL at `:8787`.
4. **iPhone**: get device Online in Xcode, or ship Option A for now.
5. **Remote deploy**: docs for self-host vs Teeny Cloud were ambiguous last session — confirm with user before `teeny deploy --remote`.

---

## Quick commands

```bash
cd /Users/home/Desktop/Re7lety-App-Updated
npm install
npm run dev          # Vite UI
npx teeny dev --local   # API (ensure port free / not 4x4)
npm run ios:sync && npm run ios:open   # Capacitor → Xcode
```

---

## Do not

- Do not treat `Projects/Re7lety/my-app` as this mobile app.
- Do not put 4X4 Cafe or Lumen branding/domains on re7lety.
- Do not invent car prices — follow `PriceType` / disclaimer rules in `src/data/cars.ts`.
- Do not mint ASC Admin API keys (`asc-team-key-create` / blitz-mac) without explicit user OK.
