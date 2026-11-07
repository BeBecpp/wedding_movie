/**
 * WeddingMemoryFilm — editable storyboard.
 *
 * Photos are referenced by their pack number ("01".."45"). Processed, cropped,
 * metadata-free copies live in public/local-photos/memory/NN.jpg (git-ignored,
 * never committed). Chronology and chapter placement are an EDITORIAL guess
 * from the contact sheets — identities, kinship and dates are NOT confirmed.
 *
 * EXCLUDED by the couple's request (2026-11-07): photos 32 and 26 — never use them.
 *
 * Times are in seconds on the film timeline (30 fps). Each shot runs from
 * `at` to the next shot's `at`. Transitions are centred on the cut.
 *
 * Music map (measured loudness envelopes of the official "Meetings" recordings):
 *   0.0 s   Song 85  "Welcome One Another"  (132.5 s, sound ends ~127 s)
 *   126.5 s Song 132 "Now We Are One"       (129.8 s; quiet intro 0–17, build 18,
 *            lift 32, breath 42, climax 56–89, breath 90–103, final lift 104,
 *            resolving tail 109–124)  -> film 126.5 / 144.5 / 158.5 / 168.5 / 183 / 230.5 / 250.5
 */
import { MEMORY_PHOTO_DIMS } from "./memoryPhotoDims";

export const MEMORY_FPS = 30;
export const MEMORY_SECONDS = 254;
export const MEMORY_FRAMES = MEMORY_SECONDS * MEMORY_FPS; // 7620
/** Film time at which song 132 starts (song 85 starts at 0). */
export const SONG2_START_SEC = 126.5;

export type MemoryCam = "pushInSlow" | "pushIn" | "pullOut" | "driftLeft" | "driftRight" | "rise" | "sink" | "panLeft" | "panRight" | "still";

export type MemoryPhoto = { id: string; fx?: number; fy?: number };

export type MemoryShot =
  | { kind: "title"; at: number; kicker?: string; title: string; sub?: string; chapter?: string }
  | { kind: "feature"; at: number; photo: MemoryPhoto; cam?: MemoryCam; chapter: string }
  | { kind: "bleed"; at: number; photo: MemoryPhoto; cam?: MemoryCam; chapter: string }
  | { kind: "gallery"; at: number; photos: MemoryPhoto[]; cam?: MemoryCam; chapter: string }
  | { kind: "finale"; at: number; photo: MemoryPhoto };

const p = (id: string, fx = 0.5, fy = 0.45): MemoryPhoto => ({ id, fx, fy });

