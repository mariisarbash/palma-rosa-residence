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
    <section className="bg-background px-6 py-12 md:px-12 md:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-2xl md:mb-14">
          <p className="eyebrow mb-4 text-muted-foreground">{t("eyebrowServices")}</p>
          <h2 className="mb-5">{t("servicesHeading")}</h2>
          <p className="text-muted-foreground">{t("servicesIntro")}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="apr-fade flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:min-h-[120px] md:flex-row md:items-start md:gap-5 md:rounded-3xl md:p-6"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground md:h-12 md:w-12 md:rounded-2xl">
                <feature.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-base md:mb-1.5 md:text-xl">{feature.title}</h3>
                <p className="text-xs text-muted-foreground md:text-sm">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
