-- Delete the 3 fabricated events
-- Winter Showcase 2025, Math Rock Marathon, and Red Pete with Just Hold Still

DELETE FROM public.events 
WHERE id IN (
  '6fc21363-bd6a-47bd-b298-bc1c2e596e88',  -- Red Pete with Just Hold Still
  '61b5115a-271d-4e54-a86a-09108ac778e7',  -- Winter Showcase 2025
  'b6f67d6b-bded-44af-9313-349f11f0ef48'   -- Math Rock Marathon
);

-- Also delete from event_submissions if they exist there
DELETE FROM public.event_submissions 
WHERE id IN (
  '6fc21363-bd6a-47bd-b298-bc1c2e596e88',
  '61b5115a-271d-4e54-a86a-09108ac778e7',
  'b6f67d6b-bded-44af-9313-349f11f0ef48'
);

-- Verify only real event remains
SELECT id, name, start_time FROM public.events ORDER BY created_at;
