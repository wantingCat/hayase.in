-- Add missing columns to orders table if they don't exist
-- This ensures the schema matches 20240214_checkout_flow.sql even if the table already existed

ALTER TABLE "public"."orders"
ADD COLUMN IF NOT EXISTS customer_details JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS order_status TEXT DEFAULT 'processing',
ADD COLUMN IF NOT EXISTS shipping_cost NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;

-- Ensure constraints (optional, but good for consistency)
-- We can't easily add NOT NULL to existing columns without handling existing data, 
-- but strictness is less critical than existence for now.
