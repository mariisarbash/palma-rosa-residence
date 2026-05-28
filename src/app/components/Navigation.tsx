import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { useLanguage, type Language } from "../lib/language";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { id: "gallery", label: t("gallery") },
    { id: "features", label: t("services") },
    { id: "rooms", label: t("roomsNav") },
    { id: "availability", label: t("availability") },
    { id: "transport", label: t("transport") },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="transition-opacity hover:opacity-80"
          >
            <Logo variant={isScrolled ? "dark" : "light"} showText={true} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm transition-colors hover:opacity-80 ${
                  isScrolled ? "text-foreground" : "text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection("availability")}
              className={`px-6 py-2 rounded-full transition-all ${
                isScrolled
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              {t("checkAvailability")}
            </button>
            <label className={`text-sm ${isScrolled ? "text-foreground" : "text-white"}`}>
              <span className="sr-only">{t("language")}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className={`rounded-full border px-3 py-2 text-sm outline-none transition-colors ${
                  isScrolled
                    ? "border-border bg-white text-foreground"
                    : "border-white/30 bg-white/15 text-white"
                }`}
              >
                <option className="text-foreground" value="it">IT</option>
                <option className="text-foreground" value="en">EN</option>
              </select>
            </label>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`fixed right-4 top-4 z-50 flex rounded-full p-2 shadow-lg md:hidden ${
              isScrolled ? "bg-white text-primary" : "bg-zinc-950/35 text-white backdrop-blur-md"
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left py-2 px-4 rounded-lg transition-colors ${
                    isScrolled
                      ? "text-foreground hover:bg-secondary"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection("availability")}
                className={`py-2 px-4 rounded-lg transition-colors ${
                  isScrolled
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/20 text-white"
                }`}
              >
                {t("checkAvailability")}
              </button>
              <label className={`px-4 text-sm ${isScrolled ? "text-foreground" : "text-white"}`}>
                {t("language")}
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className="mt-2 w-full rounded-lg border border-white/30 bg-white px-3 py-2 text-foreground"
                >
                  <option value="it">Italiano</option>
                  <option value="en">English</option>
                </select>
              </label>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
