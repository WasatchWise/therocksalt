# The Rock Salt - Agent Onboarding Guide

**Last Updated**: November 6, 2025
**Project Contact**: music@therocksalt.com
**Live Site**: https://www.therocksalt.com
**Mission**: Become the operating system for the Salt Lake City music scene

---

## 🎯 What Is The Rock Salt?

The Rock Salt is a **comprehensive digital platform for Salt Lake City's independent music community**. Think of it as a hybrid between Bandsintown, Bandcamp, and a local music directory - but specifically built for SLC.

### Core Value Proposition

1. **Band Directory**: 210+ local SLC bands with profiles, music, photos, social links
2. **Venue Directory**: Local venues with capacity, amenities, upcoming shows
3. **Event Calendar**: Comprehensive listing of live music events
4. **Live Radio**: Icecast streaming server for live DJ broadcasts
5. **Music Submission**: Artists can submit music for airplay consideration
6. **Spider Rider System** (Revolutionary): Pre-approval booking marketplace that eliminates cold-calling venues

### The Vision

Expand beyond SLC to become **"The Rock Salt: [City Name]"** in other markets (Denver, Portland, Austin, etc.) and become the de facto platform for independent music communities nationwide.

---

## 🏗️ Current Build Status

### ✅ **WORKING & DEPLOYED**

**Production URL**: https://www.therocksalt.com

#### Core Features (Live)
- ✅ Band directory with search/filter (210+ bands seeded)
- ✅ Individual band pages with bios, genres, social links
- ✅ Venue directory with detailed venue info
- ✅ Events calendar with upcoming shows
- ✅ Radio episodes archive (YouTube/Spotify integration)
- ✅ Music submission system (public form → admin review)
- ✅ Authentication (Supabase Auth - email/password)
- ✅ User profiles and saved bands (localStorage)
- ✅ Admin dashboard (basic music submission management)
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode support

#### Infrastructure
- **Frontend**: Next.js 15.5.4 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **Database**: 16+ tables with comprehensive schema
- **Testing**: Vitest + React Testing Library (setup complete)

#### Recent Additions (Nov 6, 2025)
- ✅ **Live Streaming**: Icecast server integration
  - Component: `src/components/LiveStreamPlayer.tsx`
  - Page: `src/app/live/page.tsx`
  - Server: Running on localhost:8000 (mount: `/rocksalt.mp3`)
  - Documentation: `LIVE_STREAM_SETUP.md`
- ✅ "Listen Live" button in header navigation (animated red badge)

### 🚧 **IN PROGRESS / PARTIALLY IMPLEMENTED**

#### Spider Rider System (Tables Built, UI Pending)
**Status**: Database schema complete, needs UI implementation

The most innovative feature - a pre-approval booking marketplace:
- **Problem**: Bands waste time cold-calling venues that may not want them
- **Solution**:
  1. Bands post general touring terms once (guarantee, tech rider, hospitality)
  2. Venues browse and pre-approve bands they want
  3. Bands request specific dates only at pre-approved venues
  4. No more rejection or cold calls!

**Tables**:
- `spider_riders`: Tour terms by band
- `spider_rider_acceptances`: Venue pre-approvals
- `booking_requests`: Date-specific booking requests

**Next Steps**: Build admin UI for managing Spider Rider listings

#### Subscription/Monetization (Tables Ready, Stripe Pending)
**Status**: Database schema complete, Stripe integration needed

**Tier System**:
- **Anon (Free)**: Basic profile, limited features
- **Garage ($9/mo)**: Claimed page, 10 tracks, 20 photos
- **Headliner ($29/mo)**: Unlimited uploads, featured placement
- **National Act ($79/mo)**: Enhanced analytics, Spider Rider access
- **Platinum ($149/mo)**: Priority support, advanced tools
- **Hall of Fame ($299/mo)**: All features, HOF badge

**Tables Ready**:
- `bands.tier` (enum with all tiers)
- `bands.stripe_customer_id`
- `bands.stripe_subscription_id`
- `bands.salt_rocks_balance` (virtual currency)

**Next Steps**: Implement Stripe checkout and subscription management

#### Analytics Dashboard (Placeholder)
**Status**: Data collection infrastructure needed

