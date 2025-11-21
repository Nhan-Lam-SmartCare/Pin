-- Fix: Change material_id from UUID to TEXT to support custom IDs
-- Run this in Supabase SQL Editor if still getting UUID errors

-- Step 1: Drop the existing table (WARNING: This will delete all history data)
-- If you want to keep data, export it first
DROP TABLE IF EXISTS pin_material_history CASCADE;

-- Step 2: Recreate with TEXT material_id
CREATE TABLE pin_material_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id TEXT,  -- Changed from UUID to TEXT
  material_name TEXT,
  material_sku TEXT,
  quantity DECIMAL(15,3),
  purchase_price DECIMAL(15,2),
  total_cost DECIMAL(15,2),
  supplier TEXT,
  import_date TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  user_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Recreate index
CREATE INDEX idx_pin_material_history_import_date ON pin_material_history(import_date DESC);
CREATE INDEX idx_pin_material_history_material_id ON pin_material_history(material_id);

-- Step 4: Enable RLS (if needed)
ALTER TABLE pin_material_history ENABLE ROW LEVEL SECURITY;

-- Step 5: Add policy
CREATE POLICY "Allow all for pin_material_history" ON pin_material_history FOR ALL TO authenticated USING (true);
