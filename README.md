# re7lety

Cinematic premium car rental for Egypt — **Al Omda Office** fleet.

**Agents / next session:** read [`HANDOFF.md`](./HANDOFF.md) first (also `AGENTS.md`).

## Design pack

Dark HUD aesthetic from the full re7lety reference pack:

- True black surfaces (`#050505` / `#101010` / `#171717`)
- Racing red brand accent (`#FF3548`) — the **7** in re7lety
- Technical grid, performance ring, hotspot tour, pill CTAs
- Motion tokens with Reduce Motion support

## Stack

Runnable in this environment:

- React 19 + TypeScript + Vite
- Framer Motion
- localStorage persistence

SwiftUI sources (open on macOS / Xcode — this Linux cloud agent cannot build `iphoneos`):

- `ios/re7lety/` scaffold with MotionTokens + models aligned to the same fleet

## Run

```bash
npm install
npm run dev
```

**Live website (same UI as the app):** https://re7lety.pages.dev

```bash
npm run deploy   # build dist/ → Cloudflare Pages (project re7lety)
```

## Put it on your iPhone

See **[IPHONE.md](./IPHONE.md)** — Home Screen (Safari) or Xcode USB install.

## Screens

Splash · Onboarding · Location · Home · Showcase · Explore · Detail · Exterior Tour · Gallery · Booking (5 steps) · Favorites · Bookings · Profile

## Fleet

20+ vehicles across Cairo, Giza, Alexandria, North Coast, Luxor, Aswan — Al Omda Office / Alexandria / North Coast companies.

Drop **your videos and photos** in `public/fleet/{car-id}/` (see `public/fleet/README.md`). Home, Detail, Tour, Splash, and Onboarding play them automatically. A new folder with media becomes a new listing.

## Persistence

Onboarding, selected city, favorites, bookings, language, profile — stored in `localStorage` key `re7lety.v2`.
