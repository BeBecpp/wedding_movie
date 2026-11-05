import { spawnSync } from "node:child_process";

/** Use system ffmpeg/ffprobe if present, otherwise the copy bundled with Remotion. */
const has = (bin) => spawnSync(bin, ["-version"], { stdio: "ignore" }).status === 0;
export const ff = (tool, args, opts = {}) => {
  const r = has(tool)
    ? spawnSync(tool, args, { encoding: "utf8", maxBuffer: 1 << 26, ...opts })
    : spawnSync("npx", ["remotion", tool, ...args], { encoding: "utf8", maxBuffer: 1 << 26, shell: process.platform === "win32", ...opts });
  return r;
};
