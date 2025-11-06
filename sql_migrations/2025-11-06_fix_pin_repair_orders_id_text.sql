-- Ensure pin_repair_orders.id is TEXT (app uses human-readable codes like "SC-YYYYMMDD-####")
-- Safe to run multiple times.

DO $$
BEGIN
  -- Only proceed if table exists
  IF to_regclass('public.pin_repair_orders') IS NOT NULL THEN
    -- If id is UUID, drop default (if any) then convert to TEXT
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'pin_repair_orders'
        AND column_name = 'id'
        AND data_type = 'uuid'
    ) THEN
      -- Drop default to avoid cast issues (e.g., uuid_generate_v4())
      EXECUTE 'ALTER TABLE public.pin_repair_orders ALTER COLUMN id DROP DEFAULT';
      -- Convert type UUID -> TEXT, preserving values
      EXECUTE 'ALTER TABLE public.pin_repair_orders ALTER COLUMN id TYPE text USING id::text';
    END IF;

    -- Enable RLS (idempotent)
    EXECUTE 'ALTER TABLE public.pin_repair_orders ENABLE ROW LEVEL SECURITY';

    -- Ensure a permissive authenticated policy exists (aligns with FE expectations)
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'public' AND tablename = 'pin_repair_orders'
    ) THEN
      EXECUTE 'CREATE POLICY "Allow all for pin_repair_orders" ON public.pin_repair_orders FOR ALL TO authenticated USING (true)';
    END IF;
  END IF;
END $$;

-- Helpful indexes (idempotent and fast)
CREATE INDEX IF NOT EXISTS idx_pin_repair_orders_creation_date ON pin_repair_orders(creation_date);
CREATE INDEX IF NOT EXISTS idx_pin_repair_orders_status ON pin_repair_orders(status);
