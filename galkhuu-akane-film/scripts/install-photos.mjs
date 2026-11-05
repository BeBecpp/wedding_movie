#!/usr/bin/env node
/**
 * Swap placeholders for real photos in ONE command.
 *
 * 1. Put originals in photos-inbox/ named after their slot, e.g.
 *      photos-inbox/COUPLE_HERO_01.jpg   photos-inbox/akane_portrait_01.png
 *    (anything after the slot name is ignored: "COUPLE_HERO_01 beach.jpg" works)
 * 2. npm run photos            (add --dry-run to preview, --reset to go back to placeholders)
 *
 * Each photo is auto-rotated from its EXIF orientation, resized to ≤2560 px,
 * re-encoded as JPEG and STRIPPED of all metadata (GPS, camera, dates), then
 * written to public/assets/photos/<SLOT>.jpg and registered in
 * assets/photo-manifest.json (src, width, height, orientation, enabled).
 * Focal points / crop modes you already set are kept.
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const INBOX = "photos-inbox";
const OUT = "public/assets/photos";
const MANIFEST = "assets/photo-manifest.json";
const dry = process.argv.includes("--dry-run");
const reset = process.argv.includes("--reset");

const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
const slots = manifest.photos.map((p) => p.slot).sort((a, b) => b.length - a.length);

if (reset) {
  for (const p of manifest.photos) Object.assign(p, { src: null, width: null, height: null });
  if (!dry) fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
  console.log("Manifest reset: every slot back to its placeholder (files in public/assets/photos were not deleted).");
  process.exit(0);
}

fs.mkdirSync(INBOX, { recursive: true });
fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(INBOX).filter((f) => /\.(jpe?g|png|webp|tiff?|heic|heif|avif)$/i.test(f));
if (!files.length) {
  console.log(`No photos found in ${INBOX}/. Name files after slots, e.g. COUPLE_HERO_01.jpg (see assets/photo-manifest.json).`);
  process.exit(0);
}

const unmatched = [];
let done = 0;
for (const f of files) {
  const stem = path.parse(f).name.toUpperCase().replace(/[\s-]+/g, "_");
  const slot = slots.find((s) => stem === s || stem.startsWith(s + "_") || stem.startsWith(s));
  if (!slot) {
    unmatched.push(f);
    continue;
  }
  const entry = manifest.photos.find((p) => p.slot === slot);
  const rel = `assets/photos/${slot}.jpg`;
  try {
    const pipeline = sharp(path.join(INBOX, f), { failOn: "none" })
      .rotate() // honour EXIF orientation, then drop it
      .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90, mozjpeg: true }); // no withMetadata() => all EXIF/GPS removed
    const { data, info } = await pipeline.toBuffer({ resolveWithObject: true });
    const ratio = info.width / info.height;
    const orientation = ratio < 0.92 ? "portrait" : ratio > 1.08 ? "landscape" : "square";
    if (!dry) {
      fs.writeFileSync(path.join("public", rel), data);
      Object.assign(entry, { src: rel, width: info.width, height: info.height, orientation, enabled: true });
    }
    done++;
    const small = Math.max(info.width, info.height) < 1600 ? "  ⚠ low resolution" : "";
    console.log(`✓ ${f.padEnd(36)} → ${slot.padEnd(22)} ${info.width}x${info.height} ${orientation}${small}`);
  } catch (e) {
    console.log(`✗ ${f}: ${e.message}${/heic|heif/i.test(f) ? " (export HEIC as JPEG first)" : ""}`);
  }
}
if (!dry) fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + "\n");
console.log(`\n${done} photo(s) ${dry ? "would be " : ""}installed.`);
if (unmatched.length) console.log(`Not matched to a slot (rename them): ${unmatched.join(", ")}`);
console.log("Next: adjust focalX/focalY in assets/photo-manifest.json if a face is near an edge, then `npm run check:photos`.");
