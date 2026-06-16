import { Star, ArrowUpRight } from "lucide-react";
import { reviews, reviewsSummary, reviewSources, hasRealReviews, type Review } from "../data/reviews";
import { useLanguage } from "../lib/language";

export default function Reviews() {
  const { language, t } = useLanguage();

  // Placeholder-only → preview in dev, but never publish a band of sample
  // reviews. Disappears automatically once real entries are added to the data.
  if (!hasRealReviews && import.meta.env.PROD) return null;

  return (
    <section className="bg-secondary px-6 py-12 md:px-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowReviews")}</p>
            <h2 className="mb-5">{t("reviewsHeading")}</h2>
            <p className="text-muted-foreground">{t("reviewsIntro")}</p>
          </div>

          <RatingSummary />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="apr-fade"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ReviewCard review={review} language={language} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RatingSummary() {
  const { t } = useLanguage();
  const { rating, count, googleUrl } = reviewsSummary;

  return (
    <div className="flex flex-col items-start gap-2 md:items-end">
      <div className="flex items-center gap-2">
        <Stars rating={rating} />
        <span className="text-sm font-medium text-foreground">
          {rating.toFixed(1)}
          {count > 0 && (
            <span className="text-muted-foreground"> · {t("reviewsCount", { count })}</span>
          )}
        </span>
      </div>
      {googleUrl && (
        <a
          href={googleUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium underline decoration-1 underline-offset-4 transition-opacity hover:opacity-70"
        >
          {t("reviewsReadAll")}
        </a>
      )}
    </div>
  );
}

function ReviewCard({ review, language }: { review: Review; language: "it" | "en" }) {
  const { t } = useLanguage();
  const source = reviewSources[review.source];

  return (
    <figure className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 md:p-7">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        <span className="text-xs font-medium uppercase tracking-[0.08em]" style={{ color: source.color }}>
          {source.label}
        </span>
      </div>

      <blockquote className="flex-1 text-[0.95rem] leading-relaxed text-foreground">
        “<Emphasized text={review.excerpt[language]} />”
      </blockquote>

      <figcaption className="mt-5 border-t border-border pt-4">
        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-foreground">{review.author}</span>
          <span className="text-xs text-muted-foreground">{review.date[language]}</span>
        </div>
        {review.url && (
          <a
            href={review.url}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground underline decoration-1 underline-offset-4 transition-colors hover:text-foreground"
            aria-label={`${t("reviewsReadOriginal")} — ${review.author}`}
          >
            {t("reviewsReadOriginal")}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
          </a>
        )}
      </figcaption>
    </figure>
  );
}

/**
 * Renders an excerpt, bolding the key phrases wrapped in `**…**`. The markers
 * are presentation only — the visible text stays a verbatim quote.
 */
function Emphasized({ text }: { text: string }) {
  // split() keeps the captured group, so odd indices are the emphasised parts.
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold text-foreground">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** Five stars, filled up to `rating` (supports halves). Decorative + labelled. */
function Stars({ rating }: { rating: number }) {
  const { t } = useLanguage();
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={t("reviewsStarsAria", { rating: rating.toFixed(1) })}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return <StarIcon key={i} fill={fill} />;
      })}
    </span>
  );
}

function StarIcon({ fill }: { fill: number }) {
  // fill: 0 = empty, 1 = full, between = partial via a clipped overlay.
  if (fill >= 1) return <Star className="h-4 w-4 text-accent" fill="currentColor" strokeWidth={0} />;
  if (fill <= 0) return <Star className="h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />;
  return (
    <span className="relative inline-block h-4 w-4">
      <Star className="absolute inset-0 h-4 w-4 text-muted-foreground/40" strokeWidth={1.5} />
      <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
        <Star className="h-4 w-4 text-accent" fill="currentColor" strokeWidth={0} />
      </span>
    </span>
  );
}
