import type { CarLocationTag } from "@/lib/cars";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export function locationTagLabel(
  tag: CarLocationTag,
  lang: Lang,
): string | null {
  if (tag === "korea") return t.carDetails.locationInKorea[lang];
  if (tag === "abroad") return t.carDetails.locationAbroad[lang];
  return null;
}

function tagClassName(tag: CarLocationTag, variant: "card" | "detail"): string {
  const base =
    variant === "card"
      ? "inline-flex max-w-[min(100%,14rem)] items-center rounded-full px-2.5 py-1 text-[11px] font-semibold leading-tight shadow-sm backdrop-blur-sm"
      : "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium";

  if (tag === "korea") {
    return `${base} border border-sky-200/90 bg-sky-50/95 text-sky-900 dark:border-sky-800/80 dark:bg-sky-950/90 dark:text-sky-100`;
  }
  if (tag === "abroad") {
    return `${base} border border-amber-200/90 bg-amber-50/95 text-amber-950 dark:border-amber-800/80 dark:bg-amber-950/90 dark:text-amber-100`;
  }
  return base;
}

export default function CarLocationTagBadge({
  tag,
  lang,
  variant = "card",
  className = "",
}: {
  tag: CarLocationTag;
  lang: Lang;
  variant?: "card" | "detail";
  className?: string;
}) {
  const label = locationTagLabel(tag, lang);
  if (!label) return null;

  return (
    <span className={`${tagClassName(tag, variant)} ${className}`.trim()}>
      {label}
    </span>
  );
}
