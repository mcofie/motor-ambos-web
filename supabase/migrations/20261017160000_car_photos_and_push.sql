-- A car's own photo (a path in the private vehicle-documents bucket), shown instead of the library
-- picture. Empty when the owner hasn't added one.
ALTER TABLE motorambos.vehicles ADD COLUMN IF NOT EXISTS photo_path text;

-- iPhones that get fleet alerts. Tokens come from Apple; "sandbox" for development builds and
-- "production" for TestFlight and App Store builds. Server only.
CREATE TABLE IF NOT EXISTS motorambos.push_devices (
    token text PRIMARY KEY,
    member_id uuid NOT NULL REFERENCES motorambos.members(id) ON DELETE CASCADE,
    environment text NOT NULL CHECK (environment IN ('sandbox', 'production')),
    platform text NOT NULL DEFAULT 'ios',
    updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS push_devices_member ON motorambos.push_devices (member_id);

ALTER TABLE motorambos.push_devices ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON motorambos.push_devices FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON motorambos.push_devices TO service_role;

NOTIFY pgrst, 'reload schema';
