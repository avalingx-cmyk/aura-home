-- Add whatsapp_opt_in column to orders table
-- Allows customers to opt-in for WhatsApp notifications

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS whatsapp_opt_in BOOLEAN DEFAULT false;

-- Add index for filtering orders with WhatsApp opt-in
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp_opt_in ON orders(whatsapp_opt_in) WHERE whatsapp_opt_in = true;

-- Update existing orders (set to false by default, can be updated manually if needed)
-- For future orders, the checkout form will set this value
