/**
 * Warm ivory atmosphere: paper gradient, slow light blooms and a fine,
 * deterministic paper grain (generated procedurally — no image assets).
 */
import React, { useState } from "react";
import { AbsoluteFill, random } from "remotion";
import { colors } from "../config/design";

let grainCache: string | null = null;
const makeGrain = () => {
  if (grainCache) return grainCache;
  if (typeof document === "undefined") return "";
  const c = document.createElement("canvas");
  c.width = 192;
  c.height = 192;
  const ctx = c.getContext("2d");
  if (!ctx) return "";
  const img = ctx.createImageData(192, 192);
  for (let i = 0; i < 192 * 192; i++) {
    const v = Math.floor(random(`grain-${i}`) * 255);
    img.data[i * 4] = v;
    img.data[i * 4 + 1] = v;
    img.data[i * 4 + 2] = v;
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  grainCache = c.toDataURL("image/png");
  return grainCache;
};

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.045 }) => {
  const [src] = useState(makeGrain);
  if (!src) return null;
  return (
    <AbsoluteFill
      style={{ backgroundImage: `url(${src})`, backgroundSize: "192px 192px", opacity, mixBlendMode: "multiply", pointerEvents: "none" }}
    />
  );
};

/** Base paper background. `t` drives very slow light drift (periods divide 7200). */
export const IvoryBackground: React.FC<{ t?: number; warmth?: number; children?: React.ReactNode }> = ({
  t = 0,
  warmth = 1,
  children,
}) => {
  const a = Math.sin((t / 1800) * Math.PI * 2);
  const b = Math.cos((t / 2400) * Math.PI * 2);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(168deg, ${colors.paper} 0%, ${colors.ivory} 46%, ${colors.ivoryDeep} 100%)` }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 60% at ${18 + a * 4}% ${92 + b * 3}%, rgba(232,215,192,${0.55 * warmth}) 0%, rgba(232,215,192,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 55% 50% at ${86 - b * 4}% ${10 + a * 3}%, rgba(185,194,174,${0.2 * warmth}) 0%, rgba(185,194,174,0) 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 45% 40% at ${60 + a * 6}% ${38 + b * 4}%, rgba(255,253,248,0.65) 0%, rgba(255,253,248,0) 70%)`,
        }}
      />
      {children}
      <Grain />
    </AbsoluteFill>
  );
};

/** Soft-focus warm light blooms for openings and transitions. */
export const LightBlooms: React.FC<{ t: number; intensity?: number }> = ({ t, intensity = 1 }) => {
  const blobs = [
    { x: 30, y: 30, r: 38, c: "255,250,240", P: 900 },
    { x: 72, y: 58, r: 44, c: "232,215,192", P: 1200 },
    { x: 48, y: 82, r: 30, c: "217,183,173", P: 1440 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {blobs.map((b, i) => {
        const ox = Math.sin((t / b.P) * Math.PI * 2 + i) * 5;
        const oy = Math.cos((t / b.P) * Math.PI * 2 + i * 2) * 4;
        return (
          <AbsoluteFill
            key={i}
            style={{
              background: `radial-gradient(circle ${Math.round(b.r * 19.2)}px at ${b.x + ox}% ${b.y + oy}%, rgba(${b.c},${0.5 * intensity}) 0%, rgba(${b.c},0) 72%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
