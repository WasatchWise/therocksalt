-- ============================================================
-- AUTO-PROMOTE APPROVED EVENTS
-- ============================================================
-- When an event submission is approved, automatically create it in the events table

-- Function to promote approved submission to main events table
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

    -- Copy band associations
    INSERT INTO public.event_bands (event_id, band_id, band_name, is_headliner, slot_order)
    SELECT NEW.id, band_id, band_name, is_headliner, slot_order
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

-- Promote any existing approved submissions
UPDATE public.event_submissions
SET updated_at = NOW()
WHERE status = 'approved';