**Planned Metrics**:
- Profile views
- Track plays (API endpoint exists: `/api/tracks/[trackId]/play`)
- Geographic data
- Fan demographics
- Revenue tracking

### ❌ **NOT YET STARTED**

1. **Fan Club System** (Phase 4)
   - Membership tiers (Bronze, Silver, Gold)
   - Exclusive content
   - 80/20 revenue split (band keeps 80%)

2. **Livestream Management UI** (Phase 3)
   - Schedule shows
   - DJ profiles
   - Show archives
   - (Infrastructure ready via `livestreams` table)

3. **Industry Tools** (Phase 5)
   - EPK generator
   - Tech rider builder
   - Stage plot creator
   - Press blast templates

4. **Vendor Marketplace** (Phase 6)
   - Photographers, designers, studios
   - Service listings

5. **Gear Marketplace** (Future)
   - Buy/sell used equipment

---

## 📂 Project Structure

### Key Directories

```
/Users/johnlyman/Desktop/the-rock-salt/the-rock-salt/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage (currently full-featured)
│   │   ├── layout.tsx          # Root layout
│   │   ├── about/              # About page
│   │   ├── admin/              # Admin dashboard
│   │   │   ├── bands/
│   │   │   ├── venues/
│   │   │   └── music-submissions/
│   │   ├── auth/               # Auth pages (login, signup, callback)
│   │   ├── bands/              # Band directory & individual pages
│   │   │   └── [slug]/
│   │   ├── venues/             # Venue directory & pages
│   │   ├── events/             # Events calendar
│   │   ├── episodes/           # Radio episodes
│   │   ├── live/               # 🆕 Live stream page
│   │   ├── submit/             # Music submission form
│   │   ├── dashboard/          # User dashboard
│   │   ├── my-bands/           # Saved bands
│   │   └── spider-riders/      # Spider Rider marketplace (minimal)
│   │
│   ├── components/             # React components
│   │   ├── Header.tsx          # Navigation (includes "Listen Live")
│   │   ├── Footer.tsx
│   │   ├── Logo.tsx            # SVG logo component
│   │   ├── Container.tsx
│   │   ├── Button.tsx
│   │   ├── AudioPlayer.tsx     # Track player
│   │   ├── LiveStreamPlayer.tsx # 🆕 Live stream player
│   │   ├── BandCard.tsx
│   │   ├── BandSearchFilter.tsx
│   │   ├── SaveBandButton.tsx
│   │   ├── ClaimBandButton.tsx
│   │   ├── MusicSubmissionForm.tsx
│   │   ├── EventSubmissionForm.tsx
│   │   ├── SpiderRiderForm.tsx
│   │   ├── UploadPhotoForm.tsx
│   │   └── UploadTrackForm.tsx
│   │
│   ├── lib/                    # Utilities
│   │   ├── supabase/
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   └── queries.ts      # Database queries
│   │   ├── auth.ts
│   │   ├── rateLimit.ts        # (Upstash - placeholder)
│   │   └── savedBands.ts       # LocalStorage favorites
│   │
│   ├── hooks/
│   │   └── useAuth.ts
│   │
│   └── types/
│       ├── supabase.ts         # Generated types
│       ├── database.ts
│       └── submission.ts
│
├── supabase/
│   └── migrations/             # SQL migration files
│
├── public/                     # Static assets
│
├── .env.local                  # Environment variables
├── .env.production.local       # Production env vars
├── package.json
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### Important Files

**Configuration**:
- `.env.local` - Supabase keys, API keys
- `next.config.ts` - Next.js config (security headers, CSP)
- `middleware.ts` - Route protection (auth required for /dashboard, /admin)

**Documentation**:
- `ROADMAP.md` - Full feature roadmap and phases
- `PLATFORM_BLUEPRINT.md` - Vision and architecture
- `LIVE_STREAM_SETUP.md` - 🆕 Live streaming guide
- `BAND_MANAGER_BLUEPRINT.md` - Band management spec
- `FREEMIUM_TIER_PLAN.md` - Pricing strategy
- `SUBMISSION_FORM_README.md` - Music submission guide

---

## 🗄️ Database Schema (Supabase)

### Core Tables

**Bands & Artists**:
- `bands` - Band profiles (210+ seeded)
  - Columns: id, name, slug, bio, hometown, image_url, featured, claimed_by, tier, salt_rocks_balance, stripe fields
- `band_genres` - Genre tagging (many-to-many)
- `band_members` - Lineup with instruments
- `band_photos` - Photo galleries
- `band_tracks` - Audio files with play counts
- `band_links` - Social media links
- `musicians` - Individual musician profiles

**Venues & Events**:
- `venues` - Venue directory
- `events` - Shows and performances
- `event_bands` - Event lineups (junction table)

**Content**:
- `episodes` - Radio show episodes
- `livestreams` - Scheduled live broadcasts (schema ready, unused)
- `music_submissions` - User-submitted music
- `event_submissions` - User-submitted events

**Spider Rider System**:
- `spider_riders` - Band touring terms
- `spider_rider_acceptances` - Venue pre-approvals
- `booking_requests` - Date-specific requests

**User Management**:
- `profiles` - Extended user profiles (Supabase Auth integration)
- `admin_users` - Admin access control

**Assets**:
- `assets` - Generic file storage (audio, video, images, documents)

### Storage Buckets

- `band-photos` (5MB limit, images only)
- `band-music` (25MB limit, audio only)
- `event-flyers` (10MB limit)

### Row Level Security (RLS)

- **Public read** on most content (bands, venues, events)
- **Authenticated write** for claimed profiles
- **Admin override** for all operations
- **Anonymous submission** allowed for music

---

## 🔌 Environment Variables

### Required (.env.local)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yznquvzzqrvjafdfczak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[key]
SUPABASE_SERVICE_ROLE_KEY=[key]

# Optional (for rate limiting)
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here

# Live Streaming (production)
NEXT_PUBLIC_STREAM_URL=https://stream.therocksalt.com/rocksalt.mp3
```

