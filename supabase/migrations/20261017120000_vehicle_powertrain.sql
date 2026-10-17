-- Whether a car runs on petrol or diesel, is a hybrid, or is electric. The apps use it to skip
-- oil-change tracking for electric cars. Empty for cars added before this existed.
ALTER TABLE motorambos.vehicles
    ADD COLUMN IF NOT EXISTS powertrain text
    CHECK (powertrain IS NULL OR powertrain IN ('ice', 'hybrid', 'ev'));

COMMENT ON COLUMN motorambos.vehicles.powertrain IS 'ice (petrol or diesel), hybrid or ev (electric). Null when not given.';

NOTIFY pgrst, 'reload schema';
