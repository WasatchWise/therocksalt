# Rock Salt Freemium Tier System

## Tier Levels

### 1. FREE TIER (Default)
**Event Marquee Style:**
- Smaller, compact listing
- Text-2xl event name (vs text-5xl)
- Text-xl price box (vs text-7xl)
- No animated lights
- Gray borders instead of yellow
- Listed after premium tiers

**Features:**
- Basic event listing
- Event name, date, time, venue
- Single band photo
- Standard placement in chronological order

### 2. FEATURED TIER ($25/event or $10/month)
**Event Marquee Style:**
- Current marquee design
- Text-5xl event name
- Text-6xl price display
- Yellow borders
- Animated pulsing lights
- Mixed with premium in chronological order

**Features:**
- Full marquee treatment
- Multiple band photos (up to 3)
- Social media links
- Ticket link prominence
- Event description (up to 500 chars)

### 3. ROCK & ROLL HOF TIER ($100/event or $50/month)
**Event Marquee Style:**
- MASSIVE display (text-7xl event name)
- GIANT price (text-9xl)
- Animated gradient backgrounds
- Sparkle/star effects
- Red carpet border treatment
- ALWAYS at top, regardless of date
- "PREMIUM EVENT" badge
- Spotlight animation

**Features:**
- Everything in Featured tier, plus:
- Video embeds (YouTube, etc.)
- Unlimited band photos
- Featured artist bios
- Priority support
- Social media promotion from Rock Salt account
- Email blast to subscribers
- Homepage featured carousel spot

## Database Schema Changes

```sql
-- Add tier system to bands
ALTER TABLE public.bands
ADD COLUMN tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured', 'hof'));

-- Add tier to events (can override band tier)
ALTER TABLE public.events
ADD COLUMN tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'featured', 'hof'));

-- Track tier purchases
CREATE TABLE public.tier_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  band_id UUID REFERENCES public.bands(id) ON DELETE CASCADE,
  tier TEXT NOT NULL,
  purchase_type TEXT NOT NULL CHECK (purchase_type IN ('event', 'monthly')),
  event_id UUID REFERENCES public.events(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  stripe_payment_id TEXT,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  valid_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Event Display Order

1. HOF tier events (sorted by start_time)
2. Featured tier events (sorted by start_time)
3. Free tier events (sorted by start_time)

## Visual Mockup

### Free Tier
```
┌─────────────────────────────────────┐
│ Oct 15 • 8PM • $10                  │
│ Band Name at Venue Name             │
│ [Basic info only]                   │
└─────────────────────────────────────┘
```

### Featured Tier (Current)
```
╔═══════════════════════════════════════╗
║ ✨ ANIMATED LIGHTS ✨                 ║
║                                       ║
║  OCT   BAND NAME                      ║
║   15   At Venue Name                  ║
║  8PM                                  ║
║                           $10         ║
║                        [GET TICKETS]  ║
╚═══════════════════════════════════════╝
```

### Rock & Roll HOF Tier
```
╔═══════════════════════════════════════╗
║ 🌟 ⭐ PREMIUM EVENT ⭐ 🌟            ║
║ ✨✨ SPOTLIGHT ANIMATION ✨✨         ║
║                                       ║
║    OCT    MASSIVE BAND NAME           ║
║     15    Epic Description Here       ║
║    8PM    At Legendary Venue          ║
║                                       ║
║              💰 $10 💰                ║
║           [GET TICKETS NOW]           ║
║                                       ║
║  [Band Photos Carousel]               ║
║  [Video Embed]                        ║
╚═══════════════════════════════════════╝
```

## Implementation Priority

1. ✅ Add tier columns to database
2. ✅ Set Red Pete to 'hof' tier
3. ✅ Update events page to sort by tier
4. ✅ Create tier-specific component variants
5. ⏳ Stripe integration for payments
6. ⏳ Admin panel for tier management
7. ⏳ Upgrade prompts for free users