### Production (.env.production.local)

Same as above, plus:
- Update `NEXT_PUBLIC_STREAM_URL` to production Icecast URL
- Add Stripe keys when implementing monetization

---

## 🚀 Where We Want to Go

### Short-Term Goals (Next 2-4 Weeks)

1. **Launch Simplified Homepage** ✅ IN PROGRESS
   - Logo
   - "Listen Live" button
   - Music submission form
   - Clean, simple design
   - Keep all other pages intact

2. **Complete Live Streaming Setup**
   - Test Icecast with real DJ
   - Document DJ onboarding process
   - Add scheduled shows to `/live` page

3. **Implement Stripe Subscriptions**
   - Checkout flow for tier upgrades
   - Subscription management in dashboard
   - Webhook handling for subscription events

4. **Build Spider Rider UI**
   - Band interface to create Spider Riders
   - Venue interface to browse and accept
   - Booking request workflow

### Medium-Term Goals (1-3 Months)

1. **Analytics Dashboard**
   - Track views, plays, engagement
   - Revenue tracking
   - Geographic insights

2. **Enhanced Admin Tools**
   - Content moderation
   - Featured content management
   - User management

3. **Marketing & Growth**
   - SEO optimization
   - Social media integration
   - Email campaigns (Resend or Mailgun)

4. **Mobile App** (Optional)
   - React Native wrapper
   - Push notifications for shows
   - Offline mode for saved content

### Long-Term Vision (6-12 Months)

1. **Multi-City Expansion**
   - Launch "The Rock Salt: Denver"
   - Launch "The Rock Salt: Portland"
   - Shared infrastructure, city-specific content

2. **Industry Tools Suite**
   - EPK generator
   - Tech rider builder
   - Contract templates

3. **Fan Club Platform**
   - Paid memberships
   - Exclusive content
   - Direct artist-to-fan monetization

4. **Vendor Marketplace**
   - Photographers, videographers
   - Studios, designers
   - Equipment rental

---

## 🎨 Features Planned for Future

### Phase 1: Foundation (✅ COMPLETE)
- Band/venue directories
- Event calendar
- Music submissions
- Basic authentication
- Admin dashboard

### Phase 2: Monetization (🚧 IN PROGRESS)
- Subscription tiers
- Payment processing (Stripe)
- Claimed profiles
- Upload limits by tier
- Featured placements

