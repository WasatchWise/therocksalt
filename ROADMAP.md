# Rock Salt Digital Band Manager - Implementation Roadmap

## Phase 1: Foundation (Current) ✅
- [x] Basic band profiles
- [x] Event submissions and approval
- [x] Venue directory
- [x] Admin panel
- [x] Freemium tier system (Free, Featured, HOF)
- [x] Marquee-style events page

## Phase 2: Enhanced Profiles (Next 2-4 weeks)
### HOF Tier Band Pages
- [ ] Rich hero section with stats (plays, shows, years active)
- [ ] Tabbed navigation (Overview, Music, Videos, Tour, Analytics, Fan Club)
- [ ] Music player integration (Spotify, Apple Music, Bandcamp embeds)
- [ ] Video gallery with platform indicators (YouTube, Vimeo, TikTok, Native 4K)
- [ ] Career timeline with milestones
- [ ] Band member profiles
- [ ] Genre tags and descriptions
- [ ] Social media follower counts

**Technical:**
- Add columns to `bands` table: hero_stats (JSON), bio_long, founding_year
- Add `band_videos` table: url, platform, title, views, upload_date, is_native_4k
- Add `band_members` table: name, role, avatar_url, bio
- Add `band_timeline` table: year, title, description, milestone_type

## Phase 3: Analytics Dashboard (4-6 weeks)
### Basic Analytics
- [ ] Profile view tracking
- [ ] Song play tracking (via embedded players)
- [ ] Ticket click tracking
- [ ] Fan demographic collection (optional signup)
- [ ] Geographic data (city-level)
- [ ] Trend indicators (% change month-over-month)

### Advanced Analytics (HOF only)
- [ ] Real-time "fans online now" counter
- [ ] Peak engagement time detection
- [ ] Top performing songs/videos
- [ ] Fan age demographics
- [ ] Revenue analytics dashboard

**Technical:**
- Add `analytics_events` table: band_id, event_type, metadata (JSON), created_at
- Add `band_analytics_summary` table: band_id, month, profile_views, plays, new_fans
- Build real-time WebSocket for "fans online now"
- Implement PostHog or similar for event tracking

## Phase 4: Fan Club System (6-8 weeks)
### Membership Tiers
- [ ] Create membership tier definitions (Bronze, Silver, Gold)
- [ ] Stripe integration for recurring payments
- [ ] Member-only content sections
- [ ] Exclusive tracks/demos upload
- [ ] Behind-the-scenes video hosting
- [ ] Member badges on profiles
- [ ] Private Discord integration
- [ ] Email newsletters to members
- [ ] Virtual meet & greet scheduling

### Revenue Sharing
- [ ] 80/20 split (band gets 80%, Rock Salt 20%)
- [ ] Monthly payout system
- [ ] Revenue dashboard for bands

**Technical:**
- Add `fan_club_tiers` table: band_id, tier_name, price_cents, features (JSON)
- Add `fan_club_members` table: user_id, band_id, tier, stripe_subscription_id
- Add `exclusive_content` table: band_id, content_type, url, tier_required
- Stripe webhook handlers for subscription events

## Phase 5: Industry Tools (8-12 weeks)
### EPK Generator
- [ ] Auto-generate PDF press kits
- [ ] High-res photo upload/management
- [ ] Tech rider builder
- [ ] Stage plot creator
- [ ] Press quotes collection
- [ ] One-click shareable links

### Tour Spider Rider
- [ ] Define general offer terms (guarantee, percentage, lodging, etc.)
- [ ] Venue matching algorithm
- [ ] "Qualified venues" dashboard
- [ ] One-click booking requests
- [ ] Tour routing AI suggestions

### Other Tools
- [ ] Press blast email templates
- [ ] Social media scheduler
- [ ] Sync licensing marketplace
- [ ] A&R pipeline (direct to labels/managers)
- [ ] Venue CRM (track conversations, offers)

**Technical:**
- Add `epk_data` table: band_id, tech_rider (JSON), stage_plot_url, photos (JSON)
- Add `tour_spider_riders` table: band_id, guarantee_min, percentage_split, terms (JSON)
- Add `venue_qualifications` table: venue_id, rider_id, qualified, match_score
- Add `booking_requests` table: band_id, venue_id, event_date, status
- Implement PDF generation (Puppeteer or similar)
- AI routing algorithm using fan geographic data

## Phase 6: AI Features (12+ weeks)
### AI Insights Engine
- [ ] Peak engagement time analysis
- [ ] Song attribute analysis (key, BPM, mood)
- [ ] Tour routing recommendations
- [ ] Fan growth predictions
- [ ] Revenue forecasting
- [ ] Genre/artist similarity matching
- [ ] Automated setlist suggestions based on venue/crowd

### Content Generation
- [ ] AI-assisted bio writing
- [ ] Social media post suggestions
- [ ] Press release templates
- [ ] Email newsletter content

