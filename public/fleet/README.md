# Drop your Al Omda fleet here

Put **your videos and photos** in these folders. The app scans `public/fleet` on every dev start and build — no code change needed for existing cars.

## Existing cars (folder name = car id)

| Folder | Car |
|--------|-----|
| `velocity-r/` | VELOCITY R |
| `g-class-night/` | G-Class |
| `rr-sport/` | Range Rover Sport |
| `lc300/` | Land Cruiser |
| `patrol-platinum/` | Patrol Platinum |
| `escalade-night/` | Escalade |
| `v-class-omda/` | V 300d |
| `carnival-hi/` | Carnival Hi-Limo |
| `bmw-x5/` | X5 |
| `macan-s/` | Macan S |
| `urus-pearle/` | Urus |
| `gt63/` | GT 63 S |
| `cullinan/` | Cullinan |
| `bentayga/` | Bentayga |
| `model-x/` | Model X |
| `u8-giza/` | U8 |
| `s-class/` | S 500 |
| `cayenne/` | Cayenne |
| `defender-luxor/` | Defender |
| `lc-aswan/` | Land Cruiser VX |
| `g-class-sahel/` | G 63 Coast |
| `brand/` | Splash / onboarding films |
| `locations/` | City stills (`cairo.jpg`, `giza.jpg`, …) |

## Files inside each car folder

```
public/fleet/g-class-night/
  hero.mp4      ← Home + Detail cinematic loop
  poster.jpg    ← list still + video poster
  tour.mp4      ← Tour Car screen
  front.jpg / side.jpg / rear.jpg / detail.jpg
  gallery-1.jpg
  gallery-2.jpg
```

Names are optional. Any `.mp4` in the folder becomes the hero film; any photos become the gallery.

## Brand films

```
public/fleet/brand/
  intro.mp4         ← Splash background
  onboard-1.mp4     ← Onboarding page 1
  onboard-2.mp4
  onboard-3.mp4
  poster.jpg
```

## New cars

Create a new folder, drop media, restart `npm run dev`. Example:

```
public/fleet/g63-black/
  hero.mp4
  poster.jpg
```

That listing appears automatically in Explore (Al Omda · Cairo) and on Home if it has a video. Tell us the daily price / city later if you want it exact.

## Video specs (iPhone)

- Format: **H.264 `.mp4`** (Safari-friendly; avoid HEVC-only if you also want Android)
- Length: **6–12 seconds**, loop-friendly
- Audio: none (app plays muted)
- Resolution: 1080×1920 or 1920×1080
- Size: **under 8 MB** each if possible

Stock stills stay as fallback until a file is in the matching folder.
