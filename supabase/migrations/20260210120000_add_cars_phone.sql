-- Seller contact phone on listings.
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '';
