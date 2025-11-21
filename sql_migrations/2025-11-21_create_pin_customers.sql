-- =====================================================
-- CREATE PIN CUSTOMERS TABLE
-- =====================================================
-- Created: November 21, 2025
-- Purpose: Store customer information for sales
-- =====================================================

CREATE TABLE IF NOT EXISTS pin_customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  email TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pin_customers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
ON pin_customers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pin_customers_name ON pin_customers(name);
CREATE INDEX IF NOT EXISTS idx_pin_customers_phone ON pin_customers(phone);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_pin_customers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pin_customers_updated_at
BEFORE UPDATE ON pin_customers
FOR EACH ROW
EXECUTE FUNCTION update_pin_customers_updated_at();

-- Add comment
COMMENT ON TABLE pin_customers IS 'Stores customer information for PIN Corp sales management';
