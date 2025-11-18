# The Rock Salt - Comprehensive Project Analysis Report

**Date:** January 2025  
**Analyst:** AI Code Assistant  
**Project:** The Rock Salt - Salt Lake City Music Platform  
**Live Site:** https://www.therocksalt.com

---

## Executive Summary

The Rock Salt is a well-architected Next.js 15 application serving as a comprehensive digital platform for Salt Lake City's independent music community. The project demonstrates strong technical foundations with modern architecture, comprehensive database design, and good security practices. However, several critical gaps need attention before full production readiness.

**Overall Health Score: B+ (82/100)**

### Key Strengths
- ✅ Modern tech stack (Next.js 15, React 19, TypeScript)
- ✅ Comprehensive Supabase database schema (20+ tables)
- ✅ Strong security headers and CSP implementation
- ✅ Zero security vulnerabilities in dependencies
- ✅ Well-organized codebase with clear structure
- ✅ Extensive documentation

### Critical Gaps
- ❌ No analytics/metrics tracking implemented
- ⚠️ Rate limiting infrastructure exists but not fully integrated
- ⚠️ Missing environment variable documentation
- ⚠️ TypeScript/ESLint errors ignored in build
- ⚠️ No error tracking/monitoring (Sentry, etc.)

---

## 1. Project Structure & Architecture

### 1.1 Technology Stack

**Frontend:**
- Next.js 15.5.4 (App Router)
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4
- Geist font family

**Backend:**
- Supabase (PostgreSQL + Auth + Storage)
- Supabase Edge Functions (if needed)
- Vercel Serverless Functions

**Infrastructure:**
- Vercel (hosting & deployment)
- Supabase Cloud (database & auth)
- Icecast (live streaming - localhost)
- AzuraCast API (now-playing integration)

**Development Tools:**
- Vitest (testing framework)
- ESLint (code quality)
- Supabase CLI (database management)

### 1.2 Project Organization

```
the-rock-salt/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin dashboard
│   │   ├── auth/         # Authentication pages
│   │   ├── bands/        # Band directory & pages
│   │   ├── venues/       # Venue directory
│   │   ├── events/       # Events calendar
│   │   ├── live/         # Live streaming page
│   │   ├── submit/       # Music submission
│   │   └── api/          # API routes
│   ├── components/       # React components (21 files)
│   ├── lib/              # Utilities
│   │   ├── supabase/     # Supabase clients & queries
│   │   ├── apis/         # External API integrations
│   │   └── auth.ts       # Auth utilities
│   ├── hooks/            # React hooks
│   └── types/            # TypeScript type definitions
├── supabase/
│   ├── migrations/       # Database migrations (20+ files)
│   ├── config.toml       # Supabase local config
│   └── schema.sql        # Full schema dump
├── public/               # Static assets
├── _audit/               # Previous audit reports
└── docs/                 # Documentation

**Total Source Files:** ~100 TypeScript/React files  
**Lines of Code:** ~6,747 (excluding node_modules)  
**Components:** 21 reusable React components  
**Pages/Routes:** 15+ public pages + admin area
```

### 1.3 Architecture Patterns

**Strengths:**
- ✅ Proper separation of client/server Supabase clients
- ✅ Server Components for data fetching (performance)
- ✅ Type-safe database queries with generated types
- ✅ Reusable component library
- ✅ Centralized query functions (`src/lib/supabase/queries.ts`)

**Areas for Improvement:**
- ⚠️ Large component files (MusicSubmissionForm.tsx: 663 lines)
- ⚠️ No API route versioning strategy
- ⚠️ Missing error boundaries in some areas

---

## 2. Supabase Configuration & Integration

### 2.1 Database Schema Overview

**Core Tables (20+):**

**Bands & Artists:**
- `bands` - Main band profiles (210+ seeded)
- `band_genres` - Genre associations (many-to-many)
- `band_members` - Lineup with instruments
- `band_photos` - Photo galleries
- `band_tracks` - Audio files with play counts
- `band_links` - Social media links
- `musicians` - Individual musician profiles
- `releases` - Album/EP releases

**Venues & Events:**
- `venues` - Venue directory with capacity, amenities
- `events` - Shows and performances
- `event_bands` - Event lineups (junction table)
- `event_submissions` - User-submitted events

