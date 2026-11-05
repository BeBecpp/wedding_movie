/**
 * "Casting": decides which actual photo appears in every slot of a timeline.
 *
 *  - Zero real photos  -> every slot shows its own labelled placeholder (review mode).
 *  - Some real photos  -> filled slots show their photo; empty slots borrow the
 *    least-recently-used real photo of a related category, so the film never
 *    shows a placeholder on the wedding day and never repeats a photo sooner
 *    than it has to.
 *  - enabled:false     -> slot is treated as absent (e.g. no ring photo => no rings).
 */
import { categoryOf, Category, Manifest, PhotoEntry } from "./manifest";

export type SlotUse = {
  slot: string;
  /** Collage cells may simply disappear instead of borrowing another photo. */
  droppable?: boolean;
};

export type CastShot = { id: string; start: number; uses: SlotUse[] };

export type Resolved = {
  entry: PhotoEntry;
  /** true when a real image file is shown */
  real: boolean;
  /** the slot that was asked for (may differ from entry.slot when borrowed) */
  requested: string;
  borrowed: boolean;
};

export type Casting = Record<string, Array<Resolved | null>>;

/** Which categories may stand in for a missing slot (people never become details). */
const CHAIN: Record<Category, Category[]> = {
  GALKHUU: ["GALKHUU", "COUPLE", "AKANE", "FAMILY"],
  AKANE: ["AKANE", "COUPLE", "GALKHUU", "FAMILY"],
  COUPLE: ["COUPLE", "GALKHUU", "AKANE", "FAMILY"],
  DETAIL: ["DETAIL", "COUPLE"],
  FAMILY: ["FAMILY", "COUPLE", "GALKHUU", "AKANE"],
};
const ALL: Category[] = ["COUPLE", "GALKHUU", "AKANE", "FAMILY", "DETAIL"];
/** Category relevance is worth this many frames of distance (6 s per rank step). */
const RANK_PENALTY = 180;

export const isReal = (e: PhotoEntry, files: Set<string>) =>
  e.enabled && !!e.src && files.has(e.src);

/**
 * Two passes:
 *  1. every slot that has its own usable photo takes it;
 *  2. the remaining slots borrow the photo that is FURTHEST in time from any
 *     other appearance of it (looking both backwards and forwards, and across
 *     the loop seam when `loopLength` is given), preferring related categories.
 */
export const castTimeline = (
  manifest: Manifest,
  staticFiles: Set<string>,
  shots: CastShot[],
  loopLength?: number,
): { casting: Casting; mode: "real" | "placeholder"; realCount: number } => {
  const bySlot = new Map(manifest.photos.map((p) => [p.slot, p]));
  const realCount = manifest.photos.filter((p) => isReal(p, staticFiles)).length;
  const mode = realCount > 0 ? "real" : "placeholder";
  const usable = (e: PhotoEntry | undefined): e is PhotoEntry =>
    !!e && (mode === "real" ? isReal(e, staticFiles) : e.enabled);
  const allowBorrow = mode === "placeholder" || manifest.fallbackStrategy === "reuse-least-recent";

  const uses = new Map<string, number[]>(); // photo slot -> times used
  const mark = (slot: string, t: number) => uses.set(slot, [...(uses.get(slot) ?? []), t]);
  const dist = (slot: string, t: number) => {
    let best = Infinity;
    for (const u of uses.get(slot) ?? []) {
      let d = Math.abs(u - t);
      if (loopLength) d = Math.min(d, loopLength - d);
      best = Math.min(best, d);
    }
    return best;
  };
  const resolved = (entry: PhotoEntry, requested: string): Resolved => ({
    entry,
    real: isReal(entry, staticFiles),
    requested,
    borrowed: entry.slot !== requested,
  });

  const ordered = [...shots].sort((a, b) => a.start - b.start);
  const casting: Casting = {};
  const pending: Array<{ shot: CastShot; i: number }> = [];

  // pass 1 — own photos
  for (const shot of ordered) {
    casting[shot.id] = shot.uses.map((use, i) => {
      const own = bySlot.get(use.slot);
      if (usable(own)) {
        mark(own.slot, shot.start);
        return resolved(own, use.slot);
      }
      if (!use.droppable) pending.push({ shot, i });
      return null;
    });
    // a collage must never end up empty: its first cell borrows
    if (shot.uses.length && casting[shot.id].every((r) => r === null) && shot.uses.every((u) => u.droppable)) {
      pending.push({ shot, i: 0 });
    }
  }

  // pass 2 — borrow
  pending.sort((a, b) => a.shot.start - b.shot.start);
  for (const { shot, i } of pending) {
    const use = shot.uses[i];
    const own = bySlot.get(use.slot);
    const inShot = new Set(casting[shot.id].filter((r): r is Resolved => !!r).map((r) => r.entry.slot));
    let pick: PhotoEntry | undefined;
    if (allowBorrow) {
      const cat = categoryOf(use.slot);
      const pickFrom = (cats: Category[]) => {
        let best: PhotoEntry | undefined;
        let bestScore = -Infinity;
        manifest.photos.forEach((p, idx) => {
          const rank = cats.indexOf(categoryOf(p.slot));
          if (rank < 0 || !usable(p) || inShot.has(p.slot)) return;
          const d = Math.min(dist(p.slot, shot.start), 1e6);
          const score = d - rank * RANK_PENALTY - idx * 0.001;
          if (score > bestScore) {
            bestScore = score;
            best = p;
          }
        });
        return best;
      };
      pick = pickFrom(CHAIN[cat]) ?? pickFrom(ALL);
    }
    if (!pick) {
      // nothing at all to show — this slot's own labelled placeholder
      pick = own ?? {
        id: use.slot.toLowerCase(),
        slot: use.slot,
        src: null,
        orientation: "landscape",
        focalX: 0.5,
        focalY: 0.4,
        cropMode: "auto",
        enabled: true,
        notes: "",
      };
    }
    mark(pick.slot, shot.start);
    casting[shot.id][i] = resolved(pick, use.slot);
  }
  return { casting, mode, realCount };
};
