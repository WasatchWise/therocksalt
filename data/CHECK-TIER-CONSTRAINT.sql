-- Check what tier values are allowed by the constraint
SELECT
    con.conname AS constraint_name,
    pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'bands'
AND con.conname = 'bands_tier_check';

-- Also check what tier values are currently in use
SELECT DISTINCT tier, COUNT(*) as count
FROM public.bands
GROUP BY tier
ORDER BY count DESC;
