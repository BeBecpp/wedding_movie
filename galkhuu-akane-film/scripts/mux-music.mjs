#!/usr/bin/env node
/**
 * LOCAL OPERATOR STEP ONLY — attach an authorised, locally stored recording to
 * a silent master. Never run this in a cloud/shared environment and never
 * commit or upload the result unless the rights holder has approved it.
 *
 *   node scripts/mux-music.mjs --video out/WeddingOpeningFilm_1080p_silent.mp4 \
 *     --audio "/Users/me/Music/approved-instrumental.m4a" \
 *     --out out/WeddingOpeningFilm_1080p_LOCAL_WITH_MUSIC.mp4 \
 *     --offset 0 --fade-in 1.5 --fade-out 4 --gain -3 --i-confirm-rights
 */
import fs from "node:fs";
import { ff } from "./lib-ff.mjs";

const a = process.argv.slice(2);
const get = (k, d) => {
  const i = a.indexOf(`--${k}`);
  return i >= 0 ? a[i + 1] : d;
};
const video = get("video");
const audio = get("audio");
const out = get("out");
if (!video || !audio || !out) {
  console.error("Usage: --video <silent.mp4> --audio <local file> --out <file.mp4> [--offset s] [--fade-in s] [--fade-out s] [--gain dB] --i-confirm-rights");
  process.exit(1);
}
if (!a.includes("--i-confirm-rights")) {
  console.error(
    "Refusing: add --i-confirm-rights only after the event organiser / rights holder has confirmed\n" +
      "synchronisation, in-room playback, Zoom sharing and any recording use. See public/assets/music/README.md.",
  );
  process.exit(2);
}
if (/^[a-z]+:\/\//i.test(audio)) {
  console.error("Refusing: audio must be a LOCAL file you obtained through the official site, not a URL.");
  process.exit(2);
}
if (!fs.existsSync(audio)) {
  console.error(`Audio file not found: ${audio}`);
  process.exit(1);
}
const probe = ff("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", video]);
const dur = Number(String(probe.stdout).trim());
const offset = Number(get("offset", "0"));
const fin = Number(get("fade-in", "1.5"));
const fout = Number(get("fade-out", "4"));
const gain = Number(get("gain", "0"));
const af = [
  `atrim=start=${offset}`,
  "asetpts=PTS-STARTPTS",
  `afade=t=in:st=0:d=${fin}`,
  `afade=t=out:st=${Math.max(0, dur - fout)}:d=${fout}`,
  `volume=${gain}dB`,
  "apad",
].join(",");
const r = ff("ffmpeg", [
  "-y", "-loglevel", "error", "-i", video, "-i", audio,
  "-map", "0:v:0", "-map", "1:a:0", "-c:v", "copy",
  "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-ac", "2",
  "-t", String(dur), "-movflags", "+faststart", out,
], { stdio: "inherit" });
if (r.status !== 0) process.exit(r.status ?? 1);
console.log(`✓ ${out}  (video copied bit-exact, AAC stereo 48 kHz, ${dur.toFixed(2)} s). Keep this file LOCAL.`);
