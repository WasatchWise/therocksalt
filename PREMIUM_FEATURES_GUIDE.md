# Premium Features Implementation Guide

**Quick Reference for Using the New Premium Features**

---

## 🎵 AzuraCast Auto-Upload

### How It Works:
1. Artist submits music through `/submit`
2. Admin reviews submission in `/admin/music-submissions`
3. Admin clicks **"Approve & Add to Playlist"** button
4. System automatically:
   - Uploads MP3/WAV to AzuraCast
   - Adds metadata (title, artist, album, genre, artwork)
   - Adds track to default playlist
   - Tracks media ID in database

### Admin Usage:
```typescript
// In admin UI, button automatically calls:
POST /api/azuracast/upload
Body: { submissionId: "uuid" }
```

### Result:
- Track appears in AzuraCast playlist within 2-5 minutes
- Artist can request their own song immediately
- Track is available for radio rotation

---

## 💳 Stripe Payments

### Setup Required:
1. Create Stripe account at https://stripe.com
2. Get API keys from Stripe Dashboard
3. Add to environment variables:
   ```bash
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```
4. Set up webhook endpoint in Stripe Dashboard:
   - URL: `https://yourdomain.com/api/webhooks/stripe`
   - Events: `payment_intent.succeeded`, `checkout.session.completed`, `customer.subscription.*`

### Creating a Checkout Session:
```typescript
// One-time payment
POST /api/v1/checkout/create
Body: {
  type: "one-time",
  amount: 500, // $5.00 in cents
  description: "Priority Song Request",
  successUrl: "https://yourdomain.com/success",
  cancelUrl: "https://yourdomain.com/cancel",
  metadata: { type: "song_request", request_id: "..." }
}

// Subscription
POST /api/v1/checkout/create
Body: {
  type: "subscription",
  priceId: "price_...", // From Stripe Dashboard
  description: "Analytics Dashboard",
  successUrl: "...",
  cancelUrl: "...",
  metadata: { type: "analytics", band_id: "..." }
}
```

---

## 🎤 Song Request Priority

### Pricing Tiers:
- **Normal**: Free (standard queue)
- **Next 5**: $2 (bumps to front of next 5 songs)
- **Play Next**: $5 (plays after current song)
- **Play Now**: $10 (plays immediately if DJ is live)

### Usage:
```typescript
POST /api/v1/song-requests/priority
Body: {
  mediaId: 123, // AzuraCast media ID
  priority: "play_next", // or "next_5", "play_now"
  bandId: "uuid",
  trackTitle: "Song Title",
  artistName: "Artist Name"
}
```

### User Flow:
1. User finds track they want to request
2. Selects priority level
3. Redirected to Stripe checkout
4. After payment, request is queued in AzuraCast
5. Track plays according to priority

---

## 💰 Tip Jar

### Revenue Split:
- 95% to artist
- 5% platform fee

### Usage:
```typescript
POST /api/v1/tips/create
Body: {
  artistId: "uuid",
  amount: 5.00, // $5.00
  message: "Love your music!" // Optional
}
```

### Response:
```json
{
  "tipId": "uuid",
  "paymentUrl": "https://buy.stripe.com/..."
}
```

### User Flow:
1. Fan clicks "Tip Artist" on band profile
2. Enters amount ($1-$50)
3. Optional message
4. Redirected to Stripe payment link
5. Artist receives 95% via automatic payout

---

## 📊 Analytics Tracking

### Track Events:
```typescript
POST /api/v1/analytics/track
Body: {
  eventType: "track_play", // or "profile_view", "song_request", etc.
  bandId: "uuid",
  mediaId: 123, // Optional
  metadata: { ... } // Optional
}
```

### Get Dashboard Data:
```typescript
GET /api/v1/analytics/dashboard?bandId=uuid&period=30d
```

### Returns:
- Total plays
- Profile views
- Song requests
- Tips received
- Unique listeners
- Peak listening times
- Top tracks
- Recent activity

---

## 🪙 Salt Rocks Currency

### Earning Opportunities:
- Daily login: 10 rocks
- Share profile: 25 rocks
- Submit event: 50 rocks
- Refer friend: 100 rocks

### Spending Opportunities:
- Song request: 50 rocks
- Featured comment: 25 rocks
- Boost post: 100 rocks
- Unlock premium content: 200 rocks

### Usage:
```typescript
import { awardSaltRocks, spendSaltRocks } from '@/lib/monetization/salt-rocks'

// Award rocks
await awardSaltRocks(userId, 'daily_login')

// Spend rocks
const result = await spendSaltRocks(userId, 'song_request')
if (result.success) {
  // Proceed with action
}
```

---

## 📱 Social Media Automation

### Post Templates Available:
- Event announcements
- Artist spotlights
- Track milestones

