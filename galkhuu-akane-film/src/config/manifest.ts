/**
 * Photo manifest schema + validation. Pure TypeScript (no Remotion import) so
 * the same code runs in Studio, during renders and in the Node QA scripts.
 */
export type Orientation = "portrait" | "landscape" | "square";
export type CropMode = "auto" | "cover" | "contain";
export type Category = "GALKHUU" | "AKANE" | "COUPLE" | "DETAIL" | "FAMILY";

export type PhotoEntry = {
  id: string;
  slot: string;
  /** Path relative to public/, e.g. "assets/photos/COUPLE_HERO_01.jpg". null = placeholder. */
  src: string | null;
  orientation: Orientation;
  /** 0..1 — horizontal position of the faces / subject. */
  focalX: number;
  /** 0..1 — vertical position of the faces / subject. */
  focalY: number;
  cropMode: CropMode;
  enabled: boolean;
  notes: string;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
};

export type Manifest = {
  version: number;
  fallbackStrategy: "reuse-least-recent" | "placeholder";
  photos: PhotoEntry[];
};

const ORIENTATIONS: Orientation[] = ["portrait", "landscape", "square"];
const CROPS: CropMode[] = ["auto", "cover", "contain"];

export const categoryOf = (slot: string): Category => {
  if (slot.startsWith("GALKHUU")) return "GALKHUU";
  if (slot.startsWith("AKANE")) return "AKANE";
  if (slot.startsWith("DETAIL")) return "DETAIL";
  if (slot.startsWith("FAMILY")) return "FAMILY";
  return "COUPLE";
};

const clamp01 = (n: unknown, d: number) =>
  typeof n === "number" && Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : d;

/** Validates & normalises; never throws — returns warnings instead. */
export const validateManifest = (
  raw: unknown,
): { manifest: Manifest; warnings: string[] } => {
  const warnings: string[] = [];
  const obj = (raw ?? {}) as Record<string, unknown>;
  const list = Array.isArray(obj.photos) ? obj.photos : [];
  if (!Array.isArray(obj.photos)) warnings.push("manifest.photos is missing or not an array");
  const seen = new Set<string>();
  const photos: PhotoEntry[] = [];
  list.forEach((p: any, i: number) => {
    if (!p || typeof p.slot !== "string" || !p.slot) {
      warnings.push(`photos[${i}] has no slot — ignored`);
      return;
    }
    if (seen.has(p.slot)) {
      warnings.push(`duplicate slot ${p.slot} — later entry ignored`);
      return;
    }
    seen.add(p.slot);
    let src: string | null = typeof p.src === "string" && p.src.trim() ? p.src.trim() : null;
    if (src && /^(https?:)?\/\//i.test(src)) {
      warnings.push(`${p.slot}: remote URLs are not allowed — using placeholder`);
      src = null;
    }
    if (src) src = src.replace(/^\/+/, "").replace(/^public\//, "");
    const orientation = ORIENTATIONS.includes(p.orientation) ? p.orientation : "landscape";
    if (!ORIENTATIONS.includes(p.orientation)) warnings.push(`${p.slot}: bad orientation, using landscape`);
    const cropMode = CROPS.includes(p.cropMode) ? p.cropMode : "auto";
    photos.push({
      id: typeof p.id === "string" ? p.id : p.slot.toLowerCase(),
      slot: p.slot,
      src,
      orientation,
      focalX: clamp01(p.focalX, 0.5),
      focalY: clamp01(p.focalY, 0.4),
      cropMode,
      enabled: p.enabled !== false,
      notes: typeof p.notes === "string" ? p.notes : "",
      caption: typeof p.caption === "string" ? p.caption : null,
      width: typeof p.width === "number" ? p.width : null,
      height: typeof p.height === "number" ? p.height : null,
    });
  });
  return {
    manifest: {
      version: typeof obj.version === "number" ? obj.version : 1,
      fallbackStrategy: obj.fallbackStrategy === "placeholder" ? "placeholder" : "reuse-least-recent",
      photos,
    },
    warnings,
  };
};
