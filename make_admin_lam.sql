-- Make lam.tcag@gmail.com an admin
-- Run this SQL in Supabase SQL Editor

-- Update the profile to admin role
UPDATE profiles 
SET 
  role = 'admin',
  allowed_apps = 'both',
  status = 'active',
  updated_at = NOW()
WHERE email = 'lam.tcag@gmail.com';

-- Verify the update
SELECT id, name, email, role, allowed_apps, status 
FROM profiles 
WHERE email = 'lam.tcag@gmail.com';
