import { notFound } from "next/navigation";
import OwnerDeleteCarButton from "@/components/cars/owner-delete-car-button";
import OwnerEditCarLink from "@/components/cars/owner-edit-car-link";
import CarLocationTagBadge from "@/components/cars/car-location-tag";
import { carListingImageSrc } from "@/lib/cars";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { fetchCarById } from "@/lib/supabase/cars-queries";

function pillClasses(variant: "status" | "spec" = "spec") {
  if (variant === "status") {
    return "inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-800 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-200";
  }
  return "inline-flex items-center rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200";
}

function specCardClasses() {
  return "rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50 p-4 text-zinc-800 shadow-sm dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-950 dark:text-zinc-200";
}

export default async function CarDetail({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const lang = await getLang();
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const car = await fetchCarById(numericId);
  if (!car) notFound();

  const phoneDisplay = car.phone.trim();
  const telDigits = phoneDisplay.replace(/[^\d+]/g, "");
  const telHref =
    phoneDisplay !== "" && telDigits.length > 0 ? `tel:${telDigits}` : undefined;

  return (
    <div className="flex flex-1 items-start justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative aspect-[16/9] w-full bg-zinc-100 dark:bg-zinc-900">
          <img
            src={carListingImageSrc(car.image)}
            alt={car.name}
            className="h-full w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/0" />
          {car.locationTag ? (
            <div className="absolute left-4 top-4 z-10">
              <CarLocationTagBadge
                tag={car.locationTag}
                lang={lang}
                variant="detail"
              />
            </div>
          ) : null}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                {car.year} • {car.fuel} • {car.transmission}
              </p>
              <h1 className="mt-1 truncate text-2xl font-semibold tracking-tight text-white">
                {car.name}
              </h1>
            </div>
            <div className={pillClasses("status")}>{car.status}</div>
          </div>
        </div>

        {car.gallery.length > 0 ? (
          <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-4 dark:border-zinc-800 dark:bg-zinc-900/40">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              {t.carDetails.morePhotos[lang]}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {car.gallery.map((src, i) => (
                <div
                  key={`${src}-${i}`}
                  className="aspect-[4/3] overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-950"
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            <span className={pillClasses()}>{car.color || "Color: —"}</span>
            <span className={pillClasses()}>{car.engine || "Engine: —"}</span>
            <span className={pillClasses()}>{car.doors} doors</span>
            <span className={pillClasses()}>{car.seats} seats</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={`${specCardClasses()} sm:col-span-2`}>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t.carDetails.phone[lang]}
              </p>
              <p className="mt-2">
                {phoneDisplay ? (
                  telHref ? (
                    <a
                      href={telHref}
                      className="text-lg font-semibold text-blue-700 underline-offset-2 hover:underline dark:text-blue-400"
                    >
                      {phoneDisplay}
                    </a>
                  ) : (
                    <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {phoneDisplay}
                    </span>
                  )
                ) : (
                  <span className="text-lg text-zinc-500 dark:text-zinc-400">
                    —
                  </span>
                )}
              </p>
            </div>
            <div className={specCardClasses()}>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t.carDetails.price[lang]}
              </p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {car.price.toLocaleString()}{" "}
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {t.carDetails.dzd[lang]}
                </span>
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {t.carDetails.status[lang]}:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {car.status}
                </span>
              </p>
            </div>

            <div className={specCardClasses()}>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t.carDetails.mileage[lang]}
              </p>
              <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                {car.mileage.toLocaleString()}{" "}
                <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                  {t.carDetails.km[lang]}
                </span>
              </p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                {t.carDetails.year[lang]}:{" "}
                <span className="font-medium text-zinc-900 dark:text-zinc-200">
                  {car.year}
                </span>
              </p>
            </div>

            <div className={specCardClasses()}>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t.carDetails.powertrain[lang]}
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-600 dark:text-zinc-400">
                    {t.carDetails.fuel[lang]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                    {car.fuel || "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-600 dark:text-zinc-400">
                    {t.carDetails.transmission[lang]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                    {car.transmission || "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-600 dark:text-zinc-400">
                    {t.carDetails.engine[lang]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                    {car.engine || "—"}
                  </dd>
                </div>
              </dl>
            </div>

            <div className={specCardClasses()}>
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                {t.carDetails.body[lang]}
              </p>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-600 dark:text-zinc-400">
                    {t.carDetails.color[lang]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                    {car.color || "—"}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-600 dark:text-zinc-400">
                    {t.carDetails.doors[lang]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                    {car.doors}
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-zinc-600 dark:text-zinc-400">
                    {t.carDetails.seats[lang]}
                  </dt>
                  <dd className="font-medium text-zinc-900 dark:text-zinc-200">
                    {car.seats}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-zinc-800">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              <OwnerEditCarLink
                carId={car.id}
                ownerUserId={car.userId}
                lang={lang}
              />
              <OwnerDeleteCarButton
                carId={car.id}
                ownerUserId={car.userId}
                lang={lang}
                omitSectionWrapper
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}