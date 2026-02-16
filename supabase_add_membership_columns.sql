-- Run this in the Supabase Dashboard > SQL Editor
-- This script adds membership-related columns to the 'motorambos.members' table
-- effectively merging 'memberships' capability into 'members'

ALTER TABLE motorambos.members 
ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES motorambos.membership_plans(id),
ADD COLUMN IF NOT EXISTS membership_tier text,
ADD COLUMN IF NOT EXISTS membership_number text,
ADD COLUMN IF NOT EXISTS membership_expiry_date timestamptz,
ADD COLUMN IF NOT EXISTS membership_is_active boolean DEFAULT false;

-- Optionally add index for performance
CREATE INDEX IF NOT EXISTS idx_members_plan_id ON motorambos.members(plan_id);
CREATE INDEX IF NOT EXISTS idx_members_membership_number ON motorambos.members(membership_number);

-- Refresh the schema cache if needed
NOTIFY pgrst, 'reload schema';
