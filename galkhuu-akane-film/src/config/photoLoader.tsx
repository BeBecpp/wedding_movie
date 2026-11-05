/**
 * Bridges the pure casting logic to React: reads the manifest, checks which
 * photo files really exist in public/ (getStaticFiles) and provides the
 * resolved photo for every shot through context.
 */
import React, { createContext, useContext, useMemo } from "react";
import { getStaticFiles } from "remotion";
import rawManifest from "../../assets/photo-manifest.json";
import { validateManifest } from "./manifest";
import { castTimeline, Casting, CastShot, Resolved } from "./casting";
import type { Shot } from "./storyboard";

const { manifest, warnings } = validateManifest(rawManifest);
let warned = false;

export const getManifest = () => manifest;

const staticFileSet = () => {
  try {
    return new Set(getStaticFiles().map((f) => f.name.replace(/^\/+/, "")));
  } catch {
    return new Set<string>();
  }
};

export const toCastShots = (entries: { shot: Shot; start: number }[]): CastShot[] =>
  entries.map((e) => ({ id: e.shot.id, start: e.start, uses: e.shot.slots }));

const CastingCtx = createContext<Casting>({});

export const CastingProvider: React.FC<{ entries: { shot: Shot; start: number }[]; loopLength?: number; children: React.ReactNode }> = ({
  entries,
  loopLength,
  children,
}) => {
  const casting = useMemo(() => {
    const files = staticFileSet();
    if (!warned) {
      warned = true;
      warnings.forEach((w) => console.warn(`[photo-manifest] ${w}`));
      manifest.photos
        .filter((p) => p.enabled && p.src && !files.has(p.src))
        .forEach((p) => console.warn(`[photo-manifest] ${p.slot}: file public/${p.src} not found — using fallback`));
    }
    return castTimeline(manifest, files, toCastShots(entries), loopLength).casting;
  }, [entries, loopLength]);
  return <CastingCtx.Provider value={casting}>{children}</CastingCtx.Provider>;
};

/** Resolved photos for a shot, in slot order (null = dropped collage cell). */
export const useShotPhotos = (shotId: string): Array<Resolved | null> => useContext(CastingCtx)[shotId] ?? [];
