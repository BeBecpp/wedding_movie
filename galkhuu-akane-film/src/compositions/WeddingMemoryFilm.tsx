/**
 * WeddingMemoryFilm — ~4:14 cinematic memory film (childhood → people →
 * own stories → a new chapter → names). Reuses the project's design system:
 * fonts, IvoryBackground/Grain, camera moves, GoldRule/Reveal typography and
 * @remotion/transitions. Photos are local-only (public/local-photos/memory).
 * Faces are never altered: only uniform scale + translate are used.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, Img, getStaticFiles, interpolate, staticFile, useCurrentFrame } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Easing } from "remotion";
import { ensureFonts } from "../config/fonts";
import { fonts, motion } from "../config/design";
import { Grain, IvoryBackground } from "../components/Atmosphere";
import { GoldRule, Reveal } from "../components/WeddingTitle";
import { cameraTransform } from "../components/SoftCamera";
import { MEMORY_FPS, MEMORY_FRAMES, MemoryCam, MemoryPhoto, MemoryShot, dimsOf, memoryShots, photoSrc } from "../config/memoryStoryboard";

ensureFonts();

const C = {
  evergreen: "#24392E",
  evergreenSoft: "rgba(36,57,46,0.72)",
  sage: "#8E9C85",
  sageLight: "#B9C2AE",
  gold: "#B78C57",
  ivory: "#F8F4EC",
  paper: "#FBF8F2",
};

/** Gentle, consistent grade: a touch warmer and softer, never saturated. */
const GRADE = "saturate(0.93) contrast(1.02) sepia(0.06) brightness(1.01)";

const fileSet = (() => {
  let s: Set<string> | null = null;
  return () => {
    if (!s) {
      try {
        s = new Set(getStaticFiles().map((f) => f.name.replace(/^\/+/, "")));
      } catch {
        s = new Set();
      }
    }
    return s;
  };
})();

const has = (id: string) => fileSet().has(photoSrc(id));

const Missing: React.FC<{ id: string }> = ({ id }) => (
  <AbsoluteFill style={{ background: C.sageLight, alignItems: "center", justifyContent: "center", fontFamily: fonts.sans, color: C.evergreen, fontSize: 28 }}>
    photo {id} (local file missing)
  </AbsoluteFill>
);

/** Image filling its box with cover + focal point. */
const PhotoImg: React.FC<{ ph: MemoryPhoto; w: number; h: number; filter?: string }> = ({ ph, w, h, filter = GRADE }) =>
  has(ph.id) ? (
    <Img
      src={staticFile(photoSrc(ph.id))}
      style={{ width: w, height: h, objectFit: "cover", objectPosition: `${(ph.fx ?? 0.5) * 100}% ${(ph.fy ?? 0.45) * 100}%`, display: "block", filter }}
    />
  ) : (
    <div style={{ position: "relative", width: w, height: h }}>
      <Missing id={ph.id} />
    </div>
  );

/** Cheap smooth blur: tiny render scaled up (same trick as PhotoFrame.BlurredCopy). */
const BlurBackdrop: React.FC<{ ph: MemoryPhoto; t: number; dur: number; tint?: number }> = ({ ph, t, dur, tint = 0.34 }) => {
  const k = 14;
  const W = 1920;
  const H = 1080;
  const sw = Math.ceil(W / k) + 4;
  const sh = Math.ceil(H / k) + 4;
  const { transform } = cameraTransform("pullOut", t, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ivory }}>
      <AbsoluteFill style={{ transform }}>
        <div style={{ position: "absolute", left: -2 * k, top: -2 * k, width: sw, height: sh, transform: `scale(${k})`, transformOrigin: "0 0", filter: "blur(2.4px)" }}>
          {has(ph.id) ? <Img src={staticFile(photoSrc(ph.id))} style={{ width: sw, height: sh, objectFit: "cover", display: "block", filter: "saturate(0.8)" }} /> : null}
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{ background: `rgba(248,244,236,${tint})` }} />
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 75% at 50% 50%, rgba(248,244,236,0) 50%, rgba(36,57,46,0.18) 100%)" }} />
    </AbsoluteFill>
  );
};

const fitBox = (aspect: number, maxW: number, maxH: number) => {
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { w: Math.round(w), h: Math.round(h) };
};

const Print: React.FC<{ ph: MemoryPhoto; w: number; h: number; border?: number; style?: React.CSSProperties }> = ({ ph, w, h, border = 10, style }) => (
  <div
    style={{
      width: w + border * 2,
      height: h + border * 2,
      padding: border,
      background: C.paper,
      boxShadow: "0 22px 60px rgba(36,40,30,0.28), 0 3px 10px rgba(36,40,30,0.14)",
      ...style,
    }}
  >
    <div style={{ width: w, height: h, overflow: "hidden" }}>
      <PhotoImg ph={ph} w={w} h={h} />
    </div>
  </div>
);

