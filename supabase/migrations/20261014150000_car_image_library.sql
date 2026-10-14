-- Studio photos of car models in each colour, uploaded by staff and matched to vehicles
-- by make, model, colour and year.
CREATE TABLE IF NOT EXISTS motorambos.car_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    make text NOT NULL,
    model text NOT NULL,
    colour text NOT NULL,
    year_from integer CHECK (year_from IS NULL OR year_from BETWEEN 1950 AND 2100),
    year_to integer CHECK (year_to IS NULL OR year_to BETWEEN 1950 AND 2100),
    make_key text NOT NULL,
    model_key text NOT NULL,
    colour_key text NOT NULL,
    storage_path text NOT NULL,
    image_url text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    CHECK (year_from IS NULL OR year_to IS NULL OR year_from <= year_to)
);

CREATE INDEX IF NOT EXISTS car_images_lookup_idx ON motorambos.car_images(make_key, model_key, colour_key);

ALTER TABLE motorambos.car_images ENABLE ROW LEVEL SECURITY;

-- Staff manage the library through admin routes; public pages read it on the server.
REVOKE ALL ON motorambos.car_images FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON motorambos.car_images TO service_role;

-- The photos themselves are stock images of car models, so they are served publicly.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('car-images', 'car-images', true, 5242880, ARRAY['image/png', 'image/webp', 'image/jpeg'])
ON CONFLICT (id) DO NOTHING;
