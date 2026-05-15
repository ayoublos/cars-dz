import { fetchCars } from "@/lib/supabase/cars-queries";

export async function GET() {
  try {
    const cars = await fetchCars();
    return Response.json({ cars });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed to load cars";
    return Response.json({ error: message }, { status: 500 });
  }
}
