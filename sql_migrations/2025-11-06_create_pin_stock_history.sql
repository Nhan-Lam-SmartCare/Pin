-- Create stock history table used by materials adjustments, production, and repairs
CREATE TABLE IF NOT EXISTS pin_stock_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES pin_materials(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('import','export','adjustment')),
  quantity_before DECIMAL(15,3) NOT NULL DEFAULT 0,
  quantity_change DECIMAL(15,3) NOT NULL,
  quantity_after DECIMAL(15,3) NOT NULL DEFAULT 0,
  reason TEXT NOT NULL,
  invoice_number TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_pin_stock_history_material_id ON pin_stock_history(material_id);
CREATE INDEX IF NOT EXISTS idx_pin_stock_history_created_at ON pin_stock_history(created_at DESC);
