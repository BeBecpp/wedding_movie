// Entry used by Node QA scripts (bundled on the fly with esbuild).
export { validateManifest, categoryOf } from "../src/config/manifest";
export { castTimeline, isReal } from "../src/config/casting";
export { buildTimeline } from "../src/config/storyboard";
export { openingShots, OPENING_FRAMES } from "../src/config/openingStoryboard";
export { loopShots, LOOP_FRAMES, LOOP_TAIL_SEQ } from "../src/config/loopStoryboard";
