-- Run this in the Supabase Dashboard > SQL Editor
-- This script expands provider categories and adds services

-- 1. Add backdrop_url to providers
ALTER TABLE motorambos.providers 
ADD COLUMN IF NOT EXISTS backdrop_url text;

-- 2. Insert new services
INSERT INTO motorambos.services (code, name, description)
VALUES 
  -- Mechanics
  ('mech_gen', 'General Maintenance', 'Oil change, tune-ups, and routine checks'),
  ('mech_eng', 'Engine Repair', 'Major and minor engine overhauls'),
  ('mech_ele', 'Electrical & AC', 'Battery, wiring, and air conditioning repair'),
  ('mech_brk', 'Brake & Suspension', 'Brake pads, shocks, and suspension work'),
  ('mech_diag', 'Diagnostics', 'Computerized fault finding and troubleshooting'),
  
  -- Detailers
  ('det_ext', 'Exterior Detailing', 'Deep cleaning and polishing of the exterior'),
  ('det_int', 'Interior Deep Cleaning', 'Shampooing and sanitizing of the cabin'),
  ('det_cer', 'Ceramic Coating', 'Long-lasting paint protection'),
  ('det_ful', 'Full Vehicle Detailing', 'Complete interior and exterior makeover'),

  -- Car Wash
  ('wash_std', 'Standard Car Wash', 'Basic exterior wash and dry'),
  ('wash_hnd', 'Premium Hand Wash', 'Careful hand wash with waxing'),
  ('wash_vac', 'Vacuum & Interior Clean', 'Interior vacuuming and dusting'),

  -- Roadworthy
  ('rw_cert', 'Roadworthy Certificate', 'Official roadworthy inspection and certification'),
  ('rw_insp', 'Pre-inspection Check', 'Health check before official inspection'),

  -- Insurance
  ('ins_ren', 'Policy Renewal', 'Hassle-free insurance renewal service'),
  ('ins_new', 'New Policy Quote', 'Compare and buy new insurance policies'),

  -- Shop
  ('shop_part', 'Spare Parts', 'High-quality replacement parts'),
  ('shop_acc', 'Car Accessories', 'Customization and utility accessories'),
  ('shop_dlr', 'Dealership Inquiry', 'Inquire about new or used vehicles')
ON CONFLICT (code) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;
