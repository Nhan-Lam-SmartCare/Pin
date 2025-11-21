-- =====================================================
-- CREATE PIN PRODUCTION TABLES
-- =====================================================
-- Created: November 21, 2025
-- Purpose: Store BOM and Production Orders
-- =====================================================

-- Table: pin_boms (Bill of Materials)
CREATE TABLE IF NOT EXISTS pin_boms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  product_sku TEXT,
  materials JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table: pin_production_orders
CREATE TABLE IF NOT EXISTS pin_production_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creation_date DATE DEFAULT CURRENT_DATE,
  bom_id UUID REFERENCES pin_boms(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity_produced INTEGER NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'Đang chờ' CHECK (status IN ('Đang chờ', 'Đang sản xuất', 'Hoàn thành', 'Đã hủy')),
  materials_cost NUMERIC(15,2) DEFAULT 0,
  additional_costs JSONB DEFAULT '[]'::jsonb,
  total_cost NUMERIC(15,2) DEFAULT 0,
  notes TEXT,
  user_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE pin_boms ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_production_orders ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
ON pin_boms
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all operations for authenticated users"
ON pin_production_orders
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pin_boms_product_name ON pin_boms(product_name);
CREATE INDEX IF NOT EXISTS idx_pin_boms_product_sku ON pin_boms(product_sku);
CREATE INDEX IF NOT EXISTS idx_pin_production_orders_status ON pin_production_orders(status);
CREATE INDEX IF NOT EXISTS idx_pin_production_orders_creation_date ON pin_production_orders(creation_date);
CREATE INDEX IF NOT EXISTS idx_pin_production_orders_bom_id ON pin_production_orders(bom_id);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_pin_boms_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pin_boms_updated_at
BEFORE UPDATE ON pin_boms
FOR EACH ROW
EXECUTE FUNCTION update_pin_boms_updated_at();

CREATE OR REPLACE FUNCTION update_pin_production_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pin_production_orders_updated_at
BEFORE UPDATE ON pin_production_orders
FOR EACH ROW
EXECUTE FUNCTION update_pin_production_orders_updated_at();

-- Comments
COMMENT ON TABLE pin_boms IS 'Stores Bill of Materials (BOM) for products';
COMMENT ON TABLE pin_production_orders IS 'Stores production orders for manufacturing';
