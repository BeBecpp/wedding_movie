/**
 * One photograph (or its placeholder) inside a box, with focal-point aware
 * cropping, a photographic camera move, optional blurred-copy backdrop for
 * mismatched orientations, and an optional duotone-to-colour bloom grade.
 * Faces are never distorted: only uniform scale + translate are used.
 */
import React from "react";
import { Img, interpolate, staticFile } from "remotion";
import type { Resolved } from "../config/casting";
import type { PhotoEntry } from "../config/manifest";
import type { CamPreset } from "../config/storyboard";
import { cameraTransform } from "./SoftCamera";
import { PhotoPlaceholder, PlaceholderWash } from "./PhotoPlaceholder";
import { colors, motion } from "../config/design";

export type Grade = "natural" | "duotoneBloom";

export const aspectOf = (e: PhotoEntry) =>
  e.width && e.height ? e.width / e.height : e.orientation === "portrait" ? 0.75 : e.orientation === "square" ? 1 : 1.5;

export const fitFor = (e: PhotoEntry, boxW: number, boxH: number, layoutFit: "auto" | "cover" | "contain" = "auto") => {
  if (e.cropMode !== "auto") return e.cropMode;
  if (layoutFit !== "auto") return layoutFit;
  const r = aspectOf(e) / (boxW / boxH);
  return r >= 0.7 && r <= 1.42 ? "cover" : "contain";
};

const gradeFilter = (grade: Grade | undefined, t: number) => {
  if (grade !== "duotoneBloom") return undefined;
  const p = interpolate(t, [12, 84], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeInOut });
  if (p >= 1) return undefined;
  return `grayscale(${(1 - p).toFixed(3)}) sepia(${(0.42 * (1 - p)).toFixed(3)}) brightness(${(1 + 0.04 * (1 - p)).toFixed(3)})`;
};

/** Photo content at full box size (cover). */
const Cover: React.FC<{ e: PhotoEntry; real: boolean; w: number; h: number; filter?: string }> = ({ e, real, w, h, filter }) =>
  real && e.src ? (
    <Img
      src={staticFile(e.src)}
      style={{ width: w, height: h, objectFit: "cover", objectPosition: `${e.focalX * 100}% ${e.focalY * 100}%`, display: "block", filter }}
    />
  ) : (
    <div style={{ position: "absolute", inset: 0, filter }}>
      <PhotoPlaceholder entry={e} width={w} height={h} />
    </div>
  );

/** Cheap, smooth blurred copy: blur a tiny render, then scale it up. */
export const BlurredCopy: React.FC<{ e: PhotoEntry; real: boolean; w: number; h: number; tint?: number }> = ({ e, real, w, h, tint = 0.22 }) => {
  const k = 12;
  const sw = Math.ceil(w / k) + 2;
  const sh = Math.ceil(h / k) + 2;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", left: -k, top: -k, width: sw, height: sh, transform: `scale(${k})`, transformOrigin: "0 0", filter: "blur(2.6px)" }}>
        {real && e.src ? (
          <Img src={staticFile(e.src)} style={{ width: sw, height: sh, objectFit: "cover", display: "block" }} />
        ) : (
          <PlaceholderWash slot={e.slot} />
        )}
      </div>
      <div style={{ position: "absolute", inset: 0, background: `rgba(248,244,236,${tint})` }} />
    </div>
  );
};

export const PhotoFrame: React.FC<{
  res: Resolved | null | undefined;
  width: number;
  height: number;
  t: number;
  camDur: number;
  cam?: CamPreset;
  fit?: "auto" | "cover" | "contain";
  grade?: Grade;
  style?: React.CSSProperties;
  /** extra shadow / keyline for contained "print" */
  printShadow?: boolean;
}> = ({ res, width, height, t, camDur, cam, fit = "auto", grade, style, printShadow = true }) => {
  if (!res) return null;
  const e = res.entry;
  const mode = fitFor(e, width, height, fit);
  const filter = gradeFilter(grade, t);
  const { transform } = cameraTransform(cam, t, camDur);
  const box: React.CSSProperties = { position: "relative", width, height, overflow: "hidden", ...style };

  if (mode === "cover") {
    return (
      <div style={box}>
        <div style={{ position: "absolute", inset: 0, transform, transformOrigin: `${e.focalX * 100}% ${e.focalY * 100}%` }}>
          <Cover e={e} real={res.real} w={width} h={height} filter={filter} />
        </div>
      </div>
    );
  }

  // contain: whole photo visible over a blurred copy of itself
  const a = aspectOf(e);
  const pad = 0.08;
  let cw = width * (1 - pad);
  let ch = cw / a;
  if (ch > height * (1 - pad)) {
    ch = height * (1 - pad);
    cw = ch * a;
  }
  // backdrop drifts opposite to the card for gentle depth
  const back = cameraTransform(cam === "still" ? "still" : "pullOut", t, camDur);
  return (
    <div style={{ ...box, background: colors.ivory }}>
      <div style={{ position: "absolute", inset: 0, transform: back.transform }}>
        <BlurredCopy e={e} real={res.real} w={width} h={height} />
      </div>
      <div
        style={{
          position: "absolute",
          left: (width - cw) / 2,
          top: (height - ch) / 2,
          width: cw,
          height: ch,
          transform: cameraTransform(cam, t, camDur).transform.replace(/translate\([^)]*\)\s*/, ""),
          boxShadow: printShadow ? "0 18px 50px rgba(62,52,44,0.22), 0 2px 8px rgba(62,52,44,0.12)" : undefined,
          overflow: "hidden",
        }}
      >
        <Cover e={e} real={res.real} w={cw} h={ch} filter={filter} />
      </div>
    </div>
  );
};
