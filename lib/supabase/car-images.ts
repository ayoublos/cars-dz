import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_BUCKET = "car-images";

export function getCarImagesBucket(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_CAR_BUCKET ?? DEFAULT_BUCKET;
}

export async function uploadCarListingImage(
  supabase: SupabaseClient,
  file: File,
): Promise<string> {
  const bucket = getCarImagesBucket();
  const rawExt = file.name.split(".").pop() ?? "jpg";
  const ext = rawExt.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8) || "jpg";
  const path = `listings/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "image/jpeg",
  });
  if (error) {
    const msg = error.message ?? "";
    if (/bucket not found|not found/i.test(msg)) {
      throw new Error(
        `Storage bucket "${bucket}" does not exist. In Supabase: Storage → New bucket → name "${bucket}" → Public. Then run supabase/ensure-car-images-bucket.sql in the SQL Editor (creates bucket + policies if you prefer SQL only).`,
      );
    }
    throw error;
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
