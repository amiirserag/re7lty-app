# Put re7lety on your iPhone

This cloud machine cannot install to a physical iPhone (no Xcode, no USB).  
Do one of the two paths below **on your Mac + iPhone**.

---

## Option A — Home Screen app (fastest, 2 minutes)

Looks and launches like an app (Eye of Horus icon, no Safari chrome).

1. Copy this project to your Mac (AirDrop, USB, iCloud, or Git).
2. In Terminal:

```bash
cd re7lety
npm install
npm run build
npm run preview -- --host --port 4173
```

3. On your Mac, note the Wi‑Fi IP (System Settings → Wi‑Fi → Details), e.g. `192.168.1.20`.
4. **iPhone and Mac must be on the same Wi‑Fi.**
5. iPhone Safari → open `http://YOUR-MAC-IP:4173`
6. Tap **Share** → **Add to Home Screen** → Add.
7. Open **re7lety** from the home screen.

That’s the same UI you saw, full-screen, with your icon.

To share with anyone (not just same Wi‑Fi), deploy `dist/` to Vercel / Netlify, then Add to Home Screen from that HTTPS URL.

---

## Option B — Real iOS app via Xcode (installs like a native app)

Needs: Mac, Xcode 15+, your iPhone, Apple ID (free developer account is enough for 7-day device installs).

```bash
cd re7lety
npm install
npm install @capacitor/core @capacitor/cli @capacitor/ios
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

In Xcode:

1. Select the **re7lety** target → **Signing & Capabilities**.
2. Check **Automatically manage signing**.
3. Team = your Apple ID.
4. Plug in the iPhone → unlock it → Trust This Computer.
5. Top bar: destination = **your iPhone** (not Simulator).
6. Product → Run (▶).

First run: iPhone Settings → General → VPN & Device Management → trust your developer certificate.

App icon: drop `public/brand/re7lety-app-icon.png` into the AppIcon asset.

---

## Option C — Full SwiftUI rewrite later

Starter files live in `ios/re7lety/`. That is not the running UI yet. Use A or B to get the current design on device today.

---

## Checklist

- [ ] Mac and iPhone on same network (A) **or** USB + Xcode (B)
- [ ] `npm run build` succeeds
- [ ] Icon appears on home screen
- [ ] App opens full-screen (not a Safari tab)
- [ ] Booking + favorites still persist after force-quit
