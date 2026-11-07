# Galkhuu & Akane · 7 November 2026 — Playback run sheet (Computer A)

**Computer A needs only Windows and VLC.** No Node, Remotion, GPU or source project.
Prepare everything **before guests arrive**, and never stream from GitHub during the ceremony.

## 0. Setup (the morning of the event, or the day before)
1. Install VLC (videolan.org) if it is missing.
2. Copy `DOWNLOAD_ON_COMPUTER_A.ps1` to Computer A and run it:
   - With the USB stick (works offline):
     `powershell -ExecutionPolicy Bypass -File .\DOWNLOAD_ON_COMPUTER_A.ps1 -OfflineSource "E:\DELIVERY_Galkhuu_Akane_20261107" -BackupTo "F:\"`
   - With internet (downloads everything, including the film with music):
     `powershell -ExecutionPolicy Bypass -File .\DOWNLOAD_ON_COMPUTER_A.ps1`
3. The script must end with **PLAYBACK FILES READY: YES**. Everything is then in `Desktop\WEDDING_PLAYBACK`, with SHA-256 checks done.
4. Displays: Windows **Extend** mode (Win+P → Extend). The hall projector/TV is the second screen. Drag the VLC window there before pressing F (fullscreen).
5. Audio, using **one path only**, to avoid echo and doubling:
   - **Hall:** Computer A's headphone/HDMI output feeds the mixer.
   - **Zoom:** Share Screen → the hall display → tick **Share sound** and **Optimize for video clip**.
   - Do **not** also open a Zoom microphone near the speakers, and do not route the mixer back into Zoom while Share sound is on.
6. Test once: play 20 s of `3_MEMORY_FILM.cmd` and check the hall volume and the sound on a remote Zoom device.
7. Leave SubTalk and its caption system exactly as they are. This package does not touch them.

## Running order

| # | Cue | Double-click in WEDDING_PLAYBACK | What the screen shows | Audio |
|---|---|---|---|---|
| 1 | Doors open | `1_WELCOME_SCREEN.cmd` | Floral card: "Welcome — we're so glad you're here", 7 November 2026 | none |
| 2 | Guests arriving / waiting | `2_GUEST_ARRIVAL_LOOP.cmd` | 60 s floral loop, "Our celebration will begin shortly" (repeats seamlessly) | none (room music separately if wanted) |
| 3 | Opening / Memory film | `3_MEMORY_FILM.cmd` | 4:14 film. **Ends holding GALKHUU & AKANE / 7 NOVEMBER 2026** (VLC pauses on the last frame; no black screen) | Songs 154 → 132 |
| 4 | Return to Zoom speaker view | Press **Ctrl+Q** in VLC → in Zoom click **Stop Share** | Zoom shows the speaker again | speaker microphone |
| 5 | End of programme | `4_CLOSING_SCREEN.cmd` | "Thank you for celebrating with us" | none |
| ! | Any failure | `9_FALLBACK_STILL.cmd`, or open `Galkhuu_Akane_Fallback_Still.png` | Floral card with the names and date | — |

Backup film without sound: `3b_MEMORY_FILM_SILENT.cmd`. If Zoom stutters, share the 720p file
(`Galkhuu_Akane_FINAL_154_132_Zoom_720p.mp4`, or `Galkhuu_Akane_MemoryFilm_Zoom_720p_SILENT.mp4`).

VLC keys: **F** fullscreen · **Space** pause · **Ctrl+Q** quit.

## Files
| File | Use |
|---|---|
| Galkhuu_Akane_FINAL_154_132_1080p.mp4 | MAIN film with music (songs 154 → 132) |
| Galkhuu_Akane_FINAL_154_132_Zoom_720p.mp4 | Zoom-friendly film with music |
| Galkhuu_Akane_MemoryFilm_1080p_SILENT.mp4 | Silent master / backup (GitHub release) |
| Galkhuu_Akane_MemoryFilm_Zoom_720p_SILENT.mp4 | Silent 720p backup (GitHub release) |
| Galkhuu_Akane_Waiting_Loop_1080p.mp4 | Guest-arrival / intermission loop |
| Galkhuu_Akane_Welcome_Screen.png / _Closing_Screen.png / _Waiting_Screen.png / _Fallback_Still.png | Static screens, 1920×1080 |
| Galkhuu_Akane_Wedding_Background.png | Original floral artwork (1672×941) |
