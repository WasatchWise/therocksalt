-- Drop the existing restrictive update policy
drop policy if exists "bands authenticated update own" on public.bands;

-- Create new policy that allows:
-- 1. Claiming unclaimed bands (claimed_by IS NULL)
-- 2. Updating your own claimed bands
create policy "bands authenticated update claim or own"
  on public.bands for update
  to authenticated
  using (
    claimed_by is null  -- Allow claiming unclaimed bands
    or claimed_by = auth.uid()  -- Allow updating own bands
  )
  with check (
    claimed_by = auth.uid()  -- Can only set claimed_by to your own user ID
  );