/** One photo, whole frame visible, on a soft blurred copy of itself. */
const FeatureScene: React.FC<{ ph: MemoryPhoto; t: number; dur: number; cam?: MemoryCam }> = ({ ph, t, dur, cam }) => {
  const [pw, phh] = dimsOf(ph.id);
  const { w, h } = fitBox(pw / phh, 1640, 930);
  const s = interpolate(t, [0, dur], [1.0, 1.035], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const drift = cam === "driftLeft" ? -1 : cam === "driftRight" ? 1 : 0;
  const x = interpolate(t, [0, dur], [-drift * 10, drift * 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = cam === "pullOut" ? 2.035 - s : s;
  return (
    <AbsoluteFill>
      <BlurBackdrop ph={ph} t={t} dur={dur} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ transform: `translateX(${x.toFixed(2)}px) scale(${scale.toFixed(5)})` }}>
          <Print ph={ph} w={w} h={h} border={9} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Full-bleed cinematic landscape with Ken Burns (only for photos with safe edges). */
const BleedScene: React.FC<{ ph: MemoryPhoto; t: number; dur: number; cam?: MemoryCam }> = ({ ph, t, dur, cam }) => {
  const { transform } = cameraTransform(cam ?? "pushInSlow", t, dur);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.ivory }}>
      <AbsoluteFill style={{ transform, transformOrigin: `${(ph.fx ?? 0.5) * 100}% ${(ph.fy ?? 0.5) * 100}%` }}>
        <PhotoImg ph={ph} w={1920} h={1080} />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 85% 80% at 50% 48%, rgba(36,57,46,0) 58%, rgba(36,57,46,0.22) 100%)" }} />
    </AbsoluteFill>
  );
};

