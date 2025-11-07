-- =====================================================
-- CREATE PIN SUPPLIERS TABLE
-- =====================================================
-- Created: November 6, 2025
-- Purpose: Store supplier information for PIN Corp
-- =====================================================

CREATE TABLE IF NOT EXISTS pin_suppliers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pin_suppliers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for authenticated users
CREATE POLICY "Allow all for pin_suppliers" ON pin_suppliers FOR ALL TO authenticated USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pin_suppliers_name ON pin_suppliers(name);
CREATE INDEX IF NOT EXISTS idx_pin_suppliers_phone ON pin_suppliers(phone);

-- Add comment
COMMENT ON TABLE pin_suppliers IS 'Stores supplier/vendor information for PIN Corp inventory management';
