import { lazy, Suspense } from "react";
import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Features from "../components/Features";
import RoomsSection from "../components/RoomsSection";

// Leaflet adds ~150 KB to the bundle. The map sits at the bottom of the
// page, so we lazy-load it and let it stream in while the user scrolls.
const NearbyMap = lazy(() => import("../components/NearbyMap"));

/**
 * Public landing — presentation only. The availability checker lives on
 * its own route so the home page can stay narrative.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <section id="gallery">
        <Gallery />
      </section>
      <section id="features">
        <Features />
      </section>
      <section id="rooms">
        <RoomsSection />
      </section>
      <section id="nearby">
        <Suspense fallback={<div className="min-h-[640px]" aria-hidden />}>
          <NearbyMap />
        </Suspense>
      </section>
    </>
  );
}