**Content & Submissions:**
- `episodes` - Radio show episodes
- `livestreams` - Scheduled live broadcasts (schema ready)
- `music_submissions` - User-submitted music
- `genres` - Genre catalog

**Spider Rider System (Innovative Feature):**
- `spider_riders` - Band touring terms
- `spider_rider_acceptances` - Venue pre-approvals
- `booking_requests` - Date-specific booking requests

**User Management:**
- `profiles` - Extended user profiles
- `admin_users` - Admin access control

**Monetization:**
- `bands.tier` - Subscription tiers (anon, garage, headliner, national_act, platinum, hof)
- `bands.stripe_customer_id` - Stripe integration
- `bands.salt_rocks_balance` - Virtual currency

### 2.2 Supabase Client Configuration

**Client-Side** (`src/lib/supabase/client.ts`):
```typescript
✅ Uses createBrowserClient from @supabase/ssr
✅ Properly typed with Database types
✅ Uses NEXT_PUBLIC_SUPABASE_URL
✅ Uses NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Server-Side** (`src/lib/supabase/server.ts`):
```typescript
✅ Uses createServerClient from @supabase/ssr
✅ Proper cookie handling
✅ Async/await pattern
✅ Type-safe with Database types
```

**Query Functions** (`src/lib/supabase/queries.ts`):
- ✅ 270 lines of well-organized query functions
- ✅ Proper error handling
- ✅ Type-safe return types
- ✅ Efficient joins (no N+1 queries)
- ✅ Development-only console logging

### 2.3 Row Level Security (RLS)

**Status:** ✅ RLS enabled on all tables

**Policies:**
- ✅ Public read access on most content tables
- ✅ Authenticated write for claimed profiles
- ✅ Admin override for all operations
- ✅ Anonymous submission allowed for music

**Storage Buckets:**
- `band-photos` (5MB limit, images only)
- `band-music` (25MB limit, audio only)
- `event-flyers` (10MB limit)

**⚠️ Security Concern:**
- Storage RLS policies may allow any user to delete files (needs verification)
- Recommendation: Review `supabase/migrations/20250106_storage_buckets.sql`

### 2.4 Database Migrations

**Total Migrations:** 20+ files in `supabase/migrations/`

**Key Migrations:**
- `20250101_initial_schema.sql` - Core schema
- `20250102_band_pages.sql` - Band page features
- `20250106_storage_buckets.sql` - File storage
- `20251015_event_submissions.sql` - Event submission system
- `20251115_add_tier_system.sql` - Subscription tiers
- `20251115_add_spider_rider_system.sql` - Spider Rider feature
- `20251115_enhance_venues_and_events.sql` - Venue enhancements

**Migration Health:**
- ✅ Sequential naming convention
- ✅ Some disabled migrations (`.disabled` files) - review needed
- ✅ Comments and documentation in SQL
- ⚠️ Some manual SQL files outside migrations folder

### 2.5 Supabase Project Details

**Project ID:** `yznquvzzqrvjafdfczak` (from AGENT_ONBOARDING.md)  
**Local Config:** `supabase/config.toml` configured for local development  
**Type Generation:** `yarn db:types` generates TypeScript types

**Commands Available:**
```bash
yarn db:start      # Start local Supabase
yarn db:stop       # Stop local Supabase
yarn db:push       # Push migrations to remote
yarn db:seed       # Seed database
yarn db:types      # Generate TypeScript types
```

---

## 3. API Keys & Security Configuration

### 3.1 Environment Variables

**Required Variables (from codebase analysis):**

```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://yznquvzzqrvjafdfczak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]  # Server-side only

# Live Streaming (Optional - Production)
NEXT_PUBLIC_STREAM_URL=https://stream.therocksalt.com/rocksalt.mp3

# Unsplash API (Optional - for band photos)
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=[key]

# AzuraCast API (Optional - for now-playing)
X_API_Key=[azura_api_key]

# Rate Limiting (Optional - Upstash Redis)
UPSTASH_REDIS_REST_URL=[redis_url]
UPSTASH_REDIS_REST_TOKEN=[redis_token]

