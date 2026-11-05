#!/usr/bin/env node
/**
 * Bundles the project once and renders review stills.
 *   node scripts/render-stills.mjs                 -> default review set into out/stills/
 *   node scripts/render-stills.mjs Comp:frame ...  -> specific frames
 *   --scale=0.5  --out=dir
 */
import path from "node:path";
import fs from "node:fs";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const args = process.argv.slice(2);
const opt = (k, d) => (args.find((a) => a.startsWith(`--${k}=`)) ?? `=${d}`).split("=")[1];
const scale = Number(opt("scale", "1"));
const outDir = path.resolve(opt("out", "out/stills"));
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;

const DEFAULT = [
  ["WeddingOpeningFilm", 100, "01_opening_00m03s_day-begins"],
  ["WeddingOpeningFilm", 300, "02_opening_00m10s_meet-galkhuu"],
  ["WeddingOpeningFilm", 420, "03_opening_00m14s_meet-akane"],
  ["WeddingOpeningFilm", 640, "04_opening_00m21s_two-people"],
  ["WeddingOpeningFilm", 1190, "05_opening_00m40s_reaction-edit"],
  ["WeddingOpeningFilm", 1480, "06_opening_00m49s_details-collage"],
  ["WeddingOpeningFilm", 2000, "07_opening_01m07s_hero"],
  ["WeddingOpeningFilm", 2399, "08_opening_01m20s_end-card-final-frame"],
  ["WeddingGuestLoop", 0, "09_loop_00m00s_welcome-first-frame"],
  ["WeddingGuestLoop", 7199, "10_loop_04m00s_last-frame"],
  ["WeddingGuestLoop", 1080, "11_loop_00m36s_portrait-split"],
  ["WeddingGuestLoop", 4980, "12_loop_02m46s_details"],
  ["WeddingGuestLoop", 6600, "13_loop_03m40s_thank-you"],
  ["WelcomeStill", 0, "14_emergency_welcome_card"],
];

const jobs = args.filter((a) => !a.startsWith("--")).map((a) => {
  const [comp, frame] = a.split(":");
  return [comp, Number(frame), `${comp}_${frame}`];
});
const list = jobs.length ? jobs : DEFAULT;

fs.mkdirSync(outDir, { recursive: true });
console.log("Bundling…");
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const cache = {};
for (const [id, frame, name] of list) {
  cache[id] ??= await selectComposition({ serveUrl, id, browserExecutable });
  const output = path.join(outDir, `${name}.png`);
  const t0 = Date.now();
  await renderStill({ composition: cache[id], serveUrl, frame, output, scale, imageFormat: "png", browserExecutable, overwrite: true });
  console.log(`✓ ${output}  (${Date.now() - t0} ms)`);
}
