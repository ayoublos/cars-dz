"use client";

import type { CarLocationTag } from "@/lib/cars";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const labelClassName =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const optionClass =
  "flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50 has-[:checked]:ring-2 has-[:checked]:ring-blue-400/30 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200 dark:has-[:checked]:border-blue-600 dark:has-[:checked]:bg-blue-950/40";

export default function CarLocationTagField({
  lang,
  defaultValue = "",
  name = "locationTag",
}: {
  lang: Lang;
  defaultValue?: CarLocationTag;
  name?: string;
}) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className={labelClassName}>{t.addCar.locationTag[lang]}</legend>
      <p className="mt-1 mb-3 text-xs text-zinc-500 dark:text-zinc-500">
        {t.addCar.locationTagHint[lang]}
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className={optionClass}>
          <input
            type="radio"
            name={name}
            value=""
            defaultChecked={defaultValue === ""}
            className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{t.addCar.locationTagNone[lang]}</span>
        </label>
        <label className={optionClass}>
          <input
            type="radio"
            name={name}
            value="korea"
            defaultChecked={defaultValue === "korea"}
            className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{t.carDetails.locationInKorea[lang]}</span>
        </label>
        <label className={optionClass}>
          <input
            type="radio"
            name={name}
            value="abroad"
            defaultChecked={defaultValue === "abroad"}
            className="h-4 w-4 border-zinc-300 text-blue-600 focus:ring-blue-500"
          />
          <span>{t.carDetails.locationAbroad[lang]}</span>
        </label>
      </div>
    </fieldset>
  );
}
