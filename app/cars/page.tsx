import CarsListingSection from "@/components/cars/cars-listing-section";
import type { CarsListingSearchParamsInput } from "@/lib/cars-listing-search-params";
import { getLang } from "@/lib/i18n/server";

export default async function CarsPage({
  searchParams,
}: {
  searchParams?: CarsListingSearchParamsInput;
}) {
  const lang = await getLang();
  return (
    <CarsListingSection
      lang={lang}
      basePath="/cars"
      searchParams={searchParams}
      showTitle
    />
  );
}
