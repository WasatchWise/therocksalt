-- Create storage bucket for event flyers

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'event-flyers',
  'event-flyers',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Allow public to read flyers
CREATE POLICY IF NOT EXISTS "Public can view event flyers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-flyers');

-- Storage policy: Allow anonymous users to upload flyers (for event submissions)
CREATE POLICY IF NOT EXISTS "Anyone can upload event flyers"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-flyers');

-- Storage policy: Allow users to update their own uploads
CREATE POLICY IF NOT EXISTS "Users can update their own flyers"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'event-flyers');

-- Storage policy: Allow users to delete their own uploads
CREATE POLICY IF NOT EXISTS "Users can delete their own flyers"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'event-flyers');
