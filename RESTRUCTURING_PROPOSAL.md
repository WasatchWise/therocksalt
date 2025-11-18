# The Rock Salt - Comprehensive Restructuring Proposal

**Goal:** Restructure the entire platform to optimize for user experience, developer productivity, and business growth.

---

## 🎯 Core Philosophy: User-Centric Architecture

**Three User Types:**
1. **Fans** - Discover music, save bands, attend shows
2. **Artists** - Manage profiles, submit music, book shows
3. **Venues** - Post opportunities, manage bookings

**Current Problem:** The platform treats all users the same, making it hard to find relevant features.

---

## 📐 Proposed New Structure

### 1. Feature-Based Architecture (Not Page-Based)

**Current Structure:**
```
src/app/
  ├── bands/
  ├── venues/
  ├── events/
  ├── submit/
  ├── admin/
  └── dashboard/
```

**Proposed Structure:**
```
src/
├── app/
│   ├── (marketing)/          # Public marketing pages
│   │   ├── page.tsx          # Homepage
│   │   ├── about/
│   │   └── pricing/
│   │
│   ├── (discover)/           # Discovery features (fans)
│   │   ├── artists/          # Renamed from "bands"
│   │   ├── venues/
│   │   ├── events/
│   │   ├── radio/
│   │   └── search/
│   │
│   ├── (artist)/             # Artist features
│   │   ├── dashboard/
│   │   ├── profile/
│   │   ├── music/
│   │   ├── bookings/
│   │   └── analytics/
│   │
│   ├── (venue)/              # Venue features
│   │   ├── dashboard/
│   │   ├── opportunities/
│   │   └── calendar/
│   │
│   ├── (auth)/               # Authentication
│   │   └── auth/
│   │
│   └── api/                   # API routes
│       ├── v1/
│       │   ├── artists/
│       │   ├── venues/
│       │   ├── events/
│       │   └── analytics/
│       └── webhooks/
│
├── features/                  # Feature modules (NEW!)
│   ├── discovery/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   │
│   ├── artist-profile/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   │
│   ├── bookings/
│   │   ├── spider-rider/
│   │   └── booking-requests/
│   │
│   ├── submissions/
│   │   ├── music/
│   │   └── events/
│   │
│   ├── monetization/
│   │   ├── subscriptions/
│   │   ├── payments/
│   │   └── tiers/
│   │
│   └── analytics/
│       ├── tracking/
│       └── dashboard/
│
├── components/
│   ├── ui/                    # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Modal.tsx
│   │
│   ├── layout/                # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   │
│   ├── features/              # Feature-specific components
│   │   ├── ArtistCard.tsx
│   │   ├── EventCard.tsx
│   │   └── VenueCard.tsx
│   │
│   └── shared/                # Shared utilities
│       ├── Logo.tsx
│       └── Container.tsx
│
└── lib/
    ├── supabase/
    ├── analytics/             # NEW: Analytics tracking
    ├── payments/              # NEW: Stripe integration
    ├── validation/            # NEW: Zod schemas
    └── utils/
```

---

## 🎨 User Experience Restructuring

### 2. Homepage Redesign: Clear Value Proposition

**Current Issues:**
- Too many CTAs competing for attention
- No clear user journey
- Radio player buried in middle
- Submission form uses external Google Form

**Proposed Homepage Structure:**

```
┌─────────────────────────────────────┐
│  Hero Section                        │
│  - Clear tagline                     │
│  - Primary CTA (role-based)          │
│  - Live radio player (prominent)     │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Quick Actions (Role-Based)         │
│  [For Fans]    [For Artists] [For Venues] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Featured Content                    │
│  - Featured Artists (3-6)            │
│  - Upcoming Events (5-10)            │
│  - Recent Radio Episodes (3-5)       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Community Stats                     │
│  - 210+ Artists                      │
│  - 50+ Venues                        │
│  - 1000+ Shows                       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Call to Action                      │
│  - Join as Artist / Venue            │
│  - Subscribe to Newsletter           │
└─────────────────────────────────────┘
```

