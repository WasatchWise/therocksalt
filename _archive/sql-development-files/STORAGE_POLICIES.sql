-- ============================================================
-- STORAGE BUCKET POLICIES FOR FILE UPLOADS
-- ============================================================
-- This creates RLS policies for the storage buckets to allow
-- authenticated users to upload tracks and photos
-- ============================================================

-- Delete existing policies if any
delete from storage.policies where bucket_id in ('band-tracks', 'band-photos');

-- ============================================================
-- BAND TRACKS BUCKET POLICIES
-- ============================================================

-- Allow authenticated users to upload tracks
insert into storage.policies (bucket_id, name, definition)
values (
  'band-tracks',
  'Authenticated users can upload tracks',
  '(bucket_id = ''band-tracks'' AND auth.role() = ''authenticated'')'
);

-- Allow public read access to tracks
insert into storage.policies (bucket_id, name, definition)
values (
  'band-tracks',
  'Public can read tracks',
  '(bucket_id = ''band-tracks'')'
);

-- ============================================================
-- BAND PHOTOS BUCKET POLICIES
-- ============================================================

-- Allow authenticated users to upload photos
insert into storage.policies (bucket_id, name, definition)
values (
  'band-photos',
  'Authenticated users can upload photos',
  '(bucket_id = ''band-photos'' AND auth.role() = ''authenticated'')'
);

-- Allow public read access to photos
insert into storage.policies (bucket_id, name, definition)
values (
  'band-photos',
  'Public can read photos',
  '(bucket_id = ''band-photos'')'
);

-- ============================================================
-- VERIFY POLICIES
-- ============================================================

select
  bucket_id,
  name,
  definition
from storage.policies
where bucket_id in ('band-tracks', 'band-photos')
order by bucket_id, name;