### Phase 3: Community (📋 PLANNED)
- Live streaming ✅
- Scheduled shows
- DJ profiles
- Chat integration (Discord embed)
- Real-time listener counts
- Show archives

### Phase 4: Engagement (📋 PLANNED)
- Fan clubs
- Exclusive content
- Merch integration
- Ticketing (partner with Eventbrite/Dice)
- Artist messaging

### Phase 5: Professional Tools (📋 FUTURE)
- EPK generator
- Press kit templates
- Tech rider builder
- Stage plot creator
- Contact management
- Tour routing

### Phase 6: Marketplace (📋 FUTURE)
- Vendor directory
- Service bookings
- Equipment rental/sales
- Collaboration board
- Session musicians

---

## 🛠️ Development Workflow

### Getting Started

```bash
# Navigate to project
cd /Users/johnlyman/Desktop/the-rock-salt/the-rock-salt

# Install dependencies (if needed)
yarn install

# Start development server
yarn dev

# Visit site
open http://localhost:3000
```

### Key Commands

```bash
# Development
yarn dev              # Start dev server
yarn build            # Production build
yarn start            # Production server
yarn lint             # Run ESLint
yarn test             # Run tests

# Database
supabase start        # Start local Supabase
supabase db reset     # Reset local DB
supabase migration new <name>  # Create migration
supabase db push      # Push migrations to remote
```

### Deployment

- **Platform**: Vercel (auto-deploys from main branch)
- **Build Command**: `yarn build`
- **Output Directory**: `.next`
- **Environment Variables**: Set in Vercel dashboard

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: your feature description"

# Push to GitHub
git push origin feature/your-feature-name

