-- Run this in the Supabase Dashboard > SQL Editor

ALTER TABLE motorambos.providers 
ADD COLUMN IF NOT EXISTS provider_type text DEFAULT 'mechanic',
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS operating_hours jsonb DEFAULT '{
    "monday": {"open": "08:00", "close": "17:00", "closed": false},
    "tuesday": {"open": "08:00", "close": "17:00", "closed": false},
    "wednesday": {"open": "08:00", "close": "17:00", "closed": false},
    "thursday": {"open": "08:00", "close": "17:00", "closed": false},
    "friday": {"open": "08:00", "close": "17:00", "closed": false},
    "saturday": {"open": "09:00", "close": "14:00", "closed": false},
    "sunday": {"open": "00:00", "close": "00:00", "closed": true}
}'::jsonb,
ADD COLUMN IF NOT EXISTS is_verified boolean DEFAULT false;
