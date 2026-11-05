# Galkhuu & Akane — *A Little Laughter, A Lifetime Together*

Wedding film system in **Remotion 4.0.541 + React 19 + TypeScript**. One design system and two films:

| Composition | Length | Purpose |
| --- | --- | --- |
| `WeddingGuestLoop` | **4:00** — 7200 frames @ 30 fps | Seamless pre-show loop while guests arrive (room + Zoom) |
| `WeddingOpeningFilm` | **1:20** — 2400 frames @ 30 fps | Played **once**, right before the wedding begins |
| `WelcomeStill` | 1920×1080 PNG | Emergency fallback card if video playback fails |

Everything ships **silent** by default. Real photos and authorised music are added locally. No redesign
or animation edits are needed.

---

## 1. Setup

Requirements: Node 18+ (tested on Node 22), ~2 GB free disk. Remotion downloads its own headless
Chrome the first time you render.

```bash
cd galkhuu-akane-film
npm install
```

## 2. Preview (Remotion Studio)

```bash
npm run studio
```

Opens http://localhost:3000. Pick `WeddingOpeningFilm` or `WeddingGuestLoop` and press space to play.
In the right-hand props panel, `showSafeArea: true` shows the Zoom-safe frame.

## 3. Add the real photos (5 steps)

1. Pick photos. Aim for 18–30, but 6–10 already works. Open `assets/photo-manifest.json` to see the
   33 slot names and what each slot wants. Examples: `GALKHUU_PORTRAIT_01`, `AKANE_PORTRAIT_01`,
   `COUPLE_HERO_01` (the single best photo of you together), `COUPLE_CANDID_02` (laughing together).
2. Copy them into `photos-inbox/`, **named after their slot**, e.g. `COUPLE_HERO_01.jpg`.
   Lower case and extra words are fine: `akane_portrait_01 garden.png`.
3. Run `npm run photos`. Each photo is auto-rotated from its EXIF data, resized to ≤2560 px and
   **stripped of all metadata (GPS, camera, dates)**. It is saved to `public/assets/photos/<SLOT>.jpg`
   and registered in the manifest.
4. Run `npm run check:photos -- --full`. This prints which photo appears at every timecode in both
   films and warns about quick repeats or low resolution. If a face sits near an edge, set
   `focalX` / `focalY` (0–1, where the faces are) for that slot in the manifest.
5. Run `npm run studio` to look, then `npm run render:all`.

How missing photos are handled:
- **Zero real photos:** every slot shows its own labelled placeholder (review mode). That is today's build.
- **Some real photos:** empty slots *borrow* a related real photo. The film picks the photo that is
  furthest in time from its other appearances, so **placeholders never appear on the wedding day**
  and repeats are spread out as far as possible. People slots never borrow detail shots.
- `enabled: false` removes a slot completely. `DETAIL_RINGS_01` is disabled by default, so the film
  never implies rings that weren't photographed. Collage cells for missing photos simply drop out
  and the collage re-flows.
- To use a different photo in a slot, rename and re-run step 3. You can also edit `src` in the
  manifest directly. Animation code never changes.
- `npm run photos -- --reset` returns every slot to its placeholder.
- Portrait photos are never forced into a 16:9 crop. Shots that need it use a cinematic
  blurred-copy backdrop with the whole portrait visible. `cropMode: "contain" | "cover"` in the
  manifest overrides the automatic choice per photo.
- Faces are never retouched, distorted or reshaped. Only uniform scale (1.00–1.07) and translation are
  used.
- Family and friends slots: use them only with the consent of everyone pictured, for both in-room and
  Zoom display.
- HEIC: export as JPEG first.

## 4. Render

```bash
npm run test:render      # 5-second check -> out/test_5s.mp4
npm run render:opening   # out/WeddingOpeningFilm_1080p_silent.mp4
npm run render:loop      # out/WeddingGuestLoop_1080p_silent.mp4
npm run render:still     # out/WelcomeStill_1920x1080.png
npm run render:720       # lighter 1280x720 Zoom copies of both
npm run verify           # ffprobe/SSIM checks -> out/verification.json
npm run stills           # review PNGs -> out/stills/
```

Output: H.264 High, `yuv420p`, BT.709, 1920×1080, 30 fps, no audio stream. In the cloud build, render
speed on 4 vCPUs was about 4–6 frames per second, roughly 8 min for the opening film and 25 min for the
loop. A modern laptop is similar or faster. Change parallelism with `--concurrency=N`.

