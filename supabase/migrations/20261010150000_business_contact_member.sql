-- A business and its contact person are separate records. The contact keeps
-- their own unique phone and can also be a driver in the same fleet. The app
-- grants fleet manager access through this reference without changing driver roles.
ALTER TABLE motorambos.members
    ALTER COLUMN phone DROP NOT NULL;

ALTER TABLE motorambos.members
    ADD COLUMN IF NOT EXISTS contact_member_id uuid
        REFERENCES motorambos.members(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS members_contact_member_id_idx
    ON motorambos.members(contact_member_id)
    WHERE contact_member_id IS NOT NULL;
