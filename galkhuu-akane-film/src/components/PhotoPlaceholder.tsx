/**
 * Procedural, clearly-labelled photo placeholder. Scenic abstract gradients,
 * framing guides and a "faces here" zone — never a fake person.
 */
import React from "react";
import { colors, fonts } from "../config/design";
import { categoryOf, PhotoEntry } from "../config/manifest";

const PALETTE = {
  GALKHUU: ["#E2E6D8", "#F5EEE2", colors.sage],
  AKANE: ["#F1DFD7", "#FAF2E9", colors.rose],
  COUPLE: ["#ECDCC5", "#FBF6EC", colors.gold],
  DETAIL: ["#F4EEE2", "#E3E8DA", colors.sage],
  FAMILY: ["#EEE3D0", "#E7EBDF", colors.champagne],
} as const;

const CATEGORY_LABEL = {
  GALKHUU: "Galkhuu",
  AKANE: "Akane",
  COUPLE: "The couple",
  DETAIL: "Wedding detail",
  FAMILY: "Family & friends",
} as const;

const titleOf = (slot: string) =>
  slot
    .replace(/^(GALKHUU|AKANE|COUPLE|DETAIL|FAMILY_OR_FRIENDS)_?/, "")
    .split("_")
    .map((w) => (/^\d+$/.test(w) ? w : w.charAt(0) + w.slice(1).toLowerCase()))
    .join(" ") || "Photo";

/** Gradient-only version (used as a blurred backdrop). */
export const PlaceholderWash: React.FC<{ slot: string }> = ({ slot }) => {
  const [a, b, acc] = PALETTE[categoryOf(slot)];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 60% 55% at 50% 30%, rgba(255,252,246,0.9) 0%, rgba(255,252,246,0) 70%), linear-gradient(165deg, ${a} 0%, ${b} 60%, ${acc}55 100%)`,
      }}
    />
  );
};

export const PhotoPlaceholder: React.FC<{ entry: PhotoEntry; width: number; height: number }> = ({ entry, width, height }) => {
  const cat = categoryOf(entry.slot);
  const [a, b, acc] = PALETTE[cat];
  const base = Math.min(width, height);
  const cx = entry.focalX * width;
  const cy = entry.focalY * height;
  const isCouple = cat === "COUPLE" || cat === "FAMILY";
  const isDetail = cat === "DETAIL";
  const faceR = base * (isDetail ? 0.16 : 0.105);
  const caps = Math.max(13, Math.min(30, base * 0.034));
  const title = Math.max(30, Math.min(104, base * 0.1));
  const small = Math.max(11, Math.min(19, base * 0.021));
  const labelTop = Math.min(width >= 1200 ? height * 0.57 : height * 0.86, cy + faceR * 1.55 + base * 0.08);
  const mark = Math.max(18, base * 0.05);
  const inset = Math.max(14, base * 0.04);

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: `linear-gradient(165deg, ${a} 0%, ${b} 58%, ${acc}44 100%)` }}>
      {/* soft light + scenic abstraction */}
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 50% at ${entry.focalX * 100}% ${Math.max(10, entry.focalY * 100 - 8)}%, rgba(255,252,246,0.95) 0%, rgba(255,252,246,0) 72%)` }} />
      <svg width={width} height={height} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id={`hill-${entry.slot}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={acc} stopOpacity="0.28" />
            <stop offset="1" stopColor={acc} stopOpacity="0.04" />
          </linearGradient>
        </defs>
        <path
          d={`M 0 ${height * 0.8} C ${width * 0.25} ${height * 0.7}, ${width * 0.45} ${height * 0.86}, ${width * 0.7} ${height * 0.76} S ${width} ${height * 0.74}, ${width} ${height * 0.74} L ${width} ${height} L 0 ${height} Z`}
          fill={`url(#hill-${entry.slot})`}
        />
        <path
          d={`M 0 ${height * 0.9} C ${width * 0.3} ${height * 0.82}, ${width * 0.6} ${height * 0.95}, ${width} ${height * 0.86} L ${width} ${height} L 0 ${height} Z`}
          fill={acc}
          fillOpacity={0.1}
        />
        {[...Array(7)].map((_, i) => (
          <circle
            key={i}
            cx={((i * 0.37 + 0.11) % 1) * width}
            cy={(((i * 0.53 + 0.2) % 0.6) + 0.06) * height}
            r={base * (0.03 + ((i * 0.29) % 1) * 0.05)}
            fill="#FFFCF6"
            opacity={0.32}
          />
        ))}
        {/* rule-of-thirds guides */}
        {[1, 2].map((k) => (
          <g key={k} stroke={colors.ink} strokeOpacity={0.07} strokeWidth={1}>
            <line x1={(width * k) / 3} y1={0} x2={(width * k) / 3} y2={height} />
            <line x1={0} y1={(height * k) / 3} x2={width} y2={(height * k) / 3} />
          </g>
        ))}
        {/* face / subject zone */}
        {(isCouple ? [-0.78, 0.78] : [0]).map((dx, i) => (
          <ellipse
            key={i}
            cx={cx + dx * faceR}
            cy={cy}
            rx={faceR * (isCouple ? 0.66 : 0.8)}
            ry={faceR * (isDetail ? 0.8 : 1)}
            fill="none"
            stroke={colors.gold}
            strokeOpacity={0.75}
            strokeWidth={1.4}
            strokeDasharray="6 7"
          />
        ))}
        <text x={cx} y={cy - faceR * 1.18} textAnchor="middle" fontFamily={fonts.sans} fontSize={small} letterSpacing="0.25em" fill={colors.gold}>
          {isDetail ? "SUBJECT" : isCouple ? "FACES" : "FACE"}
        </text>
        {/* crop marks */}
        {[
          [inset, inset, 1, 1],
          [width - inset, inset, -1, 1],
          [inset, height - inset, 1, -1],
          [width - inset, height - inset, -1, -1],
        ].map(([x, y, sx, sy], i) => (
          <path key={i} d={`M ${x} ${y + sy * mark} L ${x} ${y} L ${x + sx * mark} ${y}`} fill="none" stroke={colors.gold} strokeWidth={1.4} strokeOpacity={0.8} />
        ))}
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: labelTop, textAlign: "center", color: colors.ink }}>
        <div style={{ fontFamily: fonts.sans, fontSize: caps, fontWeight: 500, letterSpacing: "0.34em", textTransform: "uppercase", color: colors.inkSoft }}>
          {CATEGORY_LABEL[cat]}
        </div>
        <div style={{ fontFamily: fonts.display, fontStyle: "italic", fontWeight: 300, fontSize: title, lineHeight: 1.05, marginTop: caps * 0.3 }}>
          {titleOf(entry.slot)}
        </div>
        {base > 260 && (
          <div style={{ fontFamily: fonts.sans, fontSize: small, letterSpacing: "0.2em", color: colors.inkMuted, marginTop: small * 0.9, textTransform: "uppercase" }}>
            Photo placeholder · {entry.orientation}
          </div>
        )}
        {base > 420 && (
          <div style={{ fontFamily: fonts.mono, fontSize: small * 0.92, color: colors.inkMuted, marginTop: small * 0.5 }}>
            {entry.slot}
          </div>
        )}
      </div>
    </div>
  );
};
