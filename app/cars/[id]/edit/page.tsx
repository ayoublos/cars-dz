import Link from "next/link";
import { notFound } from "next/navigation";
import EditCarForm from "@/components/cars/edit-car-form";
import { t } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { fetchCarById } from "@/lib/supabase/cars-queries";

export default async function EditCarPage({
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

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-2xl">
        <p className="mb-4">
          <Link
            href={`/cars/${car.id}`}
            className="text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            ← {t.editCar.backToListing[lang]}
          </Link>
        </p>
        <EditCarForm initialCar={car} lang={lang} />
      </div>
    </div>
  );
}
