-- Create Verification Codes table for the Public Service Portal
CREATE TABLE IF NOT EXISTS motorambos.service_portal_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plate_number TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast lookup
CREATE INDEX IF NOT EXISTS idx_service_portal_otps_plate ON motorambos.service_portal_otps(plate_number, code);

-- Enable RLS
ALTER TABLE motorambos.service_portal_otps ENABLE ROW LEVEL SECURITY;

-- Ensure permissions are correct
GRANT ALL ON TABLE motorambos.service_portal_otps TO service_role;
GRANT ALL ON TABLE motorambos.service_portal_otps TO postgres;
GRANT SELECT, INSERT, UPDATE ON TABLE motorambos.service_portal_otps TO anon, authenticated;

-- Ensure migration is successful
COMMENT ON TABLE motorambos.service_portal_otps IS 'Stores temporary OTPs for mechanics to log service information without authentication.';

