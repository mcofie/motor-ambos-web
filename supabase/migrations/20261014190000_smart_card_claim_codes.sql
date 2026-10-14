-- A secret claim code is printed on each Smart Card. Linking a card needs the card number,
-- this code, and a text-message code sent to the account holder's phone.
ALTER TABLE motorambos.nfc_cards ADD COLUMN IF NOT EXISTS claim_code text;
ALTER TABLE motorambos.nfc_cards ADD COLUMN IF NOT EXISTS claim_failed_attempts integer NOT NULL DEFAULT 0;
ALTER TABLE motorambos.nfc_cards ADD COLUMN IF NOT EXISTS claim_locked_until timestamptz;

-- Ten hex characters from a random UUID, printed as XXXXX-XXXXX.
UPDATE motorambos.nfc_cards
SET claim_code = upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))
WHERE claim_code IS NULL;

ALTER TABLE motorambos.nfc_cards ALTER COLUMN claim_code SET NOT NULL;

-- Browsers never read cards directly. Staff and portal routes use the service role.
DROP POLICY IF EXISTS "Authenticated Read Cards" ON motorambos.nfc_cards;
REVOKE ALL ON motorambos.nfc_cards FROM anon, authenticated;

-- A driver may share their profile on cards for fleet cars they are assigned to.
ALTER TABLE motorambos.driver_licences ADD COLUMN IF NOT EXISTS show_on_fleet_cards boolean NOT NULL DEFAULT true;
