-- Add stock_quantity to products if it doesn't exist
ALTER TABLE "public"."products" ADD COLUMN IF NOT EXISTS "stock_quantity" integer DEFAULT 0;

-- Create function to decrement stock
CREATE OR REPLACE FUNCTION decrement_stock()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if there is enough stock
  IF (SELECT stock_quantity FROM products WHERE id = NEW.product_id) < NEW.quantity THEN
    RAISE EXCEPTION 'Insufficient stock for product %', NEW.product_id;
  END IF;

  -- Decrement stock
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger (drop first to ensure idempotency if re-run)
DROP TRIGGER IF EXISTS decrement_stock_trigger ON "public"."order_items";

CREATE TRIGGER decrement_stock_trigger
AFTER INSERT ON "public"."order_items"
FOR EACH ROW
EXECUTE FUNCTION decrement_stock();
