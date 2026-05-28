import { motion } from "motion/react";
import { GraduationCap, MapPin, Train } from "lucide-react";
import { useLanguage } from "../lib/language";

export default function HostChoices() {
  const { language } = useLanguage();
  const items = [
    {
      icon: Train,
      title: "Piola M2",
      text: language === "it" ? "Una delle fermate M2 piu comode per il residence." : "One of the most convenient M2 stops for the residence.",
    },
    {
      icon: Train,
      title: "Lambrate M2 / FS",
      text: language === "it" ? "Metro e collegamenti ferroviari nella stessa area." : "Metro and railway connections in the same area.",
    },
    {
      icon: Train,
      title: "Udine M2",
      text: language === "it" ? "Alternativa vicina sulla linea verde." : "A nearby alternative on the green line.",
    },
    {
      icon: GraduationCap,
      title: "Politecnico di Milano",
      text: language === "it" ? "Area universitaria raggiungibile comodamente dalla zona." : "University area easily reachable from the neighbourhood.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-secondary/30 to-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4">{language === "it" ? "Dintorni" : "Nearby"}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            {language === "it"
              ? "Punti di riferimento utili intorno a Via Privata Mario Bianco."
              : "Useful reference points around Via Privata Mario Bianco."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className="rounded-2xl border border-border bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-primary p-3 text-primary-foreground">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg">{item.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{language === "it" ? "Distanze precise da confermare in una revisione successiva." : "Precise distances to be confirmed in a later revision."}</span>
        </div>
      </div>
    </section>
  );
}
