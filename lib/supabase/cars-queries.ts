import { parseCarGallery, parseCarLocationTag, type Car } from "@/lib/cars";
import { createSupabaseServerClient } from "./server";

type CarRow = {
  id: number | string;
  name: string;
  status: string;
  location_tag?: string | null;
  color: string;
  image: string;
  gallery?: unknown;
  price: number | string;
  mileage: number | string;
  year: number | string;
  fuel: string;
  transmission: string;
  engine: string;
  doors: number | string;
  seats: number | string;
  phone?: string | null;
  user_id?: string | null;
};

function rowToCar(row: CarRow): Car {
  return {
    id: Number(row.id),
    name: row.name,
    status: row.status,
    locationTag: parseCarLocationTag(row.location_tag),
    color: row.color,
    image: row.image,
    gallery: parseCarGallery(row.gallery),
    price: Number(row.price),
    mileage: Number(row.mileage),
    year: Number(row.year),
    fuel: row.fuel,
    transmission: row.transmission,
    engine: row.engine,
    doors: Number(row.doors),
    seats: Number(row.seats),
    phone: typeof row.phone === "string" ? row.phone : "",
    userId: typeof row.user_id === "string" && row.user_id ? row.user_id : null,
  };
}

export async function fetchCars(): Promise<Car[]> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  return (data as CarRow[] | null)?.map(rowToCar) ?? [];
}

export async function fetchCarById(id: number): Promise<Car | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return rowToCar(data as CarRow);
}

/** Explicit columns so nothing extra is sent to PostgREST (avoids type mismatches). */
export function toCarInsertRow(payload: Omit<Car, "id">) {
  return {
    name: payload.name,
    status: payload.status,
    location_tag: payload.locationTag,
    color: payload.color,
    image: payload.image,
    gallery: payload.gallery,
    price: payload.price,
    mileage: payload.mileage,
    year: payload.year,
    fuel: payload.fuel,
    transmission: payload.transmission,
    engine: payload.engine,
    doors: payload.doors,
    seats: payload.seats,
    phone: payload.phone,
    user_id: payload.userId,
  };
}

export function toCarUpdateRow(payload: Omit<Car, "id">) {
  return {
    name: payload.name,
    status: payload.status,
    location_tag: payload.locationTag,
    color: payload.color,
    image: payload.image,
    gallery: payload.gallery,
    price: payload.price,
    mileage: payload.mileage,
    year: payload.year,
    fuel: payload.fuel,
    transmission: payload.transmission,
    engine: payload.engine,
    doors: payload.doors,
    seats: payload.seats,
    phone: payload.phone,
  };
}

export async function insertCar(payload: Omit<Car, "id">): Promise<Car> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("cars")
    .insert(toCarInsertRow(payload))
    .select()
    .single();

  if (error) throw error;
  return rowToCar(data as CarRow);
}