On machines where Remotion can't download Chrome, point it at an installed one:
`REMOTION_BROWSER_EXECUTABLE=/path/to/chrome npm run render:opening`.

## 5. Music (optional, local only)

Read **`public/assets/music/README.md`** first. In short:
- Candidate songs (official): **132 “Now We Are One”** for the opening film, **154 “Unfailing Love”**
  for the loop, and **85 “Welcome One Another”** as an alternate. Use instrumental recordings
  obtained via the jw.org Download control. Availability of each instrumental was **not verified**
  from the cloud build, so check it on the site.
- Synchronisation, public playback, Zoom streaming and recording rights are **UNVERIFIED**. Confirm
  them with the organiser or rights holder first. Until then, the videos stay silent.
- Never put audio files in Git, the cloud, or a shared bundle. `public/local-audio/` and all audio
  extensions are git-ignored.
- Loop: play the music separately and leave the video silent. Opening film, once approved:
  `node scripts/mux-music.mjs … --i-confirm-rights`. Or use the Studio props `withMusic` / `musicSrc`.
- `assets/music-cues.json` holds the picture markers. BPM and beats are intentionally `null` until
  someone listens to the real recording.

## 6. Editing text, timing and look

| What | Where |
| --- | --- |
| All on-screen words (names, date, lines) | `src/config/text.ts` |
| Colours, fonts, motion constants, Zoom-safe area | `src/config/design.ts` |
| Opening film shots, durations, transitions, text cues | `src/config/openingStoryboard.ts` |
| Guest loop shots | `src/config/loopStoryboard.ts` |
| Scene layouts | `src/scenes/*.tsx` |
| Shared building blocks | `src/components/*.tsx` |

Each shot's `dur` is its on-screen length. Transitions are centred on cuts. The total must equal
2400 or 7200 frames, and Studio shows an error if it does not. After changing durations, run
`npm run cues`.

## 7. Wedding-day operation

See **`docs/RUN_SHEET.md`**, a one-page operator sheet covering the Zoom test meeting, loop, opening
film, hand-back to the speaker and captions.

## 8. Troubleshooting

| Symptom | Fix |
| --- | --- |
| A photo slot still shows a placeholder | `npm run check:photos` will report `file not found` or the slot isn't filled; check the file name matches the slot |
| A face is cropped | Set that slot's `focalX`/`focalY` in the manifest, or `cropMode: "contain"` |
| Photo looks soft | Use originals ≥ 1920 px on the long edge (the check script warns) |
| `Storyboard runtime is N frames…` | A `dur` edit changed the total. Rebalance so the sum is exactly 2400 / 7200 |
| Render can't find Chrome | Set `REMOTION_BROWSER_EXECUTABLE` (see §4) |
| Render is slow / runs out of memory | `--concurrency=2` |
| Zoom playback stutters | Use the `_720p_` files, share with "Optimize for video clip", close other apps |
| Seam visible in loop | Play the file with your player's *loop* option. The seam is designed and verified (`npm run verify`) |

## Project layout

```
galkhuu-akane-film/
  src/Root.tsx                       compositions
  src/compositions/                  WeddingOpeningFilm, WeddingGuestLoop, WelcomeStill
  src/components/                    PhotoFrame, PhotoPlaceholder, PhotoGrid, WeddingTitle, FloralMotif,
                                     SoftCamera, SeamlessLoop, Atmosphere, FilmTimeline, MusicBed
  src/scenes/                        one file per layout (atmosphere, portrait editorial, split, …)
  src/transitions/presentations.tsx  bloom, veil, feathered wipe, parallax drift, dissolve
  src/config/                        design tokens, text, storyboards, manifest schema, casting logic
  assets/photo-manifest.json         THE photo manifest
  assets/music-cues.json             editorial cue sheet (no audio)
  public/assets/photos/              processed photos (placeholders are procedural — folder starts empty)
  public/assets/music/README.md      music sources, rights, local workflow
  photos-inbox/                      drop originals here (git-ignored)
  scripts/                           photos, check, stills, 720p, verify, mux-music, cues
  docs/                              SHOTLIST, DIRECTOR_NOTES, QA_REPORT, RUN_SHEET
  out/                               renders (mp4 git-ignored), stills/
```

Licences: Cormorant Garamond and Inter are SIL Open Font License and load from the `@fontsource` npm
packages, so no font files are committed. Remotion is free for individuals and small teams. See
remotion.dev/license. All floral line art and placeholders are original and procedural.
