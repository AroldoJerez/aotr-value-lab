import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BarChart3, ShieldCheck, Swords } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const features = [
    { icon: Swords, title: t("featureOneTitle"), text: t("featureOneText") },
    { icon: BarChart3, title: t("featureTwoTitle"), text: t("featureTwoText") },
    {
      icon: ShieldCheck,
      title: t("featureThreeTitle"),
      text: t("featureThreeText"),
    },
  ];
  return (
    <main className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-5 pt-28 pb-12 md:px-8">
      <section className="max-w-3xl">
        <p className="mb-5 text-xs font-bold tracking-[.32em] text-(--accentBright) uppercase">
          {t("eyebrow")}
        </p>
        <h1 className="text-5xl leading-[.92] font-black tracking-tight text-(--textHighlight) md:text-7xl">
          {t("titleFirst")}
          <br />
          <span className="text-(--accentBright)">{t("titleAccent")}</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-(--textSecondary) md:text-lg">
          {t("description")}
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link
            href="/comparator"
            className="inline-flex items-center gap-2 rounded-full border border-(--accentBright) bg-(--accentMain) px-6 py-3 font-bold text-(--textHighlight) transition-transform hover:scale-[1.03]"
          >
            {t("comparator")} <ArrowRight size={17} />
          </Link>
          <Link
            href="/price"
            className="rounded-full border border-(--accentMain) bg-black/20 px-6 py-3 font-bold text-(--textHighlight) transition-colors hover:border-(--accentBright)"
          >
            {t("prices")}
          </Link>
        </div>
      </section>
      <section className="mt-16 grid gap-3 md:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="rounded-(--radius-md) border border-(--accentMain)/70 bg-(--backgroundComparator)/55 p-5 backdrop-blur-sm"
          >
            <Icon size={20} className="text-(--accentBright)" />
            <h2 className="mt-5 font-bold text-(--textHighlight)">{title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-(--textSecondary)">
              {text}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}