### Usage:
```typescript
import { createEventPost, socialMediaClient } from '@/lib/social-media'

// Create post
const post = createEventPost({
  eventName: "Rock Night",
  venueName: "Kilby Court",
  date: "Jan 25, 2025",
  time: "8:00 PM",
  bandNames: ["Band A", "Band B"]
})

// Post to all platforms
await socialMediaClient.postToAll(post)
```

### API:
```typescript
POST /api/v1/social-media/post
Body: {
  text: "Post text...",
  platform: "all", // or "twitter", "instagram", "facebook"
  imageUrl: "https://...", // Optional
  link: "https://..." // Optional
}
```

---

## 🔗 Affiliate Links

### Supported Types:
- Equipment (Sweetwater, Guitar Center, Reverb)
- Streaming (Spotify, Apple Music, Bandcamp)
- Tickets (Eventbrite, Ticketmaster)
- Merch (Printful, Merchbar)
- Studios (Local studios)

### Usage:
```typescript
import { trackAffiliateClick, getAffiliateUrl } from '@/lib/affiliates/tracking'

// Get tracked URL
const { trackingUrl } = await trackAffiliateClick({
  affiliateType: 'equipment',
  affiliatePartner: 'sweetwater',
  affiliateUrl: 'https://sweetwater.com/product/...',
  referralCode: 'ROCKSALT'
})

// Or generate URL directly
const url = getAffiliateUrl(
  'https://sweetwater.com/product/123',
  'sweetwater',
  'equipment'
)
```

### Tracking:
- All clicks tracked in `affiliate_clicks` table
- Conversions tracked when sales occur
- Commission calculated automatically

---

## 👥 Fan Club System

### Tiers:
- **Bronze**: Basic tier (lowest price)
- **Silver**: Mid tier
- **Gold**: Premium tier (highest price)

### Setup:
1. Artist creates tier definitions in `fan_club_tiers` table
2. Sets prices for each tier
3. Defines features per tier

### Subscription:
```typescript
POST /api/v1/fan-club/subscribe
Body: {
  bandId: "uuid",
  tier: "silver",
  priceId: "price_..." // Stripe price ID
}
```

### Revenue Split:
- 80% to artist
- 20% to platform
- Automatic monthly payouts

### Exclusive Content:
- Artists can upload exclusive tracks, videos, photos
- Content gated by tier level
- Members see content based on their subscription tier

---

## 🎯 Quick Integration Examples

### Add Tip Button to Band Profile:
```tsx
import { useState } from 'react'

function TipButton({ artistId, artistName }) {
  const [loading, setLoading] = useState(false)

  const handleTip = async () => {
    setLoading(true)
    const response = await fetch('/api/v1/tips/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artistId,
        amount: 5.00,
      }),
    })
    const { paymentUrl } = await response.json()
    window.location.href = paymentUrl
  }

  return (
    <button onClick={handleTip} disabled={loading}>
      Tip {artistName} $5
    </button>
  )
}
```

### Add Song Request Priority:
```tsx
function SongRequestButton({ mediaId, trackTitle, artistName }) {
  const handleRequest = async (priority: string) => {
    const response = await fetch('/api/v1/song-requests/priority', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        mediaId,
        priority,
        trackTitle,
        artistName,
      }),
    })
    const { url } = await response.json()
    if (url) {
      window.location.href = url // Stripe checkout
    }
  }

  return (
    <div>
      <button onClick={() => handleRequest('play_next')}>
        Play Next ($5)
      </button>
      <button onClick={() => handleRequest('play_now')}>
        Play Now ($10)
      </button>
    </div>
  )
}
```

### Track Analytics Event:
```tsx
// In component
const trackPlay = async (bandId: string, mediaId: number) => {
  await fetch('/api/v1/analytics/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType: 'track_play',
      bandId,
      mediaId,
    }),
  })
}
```

---

## 📋 Environment Variables Checklist

```bash
# Required
STRIPE_SECRET_KEY=sk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Already configured
X_API_Key=57d979c6a7ba6cb7:9bc9173e1ad3904e851a16e8266deac5

# Optional (for full social media automation)
TWITTER_API_KEY=...
INSTAGRAM_API_KEY=...
FACEBOOK_API_KEY=...
```

---

## 🚀 Next Steps

1. **Run Database Migrations**
   - Apply all three migration files in Supabase

2. **Set Up Stripe**
   - Create account and get keys
   - Configure webhook endpoint
   - Create price IDs for subscriptions

3. **Test Features**
   - Test AzuraCast upload with real file
   - Test Stripe checkout flow
   - Test webhook handling

4. **Build UI Components**
   - Tip buttons
   - Song request priority UI
   - Analytics dashboard
   - Fan club subscription UI

5. **Configure Social Media**
   - Set up OAuth for each platform
   - Test automated posting

---

**All backend infrastructure is complete and ready for frontend integration!**