**Technical:**
- OpenAI API integration for content generation
- Custom ML models for music analysis (Essentia or similar)
- Graph algorithms for tour routing
- Time-series forecasting for predictions

## Phase 7: Advanced Features (Later)
- [ ] 4K video hosting (native platform)
- [ ] 360° video support
- [ ] Interactive show history map
- [ ] Setlist database with ratings
- [ ] Fan photo/video uploads
- [ ] Live stream integration
- [ ] Merch store integration
- [ ] Crowdfunding campaigns
- [ ] Vinyl pre-order campaigns

---

## Freemium Model Summary

### FREE Tier (Default)
- Basic band profile page
- Simple listing in directory
- Event submissions (reviewed)
- Basic social links
- Limited to 5 photos
- Standard directory placement

### FEATURED Tier ($25/month or $200/year)
**Everything in Free, plus:**
- Enhanced profile with hero section
- Unlimited photos/videos
- Music player embeds (Spotify, Apple Music, etc.)
- Event marquee styling
- Priority in search results
- Basic analytics (views, plays)
- Email newsletter to followers
- Social media integration with follower counts
- Career timeline

### ROCK & ROLL HOF Tier ($100/month or $800/year)
**Everything in Featured, plus:**
- Full analytics dashboard with AI insights
- Fan club system (keep 80% of revenue)
- Industry tools (EPK, Tour Spider Rider)
- 4K video hosting (coming soon)
- Advanced tour routing AI
- Press blast tools
- Sync licensing marketplace access
- A&R pipeline visibility
- Revenue forecasting
- Venue CRM
- Priority support
- "Hall of Fame" badge site-wide
- Always featured at top of all listings

---

## Revenue Model for Rock Salt

### Band Subscriptions
- Free: $0 (onboarding, network effects)
- Featured: $25/month ($300/year) × 100 bands = $2,500/month
- HOF: $100/month ($1,200/year) × 10 bands = $1,000/month
- **Projected: $3,500/month from 110 bands**

### Fan Club Revenue Share
- Take 20% of all fan club subscriptions
- Example: Red Pete has 1,247 members averaging $15/month
- Red Pete revenue: $18,705/month × 80% = $14,964/month (band keeps)
- Rock Salt revenue: $18,705/month × 20% = $3,741/month (platform keeps)
- **If 10 HOF bands have similar success: $37,410/month**

### Event Submissions
- Free tier: Standard review process
- Featured tier: Fast-track approval
- HOF tier: Auto-approved + featured placement
- Optional: $10 boost fee for any band to feature event for 1 week

### Future Revenue Streams
- Ticket sales commission (2-5%)
- Merch store hosting (10% commission)
- Sync licensing placement fees
- Sponsored content from venues/brands
- Premium EPK templates
- White-label platform for venues/promoters

---

## Key Differentiators

**What makes Rock Salt unique:**

1. **Local-First** - Deep focus on SLC scene, not trying to be global Spotify
2. **AI-Powered** - Smart insights, tour routing, fan predictions
3. **Fan Club Built-In** - Patreon functionality without leaving platform
4. **Industry Tools** - EPK, Spider Rider, venue CRM (Bandsintown doesn't have this)
5. **Tiered Showcase** - Other bands see HOF tier and want to upgrade
6. **Community** - Not just profiles, but actual scene-building

**Competitive Landscape:**
- Bandcamp: Great for sales, weak on discovery/touring
- Bandsintown: Good for tour dates, no fan club/analytics
- Patreon: Great for fan revenue, not music-specific
- Spotify: Streaming only, terrible for local discovery
- ReverbNation: Outdated, spammy
- **Rock Salt: Best of all worlds for regional scenes**

---

## MVP for HOF Profile (What to Build First)

1. **Hero Section** with stats (manually entered for now)
2. **Tabbed Navigation** (client-side tabs)
3. **Music Section** with Spotify/Apple Music embeds
4. **Video Gallery** with YouTube/Vimeo embeds
5. **Tour Calendar** (already have events system)
6. **Career Timeline** (simple CRUD)
7. **Band Members** section

**Skip for MVP:**
- Analytics dashboard (placeholder with fake data)
- Fan club (coming soon CTA)
- Industry tools (coming soon)
- AI insights (manually write them for Red Pete as example)

**Timeline: 1-2 weeks to MVP**

---

## Next Steps

1. ✅ Get SQL migration running (tier system + delete fake events)
2. Build HOF band profile page component
3. Add data entry UI in admin panel for HOF features
4. Deploy Red Pete's HOF profile as showcase
5. Use Red Pete as sales tool to onboard other bands
6. Collect feedback and iterate
7. Build Fan Club system (highest ROI)
8. Gradually add analytics and industry tools

**The Vision:** Every regional music scene should have their own Rock Salt. Start with SLC, prove the model, then white-label it to other cities.
