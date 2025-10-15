-- STEP 1: Create or get the organization
-- Run this first, then note the org_id returned

insert into public.orgs (name, slug, website)
values ('The Rock Salt', 'the-rock-salt', 'https://therocksalt.com')
on conflict (slug) do update set name = excluded.name
returning id, name, slug;

-- Also show all existing orgs
select id, name, slug, created_at from public.orgs;
