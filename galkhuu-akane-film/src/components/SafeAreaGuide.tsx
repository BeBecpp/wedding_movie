import React from "react";
import { AbsoluteFill } from "remotion";
import { safe } from "../config/design";

/** Studio-only review overlay: Zoom-safe region. Off by default. */
export const SafeAreaGuide: React.FC<{ show: boolean }> = ({ show }) =>
  !show ? null : (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div style={{ position: "absolute", left: safe.x, top: safe.y, width: safe.width, height: safe.height, border: "2px dashed rgba(220,40,40,0.7)" }} />
    </AbsoluteFill>
  );
