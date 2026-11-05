/**
 * WeddingOpeningFilm — 80 s / 2400 frames.
 * Arc: anticipation -> two portraits -> shared joy -> gentle humour -> hero title.
 * Times in comments are composition timecodes. Markers are editorial guides,
 * NOT measured musical beats.
 */
import { sec } from "./timing";
import type { Shot } from "./storyboard";
import { TEXT } from "./text";

export const OPENING_FRAMES = 2400;

export const openingShots: Shot[] = [
  // 00:00–00:07  Anticipation
  {
    id: "op01-dawn", dur: sec(7), layout: "atmosphere", slots: [],
    opts: { text: TEXT.dayBegins, textAt: 42, textOut: 168, dawn: true },
    marker: "Intro — quiet reveal",
  },
  // 00:07–00:18  Two portraits that converse across the cut
  {
    id: "op02-meet-galkhuu", dur: sec(4.5), layout: "portraitEditorial",
    slots: [{ slot: "GALKHUU_PORTRAIT_01" }],
    in: { kind: "veil", frames: 30 }, cam: "pushIn",
    opts: { side: "right", line1: "Meet", name: TEXT.groom, textAt: 18 },
    marker: "Portraits",
  },
  {
    id: "op03-meet-akane", dur: sec(3.5), layout: "portraitEditorial",
    slots: [{ slot: "AKANE_PORTRAIT_01" }],
    in: { kind: "cut" }, cam: "pushIn",
    opts: { side: "left", line1: "Meet", name: TEXT.bride, textAt: 8, reveal: true },
  },
  {
    id: "op04-split", dur: sec(3), layout: "split",
    slots: [{ slot: "GALKHUU_PORTRAIT_01" }, { slot: "AKANE_PORTRAIT_01" }],
    in: { kind: "dissolve", frames: 20 },
    opts: { converge: true, intentionalRepeat: true },
  },
  // 00:18–00:31  Together
  {
    id: "op05-couple-first", dur: sec(8), layout: "blurBackdrop",
    slots: [{ slot: "COUPLE_HERO_02" }],
    in: { kind: "bloom", frames: 30 }, cam: "pushInSlow",
    opts: { align: "right", text: [TEXT.twoPeople, TEXT.oneBeginning], textAt: 40, textGap: 34, textOut: 222 },
    marker: "Together — first couple portrait (hold)",
  },
  {
    id: "op06-close-smiles", dur: sec(5), layout: "fullBleed",
    slots: [{ slot: "COUPLE_CANDID_01" }],
    in: { kind: "dissolve", frames: 24 }, cam: "driftLeft",
  },
  // 00:31–00:44  Gentle humour — portrait-to-portrait reaction edit
  {
    id: "op07-laughter", dur: sec(4.5), layout: "fullBleed",
    slots: [{ slot: "COUPLE_CANDID_02" }],
    in: { kind: "wipe", frames: 26, dir: "right" }, cam: "pushIn",
    opts: { text: TEXT.littleLaughter, textAt: 20, textOut: 128 },
    marker: "Light-hearted lift",
  },
  {
    id: "op08-reaction", dur: sec(5.5), layout: "split",
    slots: [{ slot: "GALKHUU_PORTRAIT_02" }, { slot: "AKANE_PORTRAIT_02" }, { slot: "GALKHUU_CANDID_01" }],
    in: { kind: "cut" },
    opts: { reaction: true, revealAt: 40, thirdAt: 104 },
    marker: "Reaction edit — clean cuts on the beat if music allows",
  },
  {
    id: "op09-love", dur: sec(3), layout: "fullBleed",
    slots: [{ slot: "COUPLE_CANDID_03" }],
    in: { kind: "dissolve", frames: 20 }, cam: "pushInSlow",
    opts: { text: TEXT.lotOfLove, textAt: 6, textOut: 84, textPos: "top" },
  },
  // 00:44–00:59  Details -> faces -> wide -> details (no text)
  {
    id: "op10-hands", dur: sec(3.5), layout: "fullBleed",
    slots: [{ slot: "COUPLE_HANDS_01" }],
    in: { kind: "drift", frames: 24, dir: "left" }, cam: "rise",
    opts: { inset: true },
    marker: "Breathing section — details",
  },
  {
    id: "op11-details", dur: sec(3.5), layout: "collage",
    slots: [{ slot: "DETAIL_BOUQUET_01", droppable: true }, { slot: "DETAIL_DECOR_01", droppable: true }, { slot: "DETAIL_RINGS_01", droppable: true }],
    in: { kind: "wipe", frames: 24, dir: "up" },
  },
  {
    id: "op12-walk", dur: sec(4), layout: "fullBleed",
    slots: [{ slot: "COUPLE_WALKING_01" }],
    in: { kind: "dissolve", frames: 30 }, cam: "panLeft",
  },
  {
    id: "op13-look", dur: sec(4), layout: "fullBleed",
    slots: [{ slot: "COUPLE_LOOK_01" }],
    in: { kind: "bloom", frames: 28 }, cam: "pushIn",
    opts: { grade: "duotoneBloom" },
  },
  // 00:59–01:11  Emotional payoff
  {
    id: "op14-hero", dur: sec(12), layout: "fullBleed",
    slots: [{ slot: "COUPLE_HERO_01" }],
    in: { kind: "dissolve", frames: 36 }, cam: "pushInDeep",
    opts: { text: TEXT.realMoments, textAt: 150, textOut: 330, vignette: 0.22 },
    marker: "Hero payoff — let the melody lift here",
  },
  // 01:11–01:20  Hero title, held >= 4 s
  {
    id: "op15-endcard", dur: sec(9), layout: "endCard",
    slots: [{ slot: "COUPLE_HERO_01" }],
    in: { kind: "dissolve", frames: 36 },
    opts: { intentionalRepeat: true },
    marker: "End card — names held stable from 01:13.5 to 01:20",
  },
];
