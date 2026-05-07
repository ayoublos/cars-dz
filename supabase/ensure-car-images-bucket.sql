-- Run this in Supabase Dashboard → SQL Editor (as postgres).
-- Fixes "Bucket not found" when saving a car with photos.

-- 1) Create public bucket for listing photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('car-images', 'car-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

-- 2) Anyone can read objects (public listings)
DROP POLICY IF EXISTS "car-images public read" ON storage.objects;
CREATE POLICY "car-images public read"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'car-images');

-- 3) Anonymous uploads (same as your cars insert). Tighten when you add auth.
DROP POLICY IF EXISTS "car-images anon insert" ON storage.objects;
CREATE POLICY "car-images anon insert"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'car-images');
