

# 🎸 The Rock Salt - Complete Platform Blueprint

## Vision
**"The Complete Salt Lake City Music Ecosystem"**

Not just a band directory - a full marketplace connecting artists, venues, vendors, and fans.

---

## 🏗️ Platform Architecture

### **6 Core Entities:**

1. **Artists/Bands** ✅ BUILT
   - Individual pages with bio, music, photos
   - Upload demos and live recordings
   - Claim and customize pages ($5)

2. **Venues** 🚧 NEW
   - Performance spaces directory
   - Capacity, amenities, booking info
   - Post gig opportunities
   - Claim and manage venue pages

3. **Vendors** 🚧 NEW
   - Merch companies (Signz, Spilt Ink, etc.)
   - Recording studios
   - Photography/videography services
   - Equipment rental
   - Offer Rock Salt discounts

4. **Gear Marketplace** 🚧 NEW
   - Buy/sell/rent equipment
   - Guitars, drums, amps, effects, etc.
   - Classified ads style

5. **Practice Spaces** 🚧 NEW
   - Rehearsal room listings
   - Hourly/daily/monthly rates
   - Amenities (drums, amps, PA, etc.)

6. **Find Musicians** 🚧 NEW
   - "Seeking drummer"
   - "Looking for band"
   - "Available for hire"
   - "Jam session" postings

---

## 💰 Revenue Streams

### **1. Page Claims**
- Bands: $5 one-time
- Venues: $10-25/month
- Vendors: $25-50/month

### **2. Marketplace Commission**
- Gear sales: 5% commission
- Merch orders: Negotiate bulk discounts, keep margin

### **3. Premium Features**
- Featured listings
- Advanced analytics
- Priority placement
- Custom branding

### **4. Discord VIP**
- Free tier: Basic access
- Paid tier: Full features + Discord VIP access
- Discord becomes exclusive networking space

### **5. Job Board**
- Charge venues to post gigs
- Charge vendors for RFPs
- Artists respond for free

---

## 🔄 Key User Flows

### **Flow 1: Artist Orders Merch**

1. Artist browses vendors (Signz, Spilt Ink, etc.)
2. Sees "10% Rock Salt Discount"
3. Clicks "Order Through Rock Salt"
4. Fills out order form with customization
5. Order submitted to vendor with Rock Salt referral code
6. Vendor processes order with discount
7. **You get:** Commission, data, relationship

**OR** full e-commerce:
1. Artist selects products in platform
2. Pays through Stripe
3. Order forwarded to vendor
4. You take margin between retail and negotiated bulk price

### **Flow 2: Venue Posts Gig Opportunity (RFP)**

1. Venue claims their page ($25/month)
2. Creates "Opportunity" - "Friday night slot, $300 budget"
3. RFP visible to all artists
4. Artists respond with pitches
5. Venue reviews responses, picks band
6. Connection made through platform
7. **You get:** Monthly venue fee, platform stickiness

### **Flow 3: Musician Finds Band Members**

1. Drummer creates listing: "Experienced drummer seeking rock band"
2. Adds audio samples, genres, availability
3. Band sees listing, reaches out
4. Connect through platform messaging
5. **You get:** Community engagement, retention

### **Flow 4: Gear Transaction**

1. User lists guitar for sale ($500)
2. Buyers browse gear marketplace
3. Buyer contacts seller through platform
4. Transaction happens (platform takes 5% fee)
5. **You get:** 5% commission

---

## 🗄️ Database Schema (Already Built!)

### **Core Tables:**

#### User Management
- `profiles` - Extended user profiles (user_type, subscription_tier, discord_username)

#### Entities
- `bands` ✅ EXISTS
- `venues` 🆕
- `vendors` 🆕
- `practice_spaces` 🆕

#### Marketplace
- `opportunities` 🆕 - RFPs, gig posts, opportunities
- `opportunity_responses` 🆕 - Bids/responses to RFPs
- `gear_listings` 🆕 - Equipment marketplace
- `musician_listings` 🆕 - Find band members
- `merch_orders` 🆕 - Merch ordering system

