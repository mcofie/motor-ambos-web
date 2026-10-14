-- Create invoices table to handle organization billing
CREATE TABLE IF NOT EXISTS motorambos.invoices (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id uuid REFERENCES motorambos.members(id) ON DELETE CASCADE,
    invoice_number text UNIQUE NOT NULL,
    status text DEFAULT 'PENDING', -- 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED'
    issue_date timestamptz DEFAULT now(),
    due_date timestamptz NOT NULL,
    total_amount numeric(10, 2) DEFAULT 0,
    paid_amount numeric(10, 2) DEFAULT 0,
    currency text DEFAULT 'GHS',
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create invoice_items table for line items
CREATE TABLE IF NOT EXISTS motorambos.invoice_items (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id uuid REFERENCES motorambos.invoices(id) ON DELETE CASCADE,
    description text NOT NULL,
    quantity numeric(10, 2) DEFAULT 1,
    unit_price numeric(10, 2) NOT NULL,
    amount numeric(10, 2) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_invoices_org ON motorambos.invoices(org_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON motorambos.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON motorambos.invoice_items(invoice_id);

-- Permissions
GRANT ALL ON TABLE motorambos.invoices TO service_role;
GRANT ALL ON TABLE motorambos.invoices TO postgres;
GRANT SELECT ON TABLE motorambos.invoices TO authenticated;

GRANT ALL ON TABLE motorambos.invoice_items TO service_role;
GRANT ALL ON TABLE motorambos.invoice_items TO postgres;
GRANT SELECT ON TABLE motorambos.invoice_items TO authenticated;

-- RLS
ALTER TABLE motorambos.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE motorambos.invoice_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for service_role" ON motorambos.invoices;
CREATE POLICY "Enable all for service_role" ON motorambos.invoices FOR ALL TO service_role USING (true);

DROP POLICY IF EXISTS "Enable all for service_role" ON motorambos.invoice_items;
CREATE POLICY "Enable all for service_role" ON motorambos.invoice_items FOR ALL TO service_role USING (true);

-- Relationship Timeline / Internal Notes
CREATE TABLE IF NOT EXISTS motorambos.organization_notes (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    org_id uuid REFERENCES motorambos.members(id) ON DELETE CASCADE,
    author_id uuid REFERENCES motorambos.members(id),
    content text NOT NULL,
    category text DEFAULT 'GENERAL', -- 'GENERAL', 'BILLING', 'FLEET', 'MEETING'
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Index for notes
CREATE INDEX IF NOT EXISTS idx_org_notes_org ON motorambos.organization_notes(org_id);

-- Helper to update invoice status when paid_amount changes
CREATE OR REPLACE FUNCTION motorambos.sync_invoice_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.paid_amount >= NEW.total_amount THEN
        NEW.status := 'PAID';
    ELSIF NEW.paid_amount > 0 AND NEW.paid_amount < NEW.total_amount THEN
        NEW.status := 'PENDING';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_invoice_status ON motorambos.invoices;
CREATE TRIGGER trg_sync_invoice_status
    BEFORE UPDATE OF paid_amount ON motorambos.invoices
    FOR EACH ROW
    EXECUTE FUNCTION motorambos.sync_invoice_status();

-- Permissions for notes
GRANT ALL ON TABLE motorambos.organization_notes TO service_role;
GRANT ALL ON TABLE motorambos.organization_notes TO postgres;
GRANT SELECT ON TABLE motorambos.organization_notes TO authenticated;

-- RLS for notes
ALTER TABLE motorambos.organization_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for service_role" ON motorambos.organization_notes;
CREATE POLICY "Enable all for service_role" ON motorambos.organization_notes FOR ALL TO service_role USING (true);
