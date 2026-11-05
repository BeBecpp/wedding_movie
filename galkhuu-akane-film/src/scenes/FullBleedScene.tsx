import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground } from "../components/Atmosphere";
import { BlossomBranch } from "../components/FloralMotif";
import { PhotoFrame } from "../components/PhotoFrame";
import { reveal, Display } from "../components/WeddingTitle";
import { useCueT, useT } from "../components/SeamlessLoop";
import { useShotPhotos } from "../config/photoLoader";
import { colors } from "../config/design";
import { Keyline, Lift, Scrim, SceneProps, Vignette } from "./common";

/** Full-frame (or inset "print") photograph with optional one-idea caption. */
export const FullBleedScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const c = useCueT();
  const { shot, seqDur } = entry;
  const o = shot.opts ?? {};
  const [photo] = useShotPhotos(shot.id);
  const lines: string[] = o.text ? (Array.isArray(o.text) ? o.text : [o.text]) : [];
  const at = o.textAt ?? 30;
  const gap = o.textGap ?? 30;
  // caption goes on the side of the frame away from the faces
  const focalY = photo?.entry.focalY ?? 0.4;
  const pos: "top" | "bottom" = o.textPos ?? (focalY > 0.58 ? "top" : "bottom");
  const r0 = reveal(c, at, o.textOut);
  const lift = o.lift ? interpolate(t, [0, seqDur], [0, 1], { extrapolateRight: "clamp" }) : 0;

  if (o.inset) {
    const W = 1600;
    const H = 900;
    const x = (1920 - W) / 2;
    const y = (1080 - H) / 2;
    return (
      <AbsoluteFill>
        <IvoryBackground t={t} />
        <Keyline x={x + 20} y={y + 20} w={W} h={H} opacity={0.5} />
        <div style={{ position: "absolute", left: x, top: y, boxShadow: "0 26px 70px rgba(62,52,44,0.2)" }}>
          <PhotoFrame res={photo} width={W} height={H} t={t} camDur={seqDur} cam={shot.cam} grade={o.grade} />
        </div>
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: colors.ivory }}>
      <PhotoFrame res={photo} width={1920} height={1080} t={t} camDur={seqDur} cam={shot.cam} grade={o.grade} />
      <Vignette amount={o.vignette ?? 0.12} />
      <Lift p={lift} />
      {o.florals && (
        <>
          <BlossomBranch corner="topLeft" grow={interpolate(t, [0, 120], [0, 1], { extrapolateRight: "clamp" })} t={t} width={420} opacity={0.85} />
          <BlossomBranch corner="bottomRight" grow={interpolate(t, [20, 140], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} t={t + 300} width={380} opacity={0.8} />
        </>
      )}
      {lines.length > 0 && (
        <>
          <Scrim pos={pos} opacity={r0.opacity} />
          <AbsoluteFill
            style={{
              justifyContent: pos === "bottom" ? "flex-end" : "flex-start",
              alignItems: "center",
              padding: pos === "bottom" ? "0 0 118px" : "104px 0 0",
              textAlign: "center",
            }}
          >
            {lines.map((line, i) => {
              const r = reveal(c, at + i * gap, o.textOut);
              return (
                <div key={i} style={{ opacity: r.opacity, transform: `translateY(${r.y.toFixed(2)}px)` }}>
                  <Display
                    size={i === 0 ? 96 : 84}
                    italic={i > 0 || lines.length === 1}
                    color="#FBF7F0"
                    style={{ textShadow: "0 2px 26px rgba(40,32,26,0.45), 0 1px 3px rgba(40,32,26,0.3)" }}
                  >
                    {line}
                  </Display>
                </div>
              );
            })}
          </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};
