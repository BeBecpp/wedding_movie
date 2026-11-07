# Verification report: Galkhuu & Akane, 7 November 2026

RENDER: **PASS** (v2 render without photo 26: 7620/7620 frames, exit 0; the soundtrack was muxed with -c:v copy)

| File | Video | Duration / frames | Audio | Result |
|---|---|---|---|---|
| LOCAL_ONLY_MUSIC/Galkhuu_Akane_FINAL_154_132_1080p.mp4 (189.7 MB): **MAIN** | H.264 High 1920×1080, 30 fps, yuv420p, BT.709, picture identical to silent master | 254.000 s / 7620 | AAC LC stereo 48 kHz, −18.0 LUFS, TP −2.4 dBFS, starts 0.000 | PASS |
| LOCAL_ONLY_MUSIC/Galkhuu_Akane_FINAL_154_132_Zoom_720p.mp4 (99.1 MB) | H.264 High 1280×720 (NVENC), 30 fps | 254.000 s / 7620 | same new soundtrack | PASS |
| PUBLIC_RELEASE/Galkhuu_Akane_MemoryFilm_1080p_SILENT.mp4 (181.5 MB) | H.264 High 1920×1080, 30 fps | 254.000 s / 7620 | none (intended) | PASS |
| PUBLIC_RELEASE/Galkhuu_Akane_MemoryFilm_Zoom_720p_SILENT.mp4 (90.9 MB) | H.264 High 1280×720 | 254.000 s / 7620 | none (intended) | PASS |
| PUBLIC_RELEASE/Galkhuu_Akane_Waiting_Loop_1080p.mp4 (13.6 MB) | H.264 High 1920×1080, 30 fps, seamless (first/last frame SSIM 0.993) | 60.000 s / 1800 | none | PASS |
| Welcome / Closing / Waiting / Fallback PNG | 1920×1080, original floral artwork + names untouched, one added text line below the divider | — | — | PASS |
| Galkhuu_Akane_Wedding_Background.png | original 1672×941 pixels (lossless PNG of the supplied image) | — | — | PASS |

Checks
- ffprobe: codec, profile, size, fps, pix_fmt, BT.709, frame counts, durations, audio stream presence (table above).
- Full ffmpeg decode of every MP4: no errors. blackdetect: **no black segments**.
- Final names: GALKHUU & AKANE / 7 NOVEMBER 2026 settle at about 3:54 and hold to the last frame (last-frame luma 191/255, no fade to black).
- Soundtrack: no song 85 (fingerprint), no doubled music (single audio stream, built only from 154 + 132), no clipping (TP −2.4 dBFS). The only silence is 4:09.7–4:14.0, after the final chord, over the held names. The transition dips softly to about −27 dB and never drops to silence.
- Photos: **43/45** used. **Photos 32 and 26 are excluded** at the couple's request: from the film (re-rendered v2, 11:31; only Chapter One was retimed and every shot from 0:48.5 is unchanged), the photo ZIP, the contact sheets and every published file. The earlier release files that contained photo 26 were deleted from GitHub and replaced. The processed photos carry no EXIF/GPS.
- DOWNLOAD_ON_COMPUTER_A.ps1 tested on this PC: offline/USB mode with backup copy → PLAYBACK FILES READY: YES. The stream check also passed with ffprobe removed from PATH (Windows metadata fallback).
- VLC 3 headless playback test: earlier silent and music versions played to the end, exit 0.
- The existing `WeddingGuestLoop` (2026-11-05) was **not included**: it was built with placeholder slots and was never verified with real photos. The new floral `Waiting_Loop` is the guest-arrival loop.

Not verified by a person: listening by ear in the hall, and a live Zoom "Share sound" test from Computer A.
