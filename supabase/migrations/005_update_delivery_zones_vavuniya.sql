-- Update delivery zones for Vavuniya-based store
-- Vavuniya gets lowest rate (not free, but affordable)

-- Clear existing zones
DELETE FROM delivery_zones;

-- Insert Vavuniya-focused zones
INSERT INTO delivery_zones (id, name, fee, estimated_days, active, created_at) VALUES
  (uuid_generate_v4(), 'Vavuniya', 100, 1, true, NOW()),
  (uuid_generate_v4(), 'Vavuniya Suburbs', 200, 1, true, NOW()),
  (uuid_generate_v4(), 'Anuradhapura', 300, 2, true, NOW()),
  (uuid_generate_v4(), 'Jaffna', 350, 2, true, NOW()),
  (uuid_generate_v4(), 'Trincomalee', 400, 2, true, NOW()),
  (uuid_generate_v4(), 'Mannar', 350, 2, true, NOW()),
  (uuid_generate_v4(), 'Kilinochchi', 300, 2, true, NOW()),
  (uuid_generate_v4(), 'Mullaitivu', 400, 3, true, NOW()),
  (uuid_generate_v4(), 'Batticaloa', 450, 3, true, NOW()),
  (uuid_generate_v4(), 'Ampara', 500, 3, true, NOW()),
  (uuid_generate_v4(), 'Colombo', 600, 3, true, NOW()),
  (uuid_generate_v4(), 'Colombo Suburbs', 550, 3, true, NOW()),
  (uuid_generate_v4(), 'Kandy', 500, 3, true, NOW()),
  (uuid_generate_v4(), 'Galle', 650, 3, true, NOW()),
  (uuid_generate_v4(), 'Matara', 700, 3, true, NOW()),
  (uuid_generate_v4(), 'Kurunegala', 450, 2, true, NOW()),
  (uuid_generate_v4(), 'Puttalam', 400, 2, true, NOW()),
  (uuid_generate_v4(), 'Other Areas', 750, 4, true, NOW())
ON CONFLICT DO NOTHING;

-- Verify zones
SELECT name, fee, estimated_days FROM delivery_zones ORDER BY fee ASC;
