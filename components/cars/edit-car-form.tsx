"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Car } from "@/lib/cars";
import type { Lang } from "@/lib/i18n";
import { LANG_CHANGE_EVENT, t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toCarUpdateRow } from "@/lib/supabase/cars-queries";
import { uploadCarListingImage } from "@/lib/supabase/car-images";
import CarLocationTagField from "@/components/cars/car-location-tag-field";
import { carFromFormData } from "@/lib/util/mapper";

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600/40";

const labelClassName =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

const MAX_EXTRA_PHOTOS = 3;

type ExtraPhoto = { id: string; file: File };

export default function EditCarForm({
  initialCar,
  lang: initialLang,
}: {
  initialCar: Car;
  lang: Lang;
}) {
  const router = useRouter();
  const extraPhotosInputRef = useRef<HTMLInputElement | null>(null);
  const [lang, setLang] = useState<Lang>(initialLang);
  const [session, setSession] = useState<Session | null | undefined>(
    undefined,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialCar.image);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<
    string | null
  >(null);
  const [extraPhotos, setExtraPhotos] = useState<ExtraPhoto[]>([]);
  const [extraPhotoPreviewUrls, setExtraPhotoPreviewUrls] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    function readLangFromBrowser(): Lang {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("lang");
      if (q === "ar" || q === "fr" || q === "en") return q;
      const raw = document.cookie
        .split(";")
        .map((s) => s.trim())
        .find((s) => s.startsWith("lang="))
        ?.split("=")[1];
      if (raw === "ar" || raw === "fr" || raw === "en") return raw;
      return "en";
    }

    const onLangPicked = (e: Event) => {
      const ce = e as CustomEvent<{ lang?: Lang }>;
      const next = ce.detail?.lang;
      if (next === "ar" || next === "fr" || next === "en") setLang(next);
    };

    const onPopState = () => setLang(readLangFromBrowser());
    setLang(readLangFromBrowser());
    window.addEventListener(LANG_CHANGE_EVENT, onLangPicked);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener(LANG_CHANGE_EVENT, onLangPicked);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    let cancelled = false;
    void supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setSession(data.session ?? null);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setSelectedImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedImage);
    setSelectedImagePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedImage]);

  useEffect(() => {
    const map: Record<string, string> = {};
    for (const { id, file } of extraPhotos) {
      map[id] = URL.createObjectURL(file);
    }
    setExtraPhotoPreviewUrls(map);
    return () => {
      Object.values(map).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [extraPhotos]);

  const addExtraPhotos = (files: FileList | null) => {
    if (!files?.length) return;
    setExtraPhotos((prev) => {
      const remaining = Math.max(0, MAX_EXTRA_PHOTOS - prev.length);
      if (remaining === 0) return prev;
      const next: ExtraPhoto[] = Array.from(files)
        .slice(0, remaining)
        .map((file) => ({
          id: crypto.randomUUID(),
          file,
        }));
      return [...prev, ...next];
    });
  };

  const removeExtraPhoto = (id: string) => {
    setExtraPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const user = sessionData.session?.user;
      if (!user) {
        setErrorMessage(t.addCar.signInRequiredBody[lang]);
        return;
      }
      if (!initialCar.userId || user.id !== initialCar.userId) {
        setErrorMessage(t.editCar.notOwner[lang]);
        return;
      }

      const formData = new FormData(form);
      const base = carFromFormData(formData);

      let coverUrl = coverImageUrl.trim();
      if (selectedImage) {
        coverUrl = await uploadCarListingImage(supabase, selectedImage);
      }

      const newGalleryUrls: string[] = [];
      for (const { file } of extraPhotos) {
        newGalleryUrls.push(await uploadCarListingImage(supabase, file));
      }
      const gallery = [...initialCar.gallery, ...newGalleryUrls];

      const { error } = await supabase
        .from("cars")
        .update(
          toCarUpdateRow({
            ...base,
            image: coverUrl,
            gallery,
            userId: initialCar.userId,
          }),
        )
        .eq("id", initialCar.id);

      if (error) throw error;
      router.push(`/cars/${initialCar.id}`);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : t.editCar.updateFailed[lang],
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const c = initialCar;
  const loginNext = `/cars/${c.id}/edit`;

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          {t.editCar.title[lang]}
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t.editCar.subtitle[lang]}
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

      {session === undefined ? (
        <p className="rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
          {t.addCar.checkingSession[lang]}
        </p>
      ) : session === null ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-10">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            {t.addCar.signInRequiredTitle[lang]}
          </h2>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
            {t.addCar.signInRequiredBody[lang]}
          </p>
          <Link
            href={`/login?next=${encodeURIComponent(loginNext)}`}
            className="mt-6 inline-flex rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t.addCar.goToSignIn[lang]}
          </Link>
        </div>
      ) : !c.userId || session.user.id !== c.userId ? (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center text-sm text-zinc-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 sm:p-10">
          {t.editCar.notOwner[lang]}
        </div>
      ) : (
        <form
          key={c.id}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
        >
          <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <label htmlFor="editCarPhoto" className={labelClassName}>
              {t.addCar.carPhoto[lang]}
            </label>
            <input
              id="editCarPhoto"
              type="file"
              accept="image/*"
              className={inputClassName}
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setSelectedImage(f);
                if (!f) setCoverImageUrl(c.image);
              }}
            />
            {selectedImagePreviewUrl ? (
              <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                <img
                  src={selectedImagePreviewUrl}
                  alt=""
                  className="h-36 w-full object-cover"
                />
              </div>
            ) : (
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
                {t.addCar.coverHint[lang]}
              </p>
            )}

            <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  ref={extraPhotosInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    addExtraPhotos(e.target.files);
                    e.target.value = "";
                  }}
                />
                <button
                  type="button"
                  onClick={() => extraPhotosInputRef.current?.click()}
                  disabled={isSubmitting || extraPhotos.length >= MAX_EXTRA_PHOTOS}
                  className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-60 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                >
                  {t.addCar.additionalPhotos[lang]}
                </button>
                <span className="text-xs text-zinc-500 dark:text-zinc-500">
                  {extraPhotos.length === 0
                    ? t.addCar.additionalHint[lang]
                    : `${extraPhotos.length}/${MAX_EXTRA_PHOTOS} new`}
                </span>
              </div>
              {extraPhotos.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {extraPhotos.map(({ id }) => {
                    const url = extraPhotoPreviewUrls[id];
                    if (!url) return null;
                    return (
                      <li key={id} className="relative">
                        <img
                          src={url}
                          alt=""
                          className="h-20 w-20 rounded-md border border-zinc-200 object-cover dark:border-zinc-700"
                        />
                        <button
                          type="button"
                          onClick={() => removeExtraPhoto(id)}
                          disabled={isSubmitting}
                          className="absolute -right-1.5 -top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-300 bg-white text-xs font-medium text-zinc-600 shadow-sm hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-300"
                          aria-label="Remove photo"
                        >
                          ×
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="edit-name" className={labelClassName}>
                {t.addCar.name[lang]}
              </label>
              <input
                id="edit-name"
                type="text"
                name="name"
                required
                defaultValue={c.name}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-status" className={labelClassName}>
                {t.addCar.status[lang]}
              </label>
              <input
                id="edit-status"
                type="text"
                name="status"
                defaultValue={c.status}
                className={inputClassName}
              />
            </div>
            <CarLocationTagField lang={lang} defaultValue={c.locationTag} />
            <div>
              <label htmlFor="edit-color" className={labelClassName}>
                {t.addCar.color[lang]}
              </label>
              <input
                id="edit-color"
                type="text"
                name="color"
                defaultValue={c.color}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-price" className={labelClassName}>
                {t.addCar.price[lang]}
              </label>
              <input
                id="edit-price"
                type="text"
                name="price"
                inputMode="numeric"
                defaultValue={String(c.price)}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-mileage" className={labelClassName}>
                {t.addCar.mileage[lang]}
              </label>
              <input
                id="edit-mileage"
                type="text"
                name="mileage"
                inputMode="numeric"
                defaultValue={String(c.mileage)}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-year" className={labelClassName}>
                {t.addCar.year[lang]}
              </label>
              <input
                id="edit-year"
                type="text"
                name="year"
                inputMode="numeric"
                defaultValue={String(c.year)}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-fuel" className={labelClassName}>
                {t.addCar.fuel[lang]}
              </label>
              <input
                id="edit-fuel"
                type="text"
                name="fuel"
                defaultValue={c.fuel}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-transmission" className={labelClassName}>
                {t.addCar.transmission[lang]}
              </label>
              <input
                id="edit-transmission"
                type="text"
                name="transmission"
                defaultValue={c.transmission}
                className={inputClassName}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="edit-engine" className={labelClassName}>
                {t.addCar.engine[lang]}
              </label>
              <input
                id="edit-engine"
                type="text"
                name="engine"
                defaultValue={c.engine}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-doors" className={labelClassName}>
                {t.addCar.doors[lang]}
              </label>
              <input
                id="edit-doors"
                type="text"
                name="doors"
                inputMode="numeric"
                defaultValue={String(c.doors)}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="edit-seats" className={labelClassName}>
                {t.addCar.seats[lang]}
              </label>
              <input
                id="edit-seats"
                type="text"
                name="seats"
                inputMode="numeric"
                defaultValue={String(c.seats)}
                className={inputClassName}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="edit-phone" className={labelClassName}>
                {t.addCar.phone[lang]}
              </label>
              <input
                id="edit-phone"
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                defaultValue={c.phone}
                className={inputClassName}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-zinc-200 pt-6 dark:border-zinc-800 sm:flex-row sm:justify-end">
            <Link
              href={`/cars/${c.id}`}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              {t.editCar.backToListing[lang]}
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 dark:focus-visible:ring-offset-zinc-950"
            >
              {isSubmitting ? t.addCar.saving[lang] : t.editCar.save[lang]}
            </button>
          </div>
        </form>
      )}
    </>
  );
}
