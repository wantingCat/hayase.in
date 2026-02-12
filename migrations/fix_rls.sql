-- Fix: Allow users to read the 'admins' table to verify their own status
CREATE POLICY "Allow users to check if they are admins" ON admins
  FOR SELECT USING (auth.uid() = id);

-- Fix: Allow admins to insert/update/delete products and other tables
-- Since we are checking the 'admins' table for auth, we can use that in policies

-- Create a helper function to check if user is admin (optional, but cleaner)
-- OR just check against the table directly in the policy

CREATE POLICY "Admins can do everything on products" ON products
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admins)
  );

CREATE POLICY "Admins can do everything on orders" ON orders
  FOR ALL USING (
    auth.uid() IN (SELECT id FROM admins)
  );

-- Fix: Storage Policies (You need to run this if you haven't set up storage policies yet)
-- Assumes you have a bucket named 'product-images'
-- Enable RLS on storage.objects if not already (it is by default usually)

-- Allow public read of product images
CREATE POLICY "Public Read Product Images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'product-images' );

-- Allow admins to upload product images
CREATE POLICY "Admins Upload Product Images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.uid() IN (SELECT id FROM admins)
);
