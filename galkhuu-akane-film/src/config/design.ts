/**
 * Design system — "A Little Laughter, A Lifetime Together"
 * All colour, type, spacing and motion tokens live here so both films share
 * one visual language.
 */
import { Easing } from "remotion";

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const colors = {
  ivory: "#F8F4EC",
  champagne: "#E8D7C0",
  gold: "#B78C57",
  ink: "#3E342C",
  sage: "#B9C2AE",
  rose: "#D9B7AD",
  // derived helpers (kept within the palette family)
  ivoryDeep: "#F1EADD",
  paper: "#FBF8F2",
  goldSoft: "rgba(183,140,87,0.55)",
  inkSoft: "rgba(62,52,44,0.72)",
  inkMuted: "rgba(62,52,44,0.5)",
} as const;

export const fonts = {
  display: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  sans: "'Inter', 'DM Sans', 'Helvetica Neue', Arial, sans-serif",
  mono: "'DejaVu Sans Mono', Menlo, Consolas, monospace",
} as const;

/**
 * Zoom-safe content region. Zoom tiles, phone previews and some hall
 * projectors crop or overlay the edges, so faces and text stay inside this box.
 */
export const safe = {
  x: 150,
  y: 96,
  width: WIDTH - 300,
  height: HEIGHT - 192,
} as const;

export const motion = {
  /** Ken-Burns scale range across an exposure (brief: 1.00–1.07). */
  kbMin: 1.0,
  kbMax: 1.07,
  /** Upward drift for text entries, in px (brief: 10–16 px). */
  textDrift: 14,
  textIn: 26, // frames
  textOut: 20, // frames
  ease: Easing.bezier(0.33, 0, 0.2, 1), // calm "film" ease
  easeInOut: Easing.bezier(0.45, 0, 0.25, 1),
  easeOut: Easing.bezier(0.16, 1, 0.3, 1),
} as const;

export const sec = (s: number) => Math.round(s * FPS);
