-- Fix cars.user_id when it was created with the wrong type (e.g. bigint).
-- Symptom: invalid input syntax for type bigint: "<uuid>"
-- Safe no-op if user_id is already uuid or absent (use 20260211120000_cars_user_id_and_rls.sql first).

DO $$
DECLARE
  dt text;
BEGIN
  SELECT c.data_type INTO dt
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = 'cars'
    AND c.column_name = 'user_id';

  IF dt IS NOT NULL AND dt <> 'uuid' THEN
    DROP POLICY IF EXISTS "cars_insert_own" ON public.cars;
    DROP POLICY IF EXISTS "cars_update_own" ON public.cars;
    DROP POLICY IF EXISTS "cars_delete_own" ON public.cars;

    ALTER TABLE public.cars DROP COLUMN user_id;

    ALTER TABLE public.cars
      ADD COLUMN user_id uuid REFERENCES auth.users (id) ON DELETE SET NULL;

    CREATE INDEX IF NOT EXISTS cars_user_id_idx ON public.cars (user_id);

    CREATE POLICY "cars_insert_own"
      ON public.cars
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "cars_update_own"
      ON public.cars
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    CREATE POLICY "cars_delete_own"
      ON public.cars
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;
