-- Add deposit_amount column to pin_repair_orders table
-- This column stores the deposit amount paid by customer when receiving the repair order

ALTER TABLE pin_repair_orders
ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC DEFAULT 0;

COMMENT ON COLUMN pin_repair_orders.deposit_amount IS 'Số tiền đặt cọc khi nhận máy sửa chữa';
