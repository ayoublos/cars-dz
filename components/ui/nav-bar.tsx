import Link from "next/link";
import LanguageSelect from "./language-select";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/contact", key: "contact" },
  { href: "/about", key: "about" },
  { href: "/add-a-car", key: "addCar" },
  { href: "/login", key: "login" },
] as const;

const NAV_LINK_CLASSNAME =
  "rounded-full border border-transparent px-3 py-1.5 text-sm font-medium text-zinc-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 dark:text-zinc-300 dark:hover:border-blue-900/40 dark:hover:bg-blue-950/20 dark:hover:text-blue-100 dark:focus-visible:ring-blue-400/30";

export default async function NavBar() {
  const lang = await getLang();
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/70 bg-gradient-to-r from-white/90 via-white/80 to-blue-50/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800/70 dark:from-black/80 dark:via-black/70 dark:to-blue-950/30">
      <nav
        className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-semibold tracking-tight text-zinc-900 dark:text-zinc-100"
        >
          <span className="inline-flex h-9 items-center rounded-2xl bg-gradient-to-br from-fuchsia-600 via-indigo-600 to-sky-500 px-3.5 text-sm font-extrabold tracking-tight text-white shadow-sm ring-1 ring-black/5 transition group-hover:brightness-110 dark:ring-white/10">
            <span className="bg-gradient-to-b from-white to-white/80 bg-clip-text text-transparent">
              Loto
            </span>
            <span className="ml-1.5 rounded-lg bg-white/15 px-1.5 py-0.5 text-[11px] font-bold tracking-wide text-white ring-1 ring-white/15">
              DZ
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={NAV_LINK_CLASSNAME}
            >
              {t.nav[item.key][lang]}
            </Link>
          ))}
          <div className="ml-2 hidden sm:block">
            <div className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1 shadow-sm dark:border-zinc-800 dark:bg-zinc-950/60">
              <LanguageSelect value={lang} label={t.language[lang]} />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}