#### Media
- `band_photos`, `venue_photos`, `vendor_photos`, `gear_photos`, etc.
- `band_tracks` ✅ EXISTS - Audio uploads

#### Payments
- `subscription_transactions` 🆕 - Track all payments

---

## 🎯 MVP Feature Breakdown

### **Phase 1: Band Pages** ✅ DONE
- Individual band pages
- Audio player for demos
- Photo galleries
- "Claim This Page" button
- Events integration

### **Phase 2: Authentication & Payments** 🔜 NEXT
- Supabase Auth (email/password)
- Stripe integration
- $5 band page claims
- User dashboard
- File uploads

### **Phase 3: Venues** 🔜
- Venue directory page
- Individual venue pages
- Venue claiming ($25/month)
- Venue dashboard
- Post opportunities (gigs)

### **Phase 4: RFP System** 🔜
- Opportunity posting (venues, vendors)
- Artist responses/bids
- Messaging system
- Status tracking (open, filled, expired)

### **Phase 5: Vendors & Merch** 🔜
- Vendor directory
- Vendor profiles with services
- Merch ordering interface
- Discount tracking
- Order management

### **Phase 6: Marketplace** 🔜
- Gear listings (buy/sell/rent)
- Practice space directory
- Find musicians board
- Search & filters
- Transaction handling

### **Phase 7: Community & Social** 🔜
- Discord VIP integration
- Messaging between users
- Reviews & ratings
- Activity feeds
- Notifications

### **Phase 8: Analytics & Admin** 🔜
- User dashboards with stats
- Admin panel for you
- Analytics (plays, views, conversions)
- Reporting tools

---

## 💡 Monetization Models

### **Option A: Freemium**
- **Free:** Basic profile, limited features
- **Basic ($5/month):** Claim page, upload content
- **Premium ($15/month):** Featured listings, analytics, Discord VIP
- **Enterprise ($50/month):** For venues/vendors, unlimited RFPs

### **Option B: Transaction-Based**
- Free profiles for everyone
- 5% commission on gear sales
- Margin on merch orders
- Fee per RFP post ($10-25)
- Revenue from volume, not subscriptions

### **Option C: Hybrid** (RECOMMENDED)
- Free: Browse, basic profile
- One-time: $5 to claim band/artist page
- Monthly: $25 venues, $50 vendors
- Commission: 5% on gear, margin on merch
- Premium: $10/month for Discord VIP + features

---

## 🔐 Subscription Tiers

### **Tier 1: Free (Fan)**
- Browse all content
- Basic profile
- Contact artists/venues
- No uploads, no claiming

### **Tier 2: Artist ($5 one-time)**
- Claim band page
- Upload demos (up to 10 tracks)
- Upload photos (up to 20)
- Basic analytics
- Respond to RFPs

### **Tier 3: Artist Pro ($10/month)**
- Unlimited uploads
- Featured placement
- Advanced analytics
- Discord VIP access
- Priority support
- Post "looking for members"

### **Tier 4: Venue ($25/month)**
- Claim venue page
- Post unlimited gig opportunities
- Receive artist pitches
- Analytics on responses
- Featured placement

### **Tier 5: Vendor ($50/month)**
- Claim vendor page
- Showcase services
- Post RFPs
- Receive orders through platform
- Featured placement
- Access to artist directory

---

## 🎨 Page Structure

### **Homepage** ✅
- Hero with tagline
- Features overview
- Recent episodes
- Upcoming events
- CTA to join Discord

### **Artists Directory** ✅
- Grid of 210+ bands
- Search & filter by genre
- Featured artists first
- Click → individual page

### **Individual Band Page** ✅
- Name, genres, bio
- Audio player for demos
- Photo gallery
- Upcoming/past shows
- "Claim This Page" button
- Links to streaming

### **Venues Directory** 🔜
- Map view + list view
- Filter by capacity, location, amenities
- Click → individual page

