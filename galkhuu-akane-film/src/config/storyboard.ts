/**
 * Storyboard types + timeline maths shared by both films.
 *
 * Each shot declares its VISUAL duration (boundary to boundary). Transitions
 * are centred on the boundary, so a shot's <TransitionSeries.Sequence> lasts
 * dur + in/2 + out/2 frames and the total runtime is exactly sum(dur).
 */
import type { SlotUse } from "./casting";

export type TransitionKind = "cut" | "dissolve" | "bloom" | "veil" | "wipe" | "drift";
export type TransitionSpec = {
  kind: TransitionKind;
  /** frames, must be even (0 for cut) */
  frames?: number;
  dir?: "left" | "right" | "up" | "down";
};

export type CamPreset =
  | "pushIn"
  | "pushInSlow"
  | "pushInDeep"
  | "pullOut"
  | "panLeft"
  | "panRight"
  | "rise"
  | "sink"
  | "driftLeft"
  | "driftRight"
  | "still";

export type Layout =
  | "atmosphere"
  | "portraitEditorial"
  | "split"
  | "fullBleed"
  | "blurBackdrop"
  | "collage"
  | "arch"
  | "endCard"
  | "thankYou";

export type Shot = {
  id: string;
  /** visual duration in frames */
  dur: number;
  layout: Layout;
  slots: SlotUse[];
  /** transition from the previous shot into this one */
  in?: TransitionSpec;
  cam?: CamPreset;
  /** layout specific options (text, side, timings, grade...) */
  opts?: Record<string, any>;
  /** editorial marker label (also exported to music-cues.json) */
  marker?: string;
};

export type TimelineEntry = {
  shot: Shot;
  /** visual start in the composition (frames) */
  start: number;
  /** sequence start in the composition (frames) */
  seqStart: number;
  seqDur: number;
  /** frames of the sequence before the visual boundary (= in/2) */
  lead: number;
  inFrames: number;
  outFrames: number;
};

export const transitionFrames = (t?: TransitionSpec) =>
  !t || t.kind === "cut" ? 0 : t.frames ?? 24;

export const buildTimeline = (shots: Shot[], expectedTotal: number) => {
  const entries: TimelineEntry[] = [];
  let start = 0;
  shots.forEach((shot, i) => {
    const inF = i === 0 ? 0 : transitionFrames(shot.in);
    const outF = i === shots.length - 1 ? 0 : transitionFrames(shots[i + 1].in);
    if (inF % 2 || outF % 2) throw new Error(`Transition frames must be even (shot ${shot.id})`);
    const seqDur = shot.dur + inF / 2 + outF / 2;
    if (seqDur < inF || seqDur < outF) throw new Error(`Shot ${shot.id} too short for its transitions`);
    entries.push({
      shot,
      start,
      seqStart: start - inF / 2,
      seqDur,
      lead: inF / 2,
      inFrames: inF,
      outFrames: outF,
    });
    start += shot.dur;
  });
  if (start !== expectedTotal) {
    throw new Error(`Storyboard runtime is ${start} frames but must be exactly ${expectedTotal}`);
  }
  return { entries, total: start };
};
