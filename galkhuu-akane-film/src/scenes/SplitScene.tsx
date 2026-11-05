import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { IvoryBackground } from "../components/Atmosphere";
import { Blossom } from "../components/FloralMotif";
import { PhotoFrame } from "../components/PhotoFrame";
import { useT } from "../components/SeamlessLoop";
import { useShotPhotos } from "../config/photoLoader";
import { motion } from "../config/design";
import type { SceneProps } from "./common";

const W = 820;
const H = 960;
const TOP = 60;
const LX = 120;
const RX = 980;

/**
 * Two portraits in conversation. With `reaction`, the right panel lands on a
 * beat after the left one (portrait-to-portrait reaction edit) and an optional
 * third photo answers back in the left panel.
 */
export const SplitScene: React.FC<SceneProps> = ({ entry }) => {
  const t = useT();
  const { shot, seqDur, lead } = entry;
  const o = shot.opts ?? {};
  const [a, b, c3] = useShotPhotos(shot.id);
  const rule = interpolate(t, [lead + 4, lead + 44], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeInOut });
  const revealAt = lead + (o.revealAt ?? 0);
  // quick but soft "land" for the reaction (≈0.3 s), plain presence otherwise
  const rp = o.reaction ? interpolate(t, [revealAt, revealAt + 9], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeOut }) : 1;
  const thirdAt = lead + (o.thirdAt ?? 1e9);
  const tp = c3 ? interpolate(t, [thirdAt, thirdAt + 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  // after the reaction lands, the two frames lean in by a few pixels
  const lean = o.reaction ? interpolate(t, [revealAt + 6, revealAt + 40], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeOut }) : 0;
  const camL = o.converge ? "driftRight" : "pushInSlow";
  const camR = o.converge ? "driftLeft" : "pushInSlow";
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <div style={{ position: "absolute", left: LX + lean, top: TOP, width: W, height: H, boxShadow: "0 22px 56px rgba(62,52,44,0.16)" }}>
        <PhotoFrame res={a} width={W} height={H} t={t} camDur={seqDur} cam={camL} />
        {c3 && tp > 0 && (
          <div style={{ position: "absolute", inset: 0, opacity: tp }}>
            <PhotoFrame res={c3} width={W} height={H} t={t - thirdAt + 40} camDur={seqDur} cam="pushIn" />
          </div>
        )}
      </div>
      {rp > 0 && (
        <div
          style={{
            position: "absolute",
            left: RX - lean,
            top: TOP,
            width: W,
            height: H,
            boxShadow: "0 22px 56px rgba(62,52,44,0.16)",
            clipPath: `inset(${((1 - rp) * 100).toFixed(2)}% 0 0 0)`,
            transform: `translateY(${((1 - rp) * 14).toFixed(2)}px)`,
          }}
        >
          <PhotoFrame res={b} width={W} height={H} t={t - (o.reaction ? revealAt : 0)} camDur={seqDur} cam={camR} />
        </div>
      )}
      {/* gold divider drawing top->bottom with a small blossom at its centre */}
      <div style={{ position: "absolute", left: 959.5, top: TOP, width: 1.2, height: H * rule, background: "#B78C57", opacity: 0.7 }} />
      <svg width={80} height={80} style={{ position: "absolute", left: 920, top: 500 }}>
        <Blossom x={40} y={40} r={16} open={interpolate(t, [lead + 24, lead + 60], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })} fill="#F8F4EC" />
      </svg>
    </AbsoluteFill>
  );
};