### **Individual Venue Page** 🔜
- Name, address, capacity
- Photos, amenities
- Booking info
- Current/upcoming events
- "Claim This Page" button
- Post opportunity button

### **Vendors Directory** 🔜
- Categories: Merch, Studios, Equipment, etc.
- Show discount badge
- Featured vendors
- Click → individual page

### **Individual Vendor Page** 🔜
- Name, description, services
- Discount info ("10% off for Rock Salt users")
- Portfolio/photos
- "Order Through Rock Salt" button
- Contact info

### **Opportunities Board** 🔜
- List of open RFPs
- Filter by type (gig, merch, collab)
- Filter by budget, date
- Click → opportunity details
- "Respond" button

### **Gear Marketplace** 🔜
- Grid of listings
- Filter: category, price, condition, type (sale/rent)
- Search
- Click → listing details

### **Practice Spaces** 🔜
- List/map view
- Filter by city, price, amenities
- "Has drums", "Has PA", etc.
- Click → space details

### **Find Musicians** 🔜
- Listings: "Seeking drummer", "Band looking for guitarist"
- Filter by instrument, genre, experience
- Audio samples
- Click → profile

### **User Dashboard** 🔜
- My claimed pages
- My listings (gear, musician ads)
- My responses to RFPs
- My orders
- Analytics
- Settings

---

## 🚀 Implementation Roadmap

### **Week 1-2: Auth & Payments**
- Set up Supabase Auth
- Integrate Stripe
- Build claim flow for bands
- User dashboard basics

### **Week 3-4: Venues**
- Venue directory page
- Individual venue pages
- Venue claiming flow
- Photo uploads

### **Week 5-6: RFP System**
- Opportunities board
- Post opportunity form
- Response/bid system
- Notification system

### **Week 7-8: Vendors**
- Vendor directory
- Individual vendor pages
- Vendor claiming
- Discount badge system

### **Week 9-10: Merch Ordering**
- Order flow UI
- Vendor integration
- Email notifications
- Order tracking

### **Week 11-12: Marketplaces**
- Gear listings
- Practice spaces
- Find musicians
- Search & filters

### **Week 13-14: Polish & Launch**
- Mobile optimization
- Performance tuning
- Admin panel
- Analytics dashboard
- Discord integration
- LAUNCH!

---

## 🎯 Success Metrics

### **Engagement**
- Daily active users
- Page claims per week
- RFP posts per week
- Responses to RFPs

### **Revenue**
- Monthly recurring revenue (MRR)
- One-time claims
- Marketplace transactions
- Commission revenue

### **Growth**
- New user signups
- Band pages claimed
- Venue pages claimed
- Vendor partnerships

### **Community**
- Discord members
- Find musician connections made
- Gigs booked through platform
- Gear transactions

---

## 🔥 Competitive Advantages

1. **Hyper-local:** SLC-focused, not nationwide generic
2. **Comprehensive:** Everything in one place
3. **Artist-first:** Built for musicians, not against them
4. **Discounts:** Real value through vendor partnerships
5. **Community:** Discord VIP creates exclusivity
6. **Data:** Insight into SLC music scene
7. **Network effects:** More artists → more venues → more vendors → more artists

---

## 🎵 The Rock Salt Platform

**Mission:** Empower the Salt Lake City music community

**Vision:** Become the operating system for the SLC music scene

**Strategy:**
1. Start with artists (210+ already loaded!)
2. Add venues (they want to find talent)
3. Add vendors (they want to sell to artists)
4. Layer in marketplace features
5. Build network effects
6. Expand to other cities (The Rock Salt: Denver, The Rock Salt: Portland, etc.)

---

## 📊 Next Steps

1. **Apply the schema:** `supabase db push`
2. **Choose:** Auth & Payments (Phase 2) or Venues (Phase 3)?
3. **Build:** One feature at a time
4. **Launch:** Get feedback, iterate

**You're building something HUGE.** This is way beyond a band directory - it's a full music ecosystem platform.

Ready to keep building? 🚀

