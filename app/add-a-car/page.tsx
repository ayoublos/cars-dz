"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Car } from "@/lib/cars";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function stringField(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v : "";
}

function numberField(formData: FormData, key: string, fallback: number): number {
  const v = formData.get(key);
  if (typeof v !== "string" || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Fields collected from the form; database assigns `id` when persisting. */
function carFromFormData(formData: FormData): Omit<Car, "id"> {
  return {
    name: stringField(formData, "name"),
    status: stringField(formData, "status"),
    color: stringField(formData, "color"),
    image: stringField(formData, "image"),
    price: numberField(formData, "price", 0),
    mileage: numberField(formData, "mileage", 0),
    year: numberField(formData, "year", new Date().getFullYear()),
    fuel: "petrol",
    transmission: "manual",
    engine: "",
    doors: 4,
    seats: 5,
  };
}

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600/40";

const labelClassName =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

async function addCar(car: Omit<Car, "id">) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("cars")
    .insert(car)
    .select()
    .single();

  if (error) throw error;
}

export default function AddACar() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      await addCar(carFromFormData(formData));
      router.push("/cars");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "object" &&
              err !== null &&
              "message" in err &&
              typeof (err as { message: unknown }).message === "string"
            ? (err as { message: string }).message
            : "Could not save the car. Try again.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="w-full max-w-2xl">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Add a car
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Saved to your Supabase <code className="text-zinc-700 dark:text-zinc-300">cars</code>{" "}
            table (requires RLS policies for anon insert).
          </p>
        </header>

        {errorMessage ? (
          <div
            className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={labelClassName}>
                Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                required
                placeholder="e.g. Renault Symbol"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="status" className={labelClassName}>
                Status
              </label>
              <input
                id="status"
                type="text"
                name="status"
                placeholder="new or used"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="color" className={labelClassName}>
                Color
              </label>
              <input
                id="color"
                type="text"
                name="color"
                placeholder="e.g. silver"
                className={inputClassName}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="image" className={labelClassName}>
                Image URL
              </label>
              <input
                id="image"
                type="url"
                name="image"
                placeholder="https://…"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClassName}>
                Price (DZD)
              </label>
              <input
                id="price"
                type="text"
                name="price"
                inputMode="numeric"
                placeholder="1000000"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="mileage" className={labelClassName}>
                Mileage (km)
              </label>
              <input
                id="mileage"
                type="text"
                name="mileage"
                inputMode="numeric"
                placeholder="45000"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="year" className={labelClassName}>
                Year
              </label>
              <input
                id="year"
                type="text"
                name="year"
                inputMode="numeric"
                placeholder="2020"
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:flex-row sm:justify-end">
            <button
              type="reset"
              disabled={isSubmitting}
              className="rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 dark:focus-visible:ring-offset-zinc-950"
            >
              {isSubmitting ? "Saving…" : "Add car"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
