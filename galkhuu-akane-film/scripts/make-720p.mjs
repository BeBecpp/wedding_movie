#!/usr/bin/env node
/** Lighter 1280x720 copies of the silent masters for Zoom / low-bandwidth playback. */
import fs from "node:fs";
import { ff } from "./lib-ff.mjs";

for (const name of ["WeddingOpeningFilm", "WeddingGuestLoop"]) {
  const src = `out/${name}_1080p_silent.mp4`;
  const dst = `out/${name}_720p_silent.mp4`;
  if (!fs.existsSync(src)) {
    console.log(`skip ${name}: ${src} not rendered yet`);
    continue;
  }
  const t0 = Date.now();
  const r = ff("ffmpeg", [
    "-y", "-loglevel", "error", "-i", src,
    "-vf", "scale=1280:720:flags=lanczos",
    "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709", "-color_range", "tv",
    "-movflags", "+faststart", "-an", dst,
  ], { stdio: "inherit" });
  console.log(r.status === 0 ? `✓ ${dst} (${((Date.now() - t0) / 1000).toFixed(0)} s)` : `✗ ${dst} failed`);
}
