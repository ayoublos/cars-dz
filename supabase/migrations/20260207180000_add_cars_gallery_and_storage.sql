-- Extra listing photos (JSON array of public Storage URLs). Safe to re-run.
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS gallery jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Storage bucket for car uploads (public read URLs via getPublicUrl).
-- Minimal columns so this works across Supabase versions; optional limits in Dashboard.
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "car-images public read" ON storage.objects;
CREATE POLICY "car-images public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

DROP POLICY IF EXISTS "car-images anon insert" ON storage.objects;
CREATE POLICY "car-images anon insert"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'car-images');
