-- Add coupon columns to orders table if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS coupon_code TEXT,
ADD COLUMN IF NOT EXISTS discount_amount NUMERIC DEFAULT 0;

-- Allow public read access to active coupons (for validation by guests)
-- We drop existing policy if it conflicts or just add a new one if allowed multiple.
-- Safer to drop and recreate for this specific purpose if we own the policy name.
DROP POLICY IF EXISTS "Allow public read active coupons" ON coupons;
CREATE POLICY "Allow public read active coupons" ON coupons 
FOR SELECT USING (is_active = true);

-- Insert example coupons (fixing column names and values to match existing schema)
-- Schema: code, discount_type ('percent', 'fixed'), discount_value, min_order_value
INSERT INTO coupons (code, discount_type, discount_value, min_order_value)
VALUES 
    ('WELCOME10', 'percent', 10, 0),
    ('HAYASE500', 'fixed', 500, 2000)
ON CONFLICT (code) DO NOTHING;
