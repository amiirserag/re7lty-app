# Visual parity — original Capacitor vs iPhone recording

Recording SoT: `/Users/home/Downloads/ScreenRecording_08-18-2026 11-59-12_1.mov`  
Frames: copied into this folder as `reference-*.png` (from prior extraction).  
Current shots: `current-*-mobile.png` / `current-desktop-1440x900.png` from `vite preview` of **this** tree at **390×844** / **1440×900** after Git baseline.

**Overall mobile vs recording: PARTIAL**  
**Desktop 1440×900: PARTIAL** (adaptive shell of same yellow-accent Capacitor UI — not a stretched phone frame)

No Expo rebuild was used. No intentional redesign was applied in this checkout.

---

## SCREEN: Splash

| | |
|--|--|
| REFERENCE FRAME | `reference-splash.png` (recording frame ~001) |
| CURRENT | `current-splash-mobile.png` |
| MATCH STATUS | **PARTIAL** |
| REMAINING DIFFERENCES | Layout (R7 mark, side HUD specs, “DRIVE BEYOND ORDINARY”, Escalade garage hero) matches. Accent in **recording is red `#e61e26`**; **current source tokens use Yango yellow `#e9ff00`**. Fake iOS status bar present in web preview. |

## SCREEN: Post-splash / Onboarding

| | |
|--|--|
| REFERENCE FRAME | Recording proceeds toward showcase **Home** (G-CLASS / TOUR CAR). |
| CURRENT | `current-onboarding-mobile.png` |
| MATCH STATUS | **FAIL vs recording Home** (expected: different flow in current source) |
| REMAINING DIFFERENCES | Current app shows onboarding (“RENT THE EXTRAORDINARY” + CONTINUE). Recording home is the red showcase carousel. Preserved as-in-source; not rewritten to force recording flow. |

## SCREEN: Home / Discover

| | |
|--|--|
| REFERENCE FRAME | `reference-home.png` (G-CLASS, gauge, MORE DETAIL, TOUR CAR, red tabs) |
| CURRENT | `current-home-mobile.png` (capture landed on late onboarding “AL OMDA / FLEET / GET STARTED”, not tab Home — web gate) |
| MATCH STATUS | **FAIL / divergent product surface** |
| REMAINING DIFFERENCES | Recording = cinematic showcase home (red, G-CLASS gauge, TOUR CAR). Current Capacitor default path = yellow onboarding then iOS-style Popular `HomeScreen`. Showcase is `FeaturedShowcaseScreen`, not default tab Home. |

## SCREEN: Explore

| | |
|--|--|
| REFERENCE FRAME | `reference-explore.png` |
| CURRENT | `current-explore-mobile.png` |
| MATCH STATUS | **PARTIAL** |
| REMAINING DIFFERENCES | Shared patterns: search, chips, nightlife banner, list cards, 5-tab bar. Accent color yellow vs red; density/chip set may differ. Exact pixel match not claimed. |

## SCREEN: Car detail / Booking / Bookings / Favorites / Profile

| | |
|--|--|
| REFERENCE FRAME | `reference-booking.png` (+ recording frames for detail/tabs) |
| CURRENT | Not fully walked in this pass (onboarding path + tab capture prioritized). |
| MATCH STATUS | **NOT FULLY VERIFIED IN SCREENSHOTS** — source screens exist: `CarDetailScreen`, `BookingFlowScreen`, `FavoritesBookingsProfile`. |
| REMAINING DIFFERENCES | Need dedicated capture after completing location/onboarding gates in web preview. Do not invent UI to force match. |

## SCREEN: Bottom tab bar

| | |
|--|--|
| REFERENCE | HOME / EXPLORE / BOOKINGS / FAVORITES / PROFILE + active top tick |
| CURRENT | Same five destinations in `BottomNav.tsx` |
| MATCH STATUS | **PARTIAL** (structure PASS; color/indicator styling follows yellow token system) |

---

## Evidence paths (filesystem)

```
/Users/home/Projects/re7lty-production/docs/visual-parity/reference-splash.png
/Users/home/Projects/re7lty-production/docs/visual-parity/reference-home.png
/Users/home/Projects/re7lty-production/docs/visual-parity/reference-explore.png
/Users/home/Projects/re7lty-production/docs/visual-parity/reference-booking.png
/Users/home/Projects/re7lty-production/docs/visual-parity/current-splash-mobile.png
/Users/home/Projects/re7lty-production/docs/visual-parity/current-onboarding-mobile.png
/Users/home/Projects/re7lty-production/docs/visual-parity/current-home-mobile.png
/Users/home/Projects/re7lty-production/docs/visual-parity/current-explore-mobile.png
/Users/home/Projects/re7lty-production/docs/visual-parity/current-desktop-1440x900.png
/Users/home/Projects/re7lty-production/docs/visual-parity/VISUAL_PARITY.md
```

## Conclusion
`re7lty-production` is the **correct preserved Capacitor SoT**. Pixel identity with the **Aug 18 recording** is **not** complete because the checked-in product has evolved (yellow accent, onboarding-first, Popular Home vs red showcase Home). Closing that gap requires an explicit product decision (restore recording-era pack vs keep current yellow iOS Home) — not silent redesign.
