import { execFileSync } from "node:child_process";
import { mkdir, writeFile, stat } from "node:fs/promises";
import ffmpeg from "ffmpeg-static";
const source = process.argv[2];
if (!source)
  throw new Error("Pass the path to the original MP4 as the first argument.");
await mkdir("public/assets", { recursive: true });
const start = 6,
  duration = 19.6;
execFileSync(
  ffmpeg,
  [
    "-y",
    "-ss",
    String(start),
    "-i",
    source,
    "-t",
    String(duration),
    "-map",
    "0:v:0",
    "-an",
    "-vf",
    "scale=1440:-2",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "24",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "public/assets/hero.mp4",
  ],
  { stdio: "inherit" },
);
execFileSync(
  ffmpeg,
  [
    "-y",
    "-ss",
    String(start),
    "-i",
    source,
    "-frames:v",
    "1",
    "-vf",
    "scale=1440:-2",
    "-q:v",
    "3",
    "public/assets/hero-poster.jpg",
  ],
  { stdio: "inherit" },
);
await writeFile(
  "video-manifest.json",
  JSON.stringify(
    {
      sourceStartSeconds: start,
      sourceEndSeconds: start + duration,
      durationSeconds: duration,
      width: 1440,
      height: 810,
      audio: false,
      introAndOutroRemoved: true,
      sizeBytes: (await stat("public/assets/hero.mp4")).size,
    },
    null,
    2,
  ),
);
