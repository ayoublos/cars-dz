import CarsGrid from "@/components/cars/cars-grid";
import type { Car } from "@/lib/cars";
import { getLang } from "@/lib/i18n/server";
import { fetchCars } from "@/lib/supabase/cars-queries";

function filterCars(cars: readonly Car[], q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [...cars];
  return cars.filter((car) => {
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

type SearchParamsInput =
  | Promise<{ q?: string | string[] }>
  | { q?: string | string[] }
  | undefined;

async function getQuery(sp: SearchParamsInput): Promise<string> {
  if (!sp) return "";
  const resolved = await Promise.resolve(sp);
  const raw = resolved.q;
  const q = Array.isArray(raw) ? raw[0] : raw;
  return typeof q === "string" ? q : "";
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams?: SearchParamsInput;
}) {
  const lang = await getLang();
  const cars = await fetchCars();
  const q = await getQuery(searchParams);
  const filtered = filterCars(cars, q);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Cars
            </h1>
          
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No cars match your search. Try another keyword.
          </p>
        ) : (
          <CarsGrid cars={filtered} lang={lang} />
        )}
      </div>
    </div>
  );
}
