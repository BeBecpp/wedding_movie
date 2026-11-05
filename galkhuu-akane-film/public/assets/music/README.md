# Music — official JW instrumentals, local only

**This folder contains documentation only. No audio file is, or may be, stored here, in Git,
in the cloud build, or in any downloadable bundle of this project.**

## Selected songs (official song pages)

| Use | Song | Official page |
| --- | --- | --- |
| `WeddingOpeningFilm` (80 s) — **primary** | Song 132 — *Now We Are One* | https://www.jw.org/en/library/music-songs/sing-out-joyfully/132-now-we-are-one/ |
| `WeddingGuestLoop` (4:00) — **primary** | Song 154 — *Unfailing Love* | https://www.jw.org/en/library/music-songs/sing-out-joyfully/154-unfailing-love/ |
| Guest arrival — optional alternate | Song 85 — *Welcome One Another* | https://www.jw.org/en/library/music-songs/sing-out-joyfully/85-welcome-one-another/ |

Instrumental collection: https://www.jw.org/en/library/music-songs/sing-out-joyfully/?media=sjji
All JW music: https://www.jw.org/en/library/music-songs/
Terms of use: https://www.jw.org/en/terms-of-use/

> **Verification status: UNVERIFIED.** The cloud build environment could not reach jw.org, so
> nobody has yet confirmed that an *instrumental* recording of each song is downloadable.
> The operator must check this on the official pages. If one is not available, choose another
> suitable **official** JW instrumental — never a mirror, a guessed direct URL, a cover, an
> AI imitation, or a remix.

## How to obtain (operator, on your own computer)

1. Open the song page above (or the instrumental collection).
2. Choose the **instrumental** recording and use the site's own **Download** control.
3. Listen once. Confirm it is the instrumental arrangement you expected.
4. Keep the file on your own computer only.

## Rights — read before attaching music to any video

The jw.org terms allow personal, noncommercial viewing and downloading, but restrict uploading,
embedding in distributed applications and online republication. Those terms **do not by themselves
establish permission** to synchronise a recording into an edited video, to play it publicly in a hall,
to stream it over Zoom, or to record that stream. Ask the event organiser / rights holder to confirm
each intended use. Until confirmed:

- the deliverables stay **silent** (`withMusic: false`, the default);
- if any music is played, it is arranged separately by the event operator;
- no recording with music is uploaded, shared or redistributed.

## Attaching approved music locally (two options)

**Option A — recommended for the 4:00 loop:** play the silent loop video, and play the approved
instrumental separately (looped, low level) from the venue sound system or the playback computer.
The music length will not match 4:00, and this avoids creating a new synchronised file.

**Option B — opening film, once rights are confirmed:** mux the local file onto the silent master.

```bash
node scripts/mux-music.mjs --video out/WeddingOpeningFilm_1080p_silent.mp4 \
  --audio "/path/on/your/computer/approved-instrumental.m4a" \
  --out out/WeddingOpeningFilm_1080p_LOCAL_WITH_MUSIC.mp4 \
  --offset 0 --fade-in 1.5 --fade-out 4 --gain -3 --i-confirm-rights
```

The script refuses to run without `--i-confirm-rights`, refuses URLs, copies the picture bit-exact,
and writes AAC stereo 48 kHz. `out/*.mp4` and all audio extensions are git-ignored.

**Option C — inside Remotion (preview/render with music):** copy the file to
`public/local-audio/` (git-ignored) and start Studio, then set the props
`withMusic: true`, `musicSrc: "local-audio/your-file.m4a"`, `musicVolume: 0.6`.

## Fitting the edit to the music

`assets/music-cues.json` lists every picture cut and the emotional phases. BPM, duration and beat
markers are deliberately `null`: nothing has been measured. After listening to the authorised
recording, note its intro length, the melodic lift and the ending, then adjust shot `dur` values
in `src/config/openingStoryboard.ts` (the total must stay 2400 frames — the project throws an
error if it does not) and run `npm run cues`.

Loudness: aim for warm, low-level music under guests' conversation with no sudden peaks. Set the
final level by ear in the real room and on a remote Zoom device — no numeric target is assumed.
