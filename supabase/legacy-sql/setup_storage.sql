-- Create a public bucket for provider assets
-- Run this in the Supabase Dashboard > SQL Editor

-- 1. Create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('provider-assets', 'provider-assets', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public access to read files
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'provider-assets');

-- 3. Allow authenticated users to upload files
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
CREATE POLICY "Admin Upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'provider-assets' AND 
  auth.role() = 'authenticated'
);

-- 4. Allow users to update/delete their own uploads
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;
CREATE POLICY "Admin Delete" ON storage.objects
FOR DELETE USING (
  bucket_id = 'provider-assets' AND 
  auth.role() = 'authenticated'
);
