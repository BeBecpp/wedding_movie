import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground, LightBlooms } from "../components/Atmosphere";
import { BlossomBranch, DriftingPetals } from "../components/FloralMotif";
import { useT } from "../components/SeamlessLoop";
import { Display, GoldRule, Reveal } from "../components/WeddingTitle";
import { colors, motion } from "../config/design";
import type { SceneProps } from "./common";

/** 00:00 — warm ivory light, a blossom branch drawing itself, one quiet line. */
export const AtmosphereScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const o = entry.shot.opts ?? {};
  const dawn = o.dawn ? interpolate(t, [0, 60], [0.6, 0], { extrapolateRight: "clamp", easing: motion.ease }) : 0;
  const grow = (a: number, b: number) => interpolate(t, [a, b], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <LightBlooms t={t} intensity={0.9} />
      <BlossomBranch corner="topRight" grow={grow(8, 190)} t={t} width={720} />
      <BlossomBranch corner="bottomLeft" grow={grow(36, 220)} t={t + 200} width={560} opacity={0.85} />
      <DriftingPetals t={t + 300} count={9} region={{ x: 0, y: 0, w: 1920, h: 1080 }} seed="dawn" />
      {o.text && (
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
          <Reveal t={t} at={o.textAt ?? 40} out={o.textOut}>
            <Display size={72} italic weight={300} color={colors.ink}>
              {o.text}
            </Display>
          </Reveal>
          <div style={{ height: 30 }} />
          <Reveal t={t} at={(o.textAt ?? 40) + 10} out={o.textOut} drift={0}>
            <GoldRule t={t} at={(o.textAt ?? 40) + 10} width={180} />
          </Reveal>
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ background: "#FFFDF8", opacity: dawn }} />
    </AbsoluteFill>
  );
};
