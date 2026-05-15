"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { Car } from "@/lib/cars";
import type { Lang } from "@/lib/i18n";
import { LANG_CHANGE_EVENT, t } from "@/lib/i18n";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { toCarInsertRow } from "@/lib/supabase/cars-queries";
import { uploadCarListingImage } from "@/lib/supabase/car-images";
import CarLocationTagField from "@/components/cars/car-location-tag-field";
import { carFromFormData } from "@/lib/util/mapper";

const inputClassName =
  "mt-1 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400/30 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-zinc-500 dark:focus:ring-zinc-600/40";

const labelClassName =
  "block text-sm font-medium text-zinc-700 dark:text-zinc-300";

async function insertCarRow(car: Omit<Car, "id">) {
  const supabase = getSupabaseBrowserClient();
  const { error } = await supabase
    .from("cars")
    .insert(toCarInsertRow(car))
    .select()
    .single();

  if (error) throw error;
}

type ExtraPhoto = { id: string; file: File };

export default function AddACar() {
  const MAX_EXTRA_PHOTOS = 3;
  const router = useRouter();
  const formRef = useRef<HTMLFormElement | null>(null);
  const extraPhotosInputRef = useRef<HTMLInputElement | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImagePreviewUrl, setSelectedImagePreviewUrl] = useState<
    string | null
  >(null);
  const [extraPhotos, setExtraPhotos] = useState<ExtraPhoto[]>([]);
  const [extraPhotoPreviewUrls, setExtraPhotoPreviewUrls] = useState<
    Record<string, string>
  >({});
  const [locationText, setLocationText] = useState("");
  const [listingNotes, setListingNotes] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [session, setSession] = useState<Session | null | undefined>(
    undefined,
  );

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

  const fillLocationFromGps = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setErrorMessage(t.addCar.gpsNotSupported[lang]);
      return;
    }
    setErrorMessage(null);
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `/api/reverse-geocode?lat=${encodeURIComponent(String(latitude))}&lon=${encodeURIComponent(String(longitude))}&lang=${encodeURIComponent(lang)}`,
          );
          const json = (await res.json()) as { label?: string };
          setLocationText(
            json.label?.trim() ||
              `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          );
        } catch {
          setLocationText(
            `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
          );
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        setIsLocating(false);
        if (err.code === 1) {
          setErrorMessage(t.addCar.gpsDenied[lang]);
        } else {
          setErrorMessage(t.addCar.gpsUnavailable[lang]);
        }
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 60_000 },
    );
  };

  const setField = (name: string, value: string) => {
    const form = formRef.current;
    if (!form) return;
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      el.value = value;
    }
  };

  const readFormField = (name: string): string => {
    const form = formRef.current;
    if (!form) return "";
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      return el.value.trim();
    }
    return "";
  };

  const generateCoverFromAi = async () => {
    setErrorMessage(null);
    setIsGeneratingCover(true);
    try {
      const yearRaw = readFormField("year");
      const yearNum = Number(yearRaw);
      const res = await fetch("/api/car-cover-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: readFormField("name") || undefined,
          color: readFormField("color") || undefined,
          year: Number.isFinite(yearNum) ? yearNum : undefined,
          fuel: readFormField("fuel") || undefined,
          transmission: readFormField("transmission") || undefined,
          engine: readFormField("engine") || undefined,
          status: readFormField("status") || undefined,
          extra:
            [listingNotes.trim(), locationText.trim()].filter(Boolean).join(" | ") ||
            undefined,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        base64?: string;
        mediaType?: string;
      };
      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Image generation failed.",
        );
      }
      const b64 = data.base64;
      const mime = data.mediaType?.startsWith("image/") ? data.mediaType : "image/png";
      if (!b64) throw new Error("No image in response.");
      const blob = await fetch(`data:${mime};base64,${b64}`).then((r) => r.blob());
      const file = new File([blob], `ai-cover-${Date.now()}.png`, {
        type: mime,
      });
      setSelectedImage(file);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not generate cover image.",
      );
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const analyzePhoto = async () => {
    if (!selectedImage) return;
    setErrorMessage(null);
    setIsAnalyzing(true);
    try {
      const fd = new FormData();
      fd.set("image", selectedImage);
      const res = await fetch("/api/car-photo", { method: "POST", body: fd });
      const data = (await res.json()) as Record<string, unknown>;

      if (!res.ok) {
        throw new Error(
          typeof data.error === "string" ? data.error : "Analysis failed.",
        );
      }

      if (typeof data.location === "string") setLocationText(data.location);
      if (typeof data.notes === "string") setListingNotes(data.notes);

      const str = (k: string) =>
        typeof data[k] === "string" ? (data[k] as string) : "";
      const num = (k: string) =>
        typeof data[k] === "number" && Number.isFinite(data[k] as number)
          ? String(data[k])
          : "";

      if (str("name")) setField("name", str("name"));
      if (str("status")) setField("status", str("status"));
      if (str("color")) setField("color", str("color"));
      if (num("year")) setField("year", num("year"));
      if (str("fuel")) setField("fuel", str("fuel"));
      if (str("transmission")) setField("transmission", str("transmission"));
      if (str("engine")) setField("engine", str("engine"));
      if (num("doors")) setField("doors", num("doors"));
      if (num("seats")) setField("seats", num("seats"));
      if (num("price_dzd")) setField("price", num("price_dzd"));
      if (num("mileage_km")) setField("mileage", num("mileage_km"));
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Could not analyze the photo.",
      );
    } finally {
      setIsAnalyzing(false);
    }
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

      const formData = new FormData(form);
      const base = carFromFormData(formData);

      let coverUrl = base.image.trim();
      if (selectedImage) {
        coverUrl = await uploadCarListingImage(supabase, selectedImage);
      }

      const galleryUrls: string[] = [];
      for (const { file } of extraPhotos) {
        galleryUrls.push(await uploadCarListingImage(supabase, file));
      }

      await insertCarRow({
        ...base,
        image: coverUrl,
        gallery: galleryUrls,
        userId: user.id,
      });
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
            {t.addCar.title[lang]}
          </h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {t.addCar.subtitle[lang]}
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
              href={`/login?next=${encodeURIComponent("/add-a-car")}`}
              className="mt-6 inline-flex rounded-md bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {t.addCar.goToSignIn[lang]}
            </Link>
          </div>
        ) : (
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
        >
          <div className="mb-6 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/30">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <label htmlFor="carPhoto" className={labelClassName}>
                  {t.addCar.carPhoto[lang]}
                </label>
                <input
                  id="carPhoto"
                  type="file"
                  accept="image/*"
                  className={inputClassName}
                  onChange={(e) => setSelectedImage(e.target.files?.[0] ?? null)}
                />
                {selectedImagePreviewUrl ? (
                  <div className="mt-3 overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
                    <img
                      src={selectedImagePreviewUrl}
                      alt="Selected car"
                      className="h-36 w-full object-cover"
                    />
                  </div>
                ) : null}
                <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
                  {t.addCar.coverHint[lang]}
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:items-stretch">
                <button
                  type="button"
                  onClick={analyzePhoto}
                  disabled={
                    !selectedImage || isAnalyzing || isGeneratingCover || isSubmitting
                  }
                  className="h-10 rounded-md bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                >
                  {isAnalyzing ? t.addCar.analyzing[lang] : t.addCar.autofill[lang]}
                </button>
                <button
                  type="button"
                  onClick={generateCoverFromAi}
                  disabled={isAnalyzing || isGeneratingCover || isSubmitting}
                  className="h-10 rounded-md border border-violet-300 bg-violet-50 px-4 text-sm font-medium text-violet-900 hover:bg-violet-100 disabled:opacity-60 dark:border-violet-800 dark:bg-violet-950/50 dark:text-violet-100 dark:hover:bg-violet-950/80"
                >
                  {isGeneratingCover
                    ? t.addCar.generatingCoverAi[lang]
                    : t.addCar.generateCoverAi[lang]}
                </button>
              </div>
            </div>

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
                    : `${extraPhotos.length}/${MAX_EXTRA_PHOTOS} extra`}
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

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="locationText" className={labelClassName}>
                    {t.addCar.location[lang]}
                  </label>
                  <div className="mt-1 flex flex-col gap-2 sm:flex-row sm:items-stretch">
                    <input
                      id="locationText"
                      type="text"
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      placeholder="e.g. Algiers"
                      className={`${inputClassName} sm:mt-0 sm:min-w-0 sm:flex-1`}
                    />
                    <button
                      type="button"
                      onClick={fillLocationFromGps}
                      disabled={isSubmitting || isLocating}
                      className="shrink-0 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-900 transition-colors hover:bg-blue-100 disabled:opacity-60 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-100 dark:hover:bg-blue-950/70"
                    >
                      {isLocating
                        ? t.addCar.locatingGps[lang]
                        : t.addCar.useGpsLocation[lang]}
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="listingNotes" className={labelClassName}>
                    {t.addCar.notes[lang]}
                  </label>
                  <textarea
                    id="listingNotes"
                    rows={2}
                    value={listingNotes}
                    onChange={(e) => setListingNotes(e.target.value)}
                    className={inputClassName}
                  />
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className={labelClassName}>
                {t.addCar.name[lang]}
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
                {t.addCar.status[lang]}
              </label>
              <input
                id="status"
                type="text"
                name="status"
                placeholder="new or used"
                className={inputClassName}
              />
            </div>
            <CarLocationTagField lang={lang} />
            <div>
              <label htmlFor="color" className={labelClassName}>
                {t.addCar.color[lang]}
              </label>
              <input
                id="color"
                type="text"
                name="color"
                placeholder="e.g. silver"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="price" className={labelClassName}>
                {t.addCar.price[lang]}
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
                {t.addCar.mileage[lang]}
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
                {t.addCar.year[lang]}
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
            <div>
              <label htmlFor="fuel" className={labelClassName}>
                {t.addCar.fuel[lang]}
              </label>
              <input
                id="fuel"
                type="text"
                name="fuel"
                placeholder="petrol"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="transmission" className={labelClassName}>
                {t.addCar.transmission[lang]}
              </label>
              <input
                id="transmission"
                type="text"
                name="transmission"
                placeholder="manual"
                className={inputClassName}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="engine" className={labelClassName}>
                {t.addCar.engine[lang]}
              </label>
              <input
                id="engine"
                type="text"
                name="engine"
                placeholder="e.g. 1.6L"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="doors" className={labelClassName}>
                {t.addCar.doors[lang]}
              </label>
              <input
                id="doors"
                type="text"
                name="doors"
                inputMode="numeric"
                placeholder="4"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="seats" className={labelClassName}>
                {t.addCar.seats[lang]}
              </label>
              <input
                id="seats"
                type="text"
                name="seats"
                inputMode="numeric"
                placeholder="5"
                className={inputClassName}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className={labelClassName}>
                {t.addCar.phone[lang]}
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+213 555 00 00 00"
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
              {t.addCar.clear[lang]}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60 dark:focus-visible:ring-offset-zinc-950"
            >
              {isSubmitting ? t.addCar.saving[lang] : t.addCar.add[lang]}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
