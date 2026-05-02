import type { Car } from "@/lib/cars";
export async function GET(request: Request) {
  return new Response( JSON.stringify({ cars: CARS }), { status: 200 });
}
const CARS: Car[] = [
  { id: 1, name: "Car 1", status: "new", color: "red", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=80", price: 10000, mileage: 10000, year: 2020, fuel: "petrol", transmission: "manual", engine: "1.5L", doors: 4, seats: 5 },
  { id: 2, name: "Car 2", status: "used", color: "blue", image: "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1600&q=80", price: 20000, mileage: 20000, year: 2021, fuel: "diesel", transmission: "automatic", engine: "2.0L", doors: 4, seats: 5 },
  { id: 3, name: "Car 3", status: "new", color: "green", image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=1600&q=80", price: 30000, mileage: 30000, year: 2022, fuel: "electric", transmission: "manual", engine: "3.0L", doors: 4, seats: 5 },
];

// export async function POST(request: Request) {
//   const { name, status, color, image, price, mileage, year, fuel, transmission, engine, doors, seats } = await request.json();
//   const car = { id: CARS.length + 1, name, status, color, image, price, mileage, year, fuel, transmission, engine, doors, seats };
//   CARS.push(car);
//   return new Response( JSON.stringify({ car }), { status: 201 });
// }

// export async function PUT(request: Request) {
//   const { id, name, status, color, image, price, mileage, year, fuel, transmission, engine, doors, seats } = await request.json();
//   const car = CARS.find((c) => c.id === id);
//   if (!car) return new Response( JSON.stringify({ error: "Car not found" }), { status: 404 });