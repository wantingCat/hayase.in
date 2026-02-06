-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed')),
    discount_value NUMERIC NOT NULL CHECK (discount_value >= 0),
    min_order_value NUMERIC DEFAULT 0 CHECK (min_order_value >= 0),
    max_uses NUMERIC, -- Nullable for unlimited
    current_uses NUMERIC DEFAULT 0 CHECK (current_uses >= 0),
    expires_at TIMESTAMPTZ, -- Nullable for lifetime
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index for faster lookup by code
CREATE INDEX IF NOT EXISTS coupons_code_idx ON coupons (code);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

-- Create policy for admins (assuming admin role or similar mechanism, for now allowing all authenticated users to read/manage as it's an admin dashboard feature and auth is handled by middleware/layout generally, but refining for safety)
-- Adjust this based on your actual auth model. For now, we'll allow authenticated users to do everything provided they are admins contextually.
-- If you have an `is_admin` claim or table, join against it. 
-- For simplicity in this step, I'll add a policy that allows authenticated users to perform actions. 
-- STRICTER SECURITY IS RECOMMENDED FOR PRODUCTION.

CREATE POLICY "Allow authenticated users to read coupons" ON coupons
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to insert coupons" ON coupons
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update coupons" ON coupons
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete coupons" ON coupons
    FOR DELETE
    TO authenticated
    USING (true);

-- Ensure code is always uppercase
CREATE OR REPLACE FUNCTION upper_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.code = UPPER(NEW.code);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER make_code_upper
BEFORE INSERT OR UPDATE ON coupons
FOR EACH ROW
EXECUTE FUNCTION upper_code();
