import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";

/**
 * Shared chrome for every page: nav + outlet + footer.
 * Resets scroll position when the route changes — unless the navigation carried
 * a `scrollTo` section id (set by the nav when jumping from another route back
 * to a landing section), in which case we scroll to that section instead.
 */
export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    const scrollTarget = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (scrollTarget) {
      // Defer past this paint so the landing sections are mounted before we
      // measure their offset. Double rAF is enough for the eager sections.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document.getElementById(scrollTarget)?.scrollIntoView({ behavior: "smooth" });
        }),
      );
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.key, location.state]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
