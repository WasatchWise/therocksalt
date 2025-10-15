-- Working auto-promote with correct column names

CREATE OR REPLACE FUNCTION promote_approved_event()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status != 'approved') THEN
    INSERT INTO public.events (
      id, name, description, start_time, venue_id, created_at, updated_at
    )
    VALUES (
      NEW.id, NEW.event_name, NEW.event_description,
      NEW.start_time, NEW.venue_id, NEW.created_at, NOW()
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

DROP TRIGGER IF EXISTS trigger_promote_approved_event ON public.event_submissions;
CREATE TRIGGER trigger_promote_approved_event
AFTER INSERT OR UPDATE OF status ON public.event_submissions
FOR EACH ROW
EXECUTE FUNCTION promote_approved_event();

-- Promote existing approved events
INSERT INTO public.events (id, name, description, start_time, venue_id, created_at, updated_at)
SELECT id, event_name, event_description, start_time, venue_id, created_at, NOW()
FROM public.event_submissions
WHERE status = 'approved'
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  start_time = EXCLUDED.start_time,
  updated_at = NOW();

-- Show results
SELECT COUNT(*) as approved_count FROM public.event_submissions WHERE status = 'approved';
SELECT COUNT(*) as events_count FROM public.events;
