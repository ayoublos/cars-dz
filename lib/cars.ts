export type Car = {
  id: number;
  name: string;
  status: string;
  color: string;
  image: string;
  /** Extra photo URLs (cover uses `image`). */
  gallery: string[];
  price: number;
  mileage: number;
  year: number;
  fuel: string;
  transmission: string;
  engine: string;
  doors: number;
  seats: number;
};

export function parseCarGallery(raw: unknown): string[] {
  if (raw == null) return [];
  if (Array.isArray(raw)) {
    return raw.filter(
      (x): x is string => typeof x === "string" && x.trim() !== "",
    );
  }
  return [];
}

/** Safe src when `image` is missing (e.g. add-a-car without URL). */
export function carListingImageSrc(image: string): string {
  const s = typeof image === "string" ? image.trim() : "";
  if (s) return s;
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect fill="#e4e4e7" width="100%" height="100%"/></svg>',
    )
  );
}

/** Legacy seed data — live reads use Supabase (`fetchCars`). */


