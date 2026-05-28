import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useLanguage } from "../lib/language";

type GalleryImage = {
  url: string;
  altKey: string;
  captionKey: string;
};

const images: GalleryImage[] = [
  {
    url: "/images/building/davanti.jpg",
    altKey: "captionFacade",
    captionKey: "captionFacade",
  },
  {
    url: "/images/building/davanti_sopra.jpg",
    altKey: "captionAerial",
    captionKey: "captionAerial",
  },
  {
    url: "/images/apartments/a1/a1_1.jpg",
    altKey: "captionApartmentA1",
    captionKey: "captionApartmentA1",
  },
  {
    url: "/images/apartments/b1/b1_1.jpg",
    altKey: "captionApartmentB1",
    captionKey: "captionApartmentB1",
  },
];

export default function Gallery() {
  const { t } = useLanguage();

  return (
    <section className="bg-secondary px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowResidence")}</p>
          <h2 className="mb-5">{t("galleryHeading")}</h2>
          <p className="text-muted-foreground">{t("galleryIntro")}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {images.map((image, index) => (
            <motion.figure
              key={image.url}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: index * 0.08 }}
              className={`group ${index === 0 ? "md:row-span-2" : ""}`}
            >
              <div
                className={`relative overflow-hidden rounded-3xl bg-muted shadow-lg ${
                  index === 0 ? "aspect-[4/5]" : "aspect-[4/3]"
                }`}
              >
                <ImageWithFallback
                  src={image.url}
                  alt={t(image.altKey as never) as string}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                />
              </div>
              <figcaption className="mt-3 px-1 text-sm text-muted-foreground">
                {t(image.captionKey as never) as string}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
