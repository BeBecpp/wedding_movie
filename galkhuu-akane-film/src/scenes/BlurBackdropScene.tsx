import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground } from "../components/Atmosphere";
import { BlossomBranch, DriftingPetals } from "../components/FloralMotif";
import { PhotoFrame } from "../components/PhotoFrame";
import { Display, GoldRule, Reveal } from "../components/WeddingTitle";
import { useCueT, useT } from "../components/SeamlessLoop";
import { useShotPhotos } from "../config/photoLoader";
import { colors } from "../config/design";
import { Lift, SceneProps } from "./common";

/**
 * Portrait-friendly shot: the whole photo stays visible (no chopped heads)
 * over a soft blurred copy of itself. `align: right|left` leaves an ivory
 * text side; `center` fills the frame.
 */
export const BlurBackdropScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const c = useCueT();
  const { shot, seqDur } = entry;
  const o = shot.opts ?? {};
  const [photo] = useShotPhotos(shot.id);
  const lift = o.lift ? interpolate(t, [0, seqDur], [0, 0.9], { extrapolateRight: "clamp" }) : 0;

  if (!o.align || o.align === "center") {
    return (
      <AbsoluteFill>
        <PhotoFrame res={photo} width={1920} height={1080} t={t} camDur={seqDur} cam={shot.cam} fit="auto" />
        <Lift p={lift} />
      </AbsoluteFill>
    );
  }

  const right = o.align === "right";
  const boxW = 1060;
  const boxX = right ? 1920 - boxW : 0;
  const mask = `linear-gradient(${right ? "to right" : "to left"}, transparent 0%, black 26%)`;
  const lines: string[] = o.text ? (Array.isArray(o.text) ? o.text : [o.text]) : [];
  const at = o.textAt ?? 30;
  const textX = right ? 170 : boxW + 60;
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <BlossomBranch corner={right ? "bottomLeft" : "bottomRight"} grow={interpolate(t, [10, 200], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} t={t} width={520} opacity={0.8} />
      <DriftingPetals t={t} count={5} region={{ x: right ? 0 : boxW, y: 0, w: 1920 - boxW, h: 1080 }} seed={shot.id} />
      <div style={{ position: "absolute", left: boxX, top: 0, width: boxW, height: 1080, WebkitMaskImage: mask, maskImage: mask }}>
        <PhotoFrame res={photo} width={boxW} height={1080} t={t} camDur={seqDur} cam={shot.cam} fit="contain" />
      </div>
      <Lift p={lift} />
      {lines.length > 0 && (
        <div style={{ position: "absolute", left: textX, top: 0, bottom: 0, width: 1920 - boxW - 200, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Reveal t={c} at={at} out={o.textOut} drift={0}>
            <GoldRule t={c} at={at} width={130} align="left" />
          </Reveal>
          <div style={{ height: 30 }} />
          {lines.map((line, i) => (
            <Reveal key={i} t={c} at={at + 6 + i * (o.textGap ?? 30)} out={o.textOut}>
              <Display size={i === 0 ? 112 : 78} italic={i > 0} color={i === 0 ? colors.ink : colors.inkSoft} style={{ marginBottom: 10 }}>
                {line}
              </Display>
            </Reveal>
          ))}
        </div>
      )}
    </AbsoluteFill>
  );
};
