#!/usr/bin/env node
/**
 * Photo QA: shows exactly which photo appears where in both films, which
 * slots are still placeholders / borrowed, and warns about quick repeats,
 * missing files, low resolution and disabled slots.
 *   npm run check:photos            (summary)
 *   npm run check:photos -- --full  (every shot)
 */
import fs from "node:fs";
import { loadQa, listPublicFiles, tc } from "./lib-qa.mjs";

const full = process.argv.includes("--full");
const qa = await loadQa();
const raw = JSON.parse(fs.readFileSync("assets/photo-manifest.json", "utf8"));
const { manifest, warnings } = qa.validateManifest(raw);
const files = listPublicFiles();
let problems = 0;

console.log("\nGALKHUU & AKANE — photo check\n" + "=".repeat(40));
warnings.forEach((w) => console.log("⚠ manifest:", w));
for (const p of manifest.photos) {
  if (p.src && !files.has(p.src)) {
    console.log(`⚠ ${p.slot}: public/${p.src} does not exist`);
    problems++;
  }
  if (p.src && files.has(p.src) && p.width && p.height && Math.max(p.width, p.height) < 1600) {
    console.log(`⚠ ${p.slot}: only ${p.width}x${p.height}px — may look soft at 1080p (≥1920 px long edge recommended)`);
  }
}
const real = manifest.photos.filter((p) => qa.isReal(p, files));
console.log(`\nReal photos: ${real.length} / ${manifest.photos.length} slots   (disabled: ${manifest.photos.filter((p) => !p.enabled).map((p) => p.slot).join(", ") || "none"})`);
if (!real.length) console.log("→ REVIEW MODE: every slot renders its labelled placeholder.");

for (const [name, shots, total, loop] of [
  ["WeddingOpeningFilm", qa.openingShots, qa.OPENING_FRAMES, false],
  ["WeddingGuestLoop", qa.loopShots, qa.LOOP_FRAMES, true],
]) {
  const { entries } = qa.buildTimeline(shots, total);
  const { casting } = qa.castTimeline(manifest, files, entries.map((e) => ({ id: e.shot.id, start: e.start, uses: e.shot.slots })), loop ? total : undefined);
  console.log(`\n${name}  (${tc(total)}, ${entries.length} shots)`);
  const lastSeen = new Map();
  let borrowed = 0;
  for (const e of entries) {
    const res = casting[e.shot.id] ?? [];
    const desc = res
      .map((r, i) => {
        const want = e.shot.slots[i].slot;
        if (!r) return `${want} (dropped)`;
        if (r.borrowed) borrowed++;
        return r.borrowed ? `${want} ← ${r.entry.slot}${r.real ? "" : " [placeholder]"}` : `${want}${r.real ? " ✓" : " [placeholder]"}`;
      })
      .join(" | ");
    if (full) console.log(`  ${tc(e.start)}  ${e.shot.id.padEnd(22)} ${desc || "(no photo)"}`);
    for (const r of res) {
      if (!r) continue;
      const prev = lastSeen.get(r.entry.slot);
      const gap = prev == null ? Infinity : (e.start - prev) / 30;
      if (gap < 20 && !e.shot.opts?.intentionalRepeat) {
        console.log(`  ⚠ ${r.entry.slot} repeats after only ${gap.toFixed(1)} s (at ${tc(e.start)}, ${e.shot.id}) — add more photos to fix`);
        problems++;
      }
      lastSeen.set(r.entry.slot, e.start);
    }
  }
  console.log(`  borrowed slots: ${borrowed}${full ? "" : "   (use --full for the shot-by-shot table)"}`);
}
console.log(problems ? `\n${problems} warning(s).` : "\nNo blocking problems.");
