/**
 * Photographic camera moves (Ken Burns). Scale stays within 1.00–1.07 and
 * translation never exceeds the scale overscan, so no image edge ever shows.
 */
import React from "react";
import { Easing, interpolate } from "remotion";
import type { CamPreset } from "../config/storyboard";

type Pose = { s: number; x: number; y: number }; // x/y in % of the box
const P: Record<CamPreset, [Pose, Pose]> = {
  pushIn: [{ s: 1.0, x: 0, y: 0 }, { s: 1.055, x: 0, y: 0 }],
  pushInSlow: [{ s: 1.005, x: 0, y: 0 }, { s: 1.04, x: 0, y: 0 }],
  pushInDeep: [{ s: 1.0, x: 0, y: 0 }, { s: 1.07, x: 0, y: -0.4 }],
  pullOut: [{ s: 1.065, x: 0, y: 0 }, { s: 1.01, x: 0, y: 0 }],
  panLeft: [{ s: 1.06, x: 1.9, y: 0 }, { s: 1.06, x: -1.9, y: 0 }],
  panRight: [{ s: 1.06, x: -1.9, y: 0 }, { s: 1.06, x: 1.9, y: 0 }],
  rise: [{ s: 1.06, x: 0, y: 1.6 }, { s: 1.06, x: 0, y: -1.6 }],
  sink: [{ s: 1.06, x: 0, y: -1.6 }, { s: 1.06, x: 0, y: 1.6 }],
  driftLeft: [{ s: 1.02, x: 0.9, y: 0 }, { s: 1.06, x: -1.2, y: 0 }],
  driftRight: [{ s: 1.02, x: -0.9, y: 0 }, { s: 1.06, x: 1.2, y: 0 }],
  still: [{ s: 1.0, x: 0, y: 0 }, { s: 1.0, x: 0, y: 0 }],
};

const camEase = Easing.bezier(0.32, 0.08, 0.68, 0.92);

export const cameraTransform = (
  preset: CamPreset | undefined,
  t: number,
  duration: number,
): { transform: string; scale: number } => {
  const [a, b] = P[preset ?? "pushInSlow"];
  const p = interpolate(t, [0, Math.max(1, duration)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: camEase,
  });
  const s = a.s + (b.s - a.s) * p;
  const lim = Math.max(0, (s - 1) * 50 - 0.15);
  const x = Math.max(-lim, Math.min(lim, a.x + (b.x - a.x) * p));
  const y = Math.max(-lim, Math.min(lim, a.y + (b.y - a.y) * p));
  return { transform: `translate(${x.toFixed(4)}%, ${y.toFixed(4)}%) scale(${s.toFixed(5)})`, scale: s };
};

/** Wraps arbitrary content in a camera move whose scale origin is the focal point. */
export const SoftCamera: React.FC<{
  preset?: CamPreset;
  t: number;
  duration: number;
  focalX?: number;
  focalY?: number;
  children: React.ReactNode;
}> = ({ preset, t, duration, focalX = 0.5, focalY = 0.45, children }) => {
  const { transform } = cameraTransform(preset, t, duration);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform,
        transformOrigin: `${focalX * 100}% ${focalY * 100}%`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
};
