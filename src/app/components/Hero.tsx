import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../lib/language";

const heroImage = "/images/building/davanti_sopra.jpg";

export default function Hero() {
  const { language, t } = useLanguage();

  const scrollToRooms = () => {
    document.getElementById("rooms")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[100dvh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <ImageWithFallback
          src={heroImage}
          alt="Palma Rosa Residence - Vista dall'alto"
          className="h-full w-full object-cover"
        />
        {/* Subtle bottom-weighted vignette, editorial — not the heavy gradient. */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/55" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col px-6 pb-24 pt-24 text-white md:px-12 md:pb-32">
        {/* Bottom-left wordmark + tagline, alla Ray */}
        <div className="mt-auto max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="eyebrow mb-6 text-white/80"
          >
            Via Privata Mario Bianco, Milano
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 text-white"
          >
            Palma Rosa Residence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-10 max-w-xl text-base text-white/85 md:text-lg"
          >
            {language === "it"
              ? "Dieci appartamenti con bagno privato, a pochi minuti dalla M2."
              : "Ten apartments with private bathrooms, minutes from the M2 line."}
          </motion.p>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            onClick={scrollToRooms}
            className="inline-flex items-center gap-3 border border-white/40 px-6 py-3 text-xs font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-white hover:text-foreground"
          >
            {t("discover")}
            <ChevronDown className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
