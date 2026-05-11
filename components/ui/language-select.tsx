"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Lang } from "@/lib/i18n";
import { LANG_CHANGE_EVENT } from "@/lib/i18n";

export default function LanguageSelect({
  value,
  label,
}: {
  value: Lang;
  label: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (next: Lang) => {
    // Persist for server components too.
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;

    window.dispatchEvent(
      new CustomEvent(LANG_CHANGE_EVENT, { detail: { lang: next } }),
    );

    const params = new URLSearchParams(searchParams?.toString());
    params.set("lang", next);
    router.replace(`${pathname}?${params.toString()}`);
    router.refresh();
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
      <span className="hidden sm:inline">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Lang)}
        className="rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="ar">العربية</option>
      </select>
    </label>
  );
}

