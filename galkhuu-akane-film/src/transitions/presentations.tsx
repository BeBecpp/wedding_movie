/**
 * Bespoke transition presentations for @remotion/transitions.
 * Each one is gentle and photographic; none flash or bounce.
 */
import React from "react";
import { AbsoluteFill, Easing } from "remotion";
import { fade } from "@remotion/transitions/fade";
import { linearTiming } from "@remotion/transitions";
import type { TransitionPresentation, TransitionPresentationComponentProps } from "@remotion/transitions";
import type { TransitionSpec } from "../config/storyboard";

type Empty = Record<string, never>;

/** Dissolve with a warm light bloom peaking mid-way. */
const BloomPresentation: React.FC<TransitionPresentationComponentProps<Empty>> = ({ children, presentationDirection, presentationProgress: p }) => {
  const entering = presentationDirection === "entering";
  const glow = 0.42 * Math.pow(Math.sin(Math.PI * p), 1.4);
  return (
    <AbsoluteFill style={{ opacity: entering ? p : 1 }}>
      <AbsoluteFill style={{ transform: entering ? `scale(${1.012 - 0.012 * p})` : undefined }}>{children}</AbsoluteFill>
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 85% 75% at 55% 42%, rgba(255,251,242,1) 0%, rgba(248,236,214,0.85) 45%, rgba(232,215,192,0.4) 100%)",
          opacity: glow,
        }}
      />
    </AbsoluteFill>
  );
};
export const bloom = (): TransitionPresentation<Empty> => ({ component: BloomPresentation, props: {} as Empty });

type Dir = { dir: "left" | "right" | "up" | "down"; feather: number; rise: boolean };

/** Feathered directional reveal (veil = vertical rise). */
const WipePresentation: React.FC<TransitionPresentationComponentProps<Dir>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const { dir, feather, rise } = passedProps;
  const to = { left: "to left", right: "to right", up: "to top", down: "to bottom" }[dir];
  // edge position travels from -feather to 100 so the reveal starts and ends clean
  const edge = -feather + p * (100 + feather);
  const mask = `linear-gradient(${to}, black ${edge.toFixed(2)}%, transparent ${(edge + feather).toFixed(2)}%)`;
  const shift = rise ? (1 - p) * (dir === "up" ? 2.2 : dir === "down" ? -2.2 : 0) : 0;
  return (
    <AbsoluteFill style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <AbsoluteFill style={{ transform: shift ? `translateY(${shift}%)` : undefined }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
export const wipe = (dir: Dir["dir"], feather = 26, rise = false): TransitionPresentation<Dir> => ({
  component: WipePresentation,
  props: { dir, feather, rise },
});

type DriftP = { dir: "left" | "right" };
/** Parallax dissolve: incoming drifts in a little, outgoing drifts away less. */
const DriftPresentation: React.FC<TransitionPresentationComponentProps<DriftP>> = ({ children, presentationDirection, presentationProgress: p, passedProps }) => {
  const sgn = passedProps.dir === "left" ? -1 : 1;
  const entering = presentationDirection === "entering";
  const x = entering ? sgn * -3.2 * (1 - p) : sgn * 1.4 * p;
  return <AbsoluteFill style={{ opacity: entering ? p : 1, transform: `translateX(${x.toFixed(3)}%)` }}>{children}</AbsoluteFill>;
};
export const drift = (dir: DriftP["dir"]): TransitionPresentation<DriftP> => ({ component: DriftPresentation, props: { dir } });

const ease = Easing.bezier(0.42, 0, 0.3, 1);

export const presentationFor = (t: TransitionSpec) => {
  switch (t.kind) {
    case "bloom":
      return bloom();
    case "veil":
      return wipe("up", 32, true);
    case "wipe":
      return wipe(t.dir ?? "right", 28);
    case "drift":
      return drift(t.dir === "right" ? "right" : "left");
    case "dissolve":
    default:
      return fade();
  }
};

export const timingFor = (frames: number) => linearTiming({ durationInFrames: frames, easing: ease });
