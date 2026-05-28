import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import davantiFoto from "../../imports/davanti.jpg";
import davanti_sopraFoto from "../../imports/davanti_sopra.jpg";
import { useLanguage } from "../lib/language";

type GalleryImage = {
  src?: string;
  url?: string;
  alt: string;
};

const images: GalleryImage[] = [
  {
    src: davantiFoto,
    alt: "Palma Rosa Residence - Facciata con giardino"
  },
  {
    src: davanti_sopraFoto,
    alt: "Palma Rosa Residence - Vista dall'alto"
  },
  {
    url: "/images/apartments/a1/a1_1.jpg",
    alt: "Appartamento A1"
  },
  {
    url: "/images/apartments/b1/b1_1.jpg",
    alt: "Appartamento B1"
  },
];

export default function Gallery() {
  const { language } = useLanguage();

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">{language === "it" ? "Scopri il residence" : "Discover the residence"}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "it"
              ? "Esterni e interni reali del complesso in Via Privata Mario Bianco"
              : "Real exterior and interior views from Via Privata Mario Bianco"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={`relative overflow-hidden rounded-2xl ${
                index === 0 ? "md:row-span-2 h-[500px]" : "h-60"
              } group`}
            >
              {image.src ? (
                <ImageWithFallback
                  src={image.src}
                  alt={image.alt}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              ) : (
                <img
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
