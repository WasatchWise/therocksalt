-- Simple fix for event promotion

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION promote_approved_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    INSERT INTO public.events (
      id, name, description, start_time, venue_id,
      tickets_url, event_link, image_url, created_at, updated_at
    )
    VALUES (
      NEW.id, NEW.event_name, NEW.event_description,
      NEW.start_time, NEW.venue_id, NEW.ticket_url,
      NEW.event_url, NEW.flyer_url, NEW.created_at, NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      start_time = EXCLUDED.start_time,
      venue_id = EXCLUDED.venue_id,
      updated_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS trigger_promote_approved_event ON public.event_submissions;
CREATE TRIGGER trigger_promote_approved_event
AFTER INSERT OR UPDATE OF status ON public.event_submissions
FOR EACH ROW
EXECUTE FUNCTION promote_approved_event();

-- 3. Manually promote existing approved events
INSERT INTO public.events (id, name, description, start_time, venue_id, tickets_url, event_link, image_url, created_at, updated_at)
SELECT id, event_name, event_description, start_time, venue_id, ticket_url, event_url, flyer_url, created_at, NOW()
FROM public.event_submissions
WHERE status = 'approved'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  start_time = EXCLUDED.start_time,
  updated_at = NOW();

-- 4. Show what we have
SELECT COUNT(*) as approved_submissions FROM public.event_submissions WHERE status = 'approved';
SELECT COUNT(*) as public_events FROM public.events;
