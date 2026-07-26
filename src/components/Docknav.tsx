"use client";

import Link from "next/link";
import { Moon, Sun, Swords } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const menus = [{ label: "HOME", href: "/" }, { label: "COMPARATOR", href: "/comparator" }, { label: "PRICE", href: "/price" }];

export default function DockNav() {
  const pathname = usePathname();
  useEffect(() => {
    document.documentElement.dataset.theme = window.localStorage.getItem("aotr-theme") === "light" ? "light" : "dark";
  }, []);
  const toggleTheme = () => {
    const theme = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("aotr-theme", theme);
  };
  return <header className="fixed inset-x-0 top-0 z-30 border-b border-(--accentMain)/25 bg-black/25 backdrop-blur-md"><div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 md:px-8"><Link href="/" className="flex shrink-0 items-center gap-2 text-(--textHighlight)"><span className="grid size-8 place-items-center rounded-md border border-(--accentBright) bg-(--accentMain)/40"><Swords size={16} /></span><span className="hidden text-xs font-black tracking-[.18em] sm:block">AOTR <span className="text-(--accentBright)">VALUE</span></span></Link><nav aria-label="Navegación principal" className="flex items-center gap-1 rounded-full border border-red-500/20 bg-(--accentMain)/30 p-1">{menus.map((menu) => { const active = pathname === menu.href; return <Link key={menu.href} href={menu.href} className={`relative rounded-full px-3 py-2 text-[10px] font-bold tracking-wider transition-all sm:px-5 sm:text-xs ${active ? "border border-red-500/40 bg-(--accentMain) text-(--textHighlight)" : "text-gray-400 hover:text-white"}`}>{menu.label}</Link>; })}</nav><button type="button" onClick={toggleTheme} className="grid size-9 shrink-0 place-items-center rounded-full border border-(--accentMain) bg-black/20 text-(--textHighlight) transition-colors hover:border-(--accentBright)" aria-label="Cambiar tema" title="Cambiar tema"><Sun size={16} className="theme-sun" /><Moon size={16} className="theme-moon" /></button></div></header>;
}
