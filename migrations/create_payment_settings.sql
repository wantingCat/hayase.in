-- Create Payment Settings Table
CREATE TABLE IF NOT EXISTS payment_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    upi_id TEXT NOT NULL,
    qr_code_url TEXT,
    account_name TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Enable RLS
ALTER TABLE payment_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for checkout)
CREATE POLICY "Public can view payment settings" ON payment_settings
  FOR SELECT USING (true);

-- Allow admins full access (insert, update, delete)
CREATE POLICY "Admins can manage payment settings" ON payment_settings
    FOR ALL USING (
        auth.uid() IN (SELECT id FROM admins)
    );