# Create PR on GitHub for review
```

---

## 🔐 Security & Best Practices

### Current Security Measures

1. **RLS Policies**: All tables have row-level security
2. **CSP Headers**: Content Security Policy configured
3. **Environment Variables**: Secrets in .env (not committed)
4. **Auth Middleware**: Protected routes require authentication
5. **Rate Limiting**: Infrastructure ready (Upstash placeholder)

### Known Issues / Technical Debt

1. **TypeScript Errors**: Build temporarily ignores TS errors
   - `next.config.ts`: `typescript.ignoreBuildErrors = true`
   - **TODO**: Fix and re-enable strict checking

2. **ESLint**: Build temporarily ignores ESLint
   - `next.config.ts`: `eslint.ignoreDuringBuilds = true`
   - **TODO**: Fix linting issues

3. **Rate Limiting**: Upstash Redis URLs are placeholders
   - **TODO**: Set up actual Upstash account and update env vars

4. **Passwords**: Icecast uses default passwords
   - **TODO**: Change before production deployment
   - Location: `/opt/homebrew/etc/icecast.xml`

5. **HTTPS Streaming**: Currently localhost only
   - **TODO**: Set up production streaming server with SSL

### Pre-Production Checklist

- [ ] Fix TypeScript errors
- [ ] Fix ESLint warnings
- [ ] Set up Upstash Redis
- [ ] Change Icecast passwords
- [ ] Set up production Icecast server with HTTPS
- [ ] Add Stripe keys
- [ ] Test all authentication flows
- [ ] Set up error tracking (Sentry?)
- [ ] Configure CORS for production domains
- [ ] Add robots.txt and sitemap.xml
- [ ] Set up analytics (PostHog, Plausible, or GA4)

---

## 📞 Support & Resources

### Contact

- **Email**: music@therocksalt.com
- **Discord**: https://discord.gg/aPDxxnPb
- **Website**: https://www.therocksalt.com

### External Dependencies

1. **Supabase** (Database & Auth)
   - Dashboard: https://supabase.com/dashboard
   - Project: yznquvzzqrvjafdfczak

2. **Vercel** (Hosting)
   - Dashboard: https://vercel.com/dashboard

3. **Icecast** (Streaming)
   - Local: http://localhost:8000/admin/
   - Admin: admin / rocksalt-admin

4. **Stripe** (Payments - TODO)
   - Not yet set up

### Useful Documentation

- Next.js 15: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Tailwind CSS 4: https://tailwindcss.com/docs
- Icecast: https://icecast.org/docs/

---

## 🧠 Key Insights for Next Agent

### What Makes This Project Special

1. **Hyper-Local Focus**: SLC-specific, not generic
2. **Spider Rider Innovation**: Genuinely solves a real problem
3. **Comprehensive Platform**: One-stop shop for local music
4. **Network Effects**: More artists → more venues → more fans → more artists
5. **Freemium Model**: Free tier drives adoption, paid tiers monetize power users

### Common Pitfalls to Avoid

1. **Don't over-engineer**: MVP features first, polish later
2. **Respect existing architecture**: Next.js App Router patterns are intentional
3. **Database first**: Schema is well-designed, use it
4. **Mobile matters**: Always test responsive design
5. **Performance**: Keep bundle size in check (check with `yarn build`)

### Quick Wins for Impact

1. Fix TypeScript errors (high visibility, builds trust)
2. Complete Spider Rider UI (unique differentiator)
3. Add Stripe checkout (revenue!)
4. Improve admin dashboard UX (client-facing tool)
5. Set up analytics (data-driven decisions)

---

## 📊 Current Metrics (as of Nov 6, 2025)

### Codebase Stats

- **Total Files**: ~34,000 (mostly node_modules)
- **Source Files**: ~100 TypeScript/React files
- **Database Tables**: 16+
- **Seeded Bands**: 210+
- **Components**: 20+ reusable React components
- **Pages/Routes**: 15+ public pages + admin area

### Performance

- **Lighthouse Score**: (Not yet measured - TODO)
- **Bundle Size**: (Check with `yarn build`)
- **API Response Time**: Fast (Supabase edge functions)

---

## 🎯 Immediate Next Steps (Current Sprint)

### Priority 1: Simplified Homepage ✅ IN PROGRESS
- Replace current homepage with minimal design
- Keep: Logo, "Listen Live" button, music submission form
- Deploy to production

### Priority 2: Live Streaming Polish
- Test with real DJ
- Document DJ onboarding
- Add show schedule to `/live` page

### Priority 3: Stripe Integration
- Set up Stripe account
- Implement checkout flow
- Add subscription management to dashboard

### Priority 4: Spider Rider UI
- Design band interface
- Design venue interface
- Implement booking request flow

---

## 💡 Philosophy & Guidelines

### User-Centric Design

- **For Artists**: Make profile management dead simple
- **For Venues**: Reduce booking friction
- **For Fans**: Discovery should be effortless
- **For Admins**: Powerful tools, minimal clicks

### Technical Principles

1. **Progressive Enhancement**: Works without JS where possible
2. **Mobile First**: Design for smallest screen, scale up
3. **Accessibility**: Semantic HTML, ARIA labels, keyboard nav
4. **Performance**: Code splitting, lazy loading, optimized images
5. **Security**: Trust nothing from client, validate everything

### Content Strategy

- **Quality > Quantity**: Curated local content beats generic nationwide
- **Community-Driven**: Let users submit, admins curate
- **Stories Matter**: Highlight artist stories, venue history
- **Visual Appeal**: Professional photos, clean design

---

## 🚨 Known Constraints & Limitations

### Technical Constraints

1. **No backend server**: Using Supabase for everything (edge functions if needed)
2. **Vercel limits**: Function timeout, bandwidth, etc.
3. **Icecast localhost**: Production streaming server needed
4. **No real-time yet**: Using polling, could upgrade to Supabase Realtime

### Business Constraints

1. **Budget**: Bootstrap mode, minimize paid services
2. **Team**: Small team, prioritize high-impact features
3. **Market**: SLC first, then expand

### Data Constraints

1. **210 bands**: Need ongoing content curation
2. **Venue data**: Manually curated, needs maintenance
3. **Events**: Rely on manual submissions initially

---

## 🎸 The Rock Salt Spirit

Remember: This isn't just a directory or a streaming service. It's a **community platform** for Salt Lake City's independent music scene. Every feature should answer:

1. **Does this help artists succeed?**
2. **Does this help fans discover music?**
3. **Does this reduce friction in the scene?**
4. **Would this make SLC's music community stronger?**

If the answer is yes, build it. If not, reconsider.

---

**Welcome to The Rock Salt. Let's make Salt Lake City's music scene thrive.** 🎸

---

*Last Updated: November 6, 2025*
*Next Review: When launching new major feature*
*Questions? music@therocksalt.com*
