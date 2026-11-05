import React from "react";
import { AbsoluteFill } from "remotion";
import { FilmTimeline } from "../components/FilmTimeline";
import { MusicBed } from "../components/MusicBed";
import { SafeAreaGuide } from "../components/SafeAreaGuide";
import { LOOP_FRAMES, loopShots } from "../config/loopStoryboard";
import { ensureFonts } from "../config/fonts";
import type { FilmProps } from "./WeddingOpeningFilm";

ensureFonts();

/** 4:00 seamless guest-arrival loop. */
export const WeddingGuestLoop: React.FC<FilmProps> = (props) => (
  <AbsoluteFill>
    <FilmTimeline shots={loopShots} total={LOOP_FRAMES} loop />
    {/* For the loop, music is best played separately (see README); optional here. */}
    <MusicBed {...props} fadeInSec={0} fadeOutSec={0} />
    <SafeAreaGuide show={props.showSafeArea} />
  </AbsoluteFill>
);
