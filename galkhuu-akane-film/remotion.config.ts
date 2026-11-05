// Remotion CLI configuration — https://www.remotion.dev/docs/config
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setJpegQuality(95);
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setCrf(18);
Config.setOverwriteOutput(true);
// Conservative default; override with --concurrency=N on a stronger machine.
Config.setConcurrency(4);

// Optional: use a pre-installed Chrome / Chrome Headless Shell instead of
// letting Remotion download one (useful on locked-down machines / cloud boxes).
if (process.env.REMOTION_BROWSER_EXECUTABLE) {
  Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
}
