-- ============================================================
-- SETUP APPROVED EVENTS - Make approved submissions visible
-- ============================================================

-- Option 1: Create a view that shows approved event submissions as events
CREATE OR REPLACE VIEW public.approved_events AS
SELECT
  es.id,
  es.event_name as name,
  es.event_description as description,
  es.start_time,
  es.venue_id,
  es.ticket_price,
  es.ticket_url as tickets_url,
  es.event_url as event_link,
  es.flyer_url as image_url,
  es.created_at,
  es.updated_at
FROM public.event_submissions es
WHERE es.status = 'approved';

-- Grant public access to the view
GRANT SELECT ON public.approved_events TO anon, authenticated;

-- Option 2: Clean up old/test events from the events table
DELETE FROM public.events WHERE name LIKE '%test%' OR name LIKE '%Test%';

-- Show current approved submissions
SELECT
  id,
  event_name,
  status,
  start_time,
  organizer_name,
  created_at
FROM public.event_submissions
ORDER BY created_at DESC;
