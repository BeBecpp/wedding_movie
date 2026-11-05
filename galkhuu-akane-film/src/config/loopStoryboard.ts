/**
 * WeddingGuestLoop — 240 s / 7200 frames, designed to repeat seamlessly.
 *
 * Seam design: the welcome shot exists twice — at the head (0:00–0:24) and as
 * the tail (3:46–4:00). Both share ONE continuous scene clock: the tail plays
 * that scene's first `TAIL` frames, the head continues from frame TAIL. So the
 * last frame of the file flows directly into the first frame — no reset,
 * no black, the title never disappears across the seam.
 *
 * Text cards used (5 distinct, brief allows 4–6):
 *   1 Welcome block  2 Two people…  3 The best moments…  4 A little laughter…  5 Thank you…
 */
import { sec } from "./timing";
import type { Shot } from "./storyboard";
import { TEXT } from "./text";

export const LOOP_FRAMES = 7200;
const TAIL_IN = 72; // transition frames into the tail welcome
export const LOOP_TAIL_VISUAL = sec(10);
/** length of the tail sequence = visual + half of its incoming transition */
export const LOOP_TAIL_SEQ = LOOP_TAIL_VISUAL + TAIL_IN / 2;

export const loopShots: Shot[] = [
  // A 00:00–00:24  Welcome (already settled at frame 0 — see seam note)
  {
    id: "lp01-welcome", dur: sec(24), layout: "arch",
    slots: [{ slot: "COUPLE_HERO_02" }],
    opts: { clockOffset: LOOP_TAIL_SEQ, camTotal: LOOP_TAIL_SEQ + sec(24) + 15, seamHead: true },
    marker: "Welcome — loop start (seamless)",
  },
  // B 00:24–01:04  Individual portraits
  {
    id: "lp02-galkhuu-1", dur: sec(8), layout: "blurBackdrop",
    slots: [{ slot: "GALKHUU_PORTRAIT_01" }],
    in: { kind: "dissolve", frames: 30 }, cam: "pushInSlow", opts: { align: "center" },
    marker: "Portraits",
  },
  {
    id: "lp03-akane-1", dur: sec(8), layout: "blurBackdrop",
    slots: [{ slot: "AKANE_PORTRAIT_01" }],
    in: { kind: "drift", frames: 32, dir: "left" }, cam: "pushInSlow", opts: { align: "center" },
  },
  {
    id: "lp04-pair", dur: sec(8), layout: "split",
    slots: [{ slot: "GALKHUU_PORTRAIT_02" }, { slot: "AKANE_PORTRAIT_02" }],
    in: { kind: "veil", frames: 30 }, opts: { converge: true, reveal: "stagger" },
  },
  {
    id: "lp05-galkhuu-3", dur: sec(7), layout: "portraitEditorial",
    slots: [{ slot: "GALKHUU_PORTRAIT_03" }],
    in: { kind: "dissolve", frames: 28 }, cam: "pushIn", opts: { side: "left" },
  },
  {
    id: "lp06-akane-3", dur: sec(9), layout: "portraitEditorial",
    slots: [{ slot: "AKANE_PORTRAIT_03" }],
    in: { kind: "wipe", frames: 30, dir: "left" }, cam: "pushIn", opts: { side: "right" },
  },
  // C 01:04–01:42  Together
  {
    id: "lp07-look", dur: sec(10), layout: "fullBleed",
    slots: [{ slot: "COUPLE_LOOK_01" }],
    in: { kind: "bloom", frames: 36 }, cam: "pushInSlow",
    opts: { text: [TEXT.twoPeople, TEXT.oneBeginning], textAt: 54, textGap: 36, textOut: 250 },
    marker: "Together",
  },
  {
    id: "lp08-walk", dur: sec(7), layout: "fullBleed",
    slots: [{ slot: "COUPLE_WALKING_01" }],
    in: { kind: "dissolve", frames: 30 }, cam: "panLeft",
  },
  {
    id: "lp09-collage", dur: sec(9), layout: "collage",
    slots: [{ slot: "COUPLE_CANDID_01", droppable: true }, { slot: "COUPLE_WALKING_02", droppable: true }, { slot: "COUPLE_LOOK_02", droppable: true }],
    in: { kind: "wipe", frames: 28, dir: "up" },
  },
  {
    id: "lp10-close", dur: sec(6), layout: "fullBleed",
    slots: [{ slot: "COUPLE_CANDID_04" }],
    in: { kind: "dissolve", frames: 26 }, cam: "pushIn",
  },
  {
    id: "lp11-hands", dur: sec(6), layout: "fullBleed",
    slots: [{ slot: "COUPLE_HANDS_01" }],
    in: { kind: "drift", frames: 28, dir: "right" }, cam: "rise", opts: { grade: "duotoneBloom", inset: true },
  },
  // D 01:42–02:18  Light-hearted candid
  {
    id: "lp12-laugh", dur: sec(7), layout: "fullBleed",
    slots: [{ slot: "COUPLE_CANDID_02" }],
    in: { kind: "bloom", frames: 30 }, cam: "pushIn",
    opts: { text: TEXT.realMoments, textAt: 36, textOut: 180 },
    marker: "Candid joy",
  },
  {
    id: "lp13-reaction", dur: sec(8), layout: "split",
    slots: [{ slot: "GALKHUU_CANDID_01" }, { slot: "AKANE_CANDID_01" }],
    in: { kind: "dissolve", frames: 24 }, opts: { reaction: true, revealAt: 54 },
  },
  {
    id: "lp14-family", dur: sec(7), layout: "fullBleed",
    slots: [{ slot: "FAMILY_OR_FRIENDS_01" }],
    in: { kind: "dissolve", frames: 28 }, cam: "panRight",
  },
  {
    id: "lp15-collage", dur: sec(8), layout: "collage",
    slots: [{ slot: "COUPLE_CANDID_03", droppable: true }, { slot: "FAMILY_OR_FRIENDS_02", droppable: true }, { slot: "COUPLE_CANDID_05", droppable: true }],
    in: { kind: "veil", frames: 28 },
  },
  {
    id: "lp16-candid", dur: sec(6), layout: "fullBleed",
    slots: [{ slot: "COUPLE_CANDID_06" }],
    in: { kind: "dissolve", frames: 26 }, cam: "driftRight",
  },
  // E 02:18–03:02  Wedding details
  {
    id: "lp17-bouquet", dur: sec(8), layout: "portraitEditorial",
    slots: [{ slot: "DETAIL_BOUQUET_01" }],
    in: { kind: "bloom", frames: 32 }, cam: "pushInSlow", opts: { side: "right", florals: "rich" },
    marker: "Details",
  },
  {
    id: "lp18-invitation", dur: sec(7), layout: "fullBleed",
    slots: [{ slot: "DETAIL_INVITATION_01" }],
    in: { kind: "dissolve", frames: 28 }, cam: "sink", opts: { inset: true },
  },
  {
    id: "lp19-collage", dur: sec(9), layout: "collage",
    slots: [{ slot: "DETAIL_DECOR_01", droppable: true }, { slot: "DETAIL_RINGS_01", droppable: true }, { slot: "DETAIL_ATTIRE_01", droppable: true }],
    in: { kind: "wipe", frames: 28, dir: "right" },
  },
  {
    id: "lp20-hands", dur: sec(7), layout: "fullBleed",
    slots: [{ slot: "COUPLE_HANDS_02" }],
    in: { kind: "dissolve", frames: 28 }, cam: "pushIn",
  },
  {
    id: "lp21-decor", dur: sec(6), layout: "fullBleed",
    slots: [{ slot: "DETAIL_DECOR_02" }],
    in: { kind: "drift", frames: 28, dir: "left" }, cam: "panRight",
  },
  {
    id: "lp22-attire", dur: sec(7), layout: "split",
    slots: [{ slot: "DETAIL_ATTIRE_02" }, { slot: "DETAIL_BOUQUET_02" }],
    in: { kind: "dissolve", frames: 26 }, opts: { converge: true },
  },
  // F 03:02–03:32  Deep warm hero
  {
    id: "lp23-hero", dur: sec(14), layout: "fullBleed",
    slots: [{ slot: "COUPLE_HERO_01" }],
    in: { kind: "bloom", frames: 36 }, cam: "pushInDeep",
    opts: { text: [TEXT.littleLaughter, TEXT.lotOfLove], textAt: 120, textGap: 40, textOut: 380, vignette: 0.2, lift: true },
    marker: "Deep warm hero — emotional lift",
  },
  {
    id: "lp24-hero3", dur: sec(16), layout: "blurBackdrop",
    slots: [{ slot: "COUPLE_HERO_03" }],
    in: { kind: "dissolve", frames: 36 }, cam: "pushInSlow", opts: { align: "center", lift: true },
  },
  // G 03:32–04:00  Reprise + seamless return
  {
    id: "lp25-thanks", dur: sec(18), layout: "thankYou",
    slots: [{ slot: "COUPLE_WALKING_02" }],
    in: { kind: "dissolve", frames: 36 }, cam: "driftLeft",
    opts: { text: TEXT.thankYou, textAt: 40, textOut: 480 },
    marker: "Reprise — thank you",
  },
  {
    id: "lp26-welcome-tail", dur: LOOP_TAIL_VISUAL, layout: "arch",
    slots: [{ slot: "COUPLE_HERO_02" }],
    in: { kind: "bloom", frames: TAIL_IN },
    opts: { clockOffset: 0, camTotal: LOOP_TAIL_SEQ + sec(24) + 15, seamTail: true, intentionalRepeat: true },
    marker: "Welcome reprise — flows into 00:00",
  },
];
