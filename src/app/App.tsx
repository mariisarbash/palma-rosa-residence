import { BrowserRouter, Route, Routes } from "react-router";
import { AvailabilityProvider } from "./lib/availability-context";
import { LanguageProvider } from "./lib/language";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import AvailabilityPage from "./pages/AvailabilityPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <LanguageProvider>
      <AvailabilityProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SiteLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/disponibilita" element={<AvailabilityPage />} />
              <Route path="/availability" element={<AvailabilityPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AvailabilityProvider>
    </LanguageProvider>
  );
}
