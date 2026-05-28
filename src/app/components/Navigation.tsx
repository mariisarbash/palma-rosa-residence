import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router";
import Logo from "./Logo";
import { useLanguage, type Language } from "../lib/language";

type NavItem = { id: string; label: string; href?: string };

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On non-home routes the hero is not there: force the scrolled style.
  const solid = isScrolled || !isHome;

  const navItems: NavItem[] = [
    { id: "gallery", label: t("gallery") },
    { id: "features", label: t("services") },
    { id: "rooms", label: t("roomsNav") },
    { id: "nearby", label: t("eyebrowNearby") },
  ];

  function scrollToSection(id: string) {
    setIsMobileMenuOpen(false);
    // If we're not on home, navigate then scroll.
    if (!isHome) {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const linkColor = solid ? "text-foreground" : "text-white";

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        solid ? "bg-background/85 backdrop-blur-lg border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 py-4 md:px-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="transition-opacity hover:opacity-80">
            <Logo variant={solid ? "dark" : "light"} />
          </Link>

          {/* Desktop */}
          <div className="hidden items-center gap-8 md:flex">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`group relative text-sm font-medium ${linkColor}`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
              </button>
            ))}

            <NavLink
              to="/disponibilita"
              className={({ isActive }) =>
                isActive ? "btn-solid" : solid ? "btn-solid" : "btn-glass"
              }
            >
              {t("checkAvailability")}
            </NavLink>

            <label className={`text-sm ${linkColor}`}>
              <span className="sr-only">{t("language")}</span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value as Language)}
                className={`cursor-pointer border-0 bg-transparent text-sm font-medium outline-none ${linkColor}`}
              >
                <option className="text-foreground" value="it">IT</option>
                <option className="text-foreground" value="en">EN</option>
              </select>
            </label>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden rounded-full p-2 ${
              solid ? "bg-foreground text-background" : "bg-white/15 text-white backdrop-blur-md"
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-3 pt-6">
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`py-3 text-left text-base ${linkColor}`}
                >
                  {item.label}
                </button>
              ))}
              <Link
                to="/disponibilita"
                onClick={() => setIsMobileMenuOpen(false)}
                className="btn-solid mt-3"
              >
                {t("checkAvailability")}
              </Link>
              <label className={`mt-4 text-sm ${linkColor}`}>
                {t("language")}
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value as Language)}
                  className="mt-2 w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-foreground"
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