export const memoryShots: MemoryShot[] = [
  // ── Opening (song 154) ───────────────────────────────────────────
  { kind: "title", at: 0, kicker: "Galkhuu & Akane", title: "Every story has a beginning" },
  // ── Chapter I · The Beginning ─────────────────────────────────────────
  { kind: "title", at: 6.5, chapter: "I", kicker: "Chapter One", title: "The Beginning" },
  { kind: "feature", at: 10.5, photo: p("44", 0.5, 0.4), cam: "pushInSlow", chapter: "I" },
  { kind: "feature", at: 17.0, photo: p("38", 0.5, 0.6), cam: "driftLeft", chapter: "I" },
  { kind: "feature", at: 23.5, photo: p("45"), cam: "pullOut", chapter: "I" },
  { kind: "feature", at: 29.5, photo: p("12"), cam: "driftRight", chapter: "I" },
  { kind: "feature", at: 35.5, photo: p("10"), cam: "pushInSlow", chapter: "I" },
  { kind: "feature", at: 42.0, photo: p("36"), cam: "pullOut", chapter: "I" },
  { kind: "gallery", at: 48.5, photos: [p("19"), p("06")], cam: "pushInSlow", chapter: "I" },
  // ── Chapter II · The People in Our Lives ──────────────────────────────
  { kind: "title", at: 55.0, chapter: "II", kicker: "Chapter Two", title: "The People in Our Lives" },
  { kind: "feature", at: 59.0, photo: p("11"), cam: "pushInSlow", chapter: "II" },
  { kind: "gallery", at: 65.0, photos: [p("05"), p("40")], cam: "driftRight", chapter: "II" },
  { kind: "gallery", at: 71.0, photos: [p("14"), p("25")], cam: "pushInSlow", chapter: "II" },
  { kind: "feature", at: 77.0, photo: p("04"), cam: "driftLeft", chapter: "II" },
  { kind: "gallery", at: 83.0, photos: [p("01"), p("39")], cam: "pullOut", chapter: "II" },
  { kind: "gallery", at: 89.0, photos: [p("09"), p("24")], cam: "driftRight", chapter: "II" },
  { kind: "gallery", at: 95.0, photos: [p("34"), p("35")], cam: "pushInSlow", chapter: "II" },
  { kind: "gallery", at: 101.0, photos: [p("15"), p("41")], cam: "driftLeft", chapter: "II" },
  { kind: "feature", at: 107.0, photo: p("07"), cam: "pullOut", chapter: "II" },
  { kind: "gallery", at: 113.5, photos: [p("30"), p("21")], cam: "pushInSlow", chapter: "II" },
  { kind: "gallery", at: 120.0, photos: [p("43"), p("17")], cam: "driftRight", chapter: "II" },
  // ── Chapter III · Our Own Stories (song 132 intro → lift) ────────────
  { kind: "title", at: 126.5, chapter: "III", kicker: "Chapter Three", title: "Our Own Stories" },
  { kind: "bleed", at: 132.5, photo: p("33", 0.45, 0.55), cam: "panLeft", chapter: "III" },
  { kind: "feature", at: 140.0, photo: p("42"), cam: "rise", chapter: "III" },
  { kind: "feature", at: 147.0, photo: p("20"), cam: "pushInSlow", chapter: "III" },
  { kind: "gallery", at: 154.0, photos: [p("02"), p("16")], cam: "driftLeft", chapter: "III" },
  { kind: "feature", at: 161.0, photo: p("31", 0.5, 0.6), cam: "pushInSlow", chapter: "III" },
  { kind: "bleed", at: 169.0, photo: p("28", 0.45, 0.6), cam: "panRight", chapter: "III" },
  // ── Chapter IV · A Beautiful New Chapter (song 132 climax → resolve) ─
  { kind: "title", at: 178.0, chapter: "IV", kicker: "Chapter Four", title: "A Beautiful New Chapter" },
  { kind: "feature", at: 183.0, photo: p("29"), cam: "pushInSlow", chapter: "IV" },
  { kind: "gallery", at: 190.0, photos: [p("18"), p("23")], cam: "driftRight", chapter: "IV" },
  { kind: "feature", at: 197.0, photo: p("08"), cam: "pushInSlow", chapter: "IV" },
  { kind: "feature", at: 204.0, photo: p("22"), cam: "driftLeft", chapter: "IV" },
  { kind: "feature", at: 211.0, photo: p("03"), cam: "pushInSlow", chapter: "IV" },
  { kind: "gallery", at: 218.0, photos: [p("27"), p("37")], cam: "pullOut", chapter: "IV" },
  { kind: "feature", at: 225.0, photo: p("13", 0.5, 0.55), cam: "pushIn", chapter: "IV" },
  // ── Finale: names (song 132 final lift tail resolves under the names) ─
  { kind: "finale", at: 233.0, photo: p("13", 0.5, 0.55) },
];

export const photoSrc = (id: string) => `local-photos/memory/${id}.jpg`;
export const dimsOf = (id: string): [number, number] => MEMORY_PHOTO_DIMS[id] ?? [1600, 1200];

/** All photo ids used (for QA). */
export const usedPhotoIds = () => {
  const s = new Set<string>();
  for (const sh of memoryShots) {
    if ("photo" in sh) s.add(sh.photo.id);
    if ("photos" in sh) sh.photos.forEach((x) => s.add(x.id));
  }
  return [...s].sort();
};
