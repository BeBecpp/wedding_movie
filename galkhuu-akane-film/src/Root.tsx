import React from "react";
import { Composition, Still } from "remotion";
import { WeddingOpeningFilm, FilmProps } from "./compositions/WeddingOpeningFilm";
import { WeddingGuestLoop } from "./compositions/WeddingGuestLoop";
import { WelcomeStill } from "./compositions/WelcomeStill";
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
    <Still id="WelcomeStill" component={WelcomeStill} width={WIDTH} height={HEIGHT} />
  </>
);
