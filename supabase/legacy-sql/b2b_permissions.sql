-- Grant Permissions for new B2B tables
-- Service Role (API routes)
GRANT ALL ON TABLE motorambos.organization_members TO service_role;
GRANT ALL ON TABLE motorambos.organization_members TO postgres;

-- Authenticated & Anon (Client Side / Regular Users)
-- Typically, we want SELECT for members who are part of the org or admins
-- For now, allow SELECT to authenticated, restrict insert via RLS if needed, but here we use API so API handles security.
GRANT SELECT ON TABLE motorambos.organization_members TO authenticated;
GRANT SELECT ON TABLE motorambos.organization_members TO anon;

-- Ensure schema usage
GRANT USAGE ON SCHEMA motorambos TO service_role;
GRANT USAGE ON SCHEMA motorambos TO authenticated;
GRANT USAGE ON SCHEMA motorambos TO anon;

-- Enable RLS (Recommended)
ALTER TABLE motorambos.organization_members ENABLE ROW LEVEL SECURITY;

-- Allow Service Role full access (Bypass RLS)
CREATE POLICY "Enable all for service_role" ON motorambos.organization_members
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Allow members to view their own org memberships
CREATE POLICY "Users can view their own org memberships" ON motorambos.organization_members
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() IN (
            SELECT auth_user_id FROM motorambos.members WHERE id = member_id
        ) OR
        auth.uid() IN (
            SELECT auth_user_id FROM motorambos.members WHERE id = org_member_id
        )
    );
