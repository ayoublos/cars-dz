import Link from "next/link";
import type { Car } from "@/lib/cars";

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
const data = await fetch("http://localhost:3001/api/cars-list");
  const json = await data.json();
  const q = await getQuery(searchParams);
  const filtered = filterCars(json.cars, q);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Cars
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {q.trim()
                ? `Results for “${q.trim()}”.`
                : "Browse available listings."}
            </p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="rounded-xl border border-zinc-200 bg-white px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            No cars match your search. Try another keyword.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((car) => (
              <Link
                key={car.id}
                href={`/cars/${car.id}`}
                className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950"
              >
                <div className="aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-900">
                  <img
                    src={car.image}
                    alt={car.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-base font-semibold text-zinc-900 group-hover:text-zinc-700 dark:text-zinc-100 dark:group-hover:text-zinc-300">
                      {car.name}
                    </h2>
                    <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
                      {car.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {car.year} • {car.fuel} • {car.transmission}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {car.price.toLocaleString()} DZD
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">
                      {car.mileage.toLocaleString()} km
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
