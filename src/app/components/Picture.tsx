import type { ImgHTMLAttributes } from "react";
import manifest from "../lib/image-manifest.json";

const widthMap = manifest as Record<string, number[]>;

type PictureProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  alt: string;
  /** Tells the browser the rendered size so it can pick the right variant. */
  sizes?: string;
  /** Above-the-fold image: load eagerly with high fetch priority. */
  priority?: boolean;
};

/**
 * Renders a `<picture>` with a generated WebP `srcset` (see
 * scripts/optimize-images.mjs) and the original JPG as the universal fallback.
 *
 * If an image has no manifest entry (e.g. the SVG placeholder, or a source
 * that hasn't been processed yet) it degrades to a plain `<img>` on the
 * original `src`, so it can never render a broken image.
 */
export function Picture({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  ...rest
}: PictureProps) {
  const widths = widthMap[src];
  const base = src.replace(/\.(jpe?g)$/i, "");
  const srcSet = widths?.map((w) => `${base}-${w}w.webp ${w}w`).join(", ");

  const loading = priority ? "eager" : "lazy";

  return (
    // `contents` removes the <picture> box from layout so the inner <img>
    // sizes against the real parent — existing `h-full w-full object-cover`
    // classes behave exactly as they did on a bare <img>.
    <picture className="contents">
      {srcSet && <source type="image/webp" srcSet={srcSet} sizes={sizes} />}
      <img
        src={src}
        alt={alt}
        className={className}
        sizes={sizes}
        loading={loading}
        decoding="async"
        {...(priority ? { fetchPriority: "high" as const } : {})}
        {...rest}
      />
    </picture>
  );
}
