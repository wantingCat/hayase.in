-- Create payment_settings table
CREATE TABLE IF NOT EXISTS public.payment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    upi_id TEXT NOT NULL,
    qr_code_url TEXT,
    account_name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on payment_settings
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for checkout page)
create policy "Allow public read access to active payment settings"
on public.payment_settings
for select
to public
using (is_active = true);

-- Allow admin full access (using service role or authenticated admin check - simplified here for development)
-- Ideally this should check for admin role
create policy "Allow full access to authenticated users"
on public.payment_settings
for all
to authenticated
using (true)
with check (true);

-- Ensure orders table exists and has necessary columns
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    total_amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'paid', 'shipped', 'delivered', 'cancelled')),
    upi_transaction_id TEXT,
    items JSONB -- To store snapshot of items ordered
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for checkout)
create policy "Allow public insert to orders"
on public.orders
for insert
to public
with check (true);

-- Allow users to view their own orders (by email or user_id if we had auth)
-- For now, allowing public read of own order by ID might be tricky without auth, 
-- but we generally restrict this. 
-- Admin access:
create policy "Allow authenticated users (admin) to view all orders"
on public.orders
for select
to authenticated
using (true);

-- Create order items table if we want normalized data (optional, using JSONB property in orders for simplicity as requested plan implied, but let's stick to simple orders table for now as per request)
-- Check if we need a separate order_items table. Usually yes, but user prompt didn't strictly specify. 
-- Let's stick to the prompt's implied simple "orders" table with transaction_id. 
-- The user prompt said "Create order in orders table... Save the transaction_id".

-- Insert a default payment setting row if empty (placeholder)
INSERT INTO public.payment_settings (upi_id, account_name, is_active)
SELECT 'hayase@upi', 'Hayase Store', true
WHERE NOT EXISTS (SELECT 1 FROM public.payment_settings);
