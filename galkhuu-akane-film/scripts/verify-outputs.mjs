#!/usr/bin/env node
/**
 * Verifies rendered files with ffprobe/ffmpeg (no assumptions):
 *  - duration, frame count, fps, size, codec, pixel format, audio streams
 *  - opening film: first frame is not black; final 4 s are stable
 *  - guest loop: SSIM of the seam (last frame -> first frame) vs. a normal
 *    frame-to-frame step inside the loop
 * Writes out/verification.json.
 */
import fs from "node:fs";
import path from "node:path";
import { ff } from "./lib-ff.mjs";

const tmp = "out/tmp/verify";
fs.mkdirSync(tmp, { recursive: true });

const probe = (file) => {
  const r = ff("ffprobe", ["-v", "error", "-count_frames", "-show_streams", "-show_format", "-of", "json", file]);
  return JSON.parse(r.stdout);
};
const frameAt = (file, n, name) => {
  const out = path.join(tmp, name);
  ff("ffmpeg", ["-y", "-loglevel", "error", "-i", file, "-vf", `select=eq(n\\,${n})`, "-vsync", "0", "-frames:v", "1", out]);
  return out;
};
const ssim = (a, b) => {
  const r = ff("ffmpeg", ["-i", a, "-i", b, "-lavfi", "ssim", "-f", "null", "-"]);
  const m = /All:([0-9.]+)/.exec(r.stderr);
  return m ? Number(m[1]) : null;
};
const meanLuma = (img) => {
  const r = ff("ffmpeg", ["-i", img, "-vf", "signalstats,metadata=print:key=lavfi.signalstats.YAVG", "-f", "null", "-"]);
  const m = /YAVG=([0-9.]+)/.exec(r.stderr);
  return m ? Number(m[1]) : null;
};

const expected = [
  { file: "out/WeddingOpeningFilm_1080p_silent.mp4", frames: 2400, w: 1920, h: 1080 },
  { file: "out/WeddingGuestLoop_1080p_silent.mp4", frames: 7200, w: 1920, h: 1080, loop: true },
  { file: "out/WeddingOpeningFilm_720p_silent.mp4", frames: 2400, w: 1280, h: 720 },
  { file: "out/WeddingGuestLoop_720p_silent.mp4", frames: 7200, w: 1280, h: 720, loop: true },
];

const results = [];
for (const exp of expected) {
  if (!fs.existsSync(exp.file)) {
    results.push({ file: exp.file, status: "MISSING" });
    continue;
  }
  const p = probe(exp.file);
  const v = p.streams.find((s) => s.codec_type === "video");
  const audio = p.streams.filter((s) => s.codec_type === "audio").length;
  const [num, den] = v.r_frame_rate.split("/").map(Number);
  const r = {
    file: exp.file,
    sizeMB: +(Number(p.format.size) / 1e6).toFixed(1),
    duration: +Number(p.format.duration).toFixed(3),
    frames: Number(v.nb_read_frames),
    fps: num / den,
    width: v.width,
    height: v.height,
    codec: v.codec_name,
    profile: v.profile,
    pix_fmt: v.pix_fmt,
    color: `${v.color_space}/${v.color_range}`,
    bitrateMbps: +(Number(p.format.bit_rate) / 1e6).toFixed(2),
    audioStreams: audio,
  };
  const ok =
    r.frames === exp.frames && r.fps === 30 && r.width === exp.w && r.height === exp.h && r.codec === "h264" && r.pix_fmt === "yuv420p" && audio === 0;
  const base = path.basename(exp.file, ".mp4");
  if (exp.loop) {
    const last = frameAt(exp.file, exp.frames - 1, `${base}_last.png`);
    const first = frameAt(exp.file, 0, `${base}_first.png`);
    const prev = frameAt(exp.file, exp.frames - 2, `${base}_prev.png`);
    r.seamSSIM_last_to_first = ssim(last, first);
    r.normalStepSSIM = ssim(prev, last);
    r.seamPass = r.seamSSIM_last_to_first != null && r.seamSSIM_last_to_first >= Math.min(0.985, r.normalStepSSIM - 0.01);
  } else {
    const first = frameAt(exp.file, 0, `${base}_first.png`);
    r.firstFrameLuma = meanLuma(first);
    r.firstFrameNotBlack = r.firstFrameLuma != null && r.firstFrameLuma > 120;
    const holdA = frameAt(exp.file, exp.frames - 120, `${base}_hold_start.png`);
    const holdB = frameAt(exp.file, exp.frames - 1, `${base}_hold_end.png`);
    r.finalHoldSSIM_4s = ssim(holdA, holdB);
  }
  r.status = ok && (r.seamPass ?? true) && (r.firstFrameNotBlack ?? true) ? "PASS" : "CHECK";
  results.push(r);
}
fs.writeFileSync("out/verification.json", JSON.stringify(results, null, 2) + "\n");
console.table(results.map(({ file, status, sizeMB, duration, frames, fps, width, height, pix_fmt, audioStreams }) => ({ file: path.basename(file), status, sizeMB, duration, frames, fps, size: `${width}x${height}`, pix_fmt, audioStreams })));
for (const r of results) {
  if (r.seamSSIM_last_to_first != null) console.log(`${path.basename(r.file)}: seam SSIM ${r.seamSSIM_last_to_first} (normal step ${r.normalStepSSIM}) -> ${r.seamPass ? "PASS" : "CHECK"}`);
  if (r.firstFrameLuma != null) console.log(`${path.basename(r.file)}: first-frame mean luma ${r.firstFrameLuma} (not black: ${r.firstFrameNotBlack}); final-hold SSIM over last 4 s ${r.finalHoldSSIM_4s}`);
}
