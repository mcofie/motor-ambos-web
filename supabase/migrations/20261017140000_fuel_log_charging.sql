-- Electric cars log charges, not fill-ups. A charge is a fuel_logs row with fuel_type 'electricity',
-- the energy in energy_kwh and no litres. Fill-ups keep litres as before.
ALTER TABLE motorambos.fuel_logs ADD COLUMN IF NOT EXISTS energy_kwh numeric;
ALTER TABLE motorambos.fuel_logs ALTER COLUMN liters DROP NOT NULL;
ALTER TABLE motorambos.fuel_logs ALTER COLUMN price_per_liter DROP NOT NULL;

ALTER TABLE motorambos.fuel_logs DROP CONSTRAINT IF EXISTS fuel_logs_litres_or_kwh;
ALTER TABLE motorambos.fuel_logs ADD CONSTRAINT fuel_logs_litres_or_kwh
    CHECK (liters IS NOT NULL OR energy_kwh IS NOT NULL);

COMMENT ON COLUMN motorambos.fuel_logs.energy_kwh IS 'Energy charged, for electric cars (fuel_type electricity). Null for fill-ups.';

NOTIFY pgrst, 'reload schema';
