-- ============================================================
-- FIX AUTO-PROMOTE APPROVED EVENTS
-- ============================================================

-- First, check the event_bands table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'event_bands'
AND table_schema = 'public';

-- Create or update the event_bands table with correct structure
CREATE TABLE IF NOT EXISTS public.event_bands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  band_id UUID REFERENCES public.bands(id) ON DELETE SET NULL,
  is_headliner BOOLEAN DEFAULT false,
  slot_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.event_bands ENABLE ROW LEVEL SECURITY;

-- Public read policy
DROP POLICY IF EXISTS "Public can read event bands" ON public.event_bands;
CREATE POLICY "Public can read event bands"
ON public.event_bands
FOR SELECT
TO public
USING (true);

-- Fixed trigger function
CREATE OR REPLACE FUNCTION promote_approved_event()
RETURNS TRIGGER AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    -- Insert into events table (or update if already exists)
    INSERT INTO public.events (
      id,
      name,
      description,
      start_time,
      venue_id,
      tickets_url,
      event_link,
      image_url,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.event_name,
      NEW.event_description,
      NEW.start_time,
      NEW.venue_id,
      NEW.ticket_url,
      NEW.event_url,
      NEW.flyer_url,
      NEW.created_at,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      start_time = EXCLUDED.start_time,
      venue_id = EXCLUDED.venue_id,
      tickets_url = EXCLUDED.tickets_url,
      event_link = EXCLUDED.event_link,
      image_url = EXCLUDED.image_url,
      updated_at = NOW();

    -- Copy band associations (using correct column names)
    INSERT INTO public.event_bands (event_id, band_id, is_headliner, slot_order)
    SELECT NEW.id, band_id, is_headliner, slot_order
    FROM public.event_submission_bands
    WHERE event_submission_id = NEW.id
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_promote_approved_event ON public.event_submissions;
CREATE TRIGGER trigger_promote_approved_event
AFTER INSERT OR UPDATE OF status ON public.event_submissions
FOR EACH ROW
EXECUTE FUNCTION promote_approved_event();

-- Clean up test/fake events
DELETE FROM public.events WHERE name ILIKE '%test%';
DELETE FROM public.event_submissions WHERE event_name ILIKE '%test%' OR event_name ILIKE '%fake%';

-- Force promote any existing approved submissions
DO $$
DECLARE
  submission RECORD;
BEGIN
  FOR submission IN
    SELECT * FROM public.event_submissions WHERE status = 'approved'
  LOOP
    -- Insert into events
    INSERT INTO public.events (
      id, name, description, start_time, venue_id,
      tickets_url, event_link, image_url, created_at, updated_at
    )
    VALUES (
      submission.id,
      submission.event_name,
      submission.event_description,
      submission.start_time,
      submission.venue_id,
      submission.ticket_url,
      submission.event_url,
      submission.flyer_url,
      submission.created_at,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      start_time = EXCLUDED.start_time,
      venue_id = EXCLUDED.venue_id,
      updated_at = NOW();

    -- Copy bands
    INSERT INTO public.event_bands (event_id, band_id, is_headliner, slot_order)
    SELECT submission.id, band_id, is_headliner, slot_order
    FROM public.event_submission_bands
    WHERE event_submission_id = submission.id
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- Show results
SELECT 'Event Submissions (Approved)' as table_name, COUNT(*) as count
FROM public.event_submissions WHERE status = 'approved'
UNION ALL
SELECT 'Events (Public)', COUNT(*)
FROM public.events
UNION ALL
SELECT 'Event Bands', COUNT(*)
FROM public.event_bands;
