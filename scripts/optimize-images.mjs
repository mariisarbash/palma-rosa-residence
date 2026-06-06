/**
 * Responsive image generator for Palma Rosa Residence.
 *
 * Walks public/images, and for every .jpg/.jpeg source produces down-scaled
 * WebP variants (never upscaled) plus a manifest the <Picture> component reads
 * to build a correct `srcset`. Re-runnable and idempotent: existing, up-to-date
 * variants are skipped.
 *
 * Requirements (already present on the build machine):
 *   - `sips`  (macOS, used only to read pixel dimensions)
 *   - `cwebp` (libwebp, `brew install webp`)
 *
 * Usage:  node scripts/optimize-images.mjs [--force]
 */
import { execFileSync } from "node:child_process";
import { readdirSync, statSync, writeFileSync, existsSync } from "node:fs";
import { join, extname, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const IMAGES_DIR = join(ROOT, "public", "images");
const MANIFEST_PATH = join(ROOT, "src", "app", "lib", "image-manifest.json");

// Candidate widths. A variant is only emitted when it is <= the source width,
// so we never upscale. The largest variant <= source acts as the native cap.
const WIDTHS = [480, 768, 1200, 1920];
const QUALITY = 80;
const FORCE = process.argv.includes("--force");

/** Recursively collect every .jpg/.jpeg under a directory. */
function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.(jpe?g)$/i.test(entry)) out.push(full);
  }
  return out;
}

/** Source pixel width via sips. */
function pixelWidth(file) {
  const out = execFileSync("sips", ["-g", "pixelWidth", file], { encoding: "utf8" });
  const m = out.match(/pixelWidth:\s*(\d+)/);
  return m ? Number(m[1]) : null;
}

const sources = walk(IMAGES_DIR);
const manifest = {};
let generated = 0;
let skipped = 0;

for (const src of sources) {
  const width = pixelWidth(src);
  if (!width) {
    console.warn(`! could not read width: ${src}`);
    continue;
  }

  // Widths strictly below source, plus one variant at the source width itself
  // (capped at the largest ladder rung) so large screens still get WebP.
  const targets = WIDTHS.filter((w) => w < width);
  const nativeCap = Math.min(width, WIDTHS[WIDTHS.length - 1]);
  if (!targets.includes(nativeCap)) targets.push(nativeCap);
  targets.sort((a, b) => a - b);

  const base = src.replace(/\.(jpe?g)$/i, "");
  const produced = [];

  for (const w of targets) {
    const outFile = `${base}-${w}w.webp`;
    const upToDate =
      !FORCE && existsSync(outFile) && statSync(outFile).mtimeMs >= statSync(src).mtimeMs;
    if (!upToDate) {
      execFileSync("cwebp", ["-quiet", "-q", String(QUALITY), "-resize", String(w), "0", src, "-o", outFile]);
      generated++;
    } else {
      skipped++;
    }
    produced.push(w);
  }

  // Manifest key is the public URL path (what components reference).
  const urlPath = "/" + relative(join(ROOT, "public"), src).split("\\").join("/");
  manifest[urlPath] = produced;
}

writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `\nDone. ${Object.keys(manifest).length} images, ${generated} variants generated, ${skipped} up-to-date.`,
);
console.log(`Manifest -> ${relative(ROOT, MANIFEST_PATH)}`);
