-- Fix permissions for Service Role to access motorambos schema
-- Run this in the Supabase Dashboard > SQL Editor

GRANT USAGE ON SCHEMA motorambos TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA motorambos TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA motorambos TO service_role;

-- Also ensure authenticated and anon have access if needed (optional but good for public/client access)
GRANT USAGE ON SCHEMA motorambos TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA motorambos TO anon, authenticated;
