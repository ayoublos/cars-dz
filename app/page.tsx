import CarsListingSection from "@/components/cars/cars-listing-section";
import Search from "@/components/ui/search";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import type { CarsListingSearchParamsInput } from "@/lib/cars-listing-search-params";

export default async function Home({
  searchParams,
}: {
  searchParams?: CarsListingSearchParamsInput;
}) {
  const lang = await getLang();
  return (
    <div>
      <Search
        placeholder={t.home.searchPlaceholder[lang]}
        buttonLabel={t.home.searchButton[lang]}
        listingBasePath="/"
      />
      <CarsListingSection
        lang={lang}
        basePath="/"
        searchParams={searchParams}
      />
    </div>
  );
}
