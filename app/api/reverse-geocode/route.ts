export const runtime = "nodejs";

/** Build a coarse place label (city / district / country) — never uses street or house-level OSM fields. */
function areaLabelFromAddress(a: Record<string, string>): string | null {
  const locality =
    a.city ||
    a.town ||
    a.village ||
    a.municipality ||
    a.hamlet ||
    a.suburb ||
    a.neighbourhood ||
    a.quarter ||
    a.city_district;

  const region =
    a.county ||
    a.state_district ||
    a.state ||
    a.region ||
    a.province;

  const parts = [locality, region, a.country].filter(Boolean);
  const deduped = parts.filter((p, i) => i === 0 || p !== parts[i - 1]);
  if (deduped.length) return deduped.join(", ");
  if (a.country) return a.country;
  return null;
}

/** Reverse geocode via OpenStreetMap Nominatim (server-side; respects usage policy). */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = Number(searchParams.get("lat"));
  const lon = Number(searchParams.get("lon"));
  const lang = searchParams.get("lang") ?? "en";

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
    return Response.json({ error: "Invalid lat/lon." }, { status: 400 });
  }

  const acceptLang =
    lang === "ar" ? "ar" : lang === "fr" ? "fr,en" : "en";

  const nominatimUrl = new URL("https://nominatim.openstreetmap.org/reverse");
  nominatimUrl.searchParams.set("lat", String(lat));
  nominatimUrl.searchParams.set("lon", String(lon));
  nominatimUrl.searchParams.set("format", "json");
  nominatimUrl.searchParams.set("accept-language", acceptLang);

  try {
    const res = await fetch(nominatimUrl.toString(), {
      headers: {
        Accept: "application/json",
        "User-Agent": "Loto-dz/1.0 (car marketplace; +https://github.com/)",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return Response.json(
        { error: "Geocoding service unavailable." },
        { status: 502 },
      );
    }

    const data = (await res.json()) as {
      display_name?: string;
      address?: Record<string, string>;
    };

    const a = data.address;
    if (a) {
      const label = areaLabelFromAddress(a);
      if (label) {
        return Response.json({ label });
      }
    }

    return Response.json({
      label: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
    });
  } catch {
    return Response.json(
      { label: `${lat.toFixed(5)}, ${lon.toFixed(5)}` },
      { status: 200 },
    );
  }
}
