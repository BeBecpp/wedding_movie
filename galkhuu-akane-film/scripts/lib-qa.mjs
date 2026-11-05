import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { build } from "esbuild";

/** Bundle the pure TS config modules so Node scripts share the exact same logic as the films. */
export const loadQa = async () => {
  const outfile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "ga-qa-")), "qa.mjs");
  await build({
    entryPoints: [path.resolve("scripts/qa-entry.ts")],
    bundle: true,
    platform: "node",
    format: "esm",
    outfile,
    logLevel: "error",
  });
  return import(outfile);
};

export const listPublicFiles = (dir = "public") => {
  const out = new Set();
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else out.add(path.relative(dir, p).split(path.sep).join("/"));
    }
  };
  if (fs.existsSync(dir)) walk(dir);
  return out;
};

export const tc = (frames, fps = 30) => {
  const s = frames / fps;
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`;
};
