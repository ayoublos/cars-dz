import { User } from "../supabase/users-queries";
import { Car, parseCarLocationTag } from "../cars";


export function UserFromFormData(formData: FormData): Omit<User, "id"> {
    return {
      email: stringField(formData, "email"),
      password: stringField(formData, "password"),
      role: "user",
    };
  }

  export function stringField(formData: FormData, key: string): string {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  }
  export function numberField(formData: FormData, key: string, fallback: number): number {
    const v = formData.get(key);
    if (typeof v !== "string" || v === "") return fallback;
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
  }

  /** Fields collected from the form; database assigns `id` when persisting. */
export function carFromFormData(formData: FormData): Omit<Car, "id"> {
    return {
      name: stringField(formData, "name"),
      status: stringField(formData, "status"),
      locationTag: parseCarLocationTag(stringField(formData, "locationTag")),
      color: stringField(formData, "color"),
      image: stringField(formData, "image"),
      gallery: [],
      price: numberField(formData, "price", 0),
      mileage: numberField(formData, "mileage", 0),
      year: numberField(formData, "year", new Date().getFullYear()),
      fuel: stringField(formData, "fuel"),
      transmission: stringField(formData, "transmission"),
      engine: stringField(formData, "engine"),
      doors: numberField(formData, "doors", 4),
      seats: numberField(formData, "seats", 5),
      phone: stringField(formData, "phone"),
      userId: null,
    };
  }
  export function userFromFormData(formData: FormData): Omit<User, "id"> {
    return {
      email: stringField(formData, "email"),
      password: stringField(formData, "password"),
      role: "user",
    };
  }

  export function rowToUser(row: User): User {
    return {
      id: "1",
      email: row.email,
      password: row.password,
      role: row.role,
    };
  }