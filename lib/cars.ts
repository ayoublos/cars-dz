export type Car = {
  id: number;
  name: string;
  status: string;
  color: string;
  image: string;
  price: number;
  mileage: number;
  year: number;
  fuel: string;
  transmission: string;
  engine: string;
  doors: number;
  seats: number;
};

/** Legacy seed data — live reads use Supabase (`fetchCars`). */