**Key Changes:**
1. **Role-Based CTAs** - Different homepage for fans vs artists vs venues
2. **Prominent Radio Player** - Move to top, make it sticky
3. **Integrated Submission** - Replace Google Form with internal form
4. **Clear Navigation** - Feature discovery, not just links

### 3. Navigation Restructuring

**Current Navigation:**
```
Home | Listen Live | Artists | Venues | Radio Episodes | Events | About
```

**Proposed Navigation (Context-Aware):**

**For Unauthenticated Users:**
```
[Logo]  Discover  Radio  Events  About  [Sign In] [Join]
```

**For Artists (Authenticated):**
```
[Logo]  Discover  Radio  Events  [My Profile] [Bookings] [Analytics] [Upgrade]
```

**For Venues (Authenticated):**
```
[Logo]  Discover  Radio  Events  [Venue Dashboard] [Post Opportunity] [Upgrade]
```

**Key Changes:**
1. **Simplified Top Nav** - Only essential links
2. **Context-Aware** - Different nav based on user role
3. **Quick Actions** - Most-used features accessible
4. **Upgrade CTA** - Always visible for monetization

### 4. User Dashboard Restructuring

**Current:** Single `/dashboard` page

**Proposed:** Role-Specific Dashboards

**Artist Dashboard:**
```
┌─────────────────────────────────────┐
│  Quick Stats                        │
│  - Profile Views (30 days)          │
│  - Track Plays (30 days)            │
│  - Upcoming Shows                   │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Quick Actions                       │
│  [Upload Music] [Add Show] [Update Profile] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Recent Activity                     │
│  - New fans saved your band          │
│  - Venue accepted your Spider Rider   │
│  - New booking request               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Upgrade Prompt (if not HOF)        │
│  "Unlock analytics, fan club, and more" │
└─────────────────────────────────────┘
```

**Venue Dashboard:**
```
┌─────────────────────────────────────┐
│  Quick Stats                        │
│  - Upcoming Shows                   │
│  - Pending Booking Requests         │
│  - Active Opportunities             │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Quick Actions                       │
│  [Post Opportunity] [View Calendar] [Manage Bookings] │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Recent Activity                     │
│  - New booking request from [Band]   │
│  - Artist submitted Spider Rider     │
└─────────────────────────────────────┘
```

---

## 🏗️ Component Architecture Restructuring

### 5. Break Down Large Components

**Current Problem:**
- `MusicSubmissionForm.tsx` - 663 lines
- `BandCard.tsx` - Complex with multiple variants

**Proposed Solution:**

**MusicSubmissionForm → Feature Module:**
```
features/submissions/music/
├── components/
│   ├── MusicSubmissionForm.tsx        # Main form (orchestrator)
│   ├── BandInfoSection.tsx           # Band name, bio, genres
│   ├── ContactInfoSection.tsx        # Email, phone, location
│   ├── MusicUploadSection.tsx        # Track uploads
│   ├── PhotoUploadSection.tsx        # Photo uploads
│   ├── SocialLinksSection.tsx        # Social media links
│   └── ReviewSection.tsx              # Review before submit
│
├── hooks/
│   ├── useMusicSubmission.ts         # Form state management
│   └── useFileUpload.ts              # File upload logic
│
├── lib/
│   ├── validation.ts                 # Zod schemas
│   └── submission.ts                 # Submission logic
│
└── types/
    └── submission.ts
```

**BandCard → Multiple Variants:**
```
components/features/
├── ArtistCard/
│   ├── ArtistCard.tsx                # Main component
│   ├── ArtistCardCompact.tsx         # Small variant
│   ├── ArtistCardFeatured.tsx        # Large featured variant
│   └── ArtistCardSkeleton.tsx        # Loading state
```

### 6. Shared UI Component Library

