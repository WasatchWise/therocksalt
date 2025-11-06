-- Populate Demo Data for Rock Salt
-- Created: 2025-11-15
-- Creates Manlyman HOF band, example venues, Spider Rider, and acceptances

-- Create Manlyman as Hall of Fame tier demo band
INSERT INTO public.bands (
  id,
  name,
  slug,
  tier,
  status,
  salt_rocks_balance,
  created_at
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, -- Fixed UUID for demo purposes
  'Manlyman',
  'manlyman',
  'hof',
  'active',
  1000, -- Give them some demo Salt Rocks
  now()
)
ON CONFLICT (slug) DO UPDATE
SET tier = 'hof', status = 'active', salt_rocks_balance = 1000;

-- Create Example Venues with Technical Specs
INSERT INTO public.venues (
  id,
  name,
  slug,
  address,
  city,
  state,
  zip_code,
  venue_type,
  capacity,
  stage_width_feet,
  stage_depth_feet,
  input_channels,
  has_house_drums,
  has_backline,
  created_at
)
VALUES
  (
    '10000000-0000-0000-0000-000000000001'::uuid,
    'Urban Lounge',
    'urban-lounge',
    '241 S 500 E',
    'Salt Lake City',
    'UT',
    '84102',
    'club',
    400,
    24, -- 24 feet wide
    16, -- 16 feet deep
    24, -- 24 input channels
    true,
    true,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000002'::uuid,
    'The Depot',
    'the-depot',
    '400 W South Temple',
    'Salt Lake City',
    'UT',
    '84101',
    'theater',
    1200,
    40,
    24,
    32,
    true,
    true,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000003'::uuid,
    'Kilby Court',
    'kilby-court',
    '741 S Kilby Ct',
    'Salt Lake City',
    'UT',
    '84101',
    'club',
    200,
    16,
    12,
    16,
    false,
    false,
    now()
  ),
  (
    '10000000-0000-0000-0000-000000000004'::uuid,
    'Metro Music Hall',
    'metro-music-hall',
    '615 W 100 S',
    'Salt Lake City',
    'UT',
    '84101',
    'theater',
    1000,
    32,
    20,
    32,
    true,
    true,
    now()
  )
ON CONFLICT (slug) DO UPDATE
SET
  stage_width_feet = EXCLUDED.stage_width_feet,
  stage_depth_feet = EXCLUDED.stage_depth_feet,
  input_channels = EXCLUDED.input_channels,
  has_house_drums = EXCLUDED.has_house_drums,
  has_backline = EXCLUDED.has_backline;

-- Create Spider Rider for Manlyman
INSERT INTO public.spider_riders (
  id,
  band_id,
  version,
  is_active,

  -- Performance Terms
  guarantee_min,
  guarantee_max,
  door_split_percentage,
  notes_financial,

  -- Technical Rider
  min_stage_width_feet,
  min_stage_depth_feet,
  min_input_channels,
  requires_house_drums,
  notes_technical,

  -- Hospitality
  green_room_requirements,
  meal_buyout_amount,
  drink_tickets_count,
  guest_list_allocation,
  notes_hospitality,

  -- Business Terms
  merch_split_to_venue_percentage,
  age_restriction,
  notes_business,

  created_at
)
VALUES (
  '20000000-0000-0000-0000-000000000001'::uuid,
  '00000000-0000-0000-0000-000000000001'::uuid, -- Manlyman
  'v1.0 - Club Tour 2025',
  true,

  -- Performance Terms
  500.00,  -- Min guarantee
  1500.00, -- Max guarantee
  80,      -- 80/20 door split
  'We prefer a guaranteed minimum of $500, but are flexible on door splits for the right room.',

  -- Technical Rider
  20,    -- Min 20 feet stage width
  12,    -- Min 12 feet stage depth
  16,    -- Min 16 input channels
  false, -- Don't require house drums (we bring our own)
  'We are a 4-piece rock band. Full backline except drums (we bring our own kit). Stage plot and input list available upon request.',

  -- Hospitality
  'Private green room with seating for 4-6 people. Access to bathroom and running water.',
  50.00,  -- $50 meal buyout
  8,      -- 8 drink tickets
  10,     -- 10 guest list spots
  'We appreciate a hot meal or buyout. Beer and water for the band is always appreciated.',

  -- Business Terms
  15,     -- 15% merch split to venue
  '21+',
  'We handle our own promotion and bring our own merch person. Happy to help promote the show on our socials.',

  now()
)
ON CONFLICT (band_id, version) DO UPDATE
SET is_active = true;

-- Create Spider Rider Acceptances (3 venues pre-approve Manlyman)
INSERT INTO public.spider_rider_acceptances (
  id,
  spider_rider_id,
  venue_id,
  is_active,
  notes,
  accepted_at
)
VALUES
  (
    '30000000-0000-0000-0000-000000000001'::uuid,
    '20000000-0000-0000-0000-000000000001'::uuid, -- Manlyman's Spider Rider
    '10000000-0000-0000-0000-000000000001'::uuid, -- Urban Lounge
    true,
    'Great fit for our room. We can do $750 guarantee + bar on weekends.',
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000002'::uuid,
    '20000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000003'::uuid, -- Kilby Court
    true,
    'Love having Manlyman. Our stage is a bit small but we make it work. $500 guarantee works for us.',
    now()
  ),
  (
    '30000000-0000-0000-0000-000000000004'::uuid,
    '20000000-0000-0000-0000-000000000001'::uuid,
    '10000000-0000-0000-0000-000000000004'::uuid, -- Metro Music Hall
    true,
    'Perfect for our Thursday night series. Can do $1000 guarantee or 80/20 door split.',
    now()
  )
ON CONFLICT (spider_rider_id, venue_id) DO UPDATE
SET is_active = true, notes = EXCLUDED.notes;

-- Update acceptance counts on the Spider Rider
UPDATE public.spider_riders
SET acceptance_count = (
  SELECT COUNT(*)
  FROM public.spider_rider_acceptances
  WHERE spider_rider_id = '20000000-0000-0000-0000-000000000001'::uuid
    AND is_active = true
)
WHERE id = '20000000-0000-0000-0000-000000000001'::uuid;

-- Comments
COMMENT ON TABLE public.venues IS 'Music venues and performance spaces in Salt Lake City';
