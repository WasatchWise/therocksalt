-- Minimal auto-promote with only guaranteed columns

CREATE OR REPLACE FUNCTION promote_approved_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    INSERT INTO public.events (id, name, description, start_time, venue_id)
    VALUES (NEW.id, NEW.event_name, NEW.event_description, NEW.start_time, NEW.venue_id)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      description = EXCLUDED.description,
      start_time = EXCLUDED.start_time,
      venue_id = EXCLUDED.venue_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_promote_approved_event ON public.event_submissions;
CREATE TRIGGER trigger_promote_approved_event
AFTER INSERT OR UPDATE OF status ON public.event_submissions
FOR EACH ROW
EXECUTE FUNCTION promote_approved_event();

-- Promote existing approved events
INSERT INTO public.events (id, name, description, start_time, venue_id)
SELECT id, event_name, event_description, start_time, venue_id
FROM public.event_submissions
WHERE status = 'approved'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  start_time = EXCLUDED.start_time,
  venue_id = EXCLUDED.venue_id;

-- Show results
SELECT COUNT(*) as approved_submissions FROM public.event_submissions WHERE status = 'approved';
SELECT COUNT(*) as public_events FROM public.events;
