# QA report: 2026-11-05 (cloud build, placeholder photos)

Every number below was measured on the actual files (ffprobe / ffmpeg / Remotion). Nothing is estimated.
Reproduce with `npm run verify` (writes `out/verification.json`).

## Rendered files

| File | Status | Frames | Duration | Size | Video | Audio |
| --- | --- | --- | --- | --- | --- | --- |
| `WeddingOpeningFilm_1080p_silent.mp4` | PASS | 2400 | 80.000 s | 27.7 MB | 1920×1080, 30 fps, H.264 High, yuv420p, BT.709 | none |
| `WeddingGuestLoop_1080p_silent.mp4` | PASS | 7200 | 240.000 s | 68.7 MB | same | none |
| `WeddingOpeningFilm_720p_silent.mp4` | PASS | 2400 | 80.000 s | 7.3 MB | 1280×720, 30 fps, H.264, yuv420p | none |
| `WeddingGuestLoop_720p_silent.mp4` | PASS | 7200 | 240.000 s | 18.6 MB | 1280×720 | none |
| `WeddingOpeningFilm_1080p_with_music_song132.mp4` | PASS | 2400 | 80.000 s | 29.7 MB | picture copied bit-exact | AAC stereo 48 kHz, −18.7 LUFS, peak −4.2 dBFS |
| `WeddingGuestLoop_1080p_with_music_song154.mp4` | PASS | 7200 | 240.000 s | 74.6 MB | picture copied bit-exact | AAC stereo 48 kHz, −18.5 LUFS, peak −2.5 dBFS |
| `WeddingOpeningFilm_720p_with_music_song132.mp4` | PASS | 2400 | 80.000 s | 9.3 MB | 1280×720 | AAC stereo 48 kHz |
| `WeddingGuestLoop_720p_with_music_song154.mp4` | PASS | 7200 | 240.000 s | 24.4 MB | 1280×720 | AAC stereo 48 kHz |
| `WelcomeStill_1920x1080.png` | ✓ | — | — | 3.2 MB | emergency card | — |
| `out/stills/*.png` | ✓ 14 frames | — | — | 1920×1080 | design review | — |

Render times on 4 vCPU / 15 GB with headless Chrome:

| Step | Time | Speed |
| --- | --- | --- |
| Opening film | 302–354 s | ≈7–8 fps |
| Guest loop | 888 s | ≈8 fps |
| Both 720p transcodes | 199 s total | — |
| 5-second test render (frames 180–329) | ≈25 s + bundling | — |

## Loop seam (00:00 ↔ 04:00)

| Check | Result |
| --- | --- |
| Lossless rendered frames 7199 → 0 | SSIM **0.999767**. Normal steps are 7198→7199 0.999761 and 0→1 0.999766, so the seam step is indistinguishable from any other frame step. |
| Pixel difference image (last vs first frame, 12× contrast) | Black. No visible difference. |
| Encoded 1080p file, seam | SSIM 0.976 vs 0.981 at an ordinary keyframe boundary inside the file (every ~8.3 s), so the seam is no worse than a normal GOP boundary. **PASS** |
| Encoded 720p file, seam | SSIM 0.970 vs 0.973. **PASS** |
| Title presence | The welcome title is fully visible on both sides of the seam: no black frame, no disappearing title, no colour jump. |
| Music | Song 154 plays 00:02.3 → 03:54.4. The ~8 s gap across the seam is a natural pause before the song restarts with the welcome. |

## Opening film

| Check | Result |
| --- | --- |
| First frame | Mean luma 225/255: warm ivory, **not black**. |
| End card | Text fully settled by 01:13.5 and still until 01:20.0, a **6.5 s hold** (brief: ≥ 4 s). A difference image of 01:16 vs 01:20 shows zero change in the names/date block. Only the softly visible photo keeps its slow push. |
| Final frame | Steady name card, no fade to black. Clean operator cue. |
| Spelling | `Galkhuu & Akane`, `Wedding Celebration`, `07 November 2026`, all from `src/config/text.ts`. |
| Music (song 132, Meetings recording) | Measured sections line up with the edit at 0 s offset: build 00:18 ↔ first couple portrait, lift 00:32 ↔ "A little laughter", dip 00:42–47 ↔ details, **main lift 00:57–59 ↔ hero payoff 00:59**. Lowered 2.7 dB; 5 s fade-out over the title hold. |

## Visual QA (stills reviewed + a contact sheet of the opening at 2 s intervals)

| Check | Result |
| --- | --- |
| Fonts | Fonts load locally (Cormorant Garamond 300–500 + italics, Inter 300–500). Renders are deterministic; no network fonts. |
| Layout defects found and fixed during review | (1) Welcome date line wrapped into the floral branch → split into caps + italic date and reduced the branch. (2) Large placeholder labels collided with captions → labels capped higher. (3) A landscape hero was letterboxed on the end card → focal-point cover crop. (4) Florals removed from hero shots (brief: "reduced decoration"). |
| Placement | Text never overlaps the face zones of the placeholders. Captions sit on the side away from the manifest focal point. |
| Distinct text cards | 5 in the loop (brief: 4–6). |
| Effects | No flashing, no bouncing text, no confetti, no lens flares. |

## Real-photo path (tested in an isolated copy with 6 abstract test images, not people)

| Check | Result |
| --- | --- |
| `npm run photos` | EXIF auto-rotate, resize ≤2560 px, metadata stripped, manifest updated. Unmatched file names reported. |
| Cropping | Covers fill the arch and portrait panels; contained portraits sit on a blurred backdrop; the collage re-flows to one print when cells are missing. |
| Casting | Before the fix, the hero was reused 8 s before the hero shot and a detail photo stood in for a portrait. Both are fixed: borrowing now maximises distance in time (past and future, and across the loop seam), and people slots never borrow details. With only 6 photos, the 4:00 loop has **no repeats under 20 s**. The 80 s film reuses some photos at 13–17 s intervals, which `check:photos` flags so you can add more. |
| Zero photos | Renders labelled placeholders without crashing (this build). |
| `DETAIL_RINGS_01` | Disabled → collage cells drop out. Rings are never implied. |

## Music source check (official pages, 2026-11-05)

| Song | Instrumental (`sjji`) | Meetings (`sjjm`, music-only) | Vocals (`sjjc`) |
| --- | --- | --- | --- |
| 132 *Now We Are One* | 404, not available | ✓ 129.8 s, used | 404 |
| 154 *Unfailing Love* | 404, not available | ✓ 235.4 s, used | ✓ |
| 85 *Welcome One Another* | 404, not available | ✓ 132.5 s, downloaded as alternate, unused | ✓ |

Files were downloaded through the official song pages' own download links (jw-cdn). Usage rights:
the user instructed on 2026-11-05 that the recordings may be stored and used for this film.
This was not independently verified against jw.org terms.

## Not done / limits

- **Real photos:** none were supplied, so every picture is still a labelled placeholder. Re-render after `npm run photos`. That is the only remaining step for the final film.
- **Listening:** nobody listened to the audio. Section timing comes from measured loudness envelopes. Listen once to confirm the "Meetings" recordings are the arrangement you want.
- **Remotion Studio:** not opened interactively in the cloud (no display). Both compositions bundle, list and render through the same code path Studio uses.
- **Zoom:** venue playback and the Zoom guest-side test can only be done on site (see `docs/RUN_SHEET.md`).
