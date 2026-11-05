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
  rightsStatus: "UNVERIFIED — awaiting organiser / rights-holder confirmation for synchronisation, in-room playback, Zoom sharing and recording",
  compositions: {
    WeddingOpeningFilm: {
      durationFrames: qa.OPENING_FRAMES,
      fps: 30,
      candidateSong: { number: 132, title: "Now We Are One", page: "https://www.jw.org/en/library/music-songs/sing-out-joyfully/132-now-we-are-one/", preferred: "instrumental", availabilityVerified: false },
      localAudioFile: prev?.compositions?.WeddingOpeningFilm?.localAudioFile ?? null,
      audioOffsetSec: 0,
      bpm: null,
      durationSeconds: null,
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
      candidateSong: { number: 154, title: "Unfailing Love", page: "https://www.jw.org/en/library/music-songs/sing-out-joyfully/154-unfailing-love/", preferred: "instrumental", availabilityVerified: false },
      alternateSong: { number: 85, title: "Welcome One Another", page: "https://www.jw.org/en/library/music-songs/sing-out-joyfully/85-welcome-one-another/", preferred: "instrumental", availabilityVerified: false },
      recommendedPlayback: "Play picture loop silently and, if approved, play the audio separately on loop at low level (music length will not match 4:00).",
      localAudioFile: prev?.compositions?.WeddingGuestLoop?.localAudioFile ?? null,
      bpm: null,
      durationSeconds: null,
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