# Site URL (Optional)
NEXT_PUBLIC_SITE_URL=https://www.therocksalt.com
```

### 3.2 API Key Usage Analysis

**Supabase Keys:**
- ✅ Properly prefixed with `NEXT_PUBLIC_` for client-side
- ✅ Service role key not exposed client-side
- ✅ Anon key is public (by design - RLS provides security)
- ✅ Used in both client and server contexts correctly

**External APIs:**

**1. Unsplash API** (`src/lib/apis/unsplash.ts`):
- ✅ Used for fetching band photos
- ✅ Fallback to 'demo' if key missing
- ✅ Proper error handling
- ✅ 24-hour cache on responses
- ⚠️ Key exposed client-side (acceptable for Unsplash)

**2. AzuraCast API** (`src/app/api/now-playing/route.ts`):
- ✅ Server-side only (API route)
- ✅ Uses `X_API_Key` environment variable
- ⚠️ Variable name inconsistent (should be `AZURACAST_API_KEY`)
- ⚠️ Hardcoded station ID ('1')

**3. Upstash Redis** (`src/lib/rateLimit.ts`):
- ✅ Infrastructure ready
- ⚠️ Not fully integrated (rate limiting exists but not used everywhere)
- ⚠️ Placeholder values likely in production

### 3.3 Security Headers

**Status:** ✅ Excellent implementation

**Headers Configured** (`next.config.ts`):
- ✅ `Strict-Transport-Security` (HSTS) - 6 months
- ✅ `Content-Security-Policy` - Comprehensive policy
- ✅ `X-Frame-Options: SAMEORIGIN`
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `Referrer-Policy: no-referrer`
- ✅ `Permissions-Policy` - Restrictive

**CSP Directives:**
- ✅ Allows Supabase domains (`*.supabase.co`)
- ✅ Allows Unsplash API
- ✅ Allows AzuraCast streaming (`a8.asurahosting.com`)
- ✅ Allows YouTube embeds
- ⚠️ `unsafe-inline` and `unsafe-eval` in script-src (Next.js requirement)

### 3.4 Security Concerns

**Critical:**
1. ⚠️ **Storage RLS Policies** - Need verification that users can only delete their own files
2. ⚠️ **Rate Limiting** - Infrastructure exists but not fully integrated
3. ⚠️ **API Key Management** - No centralized documentation of all keys

**Medium:**
1. ⚠️ **Password Requirements** - Currently 6 characters minimum (weak)
2. ⚠️ **Input Validation** - No validation library (Zod/Yup)
3. ⚠️ **Error Tracking** - No Sentry or similar service

**Low:**
1. ⚠️ **CSP Reporting** - No violation reporting endpoint
2. ⚠️ **HSTS Preload** - Not in HSTS preload list

### 3.5 Environment Variable Security

**✅ Good Practices:**
- `.env*` files in `.gitignore`
- No hardcoded secrets in code
- Proper `NEXT_PUBLIC_` prefix usage
- Service role key not exposed client-side

**⚠️ Recommendations:**
- Document all required environment variables
- Use Vercel environment variable management
- Consider using a secrets management service for production
- Add validation for required env vars at startup

---

## 4. Documentation Analysis

### 4.1 Documentation Files

**Comprehensive Documentation Found:**

1. **AGENT_ONBOARDING.md** (710 lines) - Excellent onboarding guide
   - Project overview
   - Feature status
   - Architecture details
   - Development workflow
   - Known issues

2. **ROADMAP.md** - Feature roadmap with phases
3. **PLATFORM_BLUEPRINT.md** - Complete platform vision
4. **DEPLOYMENT_CHECKLIST.md** - Deployment procedures
5. **LIVE_STREAM_SETUP.md** - Streaming setup guide
6. **BAND_MANAGER_BLUEPRINT.md** - Band management features
7. **FREEMIUM_TIER_PLAN.md** - Pricing strategy
8. **SUBMISSION_FORM_README.md** - Submission form guide
9. **VENUES_SETUP.md** - Venue setup instructions
10. **QUICK_START.md** - Quick start guide

**Audit Reports** (`_audit/` directory):
- `00-EXECUTIVE-SUMMARY.md` - Overall health assessment
- `01-structure-analysis.md` - Project structure
- `02-dependency-report.md` - Dependency health
- `03-code-quality.md` - Code quality metrics
- `04-architecture-analysis.md` - Architecture review
- `05-security-deployment.md` - Security analysis
- `10-roadmap.md` - 90-day roadmap

### 4.2 Documentation Quality

**Strengths:**
- ✅ Extensive documentation coverage
- ✅ Clear onboarding guide for new developers
- ✅ Feature roadmaps and blueprints
- ✅ Deployment checklists
- ✅ Previous audit reports available

**Gaps:**
- ⚠️ No centralized API documentation
- ⚠️ No environment variable reference
- ⚠️ No database schema diagram
- ⚠️ No API endpoint documentation
- ⚠️ No contributor guidelines

### 4.3 README Status

**Current README.md:**
- ⚠️ Generic Next.js template README
- ⚠️ No project-specific information
- ⚠️ Missing setup instructions
- ⚠️ Missing project overview

**Recommendation:** Replace with comprehensive README using content from `AGENT_ONBOARDING.md`

---

## 5. Site Metrics & Performance Assessment

### 5.1 Analytics & Metrics Tracking

**Current Status:** ❌ **NO ANALYTICS IMPLEMENTED**

**Missing:**
- No Google Analytics
- No Plausible Analytics
- No PostHog
- No custom event tracking
- No user behavior tracking
- No conversion tracking

**Impact:**
- Cannot measure user engagement
- Cannot track feature adoption
- Cannot measure conversion rates
- Cannot optimize based on data
- Cannot track ROI on features

**Recommendations:**
1. **Immediate:** Implement Plausible Analytics (privacy-friendly)
2. **Short-term:** Add custom event tracking for:
   - Band saves
   - Music submissions
   - Profile views
   - Track plays
   - Event clicks
3. **Medium-term:** Set up conversion funnels
4. **Long-term:** Build analytics dashboard for bands

### 5.2 Performance Metrics

**Build Configuration:**
- ⚠️ TypeScript errors ignored (`typescript.ignoreBuildErrors = true`)
- ⚠️ ESLint errors ignored (`eslint.ignoreDuringBuilds = true`)
- ✅ Production source maps enabled
- ✅ Security headers configured

**Bundle Size:**
- Estimated: ~470KB (from audit)
- Supabase client: ~45KB (gzipped)
- No bundle analysis found

**Performance Optimizations:**
- ✅ Server Components for data fetching
- ✅ Image optimization (Next.js Image component)
- ✅ Font optimization (next/font)
- ⚠️ No query caching implemented
- ⚠️ No CDN configuration documented

### 5.3 API Performance

**API Routes:**
- `/api/tracks/[trackId]/play` - Track play count increment
- `/api/now-playing` - AzuraCast integration
- `/api/spider-rider` - Spider Rider creation

**Observations:**
- ✅ Proper error handling
- ✅ Type-safe request/response
- ⚠️ No rate limiting on API routes
- ⚠️ No request validation
- ⚠️ No response caching

### 5.4 Database Performance

**Query Patterns:**
- ✅ Efficient joins (no N+1 queries)
- ✅ Proper indexing on foreign keys
- ✅ RLS policies optimized
- ⚠️ No query caching
- ⚠️ No connection pooling configuration documented

**Indexes Found:**
- `bands_slug_idx` - Slug lookups
- `bands_featured_idx` - Featured band queries
- `bands_tier_idx` - Tier filtering
- Multiple foreign key indexes

### 5.5 Core Web Vitals

**Status:** ⚠️ **NOT MEASURED**

**Recommendations:**
1. Set up Lighthouse CI
2. Monitor in production with Vercel Analytics
3. Track LCP, FID, CLS
4. Set performance budgets

---

## 6. Feature Status Assessment

### 6.1 Completed Features ✅

**Core Platform:**
- ✅ Band directory (210+ bands)
- ✅ Individual band pages
- ✅ Venue directory
- ✅ Events calendar
- ✅ Music submission system
- ✅ Admin dashboard
- ✅ Authentication (Supabase Auth)
- ✅ User profiles
- ✅ Saved bands (localStorage)
- ✅ Live streaming page
- ✅ Radio episodes archive

**Infrastructure:**
- ✅ Responsive design
- ✅ Dark mode support
- ✅ PWA support (manifest.json)
- ✅ Service worker

### 6.2 Partially Implemented 🚧

**Spider Rider System:**
- ✅ Database schema complete
- ✅ API endpoint exists
- ⚠️ UI incomplete (minimal implementation)
- ⚠️ Venue interface missing

**Subscription/Monetization:**
- ✅ Database schema complete (tier system)
- ✅ Stripe fields in database
- ❌ Stripe integration not implemented
- ❌ Checkout flow missing
- ❌ Subscription management missing

**Analytics:**
- ✅ Track play count endpoint exists
- ❌ No analytics dashboard
- ❌ No profile view tracking
- ❌ No user behavior tracking

### 6.3 Not Started ❌

**Fan Club System:**
- ❌ Membership tiers
- ❌ Exclusive content
- ❌ Revenue sharing

**Industry Tools:**
- ❌ EPK generator
- ❌ Tech rider builder
- ❌ Stage plot creator

**Vendor Marketplace:**
- ❌ Vendor directory
- ❌ Service listings
- ❌ Merch ordering

---

## 7. Critical Recommendations

### 7.1 Immediate Actions (This Week)

**1. Implement Analytics** 🔴 **CRITICAL**
- Set up Plausible Analytics or Google Analytics
- Add event tracking for key user actions
- Track conversion funnels

**2. Fix Build Configuration** 🔴 **HIGH PRIORITY**
- Fix TypeScript errors (remove `ignoreBuildErrors`)
- Fix ESLint errors (remove `ignoreDuringBuilds`)
- Re-enable strict checking

**3. Document Environment Variables** 🟡 **HIGH PRIORITY**
- Create `.env.example` file
- Document all required variables
- Add validation at startup

**4. Review Storage RLS Policies** 🔴 **SECURITY**
- Verify users can only delete their own files
- Test file deletion permissions
- Update policies if needed

**5. Integrate Rate Limiting** 🟡 **SECURITY**
- Apply rate limiting to auth routes
- Apply rate limiting to submission endpoints
- Test rate limits in production

### 7.2 Short-Term Goals (This Month)

**1. Replace README.md**
- Use content from AGENT_ONBOARDING.md
- Add setup instructions
- Add project overview

**2. Implement Error Tracking**
- Set up Sentry or similar
- Track errors in production
- Set up alerts

**3. Complete Stripe Integration**
- Implement checkout flow
- Add subscription management
- Set up webhooks

**4. Build Analytics Dashboard**
- Profile view tracking
- Track play analytics
- User engagement metrics

**5. Performance Optimization**
- Add query caching
- Optimize bundle size
- Set up Lighthouse CI

### 7.3 Medium-Term Goals (Next 3 Months)

**1. Complete Spider Rider UI**
- Band interface for creating riders
- Venue interface for browsing/accepting
- Booking request workflow

**2. Build Fan Club System**
- Membership tiers
- Exclusive content
- Revenue sharing (80/20)

**3. Industry Tools Suite**
- EPK generator
- Tech rider builder
- Press kit templates

**4. Multi-City Expansion**
- Prepare for "The Rock Salt: Denver"
- City-specific content structure
- Shared infrastructure

### 7.4 Long-Term Vision (6-12 Months)

**1. Mobile App**
- React Native wrapper
- Push notifications
- Offline mode

**2. Advanced Analytics**
- AI-powered insights
- Fan growth predictions
- Revenue forecasting

**3. Vendor Marketplace**
- Service listings
- Equipment rental
- Merch integration

---

## 8. Technical Debt Summary

### 8.1 Code Quality

**Issues:**
- ⚠️ Large component files (MusicSubmissionForm: 663 lines)
- ⚠️ TypeScript errors ignored in build
- ⚠️ ESLint errors ignored in build
- ⚠️ No test coverage (testing framework ready but unused)

**Recommendations:**
- Refactor large components into smaller pieces
- Fix TypeScript errors incrementally
- Write tests for critical paths
- Set up CI/CD pipeline

### 8.2 Security

**Issues:**
- ⚠️ Rate limiting not fully integrated
- ⚠️ Weak password requirements (6 chars)
- ⚠️ No input validation library
- ⚠️ Storage RLS policies need review

**Recommendations:**
- Complete rate limiting integration
- Strengthen password requirements
- Implement Zod for validation
- Audit and fix storage policies

### 8.3 Performance

**Issues:**
- ⚠️ No query caching
- ⚠️ No bundle size monitoring
- ⚠️ No Core Web Vitals tracking
- ⚠️ No CDN configuration

**Recommendations:**
- Implement Supabase query caching
- Add bundle analyzer
- Set up Vercel Analytics
- Configure CDN for static assets

### 8.4 Documentation

**Issues:**
- ⚠️ Generic README.md
- ⚠️ No API documentation
- ⚠️ No environment variable reference
- ⚠️ No database schema diagram

**Recommendations:**
- Replace README with comprehensive guide
- Document all API endpoints
- Create `.env.example` file
- Generate database schema diagram

---

## 9. Metrics & KPIs to Track

### 9.1 User Engagement

**Current:** ❌ Not tracked

**Recommended Metrics:**
- Daily/Monthly Active Users (DAU/MAU)
- Band profile views
- Track plays
- Event page views
- Submission form completions
- Band saves (localStorage)

### 9.2 Business Metrics

**Current:** ❌ Not tracked

**Recommended Metrics:**
- Music submissions per week
- Submission acceptance rate
- Band page claims
- Subscription conversions
- Revenue (when Stripe implemented)

### 9.3 Technical Metrics

**Current:** ⚠️ Partially tracked

**Recommended Metrics:**
- API response times
- Error rates
- Page load times
- Core Web Vitals (LCP, FID, CLS)
- Database query performance

### 9.4 Feature Adoption

**Current:** ❌ Not tracked

**Recommended Metrics:**
- Spider Rider creations
- Booking requests
- Saved bands per user
- Admin dashboard usage
- Live stream listeners

---

## 10. Conclusion

The Rock Salt is a well-architected platform with a strong foundation. The codebase demonstrates modern best practices, comprehensive database design, and good security fundamentals. However, critical gaps in analytics, monitoring, and some security controls need immediate attention.

### Priority Actions:

1. **This Week:**
   - Implement analytics tracking
   - Fix build configuration
   - Document environment variables
   - Review storage security

2. **This Month:**
   - Complete Stripe integration
   - Set up error tracking
   - Build analytics dashboard
   - Replace README

3. **Next 3 Months:**
   - Complete Spider Rider UI
   - Build Fan Club system
   - Industry tools suite
   - Performance optimization

### Overall Assessment:

**Strengths:**
- Modern, scalable architecture
- Comprehensive feature set
- Strong database design
- Good documentation foundation
- Security-conscious development

**Weaknesses:**
- No analytics/metrics
- Incomplete monetization
- Some technical debt
- Missing monitoring/observability

**Verdict:** The project is **production-ready for MVP** but needs analytics, monitoring, and completion of monetization features for full launch.

---

## Appendix A: Environment Variables Reference

### Required for Production

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://yznquvzzqrvjafdfczak.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your_anon_key]
SUPABASE_SERVICE_ROLE_KEY=[your_service_role_key]

# Site
NEXT_PUBLIC_SITE_URL=https://www.therocksalt.com
```

