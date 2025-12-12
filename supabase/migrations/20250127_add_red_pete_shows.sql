-- Add Red Pete shows from flyers
-- Created: 2025-01-27
-- Adds two shows:
-- 1. RED PETE & SMARTER THAN KATIE at Piper Down on Dec 27, 2025
-- 2. PERFECTLY FLAWED, DEALIN' IN DIRT, RED PETE at Ice Haus on Jan 2, 2026

DO $$
DECLARE
  v_org_id uuid;
  v_piper_down_id uuid;
  v_ice_haus_id uuid;
  v_red_pete_id uuid;
  v_smarter_than_katie_id uuid;
  v_perfectly_flawed_id uuid;
  v_dealin_in_dirt_id uuid;
  v_event1_id uuid;
  v_event2_id uuid;
BEGIN
  -- Get org_id from any existing venue (if org_id is required)
  BEGIN
    SELECT org_id INTO v_org_id 
    FROM public.venues 
    WHERE org_id IS NOT NULL 
    LIMIT 1;
  EXCEPTION WHEN OTHERS THEN
    v_org_id := NULL;
  END;

  -- Get or create Piper Down
  SELECT id INTO v_piper_down_id FROM public.venues WHERE slug = 'piper-down' LIMIT 1;
  IF v_piper_down_id IS NULL THEN
    BEGIN
      IF v_org_id IS NOT NULL THEN
        INSERT INTO public.venues (name, slug, address, city, state, venue_type, org_id)
        VALUES ('Piper Down Olde World Pub', 'piper-down', '1492 South State Street', 'Salt Lake City', 'UT', 'bar', v_org_id)
        RETURNING id INTO v_piper_down_id;
      ELSE
        INSERT INTO public.venues (name, slug, address, city, state, venue_type)
        VALUES ('Piper Down Olde World Pub', 'piper-down', '1492 South State Street', 'Salt Lake City', 'UT', 'bar')
        RETURNING id INTO v_piper_down_id;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      -- If insert failed, try to get it (might have been created by another process)
      SELECT id INTO v_piper_down_id FROM public.venues WHERE slug = 'piper-down' LIMIT 1;
    END;
  END IF;

  -- Get or create Ice Haus
  SELECT id INTO v_ice_haus_id FROM public.venues WHERE slug = 'ice-haus' LIMIT 1;
  IF v_ice_haus_id IS NULL THEN
    BEGIN
      IF v_org_id IS NOT NULL THEN
        INSERT INTO public.venues (name, slug, address, city, state, venue_type, org_id)
        VALUES ('Ice Haus', 'ice-haus', '7 E. 4800 S.', 'Salt Lake City', 'UT', 'club', v_org_id)
        RETURNING id INTO v_ice_haus_id;
      ELSE
        INSERT INTO public.venues (name, slug, address, city, state, venue_type)
        VALUES ('Ice Haus', 'ice-haus', '7 E. 4800 S.', 'Salt Lake City', 'UT', 'club')
        RETURNING id INTO v_ice_haus_id;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      -- If insert failed, try to get it (might have been created by another process)
      SELECT id INTO v_ice_haus_id FROM public.venues WHERE slug = 'ice-haus' LIMIT 1;
    END;
  END IF;

  -- Get or create bands
  SELECT id INTO v_red_pete_id FROM public.bands WHERE slug = 'red-pete' LIMIT 1;
  IF v_red_pete_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status) VALUES ('Red Pete', 'red-pete', 'active') RETURNING id INTO v_red_pete_id;
  END IF;

  SELECT id INTO v_smarter_than_katie_id FROM public.bands WHERE slug = 'smarter-than-katie' LIMIT 1;
  IF v_smarter_than_katie_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status) VALUES ('Smarter Than Katie', 'smarter-than-katie', 'active') RETURNING id INTO v_smarter_than_katie_id;
  END IF;

  SELECT id INTO v_perfectly_flawed_id FROM public.bands WHERE slug = 'perfectly-flawed' LIMIT 1;
  IF v_perfectly_flawed_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status) VALUES ('Perfectly Flawed', 'perfectly-flawed', 'active') RETURNING id INTO v_perfectly_flawed_id;
  END IF;

  SELECT id INTO v_dealin_in_dirt_id FROM public.bands WHERE slug = 'dealin-in-dirt' LIMIT 1;
  IF v_dealin_in_dirt_id IS NULL THEN
    INSERT INTO public.bands (name, slug, status) VALUES ('Dealin'' in Dirt', 'dealin-in-dirt', 'active') RETURNING id INTO v_dealin_in_dirt_id;
  END IF;

  -- Create Event 1 if it doesn't exist
  SELECT id INTO v_event1_id 
  FROM public.events 
  WHERE venue_id = v_piper_down_id 
    AND start_time = '2025-12-27 21:00:00-07:00'::timestamptz
  LIMIT 1;

  IF v_event1_id IS NULL THEN
    INSERT INTO public.events (title, venue_id, venue_name, city, state, start_time, ticket_price, status)
    VALUES ('RED PETE & SMARTER THAN KATIE', v_piper_down_id, 'Piper Down Olde World Pub', 'Salt Lake City', 'UT', '2025-12-27 21:00:00-07:00'::timestamptz, 5.00, 'scheduled')
    RETURNING id INTO v_event1_id;
  END IF;

  -- Link bands to Event 1
  INSERT INTO public.event_bands (event_id, band_id, slot_order, is_headliner)
  VALUES 
    (v_event1_id, v_red_pete_id, 0, true),
    (v_event1_id, v_smarter_than_katie_id, 1, false)
  ON CONFLICT (event_id, band_id) DO NOTHING;

  -- Create Event 2 if it doesn't exist
  SELECT id INTO v_event2_id 
  FROM public.events 
  WHERE venue_id = v_ice_haus_id 
    AND start_time = '2026-01-02 21:00:00-07:00'::timestamptz
  LIMIT 1;

  IF v_event2_id IS NULL THEN
    INSERT INTO public.events (title, venue_id, venue_name, city, state, start_time, ticket_price, status)
    VALUES ('PERFECTLY FLAWED, DEALIN'' IN DIRT, RED PETE', v_ice_haus_id, 'Ice Haus', 'Salt Lake City', 'UT', '2026-01-02 21:00:00-07:00'::timestamptz, 5.00, 'scheduled')
    RETURNING id INTO v_event2_id;
  END IF;

  -- Link bands to Event 2
  INSERT INTO public.event_bands (event_id, band_id, slot_order, is_headliner)
  VALUES 
    (v_event2_id, v_perfectly_flawed_id, 0, true),
    (v_event2_id, v_dealin_in_dirt_id, 1, false),
    (v_event2_id, v_red_pete_id, 2, false)
  ON CONFLICT (event_id, band_id) DO NOTHING;

END $$;
