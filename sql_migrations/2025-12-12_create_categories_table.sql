-- Tạo bảng danh mục sản phẩm
CREATE TABLE IF NOT EXISTS pin_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  type TEXT CHECK (type IN ('material', 'product')) DEFAULT 'product',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thêm index
CREATE INDEX IF NOT EXISTS idx_pin_categories_type ON pin_categories(type);
CREATE INDEX IF NOT EXISTS idx_pin_categories_name ON pin_categories(name);

-- Thêm một số danh mục mặc định
INSERT INTO pin_categories (id, name, description, type) VALUES
  ('cat-material-default', 'Vật liệu', 'Vật liệu thô, linh kiện điện tử', 'material'),
  ('cat-product-default', 'Thành phẩm', 'Sản phẩm hoàn chỉnh', 'product')
ON CONFLICT (id) DO NOTHING;

-- Thêm cột category_id vào bảng pin_products
ALTER TABLE pin_products ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES pin_categories(id);

-- Thêm cột category_id vào bảng pin_materials  
ALTER TABLE pin_materials ADD COLUMN IF NOT EXISTS category_id TEXT REFERENCES pin_categories(id);

-- Cập nhật các sản phẩm hiện tại vào danh mục mặc định
UPDATE pin_products SET category_id = 'cat-product-default' WHERE category_id IS NULL;
UPDATE pin_materials SET category_id = 'cat-material-default' WHERE category_id IS NULL;
