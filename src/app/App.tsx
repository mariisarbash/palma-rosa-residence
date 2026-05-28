import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import Gallery from "./components/Gallery";
import Features from "./components/Features";
import RoomsSection from "./components/RoomsSection";
import TransportSection from "./components/TransportSection";
import HostChoices from "./components/HostChoices";
import AvailabilityChecker from "./components/AvailabilityChecker";
import Footer from "./components/Footer";
import { AvailabilityProvider } from "./lib/availability-context";
import { LanguageProvider } from "./lib/language";

export default function App() {
  return (
    <LanguageProvider>
      <AvailabilityProvider>
        <div className="min-h-screen overflow-x-hidden bg-background">
          <Navigation />
          <Hero />
          <div id="gallery">
            <Gallery />
          </div>
          <div id="features">
            <Features />
          </div>
          <div id="rooms">
            <RoomsSection />
          </div>
          <div id="availability">
            <AvailabilityChecker />
          </div>
          <div id="transport">
            <TransportSection />
          </div>
          <div id="host-choices">
            <HostChoices />
          </div>
          <Footer />
        </div>
      </AvailabilityProvider>
    </LanguageProvider>
  );
}
