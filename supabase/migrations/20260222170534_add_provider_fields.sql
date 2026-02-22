-- Add missing columns to the providers table in the motorambos schema
ALTER TABLE motorambos.providers
ADD COLUMN IF NOT EXISTS experience_years integer,
ADD COLUMN IF NOT EXISTS specializations text,
ADD COLUMN IF NOT EXISTS certification_url text,
ADD COLUMN IF NOT EXISTS purchase_url text,
ADD COLUMN IF NOT EXISTS purchase_action_label text;
