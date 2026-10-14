-- Add business fields to members
ALTER TABLE motorambos.members
ADD COLUMN IF NOT EXISTS is_business boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS business_name text;

-- Create organization_members table to link drivers to businesses
CREATE TABLE IF NOT EXISTS motorambos.organization_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_member_id uuid REFERENCES motorambos.members(id) ON DELETE CASCADE,
    member_id uuid REFERENCES motorambos.members(id) ON DELETE CASCADE,
    vehicle_id uuid REFERENCES motorambos.vehicles(id) ON DELETE SET NULL,
    role text DEFAULT 'DRIVER', -- 'DRIVER', 'ADMIN'
    created_at timestamptz DEFAULT now(),
    UNIQUE(org_member_id, member_id)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_org_members_org ON motorambos.organization_members(org_member_id);
CREATE INDEX IF NOT EXISTS idx_org_members_member ON motorambos.organization_members(member_id);
CREATE INDEX IF NOT EXISTS idx_org_members_vehicle ON motorambos.organization_members(vehicle_id);

-- Start generic B2C/B2B tagging
-- Update existing members to be B2C (default false so done)
