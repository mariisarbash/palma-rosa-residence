import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../lib/language";

type GalleryImage = {
  url: string;
  alt: string;
  caption?: string;
};

const images: GalleryImage[] = [
  {
    url: "/images/building/davanti.jpg",
    alt: "Palma Rosa Residence - Facciata con giardino",
    caption: "Facciata",
  },
  {
    url: "/images/building/davanti_sopra.jpg",
    alt: "Palma Rosa Residence - Vista dall'alto",
    caption: "Vista dall'alto",
  },
  {
    url: "/images/apartments/a1/a1_1.jpg",
    alt: "Appartamento A1",
    caption: "Appartamento A1",
  },
  {
    url: "/images/apartments/b1/b1_1.jpg",
    alt: "Appartamento B1",
    caption: "Appartamento B1",
  },
];

export default function Gallery() {
  const { language } = useLanguage();

  return (
    <section className="bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <p className="eyebrow mb-4 text-muted-foreground">
            {language === "it" ? "Il residence" : "The residence"}
          </p>
          <h2 className="mb-5">
            {language === "it" ? "Scopri il residence" : "Discover the residence"}
          </h2>
          <p className="text-muted-foreground">
            {language === "it"
              ? "Esterni e interni reali del complesso in Via Privata Mario Bianco."
              : "Real exterior and interior views from Via Privata Mario Bianco."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {images.map((image, index) => (
            <motion.figure
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className={`group ${index === 0 ? "md:row-span-2" : ""}`}
            >
              <div
                className={`relative overflow-hidden bg-muted ${
                  index === 0 ? "aspect-[4/5]" : "aspect-[4/3]"
                }`}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={image.alt}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                />
              </div>
              {image.caption && (
                <figcaption className="mt-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {image.caption}
                </figcaption>
              )}
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
