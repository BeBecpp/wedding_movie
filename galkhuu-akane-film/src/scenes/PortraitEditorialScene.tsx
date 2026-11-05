import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground } from "../components/Atmosphere";
import { BlossomBranch, DriftingPetals } from "../components/FloralMotif";
import { PhotoFrame } from "../components/PhotoFrame";
import { useCueT, useT } from "../components/SeamlessLoop";
import { Display, GoldRule, Reveal } from "../components/WeddingTitle";
import { useShotPhotos } from "../config/photoLoader";
import { colors, motion } from "../config/design";
import { Keyline, SceneProps } from "./common";

const PW = 780;
const PH = 975;

/** Large portrait on one side, generous negative space (with text or florals) on the other. */
export const PortraitEditorialScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const c = useCueT();
  const { shot, seqDur } = entry;
  const o = shot.opts ?? {};
  const [photo] = useShotPhotos(shot.id);
  const right = o.side !== "left";
  const sgn = right ? 1 : -1;
  const px = right ? 1920 - 140 - PW : 140;
  const py = (1080 - PH) / 2;
  const driftX = interpolate(t, [0, seqDur], [10 * sgn, -10 * sgn]);
  const rev = o.reveal ? interpolate(t, [0, 22], [100, 0], { extrapolateRight: "clamp", easing: motion.easeOut }) : 0;
  const textX = right ? 170 : px + PW + 110;
  const textW = right ? px - 170 - 80 : 1920 - textX - 120;
  const at = o.textAt ?? 20;
  const growBranch = interpolate(t, [0, 150], [0.15, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <BlossomBranch corner={right ? "topLeft" : "topRight"} grow={growBranch} t={t} width={o.florals === "rich" ? 700 : 560} opacity={0.95} />
      {o.florals === "rich" && <BlossomBranch corner={right ? "bottomLeft" : "bottomRight"} grow={growBranch * 0.9} t={t + 400} width={480} opacity={0.75} />}
      <DriftingPetals t={t} count={5} region={{ x: right ? 0 : px + PW + 40, y: 0, w: right ? px - 40 : 1920 - px - PW - 40, h: 1080 }} seed={shot.id} />
      <div style={{ position: "absolute", left: px, top: py, transform: `translateX(${driftX.toFixed(2)}px)` }}>
        <Keyline x={-22 * sgn} y={22} w={PW} h={PH} />
        <div style={{ position: "relative", clipPath: `inset(${rev.toFixed(2)}% 0 0 0)`, boxShadow: "0 24px 60px rgba(62,52,44,0.18)" }}>
          <PhotoFrame res={photo} width={PW} height={PH} t={t} camDur={seqDur} cam={shot.cam} />
        </div>
      </div>
      {o.name && (
        <div style={{ position: "absolute", left: textX, width: textW, top: 0, bottom: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: right ? "flex-start" : "flex-start" }}>
          <div style={{ marginTop: 120 }}>
            <Reveal t={c} at={at} drift={0}>
              <GoldRule t={c} at={at} width={130} align="left" />
            </Reveal>
            <div style={{ height: 26 }} />
            <Reveal t={c} at={at + 4}>
              <Display size={84} italic color={colors.inkSoft}>
                {o.line1}
              </Display>
            </Reveal>
            <Reveal t={c} at={at + 12}>
              <Display size={164} weight={300}>
                {o.name}.
              </Display>
            </Reveal>
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
