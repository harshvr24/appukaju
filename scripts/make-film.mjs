/**
 * Renders the hero's scroll-scrubbed brand film: the twelve story stills
 * become ONE continuous MP4 — a slow Ken-Burns camera push inside every
 * scene, gradual crossfades between scenes, dense keyframes for smooth
 * bidirectional seeking. The homepage scrubs this file with scroll.
 *
 *   node scripts/make-film.mjs [--force]
 *
 * Timing constants (consumed by components/home/hero-section.tsx):
 *   CLIP 3.2s · FADE 0.9s · STEP 2.3s · SCENES 12 · TOTAL 28.5s
 */
import { spawn } from "node:child_process";
import { mkdir, rm, access } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const FORCE = process.argv.includes("--force");
const OUT_DIR = path.resolve(process.cwd(), "public/videos");
const TMP = path.resolve(process.cwd(), "scripts/.film-tmp");
const OUT = path.join(OUT_DIR, "appu-film.mp4");
const POSTER = path.join(OUT_DIR, "appu-film-poster.jpg");

const W = 1152;
const H = 648;
const FPS = 24;
const CLIP = 3.2; // seconds per scene
const FADE = 0.9; // crossfade duration
const D = Math.round(CLIP * FPS); // frames per scene

/** Story order — must match BEATS in hero-section.tsx. */
const SCENES = [
  "public/images/story/dawn.webp",
  "public/images/story/appu.webp",
  "public/images/story/tree.webp",
  "public/images/story/fruit.webp",
  "public/images/story/harvest.webp",
  "public/images/story/cleaning.webp",
  "public/images/story/inspection.webp",
  "public/images/story/roasting.webp",
  "public/images/cinematic/cashew.webp",
  "public/images/story/gift.webp",
  "public/images/cinematic/table.webp",
  "public/images/cinematic/mix.webp",
];

const exists = (f) => access(f).then(() => true, () => false);

function run(args) {
  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpegPath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let err = "";
    proc.stderr.on("data", (d) => {
      err += d;
      if (err.length > 40_000) err = err.slice(-20_000);
    });
    proc.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exit ${code}\n${err.slice(-3000)}`))
    );
  });
}

if (!FORCE && (await exists(OUT))) {
  console.log("appu-film.mp4 exists — skipping (use --force to re-render).");
  process.exit(0);
}

await mkdir(OUT_DIR, { recursive: true });
await rm(TMP, { recursive: true, force: true });
await mkdir(TMP, { recursive: true });

// 1 — Normalize stills to oversized JPEGs (2× target, so zoompan is jitter-free).
const jpgs = [];
for (let i = 0; i < SCENES.length; i++) {
  const jpg = path.join(TMP, `scene-${String(i).padStart(2, "0")}.jpg`);
  await sharp(path.resolve(process.cwd(), SCENES[i]))
    .resize(W * 2, H * 2, { fit: "cover" })
    .jpeg({ quality: 92 })
    .toFile(jpg);
  jpgs.push(jpg);
}
console.log(`✓ ${jpgs.length} frames prepared`);

// 2 — Build the filter graph: per-scene Ken Burns, then chained crossfades.
const inputs = jpgs.flatMap((f) => ["-loop", "1", "-t", String(CLIP + 0.2), "-i", f]);
const moves = [
  // gentle push-in
  `z='min(zoom+0.0011,1.14)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'`,
  // drift right at slight zoom
  `z='1.10':x='(iw-iw/zoom)*on/${D}':y='ih/2-(ih/zoom/2)'`,
  // drift left at slight zoom
  `z='1.10':x='(iw-iw/zoom)*(1-on/${D})':y='ih/2-(ih/zoom/2)'`,
];
const parts = [];
for (let i = 0; i < jpgs.length; i++) {
  parts.push(
    `[${i}:v]zoompan=${moves[i % 3]}:d=${D}:s=${W}x${H}:fps=${FPS},format=yuv420p,settb=AVTB[v${i}]`
  );
}
let last = "v0";
for (let i = 1; i < jpgs.length; i++) {
  const out = i === jpgs.length - 1 ? "vout" : `x${i}`;
  const offset = (i * (CLIP - FADE)).toFixed(2);
  parts.push(
    `[${last}][v${i}]xfade=transition=fade:duration=${FADE}:offset=${offset}[${out}]`
  );
  last = out;
}
// Light denoise: AI grain compresses terribly and adds nothing on video.
parts.push(`[vout]hqdn3d=3:2:6:4[vfinal]`);

console.log("Rendering film (this takes a few minutes)…");
await run([
  "-y",
  ...inputs,
  "-filter_complex",
  parts.join(";"),
  "-map",
  "[vfinal]",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "28",
  "-g",
  "24",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  "-an",
  OUT,
]);
console.log("✓ appu-film.mp4");

// 3 — Poster (first frame).
await run(["-y", "-i", OUT, "-frames:v", "1", "-q:v", "3", POSTER]);
console.log("✓ appu-film-poster.jpg");

await rm(TMP, { recursive: true, force: true });
const total = SCENES.length * CLIP - (SCENES.length - 1) * FADE;
console.log(`Film done. ${SCENES.length} scenes · ${total.toFixed(1)}s · step ${(CLIP - FADE).toFixed(1)}s`);
