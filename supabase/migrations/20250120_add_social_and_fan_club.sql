-- Add social media posts and fan club tables
-- Created: 2025-01-20

-- Social Media Posts
CREATE TABLE IF NOT EXISTS public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  platform text NOT NULL CHECK (platform IN ('twitter', 'instagram', 'facebook', 'all')),
  text text NOT NULL,
  image_url text,
  link text,
  status text CHECK (status IN ('pending', 'posted', 'failed')) DEFAULT 'pending',
  posted_at timestamptz,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS social_posts_user_id_idx ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS social_posts_status_idx ON public.social_posts(status);
CREATE INDEX IF NOT EXISTS social_posts_created_at_idx ON public.social_posts(created_at);

-- Fan Club Members
CREATE TABLE IF NOT EXISTS public.fan_club_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  tier text CHECK (tier IN ('bronze', 'silver', 'gold')) DEFAULT 'bronze',
  
  -- Subscription info
  stripe_subscription_id text,
  subscription_status text CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')) DEFAULT 'active',
  
  -- Membership dates
  joined_at timestamptz DEFAULT now() NOT NULL,
  expires_at timestamptz,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  UNIQUE(user_id, band_id)
);

CREATE INDEX IF NOT EXISTS fan_club_members_user_id_idx ON public.fan_club_members(user_id);
CREATE INDEX IF NOT EXISTS fan_club_members_band_id_idx ON public.fan_club_members(band_id);
CREATE INDEX IF NOT EXISTS fan_club_members_tier_idx ON public.fan_club_members(tier);

-- Fan Club Tiers (band-specific tier definitions)
CREATE TABLE IF NOT EXISTS public.fan_club_tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  tier_name text NOT NULL CHECK (tier_name IN ('bronze', 'silver', 'gold')),
  price_cents integer NOT NULL,
  features jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  
  UNIQUE(band_id, tier_name)
);

CREATE INDEX IF NOT EXISTS fan_club_tiers_band_id_idx ON public.fan_club_tiers(band_id);

-- Exclusive Content (for fan club members)
CREATE TABLE IF NOT EXISTS public.exclusive_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id uuid REFERENCES public.bands(id) ON DELETE CASCADE NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('track', 'video', 'photo', 'post', 'live_stream')),
  title text NOT NULL,
  description text,
  url text,
  tier_required text CHECK (tier_required IN ('bronze', 'silver', 'gold')) DEFAULT 'bronze',
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS exclusive_content_band_id_idx ON public.exclusive_content(band_id);
CREATE INDEX IF NOT EXISTS exclusive_content_tier_required_idx ON public.exclusive_content(tier_required);

-- Enable RLS
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_club_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exclusive_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies for social_posts
CREATE POLICY "Admins can view all posts"
  ON public.social_posts FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can create posts"
  ON public.social_posts FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
  );

-- RLS Policies for fan_club_members
CREATE POLICY "Users can view their memberships"
  ON public.fan_club_members FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Artists can view their members"
  ON public.fan_club_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.bands 
      WHERE id = band_id AND claimed_by = auth.uid()
    )
  );

CREATE POLICY "Users can create memberships"
  ON public.fan_club_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for fan_club_tiers
CREATE POLICY "Public can view tiers"
  ON public.fan_club_tiers FOR SELECT
  USING (true);

CREATE POLICY "Artists can manage their tiers"
  ON public.fan_club_tiers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.bands 
      WHERE id = band_id AND claimed_by = auth.uid()
    )
  );

-- RLS Policies for exclusive_content
CREATE POLICY "Members can view content for their tier"
  ON public.exclusive_content FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.fan_club_members
      WHERE band_id = exclusive_content.band_id
        AND user_id = auth.uid()
        AND subscription_status = 'active'
        AND (
          (tier_required = 'bronze' AND tier IN ('bronze', 'silver', 'gold')) OR
          (tier_required = 'silver' AND tier IN ('silver', 'gold')) OR
          (tier_required = 'gold' AND tier = 'gold')
        )
    ) OR
    EXISTS (
      SELECT 1 FROM public.bands 
      WHERE id = band_id AND claimed_by = auth.uid()
    )
  );

CREATE POLICY "Artists can manage their content"
  ON public.exclusive_content FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.bands 
      WHERE id = band_id AND claimed_by = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE TRIGGER fan_club_members_updated_at
  BEFORE UPDATE ON public.fan_club_members
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER fan_club_tiers_updated_at
  BEFORE UPDATE ON public.fan_club_tiers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER exclusive_content_updated_at
  BEFORE UPDATE ON public.exclusive_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Comments
COMMENT ON TABLE public.social_posts IS 'Automated social media posts';
COMMENT ON TABLE public.fan_club_members IS 'Fan club membership subscriptions';
COMMENT ON TABLE public.fan_club_tiers IS 'Band-specific fan club tier definitions';
COMMENT ON TABLE public.exclusive_content IS 'Exclusive content for fan club members';