**Create Base Components:**
```
components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.stories.tsx            # Storybook
│   └── Button.test.tsx
│
├── Card/
│   ├── Card.tsx
│   ├── CardHeader.tsx
│   ├── CardBody.tsx
│   └── CardFooter.tsx
│
├── Form/
│   ├── Input.tsx
│   ├── Textarea.tsx
│   ├── Select.tsx
│   ├── Checkbox.tsx
│   └── Radio.tsx
│
├── Modal/
│   ├── Modal.tsx
│   ├── ModalHeader.tsx
│   └── ModalFooter.tsx
│
└── Loading/
    ├── Spinner.tsx
    ├── Skeleton.tsx
    └── ProgressBar.tsx
```

**Benefits:**
- Consistent design system
- Reusable across features
- Easier to maintain
- Better testing

---

## 🔄 Feature Module System

### 7. Feature-Based Organization

**Each Feature is Self-Contained:**

```
features/discovery/
├── components/
│   ├── ArtistGrid.tsx
│   ├── ArtistFilters.tsx
│   └── SearchBar.tsx
│
├── hooks/
│   ├── useArtistSearch.ts
│   └── useFilters.ts
│
├── lib/
│   ├── queries.ts                   # Feature-specific queries
│   └── filters.ts
│
├── types/
│   └── discovery.ts
│
└── page.tsx                          # Feature page (if needed)
```

**Benefits:**
- Clear boundaries
- Easy to find code
- Can be extracted to separate package
- Better code splitting

### 8. API Route Organization

**Current:**
```
app/api/
├── tracks/[trackId]/play/
├── now-playing/
└── spider-rider/
```

**Proposed:**
```
app/api/
├── v1/                               # Versioned API
│   ├── artists/
│   │   ├── route.ts                  # GET /api/v1/artists
│   │   ├── [id]/
│   │   │   ├── route.ts              # GET /api/v1/artists/:id
│   │   │   ├── tracks/
│   │   │   │   └── route.ts          # GET /api/v1/artists/:id/tracks
│   │   │   └── analytics/
│   │   │       └── route.ts          # GET /api/v1/artists/:id/analytics
│   │   └── search/
│   │       └── route.ts              # GET /api/v1/artists/search
│   │
│   ├── venues/
│   │   ├── route.ts
│   │   └── [id]/
│   │       ├── route.ts
│   │       └── opportunities/
│   │           └── route.ts
│   │
│   ├── events/
│   │   ├── route.ts
│   │   └── [id]/
│   │       └── route.ts
│   │
│   ├── analytics/
│   │   ├── track/
│   │   │   └── route.ts              # POST /api/v1/analytics/track
│   │   └── events/
│   │       └── route.ts              # GET /api/v1/analytics/events
│   │
│   └── bookings/
│       ├── spider-riders/
│       │   └── route.ts
│       └── requests/
│           └── route.ts
│
└── webhooks/
    ├── stripe/
    │   └── route.ts
    └── supabase/
        └── route.ts
```

**Benefits:**
- RESTful structure
- Versioned API
- Clear organization
- Easy to document

---

## 💰 Monetization Flow Restructuring

### 9. Clear Upgrade Path

**Current:** Tier system exists in DB but no UI

**Proposed Upgrade Flow:**

```
Artist Profile Page
  ↓
[Upgrade to Garage] button (if anon)
  ↓
Upgrade Modal
  ├── Compare Tiers
  ├── Select Tier
  └── [Checkout with Stripe]
  ↓
Success Page
  ├── Welcome message
  ├── Feature unlock animation
  └── [Go to Dashboard]
```

**Tier Comparison Component:**
```
components/monetization/
├── TierComparison.tsx
├── TierCard.tsx
├── UpgradeButton.tsx
└── FeatureList.tsx
```

### 10. Subscription Management