/** Two (or three) prints laid out on ivory paper — an editorial spread. */
const GalleryScene: React.FC<{ photos: MemoryPhoto[]; t: number; dur: number; cam?: MemoryCam }> = ({ photos, t, dur, cam }) => {
  const gap = 56;
  const maxW = 1760;
  const maxH = 820;
  const aspects = photos.map((ph) => {
    const [w, h] = dimsOf(ph.id);
    return w / h;
  });
  // equal heights, total width bounded
  let H = maxH;
  const totalA = aspects.reduce((a, b) => a + b, 0);
  if (H * totalA + gap * (photos.length - 1) > maxW) H = (maxW - gap * (photos.length - 1)) / totalA;
  const s = interpolate(t, [0, dur], [1.0, 1.03], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const scale = cam === "pullOut" ? 2.03 - s : s;
  const drift = cam === "driftLeft" ? -1 : cam === "driftRight" ? 1 : 0;
  const x = interpolate(t, [0, dur], [-drift * 12, drift * 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap, transform: `translateX(${x.toFixed(2)}px) scale(${scale.toFixed(5)})` }}>
          {photos.map((ph, i) => {
            const appear = interpolate(t, [i * 12, i * 12 + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeOut });
            const y = (1 - appear) * 14 + (i % 2 ? 18 : -18);
            return (
              <div key={ph.id} style={{ opacity: i === 0 ? 1 : appear, transform: `translateY(${y.toFixed(2)}px)` }}>
                <Print ph={ph} w={Math.round(H * aspects[i])} h={Math.round(H)} border={10} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{ shot: Extract<MemoryShot, { kind: "title" }>; t: number }> = ({ shot, t }) => {
  const isChapter = !!shot.chapter;
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        {shot.kicker ? (
          <Reveal t={t} at={8}>
            <div style={{ fontFamily: fonts.sans, fontSize: 30, fontWeight: 500, letterSpacing: "0.42em", textTransform: "uppercase", color: C.sage, paddingLeft: "0.42em" }}>
              {shot.kicker}
            </div>
          </Reveal>
        ) : null}
        <div style={{ height: 30 }} />
        <Reveal t={t} at={16} drift={0}>
          <GoldRule t={t} at={16} width={180} color={C.gold} />
        </Reveal>
        <div style={{ height: 34 }} />
        <Reveal t={t} at={24}>
          <div style={{ fontFamily: fonts.display, fontSize: isChapter ? 104 : 92, fontWeight: 300, fontStyle: "italic", color: C.evergreen, lineHeight: 1.05 }}>
            {shot.title}
          </div>
        </Reveal>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Final names over the hero photo — settles, then HOLDS to the very last frame. */
const FinaleScene: React.FC<{ ph: MemoryPhoto; t: number; dur: number }> = ({ ph, t, dur }) => {
  const [pw, phh] = dimsOf(ph.id);
  const boxH = 1080;
  const boxW = Math.round(Math.min(1060, boxH * (pw / phh) * 1.0));
  const mask = "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.6) 20%, black 45%)";
  const { transform } = cameraTransform("pushInSlow", t, dur);
  return (
    <AbsoluteFill>
      <IvoryBackground t={t} />
      <div style={{ position: "absolute", right: 0, top: 0, width: boxW, height: boxH, WebkitMaskImage: mask, maskImage: mask, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, transform, transformOrigin: "50% 55%" }}>
          <PhotoImg ph={ph} w={boxW} h={boxH} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(248,244,236,0.25), rgba(248,244,236,0.04))" }} />
      </div>
      <div style={{ position: "absolute", left: 160, width: 940, top: 0, bottom: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <Reveal t={t} at={14}>
          <div style={{ fontFamily: fonts.display, fontSize: 88, fontWeight: 400, letterSpacing: "0.08em", color: C.evergreen, whiteSpace: "nowrap", paddingLeft: "0.08em" }}>
            GALKHUU <span style={{ fontStyle: "italic", fontWeight: 300, color: C.gold, letterSpacing: 0 }}>&amp;</span> AKANE
          </div>
        </Reveal>
        <div style={{ height: 36 }} />
        <Reveal t={t} at={40} drift={0}>
          <GoldRule t={t} at={40} width={300} color={C.gold} />
        </Reveal>
        <div style={{ height: 36 }} />
        <Reveal t={t} at={58}>
          <div style={{ fontFamily: fonts.sans, fontSize: 30, fontWeight: 400, letterSpacing: "0.36em", color: C.evergreenSoft, paddingLeft: "0.36em" }}>
            7 NOVEMBER 2026
          </div>
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

type Entry = { shot: MemoryShot; dur: number; seqDur: number; lead: number; inF: number };

const transIn = (prev: MemoryShot | undefined, cur: MemoryShot) => {
  if (!prev) return 0;
  if (cur.kind === "title" || prev.kind === "title" || cur.kind === "finale") return 44;
  return 30;
};

export const buildMemoryTimeline = (): Entry[] => {
  const f = (s: number) => Math.round(s * MEMORY_FPS);
  const out: Entry[] = [];
  memoryShots.forEach((shot, i) => {
    const start = f(shot.at);
    const end = i + 1 < memoryShots.length ? f(memoryShots[i + 1].at) : MEMORY_FRAMES;
    const inF = transIn(memoryShots[i - 1], shot);
    const outF = i + 1 < memoryShots.length ? transIn(shot, memoryShots[i + 1]) : 0;
    const dur = end - start;
    out.push({ shot, dur, seqDur: dur + inF / 2 + outF / 2, lead: inF / 2, inF });
  });
  const total = out.reduce((a, e) => a + e.dur, 0);
  if (total !== MEMORY_FRAMES) throw new Error(`Memory film runtime ${total} != ${MEMORY_FRAMES}`);
  return out;
};

const ShotView: React.FC<{ e: Entry }> = ({ e }) => {
  const t = useCurrentFrame();
  const { shot, seqDur, lead } = e;
  switch (shot.kind) {
    case "title":
      return <TitleScene shot={shot} t={t - lead} />;
    case "feature":
      return <FeatureScene ph={shot.photo} t={t} dur={seqDur} cam={shot.cam} />;
    case "bleed":
      return <BleedScene ph={shot.photo} t={t} dur={seqDur} cam={shot.cam} />;
    case "gallery":
      return <GalleryScene photos={shot.photos} t={t} dur={seqDur} cam={shot.cam} />;
    case "finale":
      return <FinaleScene ph={shot.photo} t={t - lead} dur={seqDur} />;
  }
};

const ease = Easing.bezier(0.42, 0, 0.3, 1);

export const WeddingMemoryFilm: React.FC = () => {
  const entries = useMemo(buildMemoryTimeline, []);
  return (
    <AbsoluteFill style={{ backgroundColor: C.ivory }}>
      <TransitionSeries>
        {entries.flatMap((e, i) => {
          const out: React.ReactNode[] = [];
          if (i > 0 && e.inF > 0) {
            out.push(
              <TransitionSeries.Transition key={`tr-${i}`} presentation={fade()} timing={linearTiming({ durationInFrames: e.inF, easing: ease })} />,
            );
          }
          out.push(
            <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={e.seqDur} name={`${i}-${e.shot.kind}`} premountFor={30}>
              <ShotView e={e} />
            </TransitionSeries.Sequence>,
          );
          return out;
        })}
      </TransitionSeries>
      <Grain opacity={0.035} />
    </AbsoluteFill>
  );
};
