import Link from "next/link";
import { CARS } from "@/lib/cars";

export default function CarsPage() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-6xl">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Cars
            </h1>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              Browse available listings.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CARS.map((car) => (
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
      </div>
    </div>
  );
}