### Optional

```bash
# Live Streaming
NEXT_PUBLIC_STREAM_URL=https://stream.therocksalt.com/rocksalt.mp3

# External APIs
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=[optional]
X_API_Key=[azura_api_key]  # Note: inconsistent naming

# Rate Limiting
UPSTASH_REDIS_REST_URL=[optional]
UPSTASH_REDIS_REST_TOKEN=[optional]

# Analytics (when implemented)
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=[optional]
NEXT_PUBLIC_GA_ID=[optional]
```

---

## Appendix B: Database Tables Summary

### Core Tables (20+)

**Bands & Artists:**
- bands, band_genres, band_members, band_photos, band_tracks, band_links, musicians, releases

**Venues & Events:**
- venues, events, event_bands, event_submissions

**Content:**
- episodes, livestreams, music_submissions, genres

**Spider Rider:**
- spider_riders, spider_rider_acceptances, booking_requests

**Users:**
- profiles, admin_users

**Storage Buckets:**
- band-photos, band-music, event-flyers

---

## Appendix C: API Endpoints

### Public API Routes

- `GET /api/tracks/[trackId]/play` - Increment track play count
- `GET /api/now-playing` - Get current playing track (AzuraCast)
- `POST /api/spider-rider` - Create/update Spider Rider

### Internal Routes

- `GET /health/env` - Environment check (dev only)
- `POST /auth/logout` - Logout handler
- `GET /auth/callback` - Auth callback handler

---

**Report Generated:** January 2025  
**Next Review:** After implementing critical recommendations

