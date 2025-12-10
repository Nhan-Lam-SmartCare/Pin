-- Fix pin_boms product_sku constraint to allow NULL or empty values
-- This allows creating BOMs without SKU conflicts

-- Drop the existing unique constraint on product_sku
ALTER TABLE pin_boms 
DROP CONSTRAINT IF EXISTS pin_boms_product_sku_key;

-- Make product_sku nullable
ALTER TABLE pin_boms 
ALTER COLUMN product_sku DROP NOT NULL;

-- Add a unique constraint that allows NULL values (only unique non-null values)
CREATE UNIQUE INDEX IF NOT EXISTS pin_boms_product_sku_unique 
ON pin_boms (product_sku) 
WHERE product_sku IS NOT NULL AND product_sku != '';

-- Optional: Add a comment
COMMENT ON COLUMN pin_boms.product_sku IS 'Product SKU - unique when provided, nullable';
