-- Add shipping_email to orders table
-- This allows filtering orders by customer email

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS shipping_email VARCHAR(255);

-- Create index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_orders_shipping_email ON orders(shipping_email);

-- Update existing orders with email from customer data (if available)
-- This is a best-effort update for existing data
UPDATE orders 
SET shipping_email = (
  SELECT email FROM customers 
  WHERE customers.id = orders.customer_id
)
WHERE customer_id IS NOT NULL AND shipping_email IS NULL;
