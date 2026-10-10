-- One delivery per vehicle, document, expiry date, interval, and recipient.
CREATE TABLE IF NOT EXISTS motorambos.document_sms_reminders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid NOT NULL REFERENCES motorambos.vehicles(id) ON DELETE CASCADE,
    recipient_member_id uuid NOT NULL REFERENCES motorambos.members(id) ON DELETE CASCADE,
    kind text NOT NULL CHECK (kind IN ('insurance', 'roadworthy')),
    expiry_date date NOT NULL,
    days_before smallint NOT NULL CHECK (days_before IN (30, 7, 1)),
    status text NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'sent', 'failed')),
    attempt_count integer NOT NULL DEFAULT 1,
    claimed_at timestamptz NOT NULL DEFAULT now(),
    sent_at timestamptz,
    last_error text,
    CONSTRAINT document_sms_reminders_unique UNIQUE (vehicle_id, recipient_member_id, kind, expiry_date, days_before)
);

CREATE INDEX IF NOT EXISTS document_sms_reminders_status_idx
    ON motorambos.document_sms_reminders(status, claimed_at);

ALTER TABLE motorambos.document_sms_reminders ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON motorambos.document_sms_reminders FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON motorambos.document_sms_reminders TO service_role;

-- A timed claim prevents two overlapping cron calls from sending the same SMS.
-- Failed attempts can be retried; a stale in-flight claim expires after five minutes.
CREATE OR REPLACE FUNCTION motorambos.claim_document_sms_reminder(
    p_vehicle_id uuid,
    p_recipient_member_id uuid,
    p_kind text,
    p_expiry_date date,
    p_days_before smallint
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE claimed_id uuid;
BEGIN
    INSERT INTO motorambos.document_sms_reminders (
        vehicle_id, recipient_member_id, kind, expiry_date, days_before
    ) VALUES (
        p_vehicle_id, p_recipient_member_id, p_kind, p_expiry_date, p_days_before
    )
    ON CONFLICT ON CONSTRAINT document_sms_reminders_unique DO UPDATE
        SET status = 'processing',
            claimed_at = now(),
            attempt_count = motorambos.document_sms_reminders.attempt_count + 1,
            last_error = NULL
        WHERE motorambos.document_sms_reminders.status = 'failed'
           OR (motorambos.document_sms_reminders.status = 'processing'
               AND motorambos.document_sms_reminders.claimed_at < now() - interval '5 minutes')
    RETURNING id INTO claimed_id;

    RETURN claimed_id;
END;
$$;

REVOKE ALL ON FUNCTION motorambos.claim_document_sms_reminder(uuid, uuid, text, date, smallint) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION motorambos.claim_document_sms_reminder(uuid, uuid, text, date, smallint) TO service_role;
