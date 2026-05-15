-- Owner for listings: authenticated users insert with user_id = auth.uid();
-- delete/update only for matching owner. Public read stays open.

ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS cars_user_id_idx ON public.cars (user_id);

ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Read listings for everyone (adjust if you need private listings)
DROP POLICY IF EXISTS "cars_select_public" ON public.cars;
CREATE POLICY "cars_select_public"
  ON public.cars
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Signed-in users create rows they own
DROP POLICY IF EXISTS "cars_insert_own" ON public.cars;
CREATE POLICY "cars_insert_own"
  ON public.cars
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Owners may update their listings
DROP POLICY IF EXISTS "cars_update_own" ON public.cars;
CREATE POLICY "cars_update_own"
  ON public.cars
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Owners may delete their listings
DROP POLICY IF EXISTS "cars_delete_own" ON public.cars;
CREATE POLICY "cars_delete_own"
  ON public.cars
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Remove legacy open insert if present (name may differ in your project)
DROP POLICY IF EXISTS "Allow anon insert cars" ON public.cars;
DROP POLICY IF EXISTS "cars anon insert" ON public.cars;
DROP POLICY IF EXISTS "Enable insert for anon users" ON public.cars;
