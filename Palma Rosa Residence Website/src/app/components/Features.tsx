import { motion } from "motion/react";
import { Bath, Sofa, Train, WashingMachine, Wifi, Building2 } from "lucide-react";
import { useLanguage } from "../lib/language";

export default function Features() {
  const { language } = useLanguage();
  const features = [
    {
      icon: Bath,
      title: language === "it" ? "Bagno privato" : "Private bathroom",
      description: language === "it" ? "Ogni appartamento ha il proprio bagno privato" : "Every apartment has its own private bathroom",
    },
    {
      icon: Sofa,
      title: language === "it" ? "Divano letto" : "Sofa bed",
      description: language === "it" ? "Soluzioni pensate per ospitare fino a 2 persone" : "Layouts designed to host up to 2 people",
    },
    {
      icon: Wifi,
      title: "Wi-Fi",
      description: language === "it" ? "Connessione disponibile nel residence" : "Connection available in the residence",
    },
    {
      icon: WashingMachine,
      title: language === "it" ? "Lavanderia" : "Laundry",
      description: language === "it" ? "Lavatrice e asciugatrice a disposizione" : "Washing machine and dryer available",
    },
    {
      icon: Building2,
      title: language === "it" ? "Ascensore" : "Elevator",
      description: language === "it" ? "Comodo accesso agli appartamenti del primo piano" : "Convenient access to first-floor apartments",
    },
    {
      icon: Train,
      title: language === "it" ? "Metro e treni" : "Metro and trains",
      description: language === "it" ? "Vicino a Piola, Lambrate e Udine sulla M2" : "Near Piola, Lambrate and Udine on the M2 line",
    },
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="mb-4">{language === "it" ? "Servizi inclusi" : "Included services"}</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {language === "it"
              ? "Solo informazioni confermate dai dati attuali del residence"
              : "Only information confirmed by the current residence data"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-secondary/50 transition-colors duration-300"
            >
              <div className="bg-primary text-primary-foreground p-4 rounded-2xl mb-4">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
