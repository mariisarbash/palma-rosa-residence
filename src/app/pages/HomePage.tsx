import Hero from "../components/Hero";
import Gallery from "../components/Gallery";
import Features from "../components/Features";
import RoomsSection from "../components/RoomsSection";
import NearbyMap from "../components/NearbyMap";

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
        <NearbyMap />
      </section>
    </>
  );
}
