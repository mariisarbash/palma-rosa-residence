import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Navigation from "./Navigation";
import Footer from "./Footer";

/**
 * Shared chrome for every page: nav + outlet + footer.
 * Resets scroll position when the route changes.
 */
export default function SiteLayout() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [location.pathname]);

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