**Artist Dashboard → Settings → Subscription:**
```
┌─────────────────────────────────────┐
│  Current Plan: Garage ($9/mo)       │
│  [Upgrade to Headliner]              │
│  [Cancel Subscription]               │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  Billing History                     │
│  - Jan 2025: $9.00                   │
│  - Dec 2024: $9.00                   │
└─────────────────────────────────────┘
```

---

## 📊 Analytics Integration

### 11. Analytics Throughout

**Create Analytics Module:**
```
lib/analytics/
├── client.ts                          # Analytics client
├── events.ts                          # Event definitions
├── track.ts                           # Track function
└── providers/
    ├── plausible.ts                   # Plausible integration
    ├── posthog.ts                     # PostHog integration
    └── ga4.ts                         # Google Analytics 4
```

**Track Everything:**
```typescript
// User actions
track('band_saved', { bandId, bandName })
track('track_played', { trackId, trackName })
track('profile_viewed', { profileId, profileType })

// Business events
track('subscription_started', { tier, price })
track('booking_requested', { bandId, venueId })
track('music_submitted', { bandName })

// Errors
track('error', { message, stack, url })
```

**Analytics Dashboard:**
```
features/analytics/
├── components/
│   ├── AnalyticsDashboard.tsx
│   ├── MetricCard.tsx
│   ├── Chart.tsx
│   └── DateRangePicker.tsx
│
└── lib/
    └── queries.ts                    # Analytics queries
```

---

## 🚀 Implementation Plan

### Phase 1: Foundation (Week 1-2)

1. **Create Feature Module Structure**
   ```bash
   mkdir -p src/features/{discovery,artist-profile,bookings,submissions,monetization,analytics}
   ```

2. **Create UI Component Library**
   ```bash
   mkdir -p src/components/ui/{Button,Card,Form,Modal,Loading}
   ```

3. **Set Up Analytics**
   - Install Plausible or PostHog
   - Create analytics module
   - Add tracking to key actions

4. **Restructure API Routes**
   - Move to `/api/v1/` structure
   - Add versioning

### Phase 2: Component Refactoring (Week 3-4)

1. **Break Down Large Components**
   - Split `MusicSubmissionForm`
   - Refactor `BandCard` variants
   - Extract shared logic

2. **Create Shared UI Components**
   - Button, Card, Input, Modal
   - Loading states
   - Error boundaries

3. **Implement Feature Modules**
   - Move discovery code to `features/discovery`
   - Move artist profile code to `features/artist-profile`

### Phase 3: User Experience (Week 5-6)

1. **Redesign Homepage**
   - Role-based CTAs
   - Prominent radio player
   - Integrated submission form

2. **Restructure Navigation**
   - Context-aware nav
   - Simplified structure
   - Quick actions

3. **Create Role-Specific Dashboards**
   - Artist dashboard
   - Venue dashboard
   - Fan dashboard (if needed)

### Phase 4: Monetization (Week 7-8)

1. **Implement Stripe Integration**
   - Checkout flow
   - Subscription management
   - Webhook handlers

2. **Build Upgrade UI**
   - Tier comparison
   - Upgrade modals
   - Success pages

3. **Add Subscription Management**
   - Settings page
   - Billing history
   - Cancel flow

### Phase 5: Polish & Optimization (Week 9-10)

1. **Performance Optimization**
   - Code splitting
   - Lazy loading
   - Image optimization

2. **Analytics Dashboard**
   - Build dashboard UI
   - Connect to tracking
   - Add charts

3. **Testing & Documentation**
   - Write tests
   - Update docs
   - Create migration guide

---

## 📁 Detailed File Structure

### Complete Proposed Structure

