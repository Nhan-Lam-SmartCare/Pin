-- Create pin_units table for storing custom units
CREATE TABLE IF NOT EXISTS pin_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pin_units ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
ON pin_units
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Insert default units
INSERT INTO pin_units (name) VALUES
  ('Cái'),
  ('Hộp'),
  ('Bộ'),
  ('Chiếc'),
  ('Cục'),
  ('Cuộn'),
  ('Gói'),
  ('Kg'),
  ('Lít'),
  ('Mét'),
  ('Thùng'),
  ('Viên')
ON CONFLICT (name) DO NOTHING;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_pin_units_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pin_units_updated_at
BEFORE UPDATE ON pin_units
FOR EACH ROW
EXECUTE FUNCTION update_pin_units_updated_at();
