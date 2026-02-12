-- Add category column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Set default values
ALTER TABLE products ALTER COLUMN condition SET DEFAULT 'New';
UPDATE products SET condition = 'New' WHERE condition IS NULL;

-- Update RLS policies to allow public read of category (already covered by "Public products are viewable by everyone" SELECT policy)
-- But ensuring it is indexed for performance
CREATE INDEX IF NOT EXISTS products_category_idx ON products (category);
CREATE INDEX IF NOT EXISTS products_tags_idx ON products USING GIN (tags);
