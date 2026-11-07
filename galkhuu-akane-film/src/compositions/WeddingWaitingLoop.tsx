/**
 * Waiting / guest-arrival loop on the official floral background.
 * 60 s, seamless: every motion is periodic over the full duration
 * (slow 1.000–1.018 "breathing" zoom + a faint warm light drift).
 */
import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const WAITING_FRAMES = 1800;

export const WeddingWaitingLoop: React.FC<{ image?: string }> = ({ image = "event/Galkhuu_Akane_Waiting_Screen.png" }) => {
  const f = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const ph = (f / durationInFrames) * Math.PI * 2;
  const s = 1.009 - 0.009 * Math.cos(ph);
  const lx = 30 + 18 * Math.sin(ph);
  const ly = 30 + 10 * Math.cos(ph);
  return (
    <AbsoluteFill style={{ background: "#F4F3EF", overflow: "hidden" }}>
      <AbsoluteFill style={{ transform: `scale(${s.toFixed(6)})`, transformOrigin: "50% 48%" }}>
        <Img src={staticFile(image)} style={{ width: 1920, height: 1080 }} />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          mixBlendMode: "soft-light",
          background: `radial-gradient(ellipse 55% 45% at ${lx.toFixed(2)}% ${ly.toFixed(2)}%, rgba(255,248,230,0.35) 0%, rgba(255,248,230,0) 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};
