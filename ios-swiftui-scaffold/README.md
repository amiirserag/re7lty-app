# SwiftUI scaffold

This folder is a **starter** for the native iOS port of re7lety.

The fully interactive cinematic UI currently runs via the React app at the repo root (`npm run dev`) because this cloud environment is Linux and cannot build or install `iphoneos` onto a physical iPhone.

## Next steps on a Mac

1. Create an iOS App project in Xcode 15+ (iOS 17+).
2. Add the Swift files under `ios/re7lety/`.
3. Port screens from `src/screens/` using `MotionTokens`, `Re7letyColor`, and `AlOmdaFleet`.
4. Use SwiftData for onboarding / city / favorites / bookings persistence.
5. Build to a connected physical iPhone (`iphoneos`).

Shared product truth (fleet, copy, flows) lives in `src/data/cars.ts` — keep Swift models in sync.
