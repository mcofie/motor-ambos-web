-- Owner-controlled Smart Card pages and private driver's licence records.

-- What a tapped Smart Card may show. Owners change this in the portal; the public
-- page only ever receives the fields switched on here.
ALTER TABLE motorambos.vehicles
    ADD COLUMN IF NOT EXISTS public_share jsonb NOT NULL
    DEFAULT '{"vehicle": true, "plate": true, "papers": true, "service": true, "owner": false, "contact": false}'::jsonb;

-- Cards are encoded with /v/<public_id> before they ship, so the id must exist and be unique.
ALTER TABLE motorambos.nfc_cards ADD COLUMN IF NOT EXISTS public_id text;
CREATE UNIQUE INDEX IF NOT EXISTS nfc_cards_public_id_key ON motorambos.nfc_cards(public_id) WHERE public_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS vehicles_nfc_card_id_key ON motorambos.vehicles(nfc_card_id) WHERE nfc_card_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS motorambos.driver_licences (
    member_id uuid PRIMARY KEY REFERENCES motorambos.members(id) ON DELETE CASCADE,
    licence_number text,
    licence_class text,
    expires_on date,
    front_path text,
    back_path text,
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE motorambos.driver_licences ENABLE ROW LEVEL SECURITY;

-- Licence photos are personal data. Only authenticated portal routes, which check the
-- signed-in member first, read or write them through the service role.
REVOKE ALL ON motorambos.driver_licences FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON motorambos.driver_licences TO service_role;
GRANT SELECT, INSERT ON motorambos.service_history TO service_role;
