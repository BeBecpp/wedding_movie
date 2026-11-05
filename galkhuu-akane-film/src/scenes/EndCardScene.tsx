import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground } from "../components/Atmosphere";
import { Blossom, BlossomBranch } from "../components/FloralMotif";
import { PhotoFrame } from "../components/PhotoFrame";
import { Caps, CoupleNames, Display, GoldRule, Reveal } from "../components/WeddingTitle";
import { useCueT, useT } from "../components/SeamlessLoop";
import { useShotPhotos } from "../config/photoLoader";
import { TEXT } from "../config/text";
import { colors } from "../config/design";
import type { SceneProps } from "./common";

/**
 * Opening-film hero title. Text is fully settled ~2.5 s after the cut and is
 * then held perfectly still (>= 6 s) — the last frame is a clean operator cue.
 */
export const EndCardScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const c = useCueT();
  const { shot, seqDur } = entry;
  const [photo] = useShotPhotos(shot.id);
  const boxW = 1100;
  const mask = "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.55) 22%, black 48%)";
  const grow = interpolate(c, [0, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <div style={{ position: "absolute", right: 0, top: 0, width: boxW, height: 1080, WebkitMaskImage: mask, maskImage: mask, opacity: 0.92 }}>
        <PhotoFrame res={photo} width={boxW} height={1080} t={t} camDur={seqDur + 90} cam="pushInSlow" fit="cover" />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(248,244,236,0.35), rgba(248,244,236,0.08))" }} />
      </div>
      <BlossomBranch corner="topLeft" grow={grow} t={0} width={560} opacity={0.9} />
      <div style={{ position: "absolute", left: 120, width: 940, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Reveal t={c} at={6}>
          <CoupleNames size={128} />
        </Reveal>
        <div style={{ height: 34 }} />
        <Reveal t={c} at={22} drift={0}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <GoldRule t={c} at={22} width={150} />
            <svg width={40} height={40}>
              <Blossom x={20} y={20} r={13} open={interpolate(c, [30, 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} />
            </svg>
            <GoldRule t={c} at={22} width={150} />
          </div>
        </Reveal>
        <div style={{ height: 34 }} />
        <Reveal t={c} at={36}>
          <Caps size={32} color={colors.ink}>
            {TEXT.eventLine}
          </Caps>
        </Reveal>
        <div style={{ height: 18 }} />
        <Reveal t={c} at={48}>
          <Display size={60} italic color={colors.inkSoft}>
            {TEXT.date}
          </Display>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
