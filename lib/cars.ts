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
export const CARS: Car[] = [
  { id: 1, name: "Car 1", status: "new", color: "red", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80", price: 10000, mileage: 10000, year: 2020, fuel: "petrol", transmission: "manual", engine: "1.5L", doors: 4, seats: 5 },
  { id: 2, name: "Car 2", status: "used", color: "blue", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80", price: 20000, mileage: 20000, year: 2021, fuel: "diesel", transmission: "automatic", engine: "2.0L", doors: 4, seats: 5 },
  { id: 3, name: "Car 3", status: "new", color: "green", image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=80", price: 30000, mileage: 30000, year: 2022, fuel: "electric", transmission: "manual", engine: "3.0L", doors: 4, seats: 5 },
];

export function getCarById(id: number, cars: Car[]) {
  return cars.find((c) => c.id === id);
}

