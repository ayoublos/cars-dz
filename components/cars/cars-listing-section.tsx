import CarsGrid from "@/components/cars/cars-grid";
import CarsListingFilters from "@/components/cars/cars-listing-filters";
import {
  extractCarListingFacets,
  filterCars,
} from "@/lib/cars-filters";
import type { CarsListingSearchParamsInput } from "@/lib/cars-listing-search-params";
import { resolveCarListingFilters } from "@/lib/cars-listing-search-params";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { fetchCars } from "@/lib/supabase/cars-queries";

export default async function CarsListingSection({
  lang,
  basePath,
  searchParams,
  showTitle = false,
}: {
  lang: Lang;
  basePath: string;
  searchParams?: CarsListingSearchParamsInput;
  showTitle?: boolean;
}) {
  const cars = await fetchCars();
  const filters = await resolveCarListingFilters(searchParams);
  const facets = extractCarListingFacets(cars);
  const filtered = filterCars(cars, filters);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-6 dark:bg-black sm:py-10">
      <div className="w-full max-w-6xl">
        {showTitle ? (
          <h1 className="mb-4 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Cars
          </h1>
        ) : null}

        <CarsListingFilters
          lang={lang}
          basePath={basePath}
          initialFilters={filters}
          facets={facets}
          resultCount={filtered.length}
        />

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            {t.home.noResults[lang]}
          </p>
        ) : (
          <CarsGrid cars={filtered} lang={lang} />
        )}
      </div>
    </div>
  );
}
