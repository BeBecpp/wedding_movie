import React from "react";
import { AbsoluteFill } from "remotion";
import type { TimelineEntry } from "../config/storyboard";

export type SceneProps = { entry: TimelineEntry };

export const Scrim: React.FC<{ pos: "top" | "bottom"; opacity: number; height?: string }> = ({ pos, opacity, height = "52%" }) =>
  opacity <= 0.001 ? null : (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          [pos]: 0,
          height,
          opacity,
          background: `linear-gradient(${pos === "bottom" ? "to top" : "to bottom"}, rgba(46,38,31,0.62) 0%, rgba(46,38,31,0.32) 45%, rgba(46,38,31,0) 100%)`,
        }}
      />
    </AbsoluteFill>
  );

export const Vignette: React.FC<{ amount: number }> = ({ amount }) =>
  amount <= 0 ? null : (
    <AbsoluteFill
      style={{ pointerEvents: "none", background: `radial-gradient(ellipse 78% 72% at 50% 46%, rgba(62,52,44,0) 55%, rgba(62,52,44,${amount}) 100%)` }}
    />
  );

/** Warm light that slowly rises over a shot — the "emotional lift". */
export const Lift: React.FC<{ p: number }> = ({ p }) =>
  p <= 0 ? null : (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        mixBlendMode: "screen",
        opacity: p,
        background: "radial-gradient(ellipse 70% 60% at 30% 18%, rgba(255,236,206,0.38) 0%, rgba(255,236,206,0) 70%)",
      }}
    />
  );

/** Thin offset gold keyline used behind editorial prints. */
export const Keyline: React.FC<{ x: number; y: number; w: number; h: number; opacity?: number }> = ({ x, y, w, h, opacity = 0.6 }) => (
  <div style={{ position: "absolute", left: x, top: y, width: w, height: h, border: "1.2px solid #B78C57", opacity, pointerEvents: "none" }} />
);
