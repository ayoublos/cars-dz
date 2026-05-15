-- Where the vehicle is currently located (shown on listing cards).
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS location_tag text NOT NULL DEFAULT '';

COMMENT ON COLUMN public.cars.location_tag IS 'korea | abroad | empty';
