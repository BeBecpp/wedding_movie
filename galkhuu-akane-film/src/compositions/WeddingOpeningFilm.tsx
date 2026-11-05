import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmTimeline } from "../components/FilmTimeline";
import { MusicBed, MusicProps } from "../components/MusicBed";
import { SafeAreaGuide } from "../components/SafeAreaGuide";
import { OPENING_FRAMES, openingShots } from "../config/openingStoryboard";
import { ensureFonts } from "../config/fonts";

ensureFonts();

export type FilmProps = MusicProps & { showSafeArea: boolean };

/** 80-second cinematic opening — played ONCE right before the wedding begins. */
export const WeddingOpeningFilm: React.FC<FilmProps> = (props) => (
  <AbsoluteFill>
    <FilmTimeline shots={openingShots} total={OPENING_FRAMES} />
    <MusicBed {...props} fadeInSec={1.5} fadeOutSec={4} />
    <SafeAreaGuide show={props.showSafeArea} />
  </AbsoluteFill>
);
