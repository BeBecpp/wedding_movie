/**
 * Fonts are loaded from the locally installed open-licence (SIL OFL)
 * @fontsource packages — no network access needed at render time and no font
 * binaries are copied into the repository.
 */
import { loadFont } from "@remotion/fonts";
import cg300 from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-normal.woff2";
import cg400 from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2";
import cg500 from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2";
import cg300i from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-300-italic.woff2";
import cg400i from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-400-italic.woff2";
import cg500i from "@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2";
import in300 from "@fontsource/inter/files/inter-latin-300-normal.woff2";
import in400 from "@fontsource/inter/files/inter-latin-400-normal.woff2";
import in500 from "@fontsource/inter/files/inter-latin-500-normal.woff2";

let started = false;

export const ensureFonts = () => {
  if (started) return;
  started = true;
  const faces: Array<[string, string, string, "normal" | "italic"]> = [
    ["Cormorant Garamond", cg300, "300", "normal"],
    ["Cormorant Garamond", cg400, "400", "normal"],
    ["Cormorant Garamond", cg500, "500", "normal"],
    ["Cormorant Garamond", cg300i, "300", "italic"],
    ["Cormorant Garamond", cg400i, "400", "italic"],
    ["Cormorant Garamond", cg500i, "500", "italic"],
    ["Inter", in300, "300", "normal"],
    ["Inter", in400, "400", "normal"],
    ["Inter", in500, "500", "normal"],
  ];
  for (const [family, url, weight, style] of faces) {
    loadFont({ family, url, weight, style });
  }
};
