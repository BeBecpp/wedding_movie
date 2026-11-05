/**
 * Turns a storyboard (list of shots) into a <TransitionSeries>, wires every
 * shot to its scene layout, its scene clock and its cast photos.
 */
import React, { useMemo } from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries } from "@remotion/transitions";
import { buildTimeline, Shot, TimelineEntry } from "../config/storyboard";
import { CastingProvider } from "../config/photoLoader";
import { presentationFor, timingFor } from "../transitions/presentations";
import { SceneClock } from "./SeamlessLoop";
import { AtmosphereScene } from "../scenes/AtmosphereScene";
import { PortraitEditorialScene } from "../scenes/PortraitEditorialScene";
import { SplitScene } from "../scenes/SplitScene";
import { FullBleedScene } from "../scenes/FullBleedScene";
import { BlurBackdropScene } from "../scenes/BlurBackdropScene";
import { CollageScene } from "../scenes/CollageScene";
import { ArchScene } from "../scenes/ArchScene";
import { EndCardScene } from "../scenes/EndCardScene";
import { ThankYouScene } from "../scenes/ThankYouScene";
import type { SceneProps } from "../scenes/common";

const SCENES: Record<Shot["layout"], React.FC<SceneProps>> = {
  atmosphere: AtmosphereScene,
  portraitEditorial: PortraitEditorialScene,
  split: SplitScene,
  fullBleed: FullBleedScene,
  blurBackdrop: BlurBackdropScene,
  collage: CollageScene,
  arch: ArchScene,
  endCard: EndCardScene,
  thankYou: ThankYouScene,
};

export const SceneFor: React.FC<{ entry: TimelineEntry }> = ({ entry }) => {
  const Scene = SCENES[entry.shot.layout];
  return (
    <SceneClock offset={entry.shot.opts?.clockOffset ?? 0} lead={entry.lead}>
      <Scene entry={entry} />
    </SceneClock>
  );
};

export const FilmTimeline: React.FC<{ shots: Shot[]; total: number; loop?: boolean }> = ({ shots, total, loop }) => {
  const { entries } = useMemo(() => buildTimeline(shots, total), [shots, total]);
  return (
    <CastingProvider entries={entries} loopLength={loop ? total : undefined}>
      <AbsoluteFill style={{ backgroundColor: "#F8F4EC" }}>
        <TransitionSeries>
          {entries.flatMap((e, i) => {
            const out: React.ReactNode[] = [];
            if (i > 0 && e.inFrames > 0) {
              out.push(
                <TransitionSeries.Transition
                  key={`tr-${e.shot.id}`}
                  presentation={presentationFor(e.shot.in!) as any}
                  timing={timingFor(e.inFrames)}
                />,
              );
            }
            out.push(
              <TransitionSeries.Sequence key={e.shot.id} durationInFrames={e.seqDur} name={e.shot.id} premountFor={30}>
                <SceneFor entry={e} />
              </TransitionSeries.Sequence>,
            );
            return out;
          })}
        </TransitionSeries>
      </AbsoluteFill>
    </CastingProvider>
  );
};
