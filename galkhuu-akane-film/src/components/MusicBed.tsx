/**
 * OPTIONAL, LOCAL-ONLY music. Silent by default (withMusic: false).
 * The audio file must be supplied by the operator on their own machine
 * (e.g. public/local-audio/opening.m4a — git-ignored) AFTER rights are
 * confirmed. Nothing is ever downloaded or bundled by this project.
 */
import React from "react";
import { Audio, getStaticFiles, interpolate, staticFile, useVideoConfig } from "remotion";

export type MusicProps = {
  withMusic: boolean;
  /** path relative to public/, e.g. "local-audio/opening.m4a" */
  musicSrc: string | null;
  /** 0..1 — keep low; guests talk over the pre-show */
  musicVolume: number;
};

export const MusicBed: React.FC<MusicProps & { fadeInSec?: number; fadeOutSec?: number }> = ({
  withMusic,
  musicSrc,
  musicVolume,
  fadeInSec = 2,
  fadeOutSec = 4,
}) => {
  const { fps, durationInFrames } = useVideoConfig();
  if (!withMusic || !musicSrc) return null;
  const exists = getStaticFiles().some((f) => f.name === musicSrc);
  if (!exists) {
    console.warn(`[music] withMusic is true but public/${musicSrc} was not found — rendering silent.`);
    return null;
  }
  return (
    <Audio
      src={staticFile(musicSrc)}
      volume={(f) =>
        musicVolume *
        interpolate(f, [0, fadeInSec * fps, durationInFrames - fadeOutSec * fps, durationInFrames], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      }
    />
  );
};
