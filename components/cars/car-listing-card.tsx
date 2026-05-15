"use client";

import Link from "next/link";
import type { Car } from "@/lib/cars";
import type { Lang } from "@/lib/i18n";
import { carListingImageSrc } from "@/lib/cars";
import CarLocationTagBadge from "@/components/cars/car-location-tag";
import OwnerDeleteCarButton from "@/components/cars/owner-delete-car-button";

export default function CarListingCard({
  car,
  lang,
}: {
  car: Car;
  lang: Lang;
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950">
      <OwnerDeleteCarButton
        carId={car.id}
        ownerUserId={car.userId}
        lang={lang}
        compact
      />
      <Link
        href={`/cars/${car.id}`}
        className="block transition group-hover:opacity-[0.99]"
      >
        <div className="relative aspect-[16/10] w-full bg-zinc-100 dark:bg-zinc-900">
          <img
            src={carListingImageSrc(car.image)}
            alt={car.name}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {car.locationTag ? (
            <div className="absolute left-2 top-2 z-[1] max-w-[calc(100%-1rem)]">
              <CarLocationTagBadge
                tag={car.locationTag}
                lang={lang}
                variant="card"
              />
            </div>
          ) : null}
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
    </div>
  );
}
