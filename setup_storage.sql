-- Create storage buckets for band photos and music files
-- This script sets up the necessary storage infrastructure for the music submission form

-- Create band-photos bucket (5MB limit, public access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'band-photos',
  'band-photos',
  true,
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id)
DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Create band-music bucket (25MB limit, public access)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'band-music',
  'band-music',
  true,
  26214400, -- 25MB in bytes
  ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav']
)
ON CONFLICT (id)
DO UPDATE SET
  public = true,
  file_size_limit = 26214400,
  allowed_mime_types = ARRAY['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/wave', 'audio/x-wav'];

-- Create RLS policies for band-photos bucket
-- Allow anyone to upload (insert)
CREATE POLICY IF NOT EXISTS "Allow public uploads to band-photos"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'band-photos');

-- Allow anyone to view (select)
CREATE POLICY IF NOT EXISTS "Allow public access to band-photos"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'band-photos');

-- Create RLS policies for band-music bucket
-- Allow anyone to upload (insert)
CREATE POLICY IF NOT EXISTS "Allow public uploads to band-music"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'band-music');

-- Allow anyone to view (select)
CREATE POLICY IF NOT EXISTS "Allow public access to band-music"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'band-music');

-- Verify buckets were created
SELECT id, name, public, file_size_limit, allowed_mime_types
FROM storage.buckets
WHERE id IN ('band-photos', 'band-music');
