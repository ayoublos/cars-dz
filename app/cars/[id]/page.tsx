import { notFound } from "next/navigation";
import { fetchCarById } from "@/lib/supabase/cars-queries";

export default async function CarDetail({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const car = await fetchCarById(numericId);
  if (!car) notFound();

  return (
    <div className="flex flex-1 items-start justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-900">
          <img
            src={car.image}
            alt={car.name}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {car.name}
            </h1>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
              {car.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            {car.year} • {car.fuel} • {car.transmission} • {car.engine}
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-zinc-50 p-3 text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
              <span className="text-zinc-500 dark:text-zinc-400">Price</span>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {car.price.toLocaleString()} DZD
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3 text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
              <span className="text-zinc-500 dark:text-zinc-400">Mileage</span>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {car.mileage.toLocaleString()} km
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3 text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
              <span className="text-zinc-500 dark:text-zinc-400">Color</span>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {car.color}
              </div>
            </div>
            <div className="rounded-xl bg-zinc-50 p-3 text-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300">
              <span className="text-zinc-500 dark:text-zinc-400">Seats</span>
              <div className="font-semibold text-zinc-900 dark:text-zinc-100">
                {car.seats}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}