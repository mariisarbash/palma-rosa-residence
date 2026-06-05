import { motion } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { useLanguage } from "../lib/language";

const heroImage = "/images/building/hero.jpg";

export default function Hero() {
  const { t } = useLanguage();

  const scrollToRooms = () => {
    document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Palma Rosa Residence"
          className="h-full w-full object-cover"
          // Above-the-fold: pre-loaded in index.html, decode async, eager.
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
        {/* Two-tone soft gradient — keeps body crisp, anchors text bottom */}
        <div className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/55" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col px-6 pb-16 pt-24 text-white md:px-12 md:pb-20">
        <div className="mt-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="eyebrow mb-5 text-white/85"
          >
            {t("heroAddressEyebrow")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-white"
          >
            Palma Rosa <span className="font-display-italic">Residence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="mb-10 max-w-xl text-base text-white/90 md:text-lg"
          >
            {t("heroTagline")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Link to="/disponibilita" className="btn-glass">
              {t("heroCtaCheck")}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <button onClick={scrollToRooms} className="btn-glass">
              {t("heroCtaExplore")}
              <ChevronDown className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
