import type { Car, CarLocationTag } from "@/lib/cars";

export type LocationFilter = "all" | CarLocationTag | "none";

export type CarListingFilters = {
  q: string;
  location: LocationFilter;
  status: string;
  fuel: string;
  transmission: string;
  color: string;
  yearMin: string;
  yearMax: string;
  priceMin: string;
  priceMax: string;
  mileageMax: string;
  doors: string;
  seats: string;
};

export const EMPTY_CAR_LISTING_FILTERS: CarListingFilters = {
  q: "",
  location: "all",
  status: "",
  fuel: "",
  transmission: "",
  color: "",
  yearMin: "",
  yearMax: "",
  priceMin: "",
  priceMax: "",
  mileageMax: "",
  doors: "",
  seats: "",
};

export type CarListingFacets = {
  statuses: string[];
  fuels: string[];
  transmissions: string[];
  colors: string[];
  years: number[];
  doors: number[];
  seats: number[];
};

function norm(raw: string | undefined): string {
  return typeof raw === "string" ? raw.trim() : "";
}

export function parseLocationFilter(raw: string | undefined): LocationFilter {
  if (raw === "korea" || raw === "abroad") return raw;
  if (raw === "none") return "none";
  return "all";
}

export function parseCarListingFilters(
  params: Record<string, string | undefined>,
): CarListingFilters {
  return {
    q: norm(params.q),
    location: parseLocationFilter(params.location),
    status: norm(params.status),
    fuel: norm(params.fuel),
    transmission: norm(params.transmission),
    color: norm(params.color),
    yearMin: norm(params.yearMin),
    yearMax: norm(params.yearMax),
    priceMin: norm(params.priceMin),
    priceMax: norm(params.priceMax),
    mileageMax: norm(params.mileageMax),
    doors: norm(params.doors),
    seats: norm(params.seats),
  };
}

export function countActiveCarListingFilters(
  filters: CarListingFilters,
): number {
  let n = 0;
  if (filters.location !== "all") n++;
  if (filters.status) n++;
  if (filters.fuel) n++;
  if (filters.transmission) n++;
  if (filters.color) n++;
  if (filters.yearMin) n++;
  if (filters.yearMax) n++;
  if (filters.priceMin) n++;
  if (filters.priceMax) n++;
  if (filters.mileageMax) n++;
  if (filters.doors) n++;
  if (filters.seats) n++;
  return n;
}

export function buildCarListingSearchParams(
  filters: CarListingFilters,
): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.location !== "all") params.set("location", filters.location);
  if (filters.status) params.set("status", filters.status);
  if (filters.fuel) params.set("fuel", filters.fuel);
  if (filters.transmission) params.set("transmission", filters.transmission);
  if (filters.color) params.set("color", filters.color);
  if (filters.yearMin) params.set("yearMin", filters.yearMin);
  if (filters.yearMax) params.set("yearMax", filters.yearMax);
  if (filters.priceMin) params.set("priceMin", filters.priceMin);
  if (filters.priceMax) params.set("priceMax", filters.priceMax);
  if (filters.mileageMax) params.set("mileageMax", filters.mileageMax);
  if (filters.doors) params.set("doors", filters.doors);
  if (filters.seats) params.set("seats", filters.seats);
  return params;
}

export function extractCarListingFacets(cars: readonly Car[]): CarListingFacets {
  const statuses = new Set<string>();
  const fuels = new Set<string>();
  const transmissions = new Set<string>();
  const colors = new Set<string>();
  const years = new Set<number>();
  const doors = new Set<number>();
  const seats = new Set<number>();

  for (const car of cars) {
    if (car.status.trim()) statuses.add(car.status.trim());
    if (car.fuel.trim()) fuels.add(car.fuel.trim());
    if (car.transmission.trim()) transmissions.add(car.transmission.trim());
    if (car.color.trim()) colors.add(car.color.trim());
    if (Number.isFinite(car.year)) years.add(car.year);
    if (Number.isFinite(car.doors)) doors.add(car.doors);
    if (Number.isFinite(car.seats)) seats.add(car.seats);
  }

  const sortStr = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" });
  return {
    statuses: [...statuses].sort(sortStr),
    fuels: [...fuels].sort(sortStr),
    transmissions: [...transmissions].sort(sortStr),
    colors: [...colors].sort(sortStr),
    years: [...years].sort((a, b) => b - a),
    doors: [...doors].sort((a, b) => a - b),
    seats: [...seats].sort((a, b) => a - b),
  };
}

function parseNum(raw: string): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function filterCars(
  cars: readonly Car[],
  filters: CarListingFilters,
): Car[] {
  const needle = filters.q.trim().toLowerCase();
  const yearMin = parseNum(filters.yearMin);
  const yearMax = parseNum(filters.yearMax);
  const priceMin = parseNum(filters.priceMin);
  const priceMax = parseNum(filters.priceMax);
  const mileageMax = parseNum(filters.mileageMax);
  const doors = parseNum(filters.doors);
  const seats = parseNum(filters.seats);

  return cars.filter((car) => {
    if (filters.location === "korea" && car.locationTag !== "korea") return false;
    if (filters.location === "abroad" && car.locationTag !== "abroad") return false;
    if (filters.location === "none" && car.locationTag !== "") return false;

    if (filters.status && car.status.trim() !== filters.status) return false;
    if (filters.fuel && car.fuel.trim() !== filters.fuel) return false;
    if (filters.transmission && car.transmission.trim() !== filters.transmission)
      return false;
    if (filters.color && car.color.trim() !== filters.color) return false;
    if (yearMin !== null && car.year < yearMin) return false;
    if (yearMax !== null && car.year > yearMax) return false;
    if (priceMin !== null && car.price < priceMin) return false;
    if (priceMax !== null && car.price > priceMax) return false;
    if (mileageMax !== null && car.mileage > mileageMax) return false;
    if (doors !== null && car.doors !== doors) return false;
    if (seats !== null && car.seats !== seats) return false;

    if (!needle) return true;
    const haystack = [
      car.name,
      car.status,
      car.color,
      car.fuel,
      car.transmission,
      car.engine,
      String(car.year),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  });
}

/** @deprecated Use filterCars with full CarListingFilters */
export function filterCarsByQuery(
  cars: readonly Car[],
  q: string,
  location: LocationFilter,
): Car[] {
  return filterCars(cars, { ...EMPTY_CAR_LISTING_FILTERS, q, location });
}
