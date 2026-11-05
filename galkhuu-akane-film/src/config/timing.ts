// Pure timing constants (no Remotion import so Node QA scripts can use them).
export const FPS = 30;
export const sec = (s: number) => Math.round(s * FPS);
