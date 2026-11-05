/**
 * Original hand-built SVG line art: cherry-blossom branch, blossoms, leaves,
 * buds and a few drifting petals. Thin gold line work with a whisper of rose.
 * Never placed over faces — callers position it in negative space.
 */
import React, { useMemo } from "react";
import { interpolate, random } from "remotion";
import { colors, motion } from "../config/design";

const PETAL =
  "M 0 0 C -0.42 -0.18, -0.64 -0.62, -0.33 -0.94 Q -0.16 -1.05, 0 -0.86 Q 0.16 -1.05, 0.33 -0.94 C 0.64 -0.62, 0.42 -0.18, 0 0 Z";

export const Blossom: React.FC<{
  x: number;
  y: number;
  r: number;
  rot?: number;
  open?: number; // 0..1
  stroke?: string;
  fill?: string;
  strokeWidth?: number;
}> = ({ x, y, r, rot = 0, open = 1, stroke = colors.gold, fill = colors.rose, strokeWidth = 1.3 }) => {
  if (open <= 0.001) return null;
  const s = 0.35 + 0.65 * open;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={Math.min(1, open * 1.6)}>
      {[0, 1, 2, 3, 4].map((k) => (
        <path
          key={k}
          d={PETAL}
          transform={`rotate(${k * 72 + (1 - open) * 18}) scale(${r * s})`}
          fill={fill}
          fillOpacity={0.22}
          stroke={stroke}
          strokeWidth={strokeWidth}
          vectorEffect="non-scaling-stroke"
          strokeLinejoin="round"
        />
      ))}
      {[...Array(7)].map((_, k) => {
        const a = ((k * 360) / 7 + 12) * (Math.PI / 180);
        const L = r * 0.42 * s;
        return (
          <g key={k}>
            <line x1={0} y1={0} x2={Math.cos(a) * L} y2={Math.sin(a) * L} stroke={stroke} strokeWidth={0.8} opacity={0.8} />
            <circle cx={Math.cos(a) * L} cy={Math.sin(a) * L} r={1.6} fill={stroke} opacity={0.85} />
          </g>
        );
      })}
      <circle r={r * 0.09} fill={stroke} opacity={0.7} />
    </g>
  );
};

