-- Check genres table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'genres'
ORDER BY ordinal_position;

-- Check existing genres
SELECT * FROM public.genres LIMIT 10;
