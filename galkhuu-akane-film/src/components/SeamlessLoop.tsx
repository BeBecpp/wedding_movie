/**
 * Scene clock + seamless-loop helpers.
 *
 * Every component in this project reads time through useT() instead of
 * useCurrentFrame(). A <SceneClock offset> shifts that clock, which lets the
 * guest loop play ONE welcome scene across the file boundary: the tail of the
 * file shows scene-time 0…TAIL-1 and the head continues at TAIL…, so frame
 * 7199 -> frame 0 is a continuous moment instead of a reset.
 */
import React, { createContext, useContext } from "react";
import { useCurrentFrame } from "remotion";

const OffsetCtx = createContext(0);
const LeadCtx = createContext(0);

export const SceneClock: React.FC<{ offset?: number; lead?: number; children: React.ReactNode }> = ({
  offset = 0,
  lead = 0,
  children,
}) => (
  <OffsetCtx.Provider value={offset}>
    <LeadCtx.Provider value={lead}>{children}</LeadCtx.Provider>
  </OffsetCtx.Provider>
);

/** Scene-local time in frames (sequence frame + clock offset). */
export const useT = () => useCurrentFrame() + useContext(OffsetCtx);

/**
 * Time relative to the shot's visual boundary (sequence frame minus the half
 * transition lead). Text cues in storyboards are expressed in this time.
 */
export const useCueT = () => useT() - useContext(LeadCtx);
