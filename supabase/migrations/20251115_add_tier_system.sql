-- Add Tier System and Subscription Columns to Bands
-- Created: 2025-11-15

-- Add tier column with Rock Salt pricing tiers
ALTER TABLE public.bands
ADD COLUMN IF NOT EXISTS tier text
  CHECK (tier IN ('anon', 'garage', 'headliner', 'national_act', 'platinum', 'hof'))
  DEFAULT 'anon';

-- Add Salt Rocks balance
ALTER TABLE public.bands
ADD COLUMN IF NOT EXISTS salt_rocks_balance integer DEFAULT 0;

-- Add Stripe subscription tracking
ALTER TABLE public.bands ADD COLUMN IF NOT EXISTS stripe_subscription_id text;
ALTER TABLE public.bands ADD COLUMN IF NOT EXISTS stripe_customer_id text;
ALTER TABLE public.bands ADD COLUMN IF NOT EXISTS subscription_status text
  CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing', 'incomplete'));
ALTER TABLE public.bands ADD COLUMN IF NOT EXISTS subscription_ends_at timestamptz;
ALTER TABLE public.bands ADD COLUMN IF NOT EXISTS subscription_started_at timestamptz;

-- Index for tier queries
CREATE INDEX IF NOT EXISTS bands_tier_idx ON public.bands(tier);

-- Comments for documentation
COMMENT ON COLUMN public.bands.tier IS 'Subscription tier: anon (free), garage ($9), headliner ($29), national_act ($79), platinum ($149), hof ($299)';
COMMENT ON COLUMN public.bands.salt_rocks_balance IS 'Current Salt Rocks token balance for purchasing features';
COMMENT ON COLUMN public.bands.stripe_subscription_id IS 'Stripe subscription ID for recurring billing';
COMMENT ON COLUMN public.bands.subscription_status IS 'Current status of Stripe subscription';
