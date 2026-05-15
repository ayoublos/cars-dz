import {
  parseCarListingFilters,
  type CarListingFilters,
} from "@/lib/cars-filters";

const FILTER_KEYS = [
  "q",
  "location",
  "status",
  "fuel",
  "transmission",
  "color",
  "yearMin",
  "yearMax",
  "priceMin",
  "priceMax",
  "mileageMax",
  "doors",
  "seats",
] as const;

export type CarsListingSearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

function one(raw: string | string[] | undefined): string {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return typeof v === "string" ? v : "";
}

export async function resolveCarListingFilters(
  sp: CarsListingSearchParamsInput,
): Promise<CarListingFilters> {
  if (!sp) return parseCarListingFilters({});
  const resolved = await Promise.resolve(sp);
  const record: Record<string, string | undefined> = {};
  for (const key of FILTER_KEYS) {
    record[key] = one(resolved[key]);
  }
  return parseCarListingFilters(record);
}

/** @deprecated */
export async function resolveCarsListingSearchParams(
  sp: CarsListingSearchParamsInput,
): Promise<{ q: string; location: string }> {
  const f = await resolveCarListingFilters(sp);
  return { q: f.q, location: f.location === "all" ? "" : f.location };
}
