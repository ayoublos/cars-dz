import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";

export default async function AboutPage() {
  const lang = await getLang();
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-3xl">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <div className="border-b border-zinc-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 dark:border-zinc-800 dark:from-blue-950/40 dark:to-indigo-950/30">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              {t.aboutPage.title[lang]}
            </h1>
          </div>
          <div className="px-6 py-6">
            <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
              {t.aboutPage.body[lang]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

