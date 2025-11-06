-- Add a human-readable code column to pin_sales
ALTER TABLE pin_sales
ADD COLUMN IF NOT EXISTS code TEXT UNIQUE;

-- Optional: backfill existing rows with a simple code if desired (example only)
-- UPDATE pin_sales SET code = 'SALE-' || to_char(date, 'YYYYMMDD') || '-' || right(id::text, 6)
-- WHERE code IS NULL;