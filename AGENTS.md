# Agent instructions — re7lety

**Read [`HANDOFF.md`](./HANDOFF.md) before any other work.** It is the live session state.

This directory (`Re7lety-App-Updated`) is the **canonical** re7lety app (Vite + Capacitor). Not the Next.js site in `Projects/Re7lety/my-app`. Not 4X4 Cafe. Not Lumen Egypt.

## Immediate priorities

1. Design + migrate `cars` / `bookings` / `favorites` in `teenybase.ts`.
2. Wire `src/store/AppState.tsx` (and related) to the local teeny API instead of only `localStorage` (`re7lety.v2`).
3. Confirm `:8787` is **this** worker (`wrangler.jsonc` name `re7lety`), not another project on the same port.

## Stack pointers

- UI: React 19 + Vite + Framer Motion · `npm run dev`
- API: teenybase · `teenybase.ts` + `src/index.ts` · `npx teeny … --local`
- iOS: Capacitor · see `IPHONE.md` (device often Offline)
- Fleet types: `src/data/cars.ts`
