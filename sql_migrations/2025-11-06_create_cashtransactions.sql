-- Create cashtransactions table used by PIN Financial Manager
-- Stores generic cash flow entries (both income and expense)

CREATE TABLE IF NOT EXISTS cashtransactions (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  date TIMESTAMPTZ NOT NULL,
  amount NUMERIC(14,2) NOT NULL,
  -- JSON stored as text for broad compatibility with PostgREST
  contact TEXT,
  notes TEXT,
  category TEXT,
  payment_source_id TEXT,
  branch_id TEXT,
  sale_id TEXT,
  work_order_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE cashtransactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'cashtransactions'
  ) THEN
    CREATE POLICY "Allow all for cashtransactions" ON cashtransactions FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_cashtransactions_date ON cashtransactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_cashtransactions_type ON cashtransactions(type);
CREATE INDEX IF NOT EXISTS idx_cashtransactions_sale_id ON cashtransactions(sale_id);
CREATE INDEX IF NOT EXISTS idx_cashtransactions_work_order_id ON cashtransactions(work_order_id);
