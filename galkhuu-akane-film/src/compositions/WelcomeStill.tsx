import React, { useMemo } from "react";
import { buildTimeline } from "../config/storyboard";
import { LOOP_FRAMES, loopShots } from "../config/loopStoryboard";
import { CastingProvider } from "../config/photoLoader";
import { SceneFor } from "../components/FilmTimeline";
import { ensureFonts } from "../config/fonts";
import { Freeze } from "remotion";

ensureFonts();

/** Emergency fallback: a single 1920x1080 welcome card (the loop's settled welcome). */
export const WelcomeStill: React.FC = () => {
  const { entries } = useMemo(() => buildTimeline(loopShots, LOOP_FRAMES), []);
  return (
    <CastingProvider entries={entries} loopLength={LOOP_FRAMES}>
      <Freeze frame={90}>
        <SceneFor entry={entries[0]} />
      </Freeze>
    </CastingProvider>
  );
};
