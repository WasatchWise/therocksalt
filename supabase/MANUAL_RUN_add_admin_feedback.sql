-- =====================================================================
-- MANUAL MIGRATION: Add Admin Feedback to Music Submissions
-- =====================================================================
-- Copy and paste this entire file into your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yznquvzzqrvjafdfczak/sql/new
-- =====================================================================

-- Step 1: Add admin_feedback column
ALTER TABLE public.music_submissions
ADD COLUMN IF NOT EXISTS admin_feedback TEXT;

-- Step 2: Add updated_at column
ALTER TABLE public.music_submissions
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 3: Add trigger for updated_at
DROP TRIGGER IF EXISTS trigger_update_music_submissions_updated_at ON public.music_submissions;

CREATE TRIGGER trigger_update_music_submissions_updated_at
BEFORE UPDATE ON public.music_submissions
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Step 4: Update RLS policies for admin access
DROP POLICY IF EXISTS "Staff can review submissions" ON public.music_submissions;
DROP POLICY IF EXISTS "Staff can update submissions" ON public.music_submissions;
DROP POLICY IF EXISTS "Staff can delete submissions" ON public.music_submissions;

CREATE POLICY "Admins can view all submissions"
ON public.music_submissions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  )
);

CREATE POLICY "Admins can update submissions"
ON public.music_submissions
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  )
);

CREATE POLICY "Admins can delete submissions"
ON public.music_submissions
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- Step 5: Insert test music submissions for admin UI testing
INSERT INTO public.music_submissions (
  band_name, contact_name, contact_email, hometown,
  links, notes, genre_preferences, status
) VALUES

-- Test 1: Complete submission, ready to approve
(
  'Electric Haze',
  'Sarah Martinez',
  'sarah@electrichaze.com',
  'Salt Lake City, UT',
  jsonb_build_object(
    'website', 'https://electrichaze.com',
    'instagram', 'https://instagram.com/electrichaze',
    'spotify', 'https://open.spotify.com/artist/electrichaze',
    'band_photo', 'https://picsum.photos/seed/band1/800/600'
  ),
  E'Bio: Electric Haze brings heavy psych-rock vibes to the SLC underground scene.\n\nFull Description: Formed in 2022, Electric Haze blends fuzzy guitar riffs with hypnotic synth loops. Known for our intense live shows at Kilby Court and Urban Lounge.\n\nFor Fans Of: Tame Impala, King Gizzard & The Lizard Wizard\n\nBooking Available: Yes',
  ARRAY['Rock', 'Psych Rock', 'Experimental'],
  'pending'
),

-- Test 2: Incomplete submission - missing bio
(
  'The Neon Wolves',
  'Mike Chen',
  'booking@neonwolves.net',
  'Provo, UT',
  jsonb_build_object(
    'instagram', 'https://instagram.com/neonwolves',
    'facebook', 'https://facebook.com/neonwolves'
  ),
  E'Bio: Cool band from Provo\n\nBooking Available: Maybe',
  ARRAY['Indie', 'Alternative'],
  'pending'
),

-- Test 3: Low-quality photo (simulated)
(
  'Rusty Strings',
  'Jake Williams',
  'jake.williams@gmail.com',
  'Ogden, UT',
  jsonb_build_object(
    'band_photo', 'https://picsum.photos/seed/lowres/200/150',
    'spotify', 'https://open.spotify.com/artist/rustystrings'
  ),
  E'Bio: Rusty Strings is a folk-rock duo playing acoustic covers and originals around northern Utah. We love playing coffee shops and breweries.\n\nFull Description: Formed in 2020 during lockdown, we\'ve played over 50 shows in the past year.\n\nFor Fans Of: The Lumineers, Mumford & Sons\n\nBooking Available: Yes',
  ARRAY['Folk', 'Alternative'],
  'pending'
),

