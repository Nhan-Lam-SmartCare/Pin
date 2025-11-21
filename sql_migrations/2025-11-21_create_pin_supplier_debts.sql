-- Create supplier debts tracking table
CREATE TABLE IF NOT EXISTS pin_supplier_debts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'partial')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pin_supplier_debts_supplier_id ON pin_supplier_debts(supplier_id);
CREATE INDEX IF NOT EXISTS idx_pin_supplier_debts_status ON pin_supplier_debts(status);
CREATE INDEX IF NOT EXISTS idx_pin_supplier_debts_created_at ON pin_supplier_debts(created_at DESC);

-- Enable RLS
ALTER TABLE pin_supplier_debts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all for authenticated users
CREATE POLICY "Allow all for pin_supplier_debts" ON pin_supplier_debts FOR ALL TO authenticated USING (true);
