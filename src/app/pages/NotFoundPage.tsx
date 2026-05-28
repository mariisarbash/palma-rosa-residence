import { Link } from "react-router";
import { useLanguage } from "../lib/language";

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 py-32">
      <div className="text-center">
        <p className="eyebrow mb-4 text-muted-foreground">404</p>
        <h1 className="mb-6">{t("pageNotFound")}</h1>
        <Link to="/" className="btn-solid">
          {t("backToHome")}
        </Link>
      </div>
    </section>
  );
}
