-- Enable RLS for public tables that already have policies defined.
alter table public.band_links enable row level security;
alter table public.band_genres enable row level security;
alter table public.genres enable row level security;
alter table public.events enable row level security;
alter table public.event_bands enable row level security;
alter table public.episode_links enable row level security;
