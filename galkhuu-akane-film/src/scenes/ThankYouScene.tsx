import React from "react";
import { AbsoluteFill } from "remotion";
import { IvoryBackground } from "../components/Atmosphere";
import { PhotoFrame } from "../components/PhotoFrame";
import { DriftingPetals } from "../components/FloralMotif";
import { Display, GoldRule, Reveal } from "../components/WeddingTitle";
import { useCueT, useT } from "../components/SeamlessLoop";
import { useShotPhotos } from "../config/photoLoader";
import type { SceneProps } from "./common";

/** Loop reprise: a warm photo on the right, a single thank-you line in ivory space. */
export const ThankYouScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const c = useCueT();
  const { shot, seqDur } = entry;
  const o = shot.opts ?? {};
  const [photo] = useShotPhotos(shot.id);
  const boxW = 1240;
  const mask = "linear-gradient(to right, transparent 0%, black 30%)";
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <div style={{ position: "absolute", right: 0, top: 0, width: boxW, height: 1080, WebkitMaskImage: mask, maskImage: mask }}>
        <PhotoFrame res={photo} width={boxW} height={1080} t={t} camDur={seqDur} cam={shot.cam} fit="cover" />
      </div>
      <DriftingPetals t={t} count={6} region={{ x: 0, y: 0, w: 1920 - boxW + 120, h: 1080 }} seed="thanks" />
      <div style={{ position: "absolute", left: 170, top: 0, bottom: 0, width: 640, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <Reveal t={c} at={o.textAt ?? 40} out={o.textOut} drift={0}>
          <GoldRule t={c} at={o.textAt ?? 40} width={130} align="left" />
        </Reveal>
        <div style={{ height: 30 }} />
        <Reveal t={c} at={(o.textAt ?? 40) + 8} out={o.textOut}>
          <Display size={104} italic>
            {o.text}
          </Display>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};
