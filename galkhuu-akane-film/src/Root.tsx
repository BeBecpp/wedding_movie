import React from "react";
import { Composition, Still } from "remotion";
import { WeddingOpeningFilm, FilmProps } from "./compositions/WeddingOpeningFilm";
import { WeddingGuestLoop } from "./compositions/WeddingGuestLoop";
import { WelcomeStill } from "./compositions/WelcomeStill";
import { WeddingMemoryFilm } from "./compositions/WeddingMemoryFilm";
import { MEMORY_FRAMES } from "./config/memoryStoryboard";
import { WAITING_FRAMES, WeddingWaitingLoop } from "./compositions/WeddingWaitingLoop";
import { FPS, HEIGHT, WIDTH } from "./config/design";
import { OPENING_FRAMES } from "./config/openingStoryboard";
import { LOOP_FRAMES } from "./config/loopStoryboard";

const defaults: FilmProps = {
  withMusic: false,
  musicSrc: null,
  musicVolume: 0.6,
  showSafeArea: false,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="WeddingOpeningFilm"
      component={WeddingOpeningFilm}
      durationInFrames={OPENING_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaults}
    />
    <Composition
      id="WeddingGuestLoop"
      component={WeddingGuestLoop}
      durationInFrames={LOOP_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={defaults}
    />
    <Composition
      id="WeddingMemoryFilm"
      component={WeddingMemoryFilm}
      durationInFrames={MEMORY_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="WeddingWaitingLoop"
      component={WeddingWaitingLoop}
      durationInFrames={WAITING_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Still id="WelcomeStill" component={WelcomeStill} width={WIDTH} height={HEIGHT} />
  </>
);
