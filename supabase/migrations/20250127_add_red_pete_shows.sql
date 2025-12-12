-- Add Red Pete shows from flyers
-- Created: 2025-01-27
-- Adds two shows:
-- 1. RED PETE & SMARTER THAN KATIE at Piper Down on Dec 27, 2025
-- 2. PERFECTLY FLAWED, DEALIN' IN DIRT, RED PETE at Ice Haus on Jan 2, 2026

-- Helper function to get or create a band
DO $$
DECLARE
  v_piper_down_id uuid;
  v_ice_haus_id uuid;
  v_red_pete_id uuid;
  v_smarter_than_katie_id uuid;
  v_perfectly_flawed_id uuid;
  v_dealin_in_dirt_id uuid;
  v_event1_id uuid;
  v_event2_id uuid;
BEGIN
  -- Get venue IDs
  SELECT id INTO v_piper_down_id FROM public.venues WHERE slug = 'piper-down' LIMIT 1;
  SELECT id INTO v_ice_haus_id FROM public.venues WHERE slug = 'ice-haus' LIMIT 1;

  IF v_piper_down_id IS NULL THEN
    RAISE EXCEPTION 'Venue piper-down not found';
  END IF;

  IF v_ice_haus_id IS NULL THEN
    RAISE EXCEPTION 'Venue ice-haus not found';
  END IF;

  -- Get or create bands
  -- Red Pete
  SELECT id INTO v_red_pete_id FROM public.bands WHERE slug = 'red-pete';
  IF v_red_pete_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status)
    VALUES ('Red Pete', 'red-pete', 'active')
    RETURNING id INTO v_red_pete_id;
  ELSE
    UPDATE public.bands SET status = 'active' WHERE id = v_red_pete_id;
  END IF;

  -- Smarter Than Katie
  SELECT id INTO v_smarter_than_katie_id FROM public.bands WHERE slug = 'smarter-than-katie';
  IF v_smarter_than_katie_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status)
    VALUES ('Smarter Than Katie', 'smarter-than-katie', 'active')
    RETURNING id INTO v_smarter_than_katie_id;
  ELSE
    UPDATE public.bands SET status = 'active' WHERE id = v_smarter_than_katie_id;
  END IF;

  -- Perfectly Flawed
  SELECT id INTO v_perfectly_flawed_id FROM public.bands WHERE slug = 'perfectly-flawed';
  IF v_perfectly_flawed_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status)
    VALUES ('Perfectly Flawed', 'perfectly-flawed', 'active')
    RETURNING id INTO v_perfectly_flawed_id;
  ELSE
    UPDATE public.bands SET status = 'active' WHERE id = v_perfectly_flawed_id;
  END IF;

  -- Dealin' in Dirt
  SELECT id INTO v_dealin_in_dirt_id FROM public.bands WHERE slug = 'dealin-in-dirt';
  IF v_dealin_in_dirt_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status)
    VALUES ('Dealin'' in Dirt', 'dealin-in-dirt', 'active')
    RETURNING id INTO v_dealin_in_dirt_id;
  ELSE
    UPDATE public.bands SET status = 'active' WHERE id = v_dealin_in_dirt_id;
  END IF;

  -- Check if Event 1 already exists
  SELECT id INTO v_event1_id 
  FROM public.events 
  WHERE venue_id = v_piper_down_id 
    AND start_time = '2025-12-27 21:00:00-07:00'::timestamptz
  LIMIT 1;

  -- Create Event 1: RED PETE & SMARTER THAN KATIE at Piper Down (if it doesn't exist)
  IF v_event1_id IS NULL THEN
    INSERT INTO public.events (
      title,
      venue_id,
      venue_name,
      city,
      state,
      start_time,
      ticket_price,
      status
    )
    VALUES (
      'RED PETE & SMARTER THAN KATIE',
      v_piper_down_id,
      'Piper Down Olde World Pub',
      'Salt Lake City',
      'UT',
      '2025-12-27 21:00:00-07:00'::timestamptz, -- 9:00 PM MST
      5.00,
      'scheduled'
    )
    RETURNING id INTO v_event1_id;
  END IF;

  -- Link bands to Event 1
  IF v_event1_id IS NOT NULL THEN
    INSERT INTO public.event_bands (event_id, band_id, slot_order, is_headliner)
    VALUES 
      (v_event1_id, v_red_pete_id, 0, true),
      (v_event1_id, v_smarter_than_katie_id, 1, false)
    ON CONFLICT (event_id, band_id) DO NOTHING;
  END IF;

  -- Check if Event 2 already exists
  SELECT id INTO v_event2_id 
  FROM public.events 
  WHERE venue_id = v_ice_haus_id 
    AND start_time = '2026-01-02 21:00:00-07:00'::timestamptz
  LIMIT 1;

  -- Create Event 2: PERFECTLY FLAWED, DEALIN' IN DIRT, RED PETE at Ice Haus (if it doesn't exist)
  IF v_event2_id IS NULL THEN
    INSERT INTO public.events (
      title,
      venue_id,
      venue_name,
      city,
      state,
      start_time,
      ticket_price,
      status
    )
    VALUES (
      'PERFECTLY FLAWED, DEALIN'' IN DIRT, RED PETE',
      v_ice_haus_id,
      'Ice Haus',
      'Salt Lake City',
      'UT',
      '2026-01-02 21:00:00-07:00'::timestamptz, -- 9:00 PM MST
      5.00,
      'scheduled'
    )
    RETURNING id INTO v_event2_id;
  END IF;

  -- Link bands to Event 2
  IF v_event2_id IS NOT NULL THEN
    INSERT INTO public.event_bands (event_id, band_id, slot_order, is_headliner)
    VALUES 
      (v_event2_id, v_perfectly_flawed_id, 0, true),
      (v_event2_id, v_dealin_in_dirt_id, 1, false),
      (v_event2_id, v_red_pete_id, 2, false)
    ON CONFLICT (event_id, band_id) DO NOTHING;
  END IF;

END $$;
