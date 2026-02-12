-- Create Products Table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  images TEXT[],
  manufacturer TEXT,
  scale TEXT,
  condition TEXT,
  is_featured BOOLEAN DEFAULT FALSE
);

-- Create Orders Table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending_verification' CHECK (status IN ('pending_verification', 'confirmed', 'shipped', 'cancelled')),
  upi_transaction_id TEXT,
  payment_screenshot_url TEXT
);

-- Create Admins Table
CREATE TABLE admins (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL
);

-- Enable Row Level Security (RLS) recommended practices (Optional but good to have prepared)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy examples (You will need to configure these based on your auth needs)
-- Allow public read access to products
CREATE POLICY "Public products are viewable by everyone" ON products
  FOR SELECT USING (true);

-- Allow admins to do everything
-- (Requires setting up specific admin policies or roles, simplifying here for script)
