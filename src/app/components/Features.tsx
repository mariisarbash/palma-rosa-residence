import { motion } from "motion/react";
import { Bath, Sofa, Train, WashingMachine, Wifi, Building2 } from "lucide-react";
import { useLanguage } from "../lib/language";

export default function Features() {
  const { t } = useLanguage();

  const features = [
    { icon: Bath, title: t("privateBathroom"), description: t("serviceBathDesc") },
    { icon: Sofa, title: t("sofaBed"), description: t("serviceSofaDesc") },
    { icon: Wifi, title: t("serviceWifi"), description: t("serviceWifiDesc") },
    { icon: WashingMachine, title: t("serviceLaundry"), description: t("serviceLaundryDesc") },
    { icon: Building2, title: t("serviceElevator"), description: t("serviceElevatorDesc") },
    { icon: Train, title: t("serviceTransport"), description: t("serviceTransportDesc") },
  ];

  return (
    <section className="bg-background px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowServices")}</p>
          <h2 className="mb-5">{t("servicesHeading")}</h2>
          <p className="text-muted-foreground">{t("servicesIntro")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group flex items-start gap-5 rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-secondary text-foreground transition group-hover:bg-foreground group-hover:text-background">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
