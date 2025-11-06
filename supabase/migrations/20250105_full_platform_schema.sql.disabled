-- The Rock Salt Platform - Complete Schema
-- Entities: Artists, Venues, Vendors, Gear, Practice Spaces, Opportunities
-- Features: RFPs, Marketplace, Find Musicians, Merch Ordering

-- ============================================================================
-- CORE USER MANAGEMENT
-- ============================================================================

-- User profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  user_type text check (user_type in ('artist', 'venue', 'vendor', 'fan')) not null,
  display_name text,
  avatar_url text,
  bio text,
  location text,
  phone text,
  website text,
  discord_username text,
  subscription_tier text check (subscription_tier in ('free', 'basic', 'premium', 'vip')) default 'free',
  subscription_expires_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- VENUES
-- ============================================================================

create table if not exists public.venues (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  address text,
  city text,
  state text,
  zip_code text,
  website text,
  phone text,
  email text,
  capacity int,
  description text,
  bio text,
  image_url text,
  claimed_by uuid references public.profiles(id) on delete set null,
  claimed_at timestamp with time zone,
  featured boolean default false,
  amenities jsonb, -- {sound_system: true, parking: true, bar: true, etc}
  booking_info text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.venue_photos (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues(id) on delete cascade not null,
  url text not null,
  caption text,
  is_primary boolean default false,
  photo_order int,
  created_at timestamp with time zone default now()
);

create table if not exists public.venue_links (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references public.venues(id) on delete cascade not null,
  label text,
  url text not null,
  link_type text, -- 'website', 'facebook', 'instagram', 'booking', etc
  created_at timestamp with time zone default now()
);

-- ============================================================================
-- VENDORS (Merch, Services, Equipment)
-- ============================================================================

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  vendor_type text check (vendor_type in ('merch', 'studio', 'equipment', 'photography', 'videography', 'printing', 'promotion', 'other')),
  description text,
  bio text,
  address text,
  city text,
  state text,
  website text,
  phone text,
  email text,
  image_url text,
  claimed_by uuid references public.profiles(id) on delete set null,
  claimed_at timestamp with time zone,
  featured boolean default false,
  discount_percentage decimal(5,2), -- e.g., 10.00 for 10%
  discount_description text,
  accepts_platform_orders boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.vendor_photos (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete cascade not null,
  url text not null,
  caption text,
  is_primary boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists public.vendor_services (
  id uuid primary key default gen_random_uuid(),
  vendor_id uuid references public.vendors(id) on delete cascade not null,
  service_name text not null,
  description text,
  base_price decimal(10,2),
  price_description text, -- "Starting at $50", "Call for quote", etc
  created_at timestamp with time zone default now()
);

-- ============================================================================
-- RFP / OPPORTUNITIES SYSTEM
-- ============================================================================

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  opportunity_type text check (opportunity_type in ('gig', 'studio_time', 'collaboration', 'merchandise', 'sponsorship', 'other')) not null,
  title text not null,
  description text not null,
  posted_by uuid references public.profiles(id) on delete cascade not null,
  posted_by_entity_type text check (posted_by_entity_type in ('venue', 'vendor', 'band', 'other')),
  posted_by_entity_id uuid, -- Reference to venues, vendors, or bands table

  -- Details
  budget_min decimal(10,2),
  budget_max decimal(10,2),
  event_date timestamp with time zone,
  location text,
  requirements text,

  -- Status
  status text check (status in ('open', 'in_review', 'filled', 'cancelled', 'expired')) default 'open',
  expires_at timestamp with time zone,

  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.opportunity_responses (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid references public.opportunities(id) on delete cascade not null,
  responded_by uuid references public.profiles(id) on delete cascade not null,
  band_id uuid references public.bands(id) on delete set null, -- If responding as a band

  -- Response details
  message text not null,
  proposed_price decimal(10,2),
  availability text,
  portfolio_links jsonb, -- Array of URLs

  -- Status
  status text check (status in ('pending', 'accepted', 'rejected', 'withdrawn')) default 'pending',

  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- GEAR MARKETPLACE
-- ============================================================================

create table if not exists public.gear_listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid references public.profiles(id) on delete cascade not null,
  listing_type text check (listing_type in ('sale', 'rent', 'trade')) not null,

  -- Item details
  title text not null,
  description text not null,
  category text check (category in ('guitar', 'bass', 'drums', 'keyboard', 'amplifier', 'effects', 'microphone', 'dj_equipment', 'recording', 'other')),
  brand text,
  model text,
  condition text check (condition in ('new', 'like_new', 'excellent', 'good', 'fair', 'poor')),
  year_manufactured int,

  -- Pricing
  price decimal(10,2),
  rental_price_daily decimal(10,2),
  rental_price_weekly decimal(10,2),
  negotiable boolean default true,

  -- Location & Availability
  location text,
  available boolean default true,

  -- Status
  status text check (status in ('active', 'pending', 'sold', 'rented', 'inactive')) default 'active',

  -- Metadata
  view_count int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.gear_photos (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.gear_listings(id) on delete cascade not null,
  url text not null,
  is_primary boolean default false,
  photo_order int,
  created_at timestamp with time zone default now()
);

-- ============================================================================
-- PRACTICE SPACES
-- ============================================================================

create table if not exists public.practice_spaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid references public.profiles(id) on delete cascade,

  -- Location
  address text,
  city text not null,
  state text not null,
  zip_code text,

  -- Details
  description text,
  size_sqft int,
  capacity_people int,
  hourly_rate decimal(10,2),
  daily_rate decimal(10,2),
  monthly_rate decimal(10,2),

  -- Amenities
  has_drums boolean default false,
  has_amps boolean default false,
  has_pa_system boolean default false,
  has_piano boolean default false,
  has_recording_equipment boolean default false,
  has_climate_control boolean default false,
  has_wifi boolean default false,
  amenities_other text,

  -- Availability
  available boolean default true,
  booking_instructions text,

  -- Contact
  phone text,
  email text,
  website text,

  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create table if not exists public.practice_space_photos (
  id uuid primary key default gen_random_uuid(),
  space_id uuid references public.practice_spaces(id) on delete cascade not null,
  url text not null,
  is_primary boolean default false,
  created_at timestamp with time zone default now()
);

-- ============================================================================
-- FIND MUSICIANS / BAND MEMBERS
-- ============================================================================

create table if not exists public.musician_listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  listing_type text check (listing_type in ('seeking_band', 'seeking_members', 'available_for_hire', 'jam_session')) not null,

  -- Details
  title text not null,
  description text not null,
  instruments text[], -- Array of instruments
  roles text[], -- 'vocalist', 'guitarist', 'drummer', etc
  genres text[],
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced', 'professional')),

  -- Preferences
  looking_for text, -- "Looking for a punk band in SLC"
  availability text,
  location text,

  -- Links
  audio_samples jsonb, -- Array of {url, title}
  video_links jsonb,

  -- Status
  status text check (status in ('active', 'inactive', 'filled')) default 'active',

  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- MERCH ORDERS SYSTEM
-- ============================================================================

create table if not exists public.merch_orders (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.profiles(id) on delete set null,
  vendor_id uuid references public.vendors(id) on delete set null not null,
  band_id uuid references public.bands(id) on delete set null, -- If ordering for a band

  -- Order details
  order_items jsonb not null, -- Array of {product, quantity, price, customization}
  subtotal decimal(10,2) not null,
  discount_amount decimal(10,2) default 0,
  discount_code text,
  tax_amount decimal(10,2) default 0,
  total_amount decimal(10,2) not null,

  -- Status
  status text check (status in ('pending', 'submitted_to_vendor', 'in_production', 'shipped', 'delivered', 'cancelled')) default 'pending',

  -- Shipping
  shipping_address jsonb,
  tracking_number text,

  -- Payment (integrate with Stripe later)
  payment_status text check (payment_status in ('pending', 'paid', 'refunded', 'failed')) default 'pending',
  payment_intent_id text,

  -- Communication
  notes text,
  vendor_notes text,

  -- Metadata
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ============================================================================
-- SUBSCRIPTIONS & PAYMENTS
-- ============================================================================

create table if not exists public.subscription_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  transaction_type text check (transaction_type in ('subscription', 'claim_band', 'claim_venue', 'claim_vendor', 'feature_listing', 'other')) not null,
  amount decimal(10,2) not null,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  status text check (status in ('pending', 'succeeded', 'failed', 'refunded')) default 'pending',
  created_at timestamp with time zone default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Venues
create index if not exists venues_slug_idx on public.venues(slug);
create index if not exists venues_city_state_idx on public.venues(city, state);
create index if not exists venues_claimed_by_idx on public.venues(claimed_by);

-- Vendors
create index if not exists vendors_slug_idx on public.vendors(slug);
create index if not exists vendors_type_idx on public.vendors(vendor_type);
create index if not exists vendors_claimed_by_idx on public.vendors(claimed_by);

-- Opportunities
create index if not exists opportunities_status_idx on public.opportunities(status);
create index if not exists opportunities_type_idx on public.opportunities(opportunity_type);
create index if not exists opportunities_posted_by_idx on public.opportunities(posted_by);
create index if not exists opportunity_responses_opportunity_idx on public.opportunity_responses(opportunity_id);

-- Gear
create index if not exists gear_listings_category_idx on public.gear_listings(category);
create index if not exists gear_listings_status_idx on public.gear_listings(status);
create index if not exists gear_listings_seller_idx on public.gear_listings(seller_id);

-- Practice Spaces
create index if not exists practice_spaces_city_state_idx on public.practice_spaces(city, state);
create index if not exists practice_spaces_available_idx on public.practice_spaces(available);

-- Musicians
create index if not exists musician_listings_type_idx on public.musician_listings(listing_type);
create index if not exists musician_listings_status_idx on public.musician_listings(status);

-- Merch Orders
create index if not exists merch_orders_customer_idx on public.merch_orders(customer_id);
create index if not exists merch_orders_vendor_idx on public.merch_orders(vendor_id);
create index if not exists merch_orders_status_idx on public.merch_orders(status);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.venues enable row level security;
alter table public.venue_photos enable row level security;
alter table public.venue_links enable row level security;
alter table public.vendors enable row level security;
alter table public.vendor_photos enable row level security;
alter table public.vendor_services enable row level security;
alter table public.opportunities enable row level security;
alter table public.opportunity_responses enable row level security;
alter table public.gear_listings enable row level security;
alter table public.gear_photos enable row level security;
alter table public.practice_spaces enable row level security;
alter table public.practice_space_photos enable row level security;
alter table public.musician_listings enable row level security;
alter table public.merch_orders enable row level security;
alter table public.subscription_transactions enable row level security;

-- Public read policies (anonymous can view)
create policy "Public profiles read" on public.profiles for select using (true);
create policy "Public venues read" on public.venues for select using (true);
create policy "Public venue photos read" on public.venue_photos for select using (true);
create policy "Public venue links read" on public.venue_links for select using (true);
create policy "Public vendors read" on public.vendors for select using (true);
create policy "Public vendor photos read" on public.vendor_photos for select using (true);
create policy "Public vendor services read" on public.vendor_services for select using (true);
create policy "Public opportunities read" on public.opportunities for select using (status = 'open');
create policy "Public gear listings read" on public.gear_listings for select using (status = 'active');
create policy "Public gear photos read" on public.gear_photos for select using (true);
create policy "Public practice spaces read" on public.practice_spaces for select using (available = true);
create policy "Public practice space photos read" on public.practice_space_photos for select using (true);
create policy "Public musician listings read" on public.musician_listings for select using (status = 'active');

-- Authenticated users can manage their own content
create policy "Users manage own profile" on public.profiles
  for all using (auth.uid() = id);

create policy "Users manage claimed venues" on public.venues
  for all using (auth.uid() = claimed_by);

create policy "Users manage claimed vendors" on public.vendors
  for all using (auth.uid() = claimed_by);

create policy "Users create opportunities" on public.opportunities
  for insert with check (auth.uid() = posted_by);

create policy "Users manage own opportunities" on public.opportunities
  for all using (auth.uid() = posted_by);

create policy "Users create responses" on public.opportunity_responses
  for insert with check (auth.uid() = responded_by);

create policy "Users view own responses" on public.opportunity_responses
  for select using (auth.uid() = responded_by or auth.uid() in (
    select posted_by from opportunities where id = opportunity_id
  ));

create policy "Users manage own gear" on public.gear_listings
  for all using (auth.uid() = seller_id);

create policy "Users manage own practice spaces" on public.practice_spaces
  for all using (auth.uid() = owner_id);

create policy "Users manage own musician listings" on public.musician_listings
  for all using (auth.uid() = user_id);

create policy "Users view own orders" on public.merch_orders
  for select using (auth.uid() = customer_id or auth.uid() in (
    select claimed_by from vendors where id = vendor_id
  ));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Updated_at triggers
create trigger venues_updated_at before update on public.venues
  for each row execute function public.set_updated_at();

create trigger vendors_updated_at before update on public.vendors
  for each row execute function public.set_updated_at();

create trigger opportunities_updated_at before update on public.opportunities
  for each row execute function public.set_updated_at();

create trigger opportunity_responses_updated_at before update on public.opportunity_responses
  for each row execute function public.set_updated_at();

create trigger gear_listings_updated_at before update on public.gear_listings
  for each row execute function public.set_updated_at();

create trigger practice_spaces_updated_at before update on public.practice_spaces
  for each row execute function public.set_updated_at();

create trigger musician_listings_updated_at before update on public.musician_listings
  for each row execute function public.set_updated_at();

create trigger merch_orders_updated_at before update on public.merch_orders
  for each row execute function public.set_updated_at();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to automatically expire old opportunities
create or replace function expire_old_opportunities()
returns trigger as $$
begin
  update public.opportunities
  set status = 'expired'
  where status = 'open'
    and expires_at is not null
    and expires_at < now();
  return null;
end;
$$ language plpgsql;

-- Create scheduled job (requires pg_cron extension)
-- Run this separately if you want automated expiration
-- create extension if not exists pg_cron;
-- select cron.schedule('expire-opportunities', '0 0 * * *', 'select expire_old_opportunities()');
