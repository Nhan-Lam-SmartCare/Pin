-- Finance tables migrated to pin_* schema

-- Fixed Assets
CREATE TABLE IF NOT EXISTS pin_fixed_assets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'machinery','equipment','vehicle','building','land','software','furniture','other'
  )),
  description TEXT,
  purchase_date TIMESTAMPTZ NOT NULL,
  purchase_price DECIMAL(15,2) NOT NULL,
  current_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  useful_life INTEGER NOT NULL,
  salvage_value DECIMAL(15,2) NOT NULL DEFAULT 0,
  depreciation_method TEXT NOT NULL CHECK (depreciation_method IN (
    'straight_line','declining_balance','sum_of_years','units_of_production'
  )),
  location TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','disposed','sold','under_maintenance')),
  branch_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Capital Investments
CREATE TABLE IF NOT EXISTS pin_capital_investments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date TIMESTAMPTZ NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  description TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('Vốn chủ sở hữu','Vay ngân hàng')),
  interest_rate DECIMAL(6,3),
  branch_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS enable
ALTER TABLE pin_fixed_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE pin_capital_investments ENABLE ROW LEVEL SECURITY;

-- Simple allow-all policies for authenticated users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pin_fixed_assets'
  ) THEN
    CREATE POLICY "Allow all for pin_fixed_assets" ON pin_fixed_assets FOR ALL TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'pin_capital_investments'
  ) THEN
    CREATE POLICY "Allow all for pin_capital_investments" ON pin_capital_investments FOR ALL TO authenticated USING (true);
  END IF;
END $$;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_pin_fixed_assets_status ON pin_fixed_assets(status);
CREATE INDEX IF NOT EXISTS idx_pin_fixed_assets_purchase_date ON pin_fixed_assets(purchase_date);
CREATE INDEX IF NOT EXISTS idx_pin_capital_investments_date ON pin_capital_investments(date);
