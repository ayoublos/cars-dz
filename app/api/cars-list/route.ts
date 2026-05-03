import { fetchCars, insertCar } from "@/lib/supabase/cars-queries";

export async function GET() {
  try {
    const cars = await fetchCars();
    return Response.json({ cars });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load cars";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      status,
      color,
      image,
      price,
      mileage,
      year,
      fuel,
      transmission,
      engine,
      doors,
      seats,
    } = body;
    const car = await insertCar({
      name,
      status,
      color,
      image,
      price: Number(price),
      mileage: Number(mileage),
      year: Number(year),
      fuel,
      transmission,
      engine,
      doors: Number(doors),
      seats: Number(seats),
    });
    return Response.json({ car }, { status: 201 });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to create car";
    return Response.json({ error: message }, { status: 500 });
  }
}
