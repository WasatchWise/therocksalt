-- Optimize RLS policies to avoid auth.* re-evaluation per row and
-- consolidate overlapping permissive policies flagged by Supabase lint.

-- MUSIC SUBMISSIONS ---------------------------------------------------------
do $$
begin
  if to_regclass('public.music_submissions') is not null then
    execute 'drop policy if exists "Allow anonymous submissions" on public.music_submissions';
    execute 'drop policy if exists "Allow public event submissions" on public.music_submissions';
    execute 'drop policy if exists "Submissions public submit" on public.music_submissions';
    execute 'drop policy if exists "Submissions read own" on public.music_submissions';
    execute 'drop policy if exists "Staff can review submissions" on public.music_submissions';
    execute 'drop policy if exists "Staff can update submissions" on public.music_submissions';
    execute 'drop policy if exists "Staff can delete submissions" on public.music_submissions';

    execute $sql$
      create policy "music_submissions public submit"
        on public.music_submissions
        for insert
        to public
        with check (true)
    $sql$;

    execute $sql$
      create policy "music_submissions review and owner read"
        on public.music_submissions
        for select
        to authenticated
        using (
          submitted_by = (select auth.uid())
          or coalesce(((select auth.jwt())->> 'is_staff'), 'false') = 'true'
        )
    $sql$;

    execute $sql$
      create policy "music_submissions staff update"
        on public.music_submissions
        for update
        to authenticated
        using (coalesce(((select auth.jwt())->> 'is_staff'), 'false') = 'true')
        with check (coalesce(((select auth.jwt())->> 'is_staff'), 'false') = 'true')
    $sql$;

    execute $sql$
      create policy "music_submissions staff delete"
        on public.music_submissions
        for delete
        to authenticated
        using (coalesce(((select auth.jwt())->> 'is_staff'), 'false') = 'true')
    $sql$;
  end if;
end
$$;

-- ARTIST_FOLLOWS ------------------------------------------------------------
do $$
begin
  if to_regclass('public.artist_follows') is not null then
    execute 'drop policy if exists "Follows own" on public.artist_follows';

    execute $sql$
      create policy "artist_follows manage own"
        on public.artist_follows
        for all
        to authenticated
        using (user_id = (select auth.uid()))
        with check (user_id = (select auth.uid()))
    $sql$;
  end if;
end
$$;

-- SHOW_INTERESTED -----------------------------------------------------------
do $$
begin
  if to_regclass('public.show_interested') is not null then
    execute 'drop policy if exists "Interested own" on public.show_interested';

    execute $sql$
      create policy "show_interested manage own"
        on public.show_interested
        for all
        to authenticated
        using (user_id = (select auth.uid()))
        with check (user_id = (select auth.uid()))
    $sql$;
  end if;
end
$$;

-- BAND_TRACKS ---------------------------------------------------------------
do $$
begin
  if to_regclass('public.band_tracks') is not null then
    execute 'drop policy if exists "band_tracks anon read" on public.band_tracks';
    execute 'drop policy if exists "band_tracks public read" on public.band_tracks';
    execute 'drop policy if exists "band_tracks authenticated insert" on public.band_tracks';
    execute 'drop policy if exists "band_tracks authenticated update" on public.band_tracks';
    execute 'drop policy if exists "band_tracks authenticated delete" on public.band_tracks';
    execute 'drop policy if exists "band_tracks authenticated manage own" on public.band_tracks';

    execute $sql$
      create policy "band_tracks public read"
        on public.band_tracks
        for select
        to public
        using (true)
    $sql$;

    execute $sql$
      create policy "band_tracks manage own"
        on public.band_tracks
        for all
        to authenticated
        using (
          exists (
            select 1
            from public.bands b
            where b.id = band_tracks.band_id
              and b.claimed_by = (select auth.uid())
          )
        )
        with check (
          exists (
            select 1
            from public.bands b
            where b.id = band_tracks.band_id
              and b.claimed_by = (select auth.uid())
          )
        )
    $sql$;
  end if;
end
$$;

-- BAND_PHOTOS ---------------------------------------------------------------
do $$
begin
  if to_regclass('public.band_photos') is not null then
    execute 'drop policy if exists "band_photos anon read" on public.band_photos';
    execute 'drop policy if exists "band_photos public read" on public.band_photos';
    execute 'drop policy if exists "band_photos authenticated insert" on public.band_photos';
    execute 'drop policy if exists "band_photos authenticated update" on public.band_photos';
    execute 'drop policy if exists "band_photos authenticated delete" on public.band_photos';
    execute 'drop policy if exists "band_photos authenticated manage own" on public.band_photos';

    execute $sql$
      create policy "band_photos public read"
        on public.band_photos
        for select
        to public
        using (true)
    $sql$;

    execute $sql$
      create policy "band_photos manage own"
        on public.band_photos
        for all
        to authenticated
        using (
          exists (
            select 1
            from public.bands b
            where b.id = band_photos.band_id
              and b.claimed_by = (select auth.uid())
          )
        )
        with check (
          exists (
            select 1
            from public.bands b
            where b.id = band_photos.band_id
              and b.claimed_by = (select auth.uid())
          )
        )
    $sql$;
  end if;
