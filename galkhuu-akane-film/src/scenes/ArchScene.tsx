import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground, LightBlooms } from "../components/Atmosphere";
import { BlossomBranch, DriftingPetals } from "../components/FloralMotif";
import { PhotoFrame } from "../components/PhotoFrame";
import { Caps, CoupleNames, Display, GoldRule, Reveal } from "../components/WeddingTitle";
import { useT } from "../components/SeamlessLoop";
import { useShotPhotos } from "../config/photoLoader";
import { TEXT } from "../config/text";
import { colors, motion } from "../config/design";
import type { SceneProps } from "./common";

const AW = 700;
const AH = 940;
const AX = 1920 - 160 - AW;
const AY = (1080 - AH) / 2;

/**
 * Guest-loop welcome: names + one large portrait in an arched window.
 * Runs on a shared scene clock (see SeamlessLoop) so the loop tail and head
 * are one continuous shot. Everything has settled by scene-time ~200.
 */
export const ArchScene: React.FC<SceneProps & { stillFrame?: boolean }> = ({ entry }) => {
  const u = useT();
  const { shot } = entry;
  const o = shot.opts ?? {};
  const [photo] = useShotPhotos(shot.id);
  const camTotal: number = o.camTotal ?? entry.seqDur;
  const archIn = interpolate(u, [4, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeOut });
  const grow = interpolate(u, [10, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const r = AW / 2;
  return (
    <AbsoluteFill>
      <IvoryBackground t={u} />
      <LightBlooms t={u} intensity={0.55} />
      <BlossomBranch corner="bottomLeft" grow={grow} t={u} width={440} opacity={0.85} />
      <BlossomBranch corner="topRight" grow={grow} t={u + 360} width={380} opacity={0.75} style={{ right: 0, top: 0 }} />
      <DriftingPetals t={u} count={7} region={{ x: 0, y: 0, w: AX - 40, h: 1080 }} seed="welcome" />
      {/* gold arch outline, slightly larger than the photo window */}
      <div
        style={{
          position: "absolute",
          left: AX - 18,
          top: AY - 18,
          width: AW + 36,
          height: AH + 36,
          borderRadius: `${r + 18}px ${r + 18}px 0 0`,
          border: "1.4px solid #B78C57",
          opacity: 0.7 * archIn,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: AX,
          top: AY,
          width: AW,
          height: AH,
          borderRadius: `${r}px ${r}px 0 0`,
          overflow: "hidden",
          clipPath: `inset(${((1 - archIn) * 100).toFixed(2)}% 0 0 0 round ${r}px ${r}px 0 0)`,
          boxShadow: "0 30px 70px rgba(62,52,44,0.18)",
        }}
      >
        <PhotoFrame res={photo} width={AW} height={AH} t={u} camDur={camTotal} cam="pushInSlow" printShadow={false} />
      </div>
      <div style={{ position: "absolute", left: 170, top: 0, bottom: 0, width: AX - 240, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Reveal t={u} at={48}>
          <Display size={54} italic color={colors.inkSoft}>
            {TEXT.welcome}
          </Display>
        </Reveal>
        <div style={{ height: 34 }} />
        <Reveal t={u} at={62} drift={0}>
          <GoldRule t={u} at={62} width={150} align="left" />
        </Reveal>
        <div style={{ height: 40 }} />
        <Reveal t={u} at={78}>
          <CoupleNames size={150} stacked />
        </Reveal>
        <div style={{ height: 52 }} />
        <Reveal t={u} at={112}>
          <Caps size={27} style={{ whiteSpace: "nowrap" }}>
            {TEXT.eventLine}
          </Caps>
        </Reveal>
        <div style={{ height: 14 }} />
        <Reveal t={u} at={124}>
          <Display size={50} italic color={colors.inkSoft}>
            {TEXT.date}
          </Display>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
