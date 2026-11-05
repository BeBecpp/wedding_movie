import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground } from "../components/Atmosphere";
import { BlossomBranch } from "../components/FloralMotif";
import { PhotoGrid } from "../components/PhotoGrid";
import { useT } from "../components/SeamlessLoop";
import { useShotPhotos } from "../config/photoLoader";
import type { SceneProps } from "./common";

export const CollageScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const { shot, seqDur } = entry;
  const photos = useShotPhotos(shot.id);
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <BlossomBranch corner="topRight" grow={interpolate(t, [0, 160], [0.1, 1], { extrapolateRight: "clamp" })} t={t} width={460} opacity={0.75} />
      <BlossomBranch corner="bottomLeft" grow={interpolate(t, [20, 180], [0.1, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} t={t + 500} width={420} opacity={0.7} />
      <PhotoGrid photos={photos} t={t} seqDur={seqDur} />
    </AbsoluteFill>
  );
};
