-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop policy if exists to avoid errors (or create if not exists using DO block, but dropping is simpler here for a script)
DROP POLICY IF EXISTS "Allow Public Read Access" ON products;

-- Allow public read access (SELECT) for everyone (anon and authenticated)
CREATE POLICY "Allow Public Read Access"
ON products
FOR SELECT
TO public
USING (true);

-- Storage Permissions
-- Allow public read access to product-images bucket
DROP POLICY IF EXISTS "Allow Public Read Access on product-images" ON storage.objects;

CREATE POLICY "Allow Public Read Access on product-images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'product-images');
