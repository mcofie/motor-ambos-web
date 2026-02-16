-- Create NFC Inventory Table
CREATE TABLE IF NOT EXISTS motorambos.nfc_cards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    serial_number text UNIQUE NOT NULL, -- The physical ID (e.g. MA-26-00001)
    batch_id text, -- For tracking manufacturing batches
    status text DEFAULT 'MANUFACTURED', -- 'MANUFACTURED', 'ASSIGNED', 'VOID'
    created_at timestamptz DEFAULT now()
);

-- Create NFC Requests Table
CREATE TABLE IF NOT EXISTS motorambos.nfc_requests (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    member_id uuid REFERENCES motorambos.members(id) ON DELETE CASCADE,
    vehicle_id uuid REFERENCES motorambos.vehicles(id) ON DELETE SET NULL,
    status text DEFAULT 'PENDING', -- 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    request_type text DEFAULT 'NEW', -- 'NEW', 'REPLACEMENT'
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nfc_cards_serial ON motorambos.nfc_cards(serial_number);
CREATE INDEX IF NOT EXISTS idx_nfc_requests_status ON motorambos.nfc_requests(status);
CREATE INDEX IF NOT EXISTS idx_nfc_requests_member ON motorambos.nfc_requests(member_id);

-- Permissions
GRANT ALL ON TABLE motorambos.nfc_cards TO service_role;
GRANT ALL ON TABLE motorambos.nfc_cards TO postgres;
GRANT SELECT ON TABLE motorambos.nfc_cards TO authenticated;
GRANT SELECT ON TABLE motorambos.nfc_cards TO anon;

GRANT ALL ON TABLE motorambos.nfc_requests TO service_role;
GRANT ALL ON TABLE motorambos.nfc_requests TO postgres;
GRANT SELECT, INSERT ON TABLE motorambos.nfc_requests TO authenticated;

-- RLS
ALTER TABLE motorambos.nfc_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorambos.nfc_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service Role Full Access Cards" ON motorambos.nfc_cards FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated Read Cards" ON motorambos.nfc_cards FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service Role Full Access Requests" ON motorambos.nfc_requests FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Users can see own requests" ON motorambos.nfc_requests FOR SELECT TO authenticated USING (
    auth.uid() IN (SELECT auth_user_id FROM motorambos.members WHERE id = member_id)
);
CREATE POLICY "Users can create requests" ON motorambos.nfc_requests FOR INSERT TO authenticated WITH CHECK (
    auth.uid() IN (SELECT auth_user_id FROM motorambos.members WHERE id = member_id)
);
