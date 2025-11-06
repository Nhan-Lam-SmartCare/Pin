-- Create pin_repair_orders table (compatible with current app payload)
-- Note: We use TEXT id because UI generates non-UUID codes like "SC-YYYYMMDD-####".

CREATE TABLE IF NOT EXISTS pin_repair_orders (
  id TEXT PRIMARY KEY,
  creation_date TIMESTAMPTZ NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  device_name TEXT,
  issue_description TEXT NOT NULL,
  technician_name TEXT,
  status TEXT NOT NULL CHECK (status IN ('Tiếp nhận','Đang sửa','Đã sửa xong','Trả máy')),
  materials_used JSONB,
  labor_cost NUMERIC(14,2) DEFAULT 0,
  total NUMERIC(14,2) NOT NULL,
  notes TEXT,
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('paid','unpaid','partial')),
  partial_payment_amount NUMERIC(14,2),
  payment_method TEXT CHECK (payment_method IN ('cash','bank')),
  payment_date TIMESTAMPTZ,
  cash_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS and policies
ALTER TABLE pin_repair_orders ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pin_repair_orders'
  ) THEN
    CREATE POLICY "Allow all for pin_repair_orders" ON pin_repair_orders FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- Helpful indexes
CREATE INDEX IF NOT EXISTS idx_pin_repair_orders_creation_date ON pin_repair_orders(creation_date);
CREATE INDEX IF NOT EXISTS idx_pin_repair_orders_status ON pin_repair_orders(status);
