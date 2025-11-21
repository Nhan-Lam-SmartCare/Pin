CREATE TABLE IF NOT EXISTS pin_material_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id TEXT,
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

CREATE INDEX IF NOT EXISTS idx_pin_material_history_import_date ON pin_material_history(import_date DESC);
