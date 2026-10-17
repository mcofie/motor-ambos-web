-- Sign-in codes for the mobile apps' phone login. Codes are sent through Hubtel by the web API
-- and stored only as an HMAC, never in plain text. Server only: no anon or authenticated access.
CREATE TABLE IF NOT EXISTS motorambos.phone_login_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone text NOT NULL,
    code_hash text NOT NULL,
    expires_at timestamptz NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    used_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS phone_login_codes_phone_created ON motorambos.phone_login_codes (phone, created_at DESC);

ALTER TABLE motorambos.phone_login_codes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON motorambos.phone_login_codes FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON motorambos.phone_login_codes TO service_role;

COMMENT ON TABLE motorambos.phone_login_codes IS 'Hashed SMS sign-in codes for the mobile apps (sent via Hubtel). Rows older than a day can be deleted.';