const Leaf: React.FC<{ x: number; y: number; len: number; rot: number; p: number }> = ({ x, y, len, rot, p }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${len * (0.6 + 0.4 * p)})`} opacity={p}>
    <path
      d="M 0 0 C 0.3 -0.26, 0.74 -0.24, 1 0 C 0.74 0.24, 0.3 0.26, 0 0 Z"
      fill={colors.sage}
      fillOpacity={0.28}
      stroke={colors.gold}
      strokeWidth={1.1}
      vectorEffect="non-scaling-stroke"
    />
    <path d="M 0.04 0 L 0.9 0" stroke={colors.gold} strokeWidth={0.7} vectorEffect="non-scaling-stroke" opacity={0.7} />
  </g>
);

const Bud: React.FC<{ x: number; y: number; rot: number; p: number }> = ({ x, y, rot, p }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={p}>
    <ellipse rx={5.5} ry={8.5} fill={colors.rose} fillOpacity={0.35} stroke={colors.gold} strokeWidth={1.1} />
  </g>
);

const STEM = "M 640 30 C 560 44, 500 78, 452 124 C 404 170, 352 196, 286 210 C 226 223, 170 246, 120 292";
const TWIGS = [
  { d: "M 452 124 C 462 168, 478 200, 506 232", at: 0.28 },
  { d: "M 360 190 C 338 156, 326 124, 330 86", at: 0.42 },
  { d: "M 230 222 C 214 252, 208 282, 216 316", at: 0.58 },
  { d: "M 560 50 C 566 80, 580 100, 604 116", at: 0.16 },
];
const BLOSSOMS = [
  { x: 506, y: 236, r: 25, rot: 10, at: 0.5 },
  { x: 330, y: 82, r: 23, rot: -15, at: 0.62 },
  { x: 216, y: 322, r: 18, rot: 20, at: 0.74 },
  { x: 116, y: 298, r: 21, rot: 5, at: 0.84 },
  { x: 606, y: 120, r: 16, rot: 30, at: 0.4 },
  { x: 404, y: 154, r: 12, rot: 40, at: 0.56 },
];
const LEAVES = [
  { x: 452, y: 124, len: 48, rot: 200, at: 0.3 },
  { x: 360, y: 190, len: 40, rot: 120, at: 0.45 },
  { x: 230, y: 222, len: 38, rot: 160, at: 0.6 },
  { x: 540, y: 58, len: 34, rot: 250, at: 0.2 },
];
const BUDS = [
  { x: 286, y: 204, rot: -70, at: 0.66 },
  { x: 168, y: 240, rot: -55, at: 0.8 },
  { x: 474, y: 172, rot: 30, at: 0.48 },
];

/**
 * A blossom branch that grows from a frame corner.
 * `grow` 0..1 draws the line work; `t` drives a very slow sway.
 */
export const BlossomBranch: React.FC<{
  corner: "topRight" | "topLeft" | "bottomLeft" | "bottomRight";
  grow: number;
  t: number;
  width?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ corner, grow, t, width = 640, opacity = 1, style }) => {
  const h = (width * 420) / 640;
  const flipX = corner === "topLeft" || corner === "bottomLeft";
  const flipY = corner === "bottomLeft" || corner === "bottomRight";
  const sway = Math.sin((t / 300) * Math.PI * 2) * 0.7 + Math.sin((t / 720) * Math.PI * 2) * 0.5;
  const seg = (at: number, span = 0.22) =>
    interpolate(grow, [at, at + span], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.ease });
  const pos: React.CSSProperties = {
    position: "absolute",
    width,
    height: h,
    [flipX ? "left" : "right"]: 0,
    [flipY ? "bottom" : "top"]: 0,
    transform: `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`,
    opacity,
    pointerEvents: "none",
    ...style,
  };
  const stemP = seg(0, 0.55);
  return (
    <div style={pos}>
      <svg viewBox="0 0 640 420" width={width} height={h} style={{ overflow: "visible" }}>
        <g transform={`rotate(${sway} 640 0)`}>
          <path d={STEM} pathLength={1} fill="none" stroke={colors.gold} strokeWidth={1.6} strokeLinecap="round"
            strokeDasharray={1} strokeDashoffset={1 - stemP} />
          {TWIGS.map((tw, i) => (
            <path key={i} d={tw.d} pathLength={1} fill="none" stroke={colors.gold} strokeWidth={1.2} strokeLinecap="round"
              strokeDasharray={1} strokeDashoffset={1 - seg(tw.at, 0.2)} />
          ))}
          {LEAVES.map((l, i) => <Leaf key={i} {...l} p={seg(l.at)} />)}
          {BUDS.map((b, i) => <Bud key={i} {...b} p={seg(b.at, 0.15)} />)}
          {BLOSSOMS.map((b, i) => <Blossom key={i} {...b} open={seg(b.at, 0.25)} />)}
        </g>
      </svg>
    </div>
  );
};

const PETAL_SHAPE = "M 0 -1 C 0.72 -0.88, 0.78 0.42, 0 1 C -0.78 0.42, -0.72 -0.88, -0.14 -1 L 0 -0.8 Z";
const PERIODS = [720, 900, 1200, 1440, 1800]; // all divide 7200 -> loop-safe

/**
 * A handful of slow petals drifting inside a rectangular region (clipped), so
 * they never wander across a face.
 */
export const DriftingPetals: React.FC<{
  t: number;
  count?: number;
  region: { x: number; y: number; w: number; h: number };
  seed?: string;
  opacity?: number;
  size?: number;
}> = ({ t, count = 7, region, seed = "petals", opacity = 0.75, size = 13 }) => {
  const petals = useMemo(
    () =>
      [...Array(count)].map((_, i) => ({
        x0: random(`${seed}-x-${i}`),
        ph: random(`${seed}-p-${i}`),
        P: PERIODS[Math.floor(random(`${seed}-P-${i}`) * PERIODS.length)],
        amp: 18 + random(`${seed}-a-${i}`) * 34,
        drift: 60 + random(`${seed}-d-${i}`) * 120,
        rot0: random(`${seed}-r-${i}`) * 360,
        sz: size * (0.7 + random(`${seed}-s-${i}`) * 0.6),
        spin: random(`${seed}-sp-${i}`) > 0.5 ? 1 : -1,
      })),
    [count, seed, size],
  );
  return (
    <div style={{ position: "absolute", left: region.x, top: region.y, width: region.w, height: region.h, overflow: "hidden", pointerEvents: "none" }}>
      <svg width={region.w} height={region.h}>
        {petals.map((p, i) => {
          const f = (((t + p.ph * p.P) % p.P) + p.P) % p.P / p.P; // 0..1 fall progress
          const y = -30 + f * (region.h + 60);
          const x = p.x0 * region.w + p.drift * f + Math.sin((t / (p.P / 4)) * Math.PI * 2 + p.ph * 6) * p.amp;
          const rot = p.rot0 + p.spin * f * 360;
          const flutter = 0.35 + 0.65 * Math.abs(Math.cos((t / (p.P / 8)) * Math.PI * 2 + p.ph * 3));
          const edge = Math.min(1, f / 0.12, (1 - f) / 0.12);
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${p.sz * flutter} ${p.sz})`} opacity={opacity * Math.max(0, edge)}>
              <path d={PETAL_SHAPE} fill={colors.rose} fillOpacity={0.75} stroke={colors.gold} strokeOpacity={0.35} strokeWidth={0.6} vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
