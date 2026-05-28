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

  const navTextClass = isScrolled ? "text-foreground" : "text-white";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-5 md:px-12">
        <div className="flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="transition-opacity hover:opacity-80"
          >
            <Logo variant={isScrolled ? "dark" : "light"} />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-10 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative text-xs font-medium uppercase tracking-[0.12em] transition-colors ${navTextClass}`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
            <label className={`text-xs font-medium uppercase tracking-[0.18em] ${navTextClass}`}>
              <span className="sr-only">{t("language")}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className={`border-0 bg-transparent text-xs font-medium uppercase tracking-[0.18em] outline-none ${navTextClass}`}
              >
                <option className="text-foreground" value="it">IT</option>
                <option className="text-foreground" value="en">EN</option>
              </select>
            </label>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`fixed right-4 top-4 z-50 flex p-2 md:hidden ${
              isScrolled
                ? "bg-background text-foreground border border-border"
                : "bg-black/40 text-white backdrop-blur-md"
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-6 pb-2">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left py-3 text-sm transition-colors ${navTextClass}`}
                >
                  {item.label}
                </button>
              ))}
              <label className={`mt-4 text-xs font-medium uppercase tracking-[0.18em] ${navTextClass}`}>
                {t("language")}
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className="mt-2 w-full border border-border bg-background px-3 py-2 text-foreground"
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
