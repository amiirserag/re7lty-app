# Visual parity — recording-era RED UI (Capacitor)

**Milestone:** RE7LTY ORIGINAL CAPACITOR + IPHONE RED UI PARITY VERIFIED (core surfaces)

Recording SoT: `/Users/home/Downloads/ScreenRecording_08-18-2026 11-59-12_1.mov`  
Working tree: `/Users/home/Projects/re7lty-production` (Capacitor — **not** Expo)

Captured after restore build at **390×844**, **430×932**, **1440×900**.

| SCREEN | REFERENCE | CURRENT (390×844) | STATUS | REMAINING |
|--------|-----------|-------------------|--------|-----------|
| Splash | `reference-splash.png` | `current-390x844-splash.png` | **PASS** | Fake web status bar; progress underline thickness minor |
| Home showcase | `reference-home.png` | `current-390x844-home.png` | **PASS** | Title uses catalog name `G 63` (not recording label `G-CLASS`); badge `NIGHT EDITION` from data; pager count = featured set size |
| Explore | `reference-explore.png` | `current-390x844-explore.png` | **PASS** | Chip set / card density may differ slightly; accent red restored |
| Detail | recording frame ~052 | `current-390x844-detail.png` | **PASS** | Spec grid labels English uppercase; BOOK NOW present |
| Booking 5-step | recording frame ~055/058 | `current-390x844-booking.png` | **PASS** | Existing Capacitor wizard preserved; red chrome |
| Tabs | recording HOME…PROFILE | visible on Home/Explore shots | **PASS** | Flat recording-style bar; red active + top tick |
| Desktop | — | `current-desktop-1440x900.png` | **PARTIAL** | Adaptive phone viewport shell, same design system |

## Preserved (not reinvented)
- Fleet data / offices / nightlife / booking / favorites / profile
- Local `public/fleet` media
- Capacitor iOS + `app.re7lety.ios`
- Smoke: **11/11 passed** (`BASE_URL=http://127.0.0.1:4173`)

## Explicit product decisions applied
- Accent `#e61e26` (recording wins over yellow Yango tokens)
- Splash → cinematic Home (skip yellow onboarding)
- Home tab = showcase (gauge / MORE DETAIL / TOUR CAR)
