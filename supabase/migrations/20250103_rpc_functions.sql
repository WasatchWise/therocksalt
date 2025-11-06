-- RPC Functions for The Rock Salt

-- Function to increment track play count
create or replace function public.increment_track_play_count(track_id uuid)
returns void as $$
begin
  update public.band_tracks
  set play_count = coalesce(play_count, 0) + 1
  where id = track_id;
end;
$$ language plpgsql security definer;

-- Grant execute permission to anonymous users
grant execute on function public.increment_track_play_count(uuid) to anon;
grant execute on function public.increment_track_play_count(uuid) to authenticated;
