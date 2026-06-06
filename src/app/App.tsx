import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { MotionConfig } from "motion/react";
import { AvailabilityProvider } from "./lib/availability-context";
import { LanguageProvider } from "./lib/language";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";

// Heavy routes are split off so the landing chunk doesn't pay for the
// date picker / map bundles until those pages are actually visited.
const AvailabilityPage = lazy(() => import("./pages/AvailabilityPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

function RouteFallback() {
  return <div className="min-h-[60vh]" aria-hidden />;
}

export default function App() {
  return (
    <LanguageProvider>
      <AvailabilityProvider>
        <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/disponibilita"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <AvailabilityPage />
                  </Suspense>
                }
              />
              <Route
                path="/availability"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <AvailabilityPage />
                  </Suspense>
                }
              />
              <Route
                path="*"
                element={
                  <Suspense fallback={<RouteFallback />}>
                    <NotFoundPage />
                  </Suspense>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
        </MotionConfig>
      </AvailabilityProvider>
    </LanguageProvider>
  );
}
