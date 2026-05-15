"use client";

import type { Car } from "@/lib/cars";
import type { Lang } from "@/lib/i18n";
import CarListingCard from "@/components/cars/car-listing-card";

export default function CarsGrid({
  cars,
  lang,
}: {
  cars: readonly Car[];
  lang: Lang;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car) => (
        <CarListingCard key={car.id} car={car} lang={lang} />
      ))}
    </div>
  );
}
