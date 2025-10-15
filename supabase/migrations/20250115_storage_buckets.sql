-- Create storage buckets for band submissions
-- Run this in Supabase SQL editor or via supabase db push

-- Create band-photos bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-photos',
  'band-photos',
  true,
  5242880, -- 5MB limit
  array['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
) on conflict (id) do nothing;

-- Create band-music bucket
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'band-music',
  'band-music',
  true,
  26214400, -- 25MB limit
  array['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav']
) on conflict (id) do nothing;

-- Storage policies for band-photos bucket
-- Allow public uploads (anyone can upload)
create policy if not exists "Public can upload band photos"
on storage.objects for insert
with check (bucket_id = 'band-photos');

-- Allow public reads
create policy if not exists "Public can read band photos"
on storage.objects for select
using (bucket_id = 'band-photos');

-- Allow users to update their own uploads
create policy if not exists "Users can update own band photos"
on storage.objects for update
using (bucket_id = 'band-photos');

-- Allow users to delete their own uploads
create policy if not exists "Users can delete own band photos"
on storage.objects for delete
using (bucket_id = 'band-photos');

-- Storage policies for band-music bucket
-- Allow public uploads
create policy if not exists "Public can upload band music"
on storage.objects for insert
with check (bucket_id = 'band-music');

-- Allow public reads
create policy if not exists "Public can read band music"
on storage.objects for select
using (bucket_id = 'band-music');

-- Allow users to update their own uploads
create policy if not exists "Users can update own band music"
on storage.objects for update
using (bucket_id = 'band-music');

-- Allow users to delete their own uploads
create policy if not exists "Users can delete own band music"
on storage.objects for delete
using (bucket_id = 'band-music');
