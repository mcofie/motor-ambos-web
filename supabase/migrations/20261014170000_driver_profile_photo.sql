-- A driver's own profile photo, shown on Smart Card pages only when the car's sharing allows it.
ALTER TABLE motorambos.driver_licences ADD COLUMN IF NOT EXISTS photo_path text;
