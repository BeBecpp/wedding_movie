/**
 * Typography system. Text enters with a 10–16 px upward drift + opacity —
 * never bouncing word by word — and leaves with a soft fade.
 */
import React from "react";
import { interpolate } from "remotion";
import { colors, fonts, motion } from "../config/design";
import { TEXT } from "../config/text";

export const reveal = (t: number, at: number, out?: number | null, drift: number = motion.textDrift) => {
  const inP = interpolate(t, [at, at + motion.textIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: motion.easeOut,
  });
  const outP =
    out == null
      ? 1
      : interpolate(t, [out, out + motion.textOut], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: motion.ease,
        });
  return { opacity: inP * outP, y: (1 - inP) * drift };
};

export const Reveal: React.FC<{
  t: number;
  at: number;
  out?: number | null;
  drift?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ t, at, out, drift, style, children }) => {
  const r = reveal(t, at, out, drift);
  if (r.opacity <= 0.001) return null;
  return <div style={{ opacity: r.opacity, transform: `translateY(${r.y.toFixed(3)}px)`, ...style }}>{children}</div>;
};

export const Display: React.FC<{
  size?: number;
  italic?: boolean;
  weight?: number;
  color?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ size = 96, italic, weight = 300, color = colors.ink, style, children }) => (
  <div
    style={{
      fontFamily: fonts.display,
      fontSize: size,
      fontWeight: weight,
      fontStyle: italic ? "italic" : "normal",
      lineHeight: 1.04,
      letterSpacing: "0.005em",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Caps: React.FC<{ size?: number; color?: string; spacing?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 28,
  color = colors.inkSoft,
  spacing = "0.32em",
  style,
  children,
}) => (
  <div
    style={{
      fontFamily: fonts.sans,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: spacing,
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

/** A hairline gold rule that draws outward from its centre. */
export const GoldRule: React.FC<{ t: number; at: number; width?: number; align?: "center" | "left"; color?: string; style?: React.CSSProperties }> = ({
  t,
  at,
  width = 220,
  align = "center",
  color = colors.gold,
  style,
}) => {
  const p = interpolate(t, [at, at + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeInOut });
  return (
    <div style={{ width, height: 1.5, display: "flex", justifyContent: align === "center" ? "center" : "flex-start", ...style }}>
      <div style={{ width: `${p * 100}%`, height: "100%", background: color, opacity: 0.85 }} />
    </div>
  );
};

/** "Galkhuu & Akane" with a gold italic ampersand. */
export const CoupleNames: React.FC<{ size?: number; color?: string; amp?: string; stacked?: boolean; style?: React.CSSProperties }> = ({
  size = 140,
  color = colors.ink,
  amp = colors.gold,
  stacked,
  style,
}) => {
  const Amp = (
    <span style={{ fontStyle: "italic", color: amp, fontWeight: 300, padding: stacked ? "0 0.18em 0 0" : "0 0.16em" }}>&amp;</span>
  );
  return (
    <Display size={size} color={color} style={{ whiteSpace: "nowrap", ...style }}>
      {stacked ? (
        <>
          <div>{TEXT.groom}</div>
          <div style={{ paddingLeft: size * 0.62 }}>
            {Amp}{TEXT.bride}
          </div>
        </>
      ) : (
        <>
          {TEXT.groom}{Amp}{TEXT.bride}
        </>
      )}
    </Display>
  );
};
