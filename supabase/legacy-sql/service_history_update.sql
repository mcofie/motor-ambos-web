-- Add location and document_metadata to service_history
ALTER TABLE motorambos.service_history ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE motorambos.service_history ADD COLUMN IF NOT EXISTS document_metadata JSONB;

-- Note: We are not making 'location' NOT NULL yet to avoid breaking existing records.
-- However, the UI now enforces it for new entries.
