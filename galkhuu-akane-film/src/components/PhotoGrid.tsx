/**
 * Editorial collage. Chooses a composition from the ORIENTATIONS of the
 * photos actually cast (and how many survive — disabled/droppable cells
 * simply disappear), so it reflows gracefully for 1, 2 or 3 photos.
 */
import React from "react";
import { interpolate } from "remotion";
import type { Resolved } from "../config/casting";
import type { CamPreset } from "../config/storyboard";
import { motion } from "../config/design";
import { aspectOf, PhotoFrame } from "./PhotoFrame";

export type Cell = { x: number; y: number; w: number; h: number; res: Resolved };

const isP = (r: Resolved) => aspectOf(r.entry) < 1.05;

const row = (items: Resolved[], maxH: number, availW = 1620, gap = 40, stagger = [-36, 30, -14]): Cell[] => {
  const sumA = items.reduce((s, r) => s + Math.min(1.6, Math.max(0.66, aspectOf(r.entry))), 0);
  const H = Math.min(maxH, (availW - gap * (items.length - 1)) / sumA);
  const widths = items.map((r) => H * Math.min(1.6, Math.max(0.66, aspectOf(r.entry))));
  const total = widths.reduce((s, w) => s + w, 0) + gap * (items.length - 1);
  let x = (1920 - total) / 2;
  return items.map((res, i) => {
    const cell = { x, y: (1080 - H) / 2 + (stagger[i] ?? 0), w: widths[i], h: H, res };
    x += widths[i] + gap;
    return cell;
  });
};

export const layoutCells = (photos: Array<Resolved | null>): Cell[] => {
  const list = photos.filter((p): p is Resolved => !!p);
  if (list.length === 0) return [];
  if (list.length === 1) {
    const r = list[0];
    return isP(r) ? [{ x: (1920 - 645) / 2, y: 110, w: 645, h: 860, res: r }] : [{ x: 320, y: 113, w: 1280, h: 853, res: r }];
  }
  if (list.length === 2) return row(list, 820, 1620, 48, [-30, 30]);
  const P = list.filter(isP);
  const L = list.filter((r) => !isP(r));
  if (L.length === 3) {
    return [
      { x: 150, y: 150, w: 1080, h: 720, res: L[0] },
      { x: 1270, y: 150, w: 500, h: 333, res: L[1] },
      { x: 1270, y: 537, w: 500, h: 333, res: L[2] },
    ];
  }
  if (P.length === 1) {
    return [
      { x: 150, y: 140, w: 600, h: 800, res: P[0] },
      { x: 800, y: 96, w: 640, h: 427, res: L[0] },
      { x: 1130, y: 557, w: 640, h: 427, res: L[1] },
    ];
  }
  if (P.length === 3) return row(P, 700);
  // two portraits + one landscape: landscape in the middle
  return row([P[0], L[0], P[1]], 560, 1620, 40, [-30, 26, -10]);
};

const CAMS: CamPreset[] = ["pushInSlow", "driftLeft", "driftRight"];

export const PhotoGrid: React.FC<{ photos: Array<Resolved | null>; t: number; seqDur: number; startAt?: number }> = ({
  photos,
  t,
  seqDur,
  startAt = 4,
}) => {
  const cells = layoutCells(photos);
  return (
    <>
      {cells.map((cell, i) => {
        const at = startAt + i * 12;
        const p = interpolate(t, [at, at + 30], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: motion.easeOut });
        const depth = [10, -14, 18][i] ?? 0; // parallax: each print drifts at its own pace
        const dx = interpolate(t, [0, seqDur], [depth, -depth]);
        const pad = 12;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: cell.x - pad,
              top: cell.y - pad,
              padding: pad,
              background: "#FBF8F2",
              boxShadow: "0 20px 50px rgba(62,52,44,0.18), 0 2px 6px rgba(62,52,44,0.1)",
              opacity: p,
              transform: `translate(${dx.toFixed(2)}px, ${((1 - p) * 16).toFixed(2)}px)`,
            }}
          >
            <PhotoFrame res={cell.res} width={Math.round(cell.w)} height={Math.round(cell.h)} t={t} camDur={seqDur} cam={CAMS[i % 3]} printShadow={false} />
          </div>
        );
      })}
    </>
  );
};
