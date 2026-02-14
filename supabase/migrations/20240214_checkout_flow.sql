-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_details JSONB NOT NULL,
  payment_id TEXT, -- UTR / Transaction ID
  payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
  order_status TEXT DEFAULT 'processing', -- processing, shipped, delivered, cancelled
  total_amount NUMERIC NOT NULL,
  shipping_cost NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL, -- Keep history even if product deleted? Or set null.
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL, -- Price at time of purchase
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create store_settings table (Singleton)
CREATE TABLE IF NOT EXISTS store_settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    upi_qr_url TEXT,
    upi_id TEXT,
    is_active BOOLEAN DEFAULT true,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default row for store_settings if not exists
INSERT INTO store_settings (id, upi_id, is_active)
VALUES (1, 'hayase@upi', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

-- Policies for orders
-- Allow public to insert orders (Guest checkout)
CREATE POLICY "Allow public insert orders" ON orders FOR INSERT WITH CHECK (true);
-- Allow public to select their own order (by ID) - simplifying for now to allow reading created order
CREATE POLICY "Allow public select orders" ON orders FOR SELECT USING (true); 

-- Policies for order_items
CREATE POLICY "Allow public insert order_items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select order_items" ON order_items FOR SELECT USING (true);

-- Policies for store_settings
CREATE POLICY "Allow public select store_settings" ON store_settings FOR SELECT USING (true);
-- Only authenticated admin can update
CREATE POLICY "Allow admin update store_settings" ON store_settings FOR UPDATE USING (auth.role() = 'authenticated');