```
src/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # New homepage
│   │   ├── about/
│   │   │   └── page.tsx
│   │   └── pricing/
│   │       └── page.tsx
│   │
│   ├── (discover)/
│   │   ├── layout.tsx
│   │   ├── artists/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── venues/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── events/
│   │   │   └── page.tsx
│   │   ├── radio/
│   │   │   ├── page.tsx
│   │   │   └── episodes/
│   │   │       └── page.tsx
│   │   └── search/
│   │       └── page.tsx
│   │
│   ├── (artist)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── edit/
│   │   │       └── page.tsx
│   │   ├── music/
│   │   │   ├── page.tsx
│   │   │   └── upload/
│   │   │       └── page.tsx
│   │   ├── bookings/
│   │   │   ├── page.tsx
│   │   │   └── spider-rider/
│   │   │       └── page.tsx
│   │   └── analytics/
│   │       └── page.tsx
│   │
│   ├── (venue)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── opportunities/
│   │   │   ├── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── calendar/
│   │       └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   └── auth/
│   │       ├── signin/
│   │       ├── signup/
│   │       └── ...
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── artists/
│   │   │   ├── venues/
│   │   │   ├── events/
│   │   │   ├── analytics/
│   │   │   └── bookings/
│   │   └── webhooks/
│   │
│   ├── layout.tsx
│   ├── globals.css
│   └── error.tsx
│
├── features/
│   ├── discovery/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   │
│   ├── artist-profile/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── types/
│   │
│   ├── bookings/
│   │   ├── spider-rider/
│   │   └── booking-requests/
│   │
│   ├── submissions/
│   │   ├── music/
│   │   └── events/
│   │
│   ├── monetization/
│   │   ├── subscriptions/
│   │   ├── payments/
│   │   └── tiers/
│   │
│   └── analytics/
│       ├── tracking/
│       └── dashboard/
│
├── components/
│   ├── ui/
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Form/
│   │   ├── Modal/
│   │   └── Loading/
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx
│   │   └── Navigation.tsx
│   │
│   ├── features/
│   │   ├── ArtistCard/
│   │   ├── EventCard/
│   │   └── VenueCard/
│   │
│   └── shared/
│       ├── Logo.tsx
│       └── Container.tsx
│
└── lib/
    ├── supabase/
    ├── analytics/
    ├── payments/
    ├── validation/
    └── utils/
```

---

## 🎯 Key Benefits of This Restructure

### For Users:
1. **Clearer Navigation** - Find what you need faster
2. **Role-Specific Experience** - Different UI for artists vs venues vs fans
3. **Better Onboarding** - Clear upgrade path
4. **Faster Performance** - Code splitting by feature

### For Developers:
1. **Easier to Find Code** - Feature-based organization
2. **Better Maintainability** - Smaller, focused components
3. **Reusable Components** - Shared UI library
4. **Clearer Boundaries** - Feature modules are self-contained

### For Business:
1. **Better Monetization** - Clear upgrade path
2. **Analytics Everywhere** - Track everything
3. **Scalable Architecture** - Easy to add features
4. **Better Conversion** - Role-based CTAs

---

## 🚦 Migration Strategy

### Gradual Migration (Not Big Bang)

**Step 1:** Create new structure alongside old
**Step 2:** Migrate one feature at a time
**Step 3:** Update routes gradually
**Step 4:** Remove old code once migrated

**Example Migration:**
```typescript
// Old: src/app/bands/page.tsx
// New: src/app/(discover)/artists/page.tsx

// Keep both during migration
// Redirect old route to new route
// Remove old route after analytics show no traffic
```

---

## 📝 Next Steps

1. **Review this proposal** with team
2. **Prioritize features** to migrate first
3. **Create migration tickets** for each feature
4. **Set up analytics** before migration
5. **Start with homepage** (highest impact)
6. **Migrate one feature** at a time
7. **Measure impact** after each migration

---

**This restructure will make The Rock Salt:**
- ✅ More user-friendly
- ✅ Easier to develop
- ✅ Better for monetization
- ✅ More scalable
- ✅ More maintainable

**Estimated Timeline:** 10-12 weeks for full migration
**Risk Level:** Low (gradual migration)
**Impact Level:** High (better UX, DX, and business outcomes)

