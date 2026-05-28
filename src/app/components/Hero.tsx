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
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 pb-20 pt-28 text-center text-white">
        <div className="w-full max-w-4xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-4 max-w-full font-serif text-4xl leading-tight tracking-tight md:text-6xl"
          >
            <span className="block sm:inline">Palma Rosa</span>{" "}
            <span className="block sm:inline">Residence</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mx-auto mb-2 max-w-xs break-words px-2 text-lg opacity-90 md:max-w-[28rem] md:text-2xl"
          >
            <span className="block md:inline">Via Privata Mario Bianco</span>
            <span className="hidden md:inline">, Milano</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mx-auto mb-8 max-w-xs break-words px-2 text-xs opacity-80 md:max-w-[32rem] md:text-xl"
          >
            {language === "it"
              ? "10 appartamenti con bagno privato vicino alla M2"
              : "10 apartments with private bathrooms near the M2"}
          </motion.p>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            onClick={scrollToRooms}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-8 py-3 text-lg hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            {t("discover")}
            <ChevronDown className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white/60" />
      </div>
    </div>
  );
}
