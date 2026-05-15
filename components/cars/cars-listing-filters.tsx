"use client";

import { useRouter } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import {
  buildCarListingSearchParams,
  countActiveCarListingFilters,
  EMPTY_CAR_LISTING_FILTERS,
  type CarListingFacets,
  type CarListingFilters,
  type LocationFilter,
} from "@/lib/cars-filters";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

const selectClass =
  "mt-1 w-full appearance-none rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:bg-zinc-950";

const inputClass =
  "mt-1 w-full rounded-lg border border-zinc-200 bg-zinc-50/80 px-3 py-2.5 text-sm text-zinc-900 shadow-sm transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-100 dark:focus:border-blue-500 dark:focus:bg-zinc-950";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  allLabel: string;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </Field>
  );
}

function NumberSelectField({
  label,
  value,
  onChange,
  options,
  allLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly number[];
  allLabel: string;
}) {
  return (
    <Field label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={selectClass}
      >
        <option value="">{allLabel}</option>
        {options.map((opt) => (
          <option key={opt} value={String(opt)}>
            {opt}
          </option>
        ))}
      </select>
    </Field>
  );
}

function LocationSegment({
  lang,
  value,
  onChange,
}: {
  lang: Lang;
  value: LocationFilter;
  onChange: (v: LocationFilter) => void;
}) {
  const items: { value: LocationFilter; label: string }[] = [
    { value: "all", label: t.home.filterAll[lang] },
    { value: "korea", label: t.carDetails.locationInKorea[lang] },
    { value: "abroad", label: t.carDetails.locationAbroad[lang] },
    { value: "none", label: t.home.filterNoLocationTag[lang] },
  ];

  return (
    <Field label={t.home.filterLocation[lang]}>
      <div className="mt-1 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
        {items.map(({ value: v, label }) => {
          const active = value === v;
          return (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className={[
                "rounded-lg border px-2 py-2 text-center text-xs font-medium leading-snug transition",
                active
                  ? "border-blue-600 bg-blue-600 text-white shadow-sm dark:border-blue-500"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900",
              ].join(" ")}
            >
              {label}
            </button>
          );
        })}
      </div>
    </Field>
  );
}

function CarsListingFiltersPanel({
  lang,
  basePath,
  initialFilters,
  facets,
  resultCount,
}: {
  lang: Lang;
  basePath: string;
  initialFilters: CarListingFilters;
  facets: CarListingFacets;
  resultCount: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [draft, setDraft] = useState<CarListingFilters>(initialFilters);

  useEffect(() => {
    setDraft(initialFilters);
  }, [initialFilters]);

  const activeCount = useMemo(
    () => countActiveCarListingFilters(draft),
    [draft],
  );

  const patch = (partial: Partial<CarListingFilters>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const apply = () => {
    const params = buildCarListingSearchParams(draft);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const clearAll = () => {
    const next = { ...EMPTY_CAR_LISTING_FILTERS, q: draft.q };
    setDraft(next);
    const params = buildCarListingSearchParams(next);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  };

  const allLabel = t.home.filterAll[lang];

  return (
    <section className="mb-6 overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm ring-1 ring-zinc-950/5 dark:border-zinc-800 dark:bg-zinc-950 dark:ring-white/10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-gradient-to-r from-zinc-50 to-white px-4 py-3 dark:border-zinc-800 dark:from-zinc-900/50 dark:to-zinc-950 sm:px-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
          </span>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {t.home.filtersTitle[lang]}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {t.home.filtersSubtitle[lang]}
            </p>
          </div>
          {activeCount > 0 ? (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-800 dark:bg-blue-950 dark:text-blue-200">
              {activeCount}
            </span>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-zinc-500 sm:inline dark:text-zinc-400">
            {resultCount} {t.home.filtersResults[lang]}
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
          >
            {open ? t.home.filtersCollapse[lang] : t.home.filtersExpand[lang]}
          </button>
        </div>
      </div>

      {open ? (
        <div className="space-y-5 px-4 py-4 sm:px-5 sm:py-5">
          <LocationSegment
            lang={lang}
            value={draft.location}
            onChange={(location) => patch({ location })}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <SelectField
              label={t.addCar.status[lang]}
              value={draft.status}
              onChange={(status) => patch({ status })}
              options={facets.statuses}
              allLabel={allLabel}
            />
            <SelectField
              label={t.addCar.fuel[lang]}
              value={draft.fuel}
              onChange={(fuel) => patch({ fuel })}
              options={facets.fuels}
              allLabel={allLabel}
            />
            <SelectField
              label={t.addCar.transmission[lang]}
              value={draft.transmission}
              onChange={(transmission) => patch({ transmission })}
              options={facets.transmissions}
              allLabel={allLabel}
            />
            <SelectField
              label={t.addCar.color[lang]}
              value={draft.color}
              onChange={(color) => patch({ color })}
              options={facets.colors}
              allLabel={allLabel}
            />
            <NumberSelectField
              label={t.home.filterYearFrom[lang]}
              value={draft.yearMin}
              onChange={(yearMin) => patch({ yearMin })}
              options={facets.years}
              allLabel={allLabel}
            />
            <NumberSelectField
              label={t.home.filterYearTo[lang]}
              value={draft.yearMax}
              onChange={(yearMax) => patch({ yearMax })}
              options={facets.years}
              allLabel={allLabel}
            />
            <NumberSelectField
              label={t.addCar.doors[lang]}
              value={draft.doors}
              onChange={(doors) => patch({ doors })}
              options={facets.doors}
              allLabel={allLabel}
            />
            <NumberSelectField
              label={t.addCar.seats[lang]}
              value={draft.seats}
              onChange={(seats) => patch({ seats })}
              options={facets.seats}
              allLabel={allLabel}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:grid-cols-3">
            <Field label={t.home.filterPriceMin[lang]}>
              <input
                type="text"
                inputMode="numeric"
                value={draft.priceMin}
                onChange={(e) => patch({ priceMin: e.target.value })}
                placeholder="0"
                className={inputClass}
              />
            </Field>
            <Field label={t.home.filterPriceMax[lang]}>
              <input
                type="text"
                inputMode="numeric"
                value={draft.priceMax}
                onChange={(e) => patch({ priceMax: e.target.value })}
                placeholder="—"
                className={inputClass}
              />
            </Field>
            <Field label={t.home.filterMileageMax[lang]}>
              <input
                type="text"
                inputMode="numeric"
                value={draft.mileageMax}
                onChange={(e) => patch({ mileageMax: e.target.value })}
                placeholder="km"
                className={inputClass}
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={clearAll}
              disabled={activeCount === 0}
              className="text-sm font-medium text-zinc-600 underline-offset-2 hover:text-zinc-900 hover:underline disabled:opacity-40 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              {t.home.filtersClear[lang]}
            </button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <p className="self-center text-xs text-zinc-500 sm:hidden dark:text-zinc-400">
                {resultCount} {t.home.filtersResults[lang]}
              </p>
              <button
                type="button"
                onClick={apply}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-zinc-950"
              >
                {t.home.filtersApply[lang]}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default function CarsListingFilters(props: {
  lang: Lang;
  basePath: string;
  initialFilters: CarListingFilters;
  facets: CarListingFacets;
  resultCount: number;
}) {
  return (
    <Suspense
      fallback={
        <div className="mb-6 h-48 animate-pulse rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
      }
    >
      <CarsListingFiltersPanel {...props} />
    </Suspense>
  );
}
