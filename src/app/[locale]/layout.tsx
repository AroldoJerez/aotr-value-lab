import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { setRequestLocale } from "next-intl/server";
import DockNav from "@/components/Docknav";
import AmbientVideoBackground from "@/components/AmbientVideoBackground";

export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <NextIntlClientProvider><AmbientVideoBackground /><div className="relative z-10 min-h-screen bg-(--backgroundPage)/35"><DockNav />{children}</div></NextIntlClientProvider>;
}