end
$$;

-- BANDS ---------------------------------------------------------------------
do $$
begin
  if to_regclass('public.bands') is not null then
    execute 'drop policy if exists "bands authenticated update claim or own" on public.bands';

    execute $sql$
      create policy "bands authenticated update claim or own"
        on public.bands
        for update
        to authenticated
        using (
          claimed_by is null
          or claimed_by = (select auth.uid())
        )
        with check (claimed_by = (select auth.uid()))
    $sql$;
  end if;
end
$$;

-- EVENT_SUBMISSIONS ---------------------------------------------------------
do $$
begin
  if to_regclass('public.event_submissions') is not null then
    execute 'drop policy if exists "Allow public event submissions" on public.event_submissions';
    execute 'drop policy if exists "Allow public to read all event submissions" on public.event_submissions';
    execute 'drop policy if exists "Admins can read all event submissions" on public.event_submissions';
    execute 'drop policy if exists "Admins can update event submissions" on public.event_submissions';
    execute 'drop policy if exists "Admins can delete event submissions" on public.event_submissions';

    execute $sql$
      create policy "Allow public event submissions"
        on public.event_submissions
        for insert
        to public
        with check (true)
    $sql$;

    execute $sql$
      create policy "Allow public to read event submissions"
        on public.event_submissions
        for select
        to public
        using (true)
    $sql$;

    execute $sql$
      create policy "Admins can update event submissions"
        on public.event_submissions
        for update
        to authenticated
        using (
          exists (
            select 1
            from public.admin_users a
            where a.id = (select auth.uid())
          )
        )
        with check (
          exists (
            select 1
            from public.admin_users a
            where a.id = (select auth.uid())
          )
        )
    $sql$;

    execute $sql$
      create policy "Admins can delete event submissions"
        on public.event_submissions
        for delete
        to authenticated
        using (
          exists (
            select 1
            from public.admin_users a
            where a.id = (select auth.uid())
          )
        )
    $sql$;
  end if;
end
$$;

-- SHARED READ POLICIES ------------------------------------------------------
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
as $function$
  select exists (
    select 1
    from public.org_members om
    where om.org_id = p_org_id
      and om.user_id = (select auth.uid())
  );
$function$;

do $$
begin
  if to_regclass('public.artists') is not null then
    execute 'drop policy if exists "Artists public read" on public.artists';
    execute 'drop policy if exists "Artists org manage" on public.artists';

    execute $sql$
      create policy "Artists public read"
        on public.artists
        for select
        to public
        using (
          is_published
          or public.is_org_member(org_id)
        )
    $sql$;
  end if;

  if to_regclass('public.assets') is not null then
    execute 'drop policy if exists "Assets public read" on public.assets';
    execute 'drop policy if exists "Assets org manage" on public.assets';

    execute $sql$
      create policy "Assets public read"
        on public.assets
        for select
        to public
        using (
          public.is_org_member(org_id)
        )
    $sql$;
  end if;

  if to_regclass('public.episodes') is not null then
    execute 'drop policy if exists "Episodes public read" on public.episodes';
    execute 'drop policy if exists "episodes public read" on public.episodes';
    execute 'drop policy if exists "Episodes org manage" on public.episodes';

    execute $sql$
      create policy "Episodes public read"
        on public.episodes
        for select
        to public
        using (
          is_published
          or public.is_org_member(org_id)
        )
    $sql$;
  end if;

  if to_regclass('public.partners') is not null then
    execute 'drop policy if exists "Partners public read" on public.partners';
    execute 'drop policy if exists "Partners org manage" on public.partners';

    execute $sql$
      create policy "Partners public read"
        on public.partners
        for select
        to public
        using (
          is_active
          or public.is_org_member(org_id)
        )
    $sql$;
  end if;

  if to_regclass('public.shows') is not null then
    execute 'drop policy if exists "Shows public read" on public.shows';
    execute 'drop policy if exists "Shows org manage" on public.shows';

    execute $sql$
      create policy "Shows public read"
        on public.shows
        for select
        to public
        using (
          is_published
          or public.is_org_member(org_id)
        )
    $sql$;
  end if;
end
$$;