-- Test 4: Genre mismatch (Classical)
(
  'Utah Symphony Chamber Ensemble',
  'Dr. Robert Kim',
  'r.kim@utahsymphony.org',
  'Salt Lake City, UT',
  jsonb_build_object(
    'website', 'https://utahsymphony.org'
  ),
  E'Bio: The Utah Symphony Chamber Ensemble performs classical chamber music across the Wasatch Front.\n\nFull Description: Established in 1995, we specialize in 18th and 19th-century European compositions.\n\nBooking Available: No',
  ARRAY['Classical', 'Chamber Music'],
  'pending'
),

-- Test 5: No SLC connection (out of state)
(
  'Denver Death Squad',
  'Alex Rodriguez',
  'alex@denverdeathsquad.com',
  'Denver, CO',
  jsonb_build_object(
    'instagram', 'https://instagram.com/denverdeathsquad',
    'bandcamp', 'https://denverdeathsquad.bandcamp.com',
    'band_photo', 'https://picsum.photos/seed/band2/800/600',
    'music_file', 'https://example.com/sample.mp3'
  ),
  E'Bio: Denver Death Squad delivers blistering hardcore punk with political edge.\n\nFull Description: Active since 2018, we\'ve toured the southwest and released 2 EPs.\n\nFor Fans Of: Converge, Knocked Loose\n\nBooking Available: Yes',
  ARRAY['Punk', 'Hardcore'],
  'pending'
),

-- Test 6: Complete, great submission
(
  'Velvet Thunder',
  'Lisa Park',
  'contact@velvetthunder.band',
  'Salt Lake City, UT',
  jsonb_build_object(
    'website', 'https://velvetthunder.band',
    'instagram', 'https://instagram.com/velvetthunderslc',
    'spotify', 'https://open.spotify.com/artist/velvetthunder',
    'bandcamp', 'https://velvetthunder.bandcamp.com',
    'band_photo', 'https://picsum.photos/seed/band3/800/600',
    'music_file', 'https://example.com/velvet-sample.mp3',
    'song_title', 'Midnight Drive'
  ),
  E'Bio: Velvet Thunder merges dreamy shoegaze with driving post-punk energy, creating a wall of sound that\'s both ethereal and intense.\n\nFull Description: Since forming in 2021, Velvet Thunder has become a staple of the Salt Lake DIY scene. We\'ve played The State Room, Kilby Court, and Urban Lounge, sharing the stage with national acts like Narrow Head and Nothing. Our debut EP "Neon Haze" dropped in 2024 to local acclaim.\n\nFor Fans Of: My Bloody Valentine, Interpol, The Twilight Sad\n\nPhone: 801-555-0147\n\nBooking Available: Yes\n\nHow they heard about us: Friend/band referral\n\nAdditional Comments: We have a full-length album releasing in March 2026 and would love to be featured!',
  ARRAY['Alternative', 'Shoegaze', 'Post-Punk'],
  'pending'
),

-- Test 7: Inactive band (last show 3 years ago)
(
  'The Static Kings',
  'Tom Bradley',
  'tom.bradley@oldmail.com',
  'Salt Lake City, UT',
  jsonb_build_object(
    'facebook', 'https://facebook.com/statickings'
  ),
  E'Bio: The Static Kings rocked SLC from 2015-2021 with garage rock energy.\n\nFull Description: We played every dive bar in the valley. Last show was at Bar Deluxe in 2021.\n\nBooking Available: No',
  ARRAY['Rock', 'Garage Rock'],
  'pending'
),

-- Test 8: Spam/test submission
(
  'Test Band 123',
  'John Doe',
  'test@test.com',
  'Test City',
  jsonb_build_object(),
  E'Bio: This is a test submission please ignore thanks',
  ARRAY['Other'],
  'pending'
);

-- Verify insertions
SELECT
  band_name,
  contact_email,
  hometown,
  status,
  CASE
    WHEN LENGTH(notes) > 50 THEN 'Complete'
    ELSE 'Incomplete'
  END as profile_status
FROM public.music_submissions
ORDER BY created_at DESC
LIMIT 10;

-- =====================================================================
-- SUCCESS!
-- =====================================================================
-- You should now see 8 test submissions in your music_submissions table.
-- Run the dev server and navigate to /admin/music-submissions to test!
-- =====================================================================
