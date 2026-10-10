-- Private documents and a small issue queue for driver and fleet portals.
CREATE TABLE IF NOT EXISTS motorambos.portal_vehicle_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES motorambos.vehicles(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('insurance', 'roadworthy')),
    storage_path text NOT NULL,
    file_name text NOT NULL,
    uploaded_by uuid NOT NULL REFERENCES motorambos.members(id),
    created_at timestamptz NOT NULL DEFAULT now(),
    UNIQUE (vehicle_id, kind)
);

CREATE TABLE IF NOT EXISTS motorambos.vehicle_issues (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES motorambos.vehicles(id) ON DELETE CASCADE,
    reported_by uuid NOT NULL REFERENCES motorambos.members(id),
    category text NOT NULL CHECK (category IN ('Tyres', 'Battery', 'Engine', 'Brakes', 'Electrical', 'Other')),
    note text,
    status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
    resolution_note text,
    created_at timestamptz NOT NULL DEFAULT now(),
    resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS vehicle_issues_vehicle_created_idx ON motorambos.vehicle_issues(vehicle_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vehicle_issues_status_idx ON motorambos.vehicle_issues(status) WHERE status = 'open';

ALTER TABLE motorambos.portal_vehicle_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorambos.vehicle_issues ENABLE ROW LEVEL SECURITY;

-- All access is through authenticated portal routes, which verify vehicle access
-- before using the service role. Do not expose either table to browser clients.
REVOKE ALL ON motorambos.portal_vehicle_documents FROM anon, authenticated;
REVOKE ALL ON motorambos.vehicle_issues FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON motorambos.portal_vehicle_documents TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON motorambos.vehicle_issues TO service_role;
GRANT SELECT, INSERT ON motorambos.fuel_logs TO service_role;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('vehicle-documents', 'vehicle-documents', false, 5242880, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;
