#!/usr/bin/env node
/** Regenerates assets/music-cues.json from the storyboards (editorial markers, not beats). */
import fs from "node:fs";
import { loadQa, tc } from "./lib-qa.mjs";

const qa = await loadQa();
const comp = (shots, total) =>
  qa.buildTimeline(shots, total).entries.map((e) => ({
    shot: e.shot.id,
    start: tc(e.start),
    startFrame: e.start,
    durationSec: +(e.shot.dur / 30).toFixed(2),
    transitionIn: e.shot.in?.kind ?? "start",
    ...(e.shot.marker ? { marker: e.shot.marker } : {}),
  }));
const prev = fs.existsSync("assets/music-cues.json") ? JSON.parse(fs.readFileSync("assets/music-cues.json", "utf8")) : {};
const cues = {
  $comment:
    "Editorial cue sheet. Timecodes are PICTURE markers from the storyboard — NOT measured beats. bpm/durationSeconds/beatMarkers stay null until an AUTHORISED recording is listened to locally. No audio bytes or remote audio URLs belong in this file.",
  withMusic: false,
  rightsStatus:
    "2026-11-05: the user (event side) instructed that the official JW recordings may be downloaded, stored and used for this film. Not independently verified against jw.org terms; see public/assets/music/README.md.",
  officialSourceCheck: {
    checkedOn: "2026-11-05",
    method: "Read the official song pages and the download links they expose (pub-media API used by the page's own Download control).",
    result:
      "For songs 132, 154 and 85 the 'Instrumental' (sjji) version returns 404 — not available. The music-only 'Meetings' (sjjm) recordings ARE available and were used. 'Vocals' (sjjc) exists for 154 and 85 only.",
  },
  compositions: {
    WeddingOpeningFilm: {
      durationFrames: qa.OPENING_FRAMES,
      fps: 30,
      candidateSong: { number: 132, title: "Now We Are One", page: "https://www.jw.org/en/library/music-songs/sing-out-joyfully/132-now-we-are-one/", version: "Meetings (sjjm_E_132.mp3)", instrumentalAvailable: false },
      localAudioFile: "public/local-audio/sjjm_E_132.mp3",
      audioOffsetSec: 0,
      gainDb: -2.7,
      fadeOutSec: 5,
      bpm: null,
      durationSeconds: 129.83,
      integratedLoudnessLUFS: -15.7,
      measuredSections: [
        { at: "00:00", what: "quiet intro (music begins ~1 s)", film: "anticipation + portraits" },
        { at: "00:18", what: "first build", film: "first couple portrait (00:18)" },
        { at: "00:32", what: "lift", film: "A little laughter (00:31)" },
        { at: "00:42–00:47", what: "dip / breath", film: "details section (00:44)" },
        { at: "00:57–00:59", what: "main lift / climax begins", film: "HERO payoff (00:59)" },
        { at: "01:15–01:20", what: "still at climax — 5 s fade-out applied", film: "title hold" },
        { at: "02:04", what: "song's own ending (not used)", film: "—" },
      ],
      beatMarkers: [],
      phases: [
        { name: "Anticipation", from: "00:00", to: "00:07", musicIntent: "intro; very soft entry" },
        { name: "Portraits", from: "00:07", to: "00:18", musicIntent: "first phrase; Meet Galkhuu / Meet Akane can land on phrase starts" },
        { name: "Together", from: "00:18", to: "00:31", musicIntent: "warm, steady" },
        { name: "Gentle humour", from: "00:31", to: "00:44", musicIntent: "lighter passage; reaction cuts (00:36.8, 00:39.0) can move onto beats" },
        { name: "Details", from: "00:44", to: "00:59", musicIntent: "breathe; no text" },
        { name: "Hero payoff", from: "00:59", to: "01:11", musicIntent: "melodic lift / chorus" },
        { name: "Title hold", from: "01:11", to: "01:20", musicIntent: "resolve and fade by 01:20 (operator cue)" },
      ],
      shots: comp(qa.openingShots, qa.OPENING_FRAMES),
    },
    WeddingGuestLoop: {
      durationFrames: qa.LOOP_FRAMES,
      fps: 30,
      candidateSong: { number: 154, title: "Unfailing Love", page: "https://www.jw.org/en/library/music-songs/sing-out-joyfully/154-unfailing-love/", version: "Meetings (sjjm_E_154.mp3)", instrumentalAvailable: false },
      alternateSong: { number: 85, title: "Welcome One Another", page: "https://www.jw.org/en/library/music-songs/sing-out-joyfully/85-welcome-one-another/", version: "Meetings (sjjm_E_085.mp3)", instrumentalAvailable: false },
      recommendedPlayback: "Song 154 (235.4 s) fits the 240 s loop: it starts at 00:02 and resolves at ~03:52, leaving a natural ~8 s pause across the seam.",
      localAudioFile: "public/local-audio/sjjm_E_154.mp3",
      audioDelaySec: 2,
      bpm: null,
      durationSeconds: 235.4,
      integratedLoudnessLUFS: -18.4,
      beatMarkers: [],
      phases: [
        { name: "Welcome", from: "00:00", to: "00:24" },
        { name: "Portraits", from: "00:24", to: "01:04" },
        { name: "Together", from: "01:04", to: "01:42" },
        { name: "Candid joy", from: "01:42", to: "02:18" },
        { name: "Details", from: "02:18", to: "03:02" },
        { name: "Deep warm hero", from: "03:02", to: "03:32" },
        { name: "Reprise + seamless return", from: "03:32", to: "04:00" },
      ],
      shots: comp(qa.loopShots, qa.LOOP_FRAMES),
    },
  },
};
fs.writeFileSync("assets/music-cues.json", JSON.stringify(cues, null, 2) + "\n");
console.log("✓ assets/music-cues.json");
