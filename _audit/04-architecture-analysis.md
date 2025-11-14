# Phase 2: Architecture Analysis

**Date**: October 14, 2025
**Project**: The Rock Salt (rocksalt.com)
**Combined Report**: Bundle, Performance, Database & API

---

## Executive Summary

**Architecture Grade: B+** (Solid foundation, room for optimization)

The Rock Salt uses a modern, well-structured architecture with Next.js 15 App Router, Supabase PostgreSQL backend, and Vercel deployment. The database schema is comprehensive and properly normalized, with strong relationships and RLS policies. However, production build analysis was limited, and some performance optimizations are recommended.

**Key Strengths**:
- Comprehensive database schema (11+ tables, properly normalized)
- Strong type safety with Supabase type generation
- Clean API layer with reusable query functions
- Proper file storage configuration (5MB photos, 25MB audio)
- Row Level Security (RLS) policies implemented

**Key Weaknesses**:
- Production build not completed (timeout issue)
- No bundle size optimization detected
- Limited code splitting beyond default Next.js
- Missing performance monitoring
- No caching strategy implemented

---

# PART 1: Bundle Analysis

## 1.1 Build Status

### Production Build Attempt
```
Status: ⚠️ Timeout after 5 minutes
Last build type: Development mode
Build directory: .next (114MB)
```

**Issue**: Production build (`yarn build`) timed out during audit. This indicates:
1. Potential build configuration issues
2. Slow TypeScript compilation
3. ESLint integration slowing build (noted: `ignoreDuringBuilds: true` added to next.config.ts)

### Development Build Analysis
```
.next directory: 114MB
Static chunks:   112KB
    - polyfills.js:  110KB
    - other:         2KB
```

**Note**: Development builds are significantly larger than production and don't represent optimized output.

---

## 1.2 Estimated Production Bundle Size

Based on source code analysis and typical Next.js builds with similar stacks:

### Estimated Bundle Breakdown
```
Main App Bundle:         ~180KB (gzipped)
React 19 + ReactDOM:     ~130KB (gzipped)
Next.js Runtime:         ~90KB (gzipped)
Supabase Client:         ~45KB (gzipped)
Tailwind CSS (used):     ~25KB (gzipped)
Sharp (image opt):       Server-side only
Total First Load JS:     ~470KB (estimated)
```

**Comparison with Next.js Benchmarks**:
- Excellent: < 300KB
- Good: 300-500KB
- **This Project**: ~470KB (estimated, on the higher end of "good")
- Needs Optimization: > 500KB

---

## 1.3 Code Splitting Analysis

### Automatic Splitting (Next.js App Router)
```
✅ Page-level splitting:    Enabled (default)
✅ Dynamic imports:         Not detected
✅ Route groups:            Not utilized
⚠️ Component lazy loading:  None found
```

### Route Chunks (Detected)
From source file structure, estimated route bundles:
1. `/` (homepage) - 303 lines → ~40KB
2. `/bands` - 302 lines → ~38KB
3. `/bands/[slug]` - 302 lines + AudioPlayer → ~50KB (heavy)
4. `/venues/[slug]` - 358 lines → ~45KB (largest page)
5. `/submit` - 663 lines (MusicSubmissionForm) → ~85KB (**heavy**)
6. `/dashboard` - 185-274 lines → ~35KB
7. `/auth/*` - 187 lines per page → ~25KB each

### Bundle Size Concerns

#### 🔴 Critical - Large Pages
1. **Submit Form (src/app/submit/page.tsx + MusicSubmissionForm.tsx)**
   - Combined: 663+ lines
   - Estimated bundle: ~85KB
   - **Issue**: Blocks submission page load
   - **Solution**: Code split form sections with lazy loading

#### 🟡 Moderate - Dynamic Pages
2. **Band Detail Page (src/app/bands/[slug]/page.tsx)**
   - Size: 302 lines + AudioPlayer (~180 lines)
   - Estimated bundle: ~50KB
   - **Issue**: AudioPlayer loaded even if no music
   - **Solution**: Lazy load AudioPlayer component

3. **Venue Detail Page (src/app/venues/[slug]/page.tsx)**
   - Size: 358 lines
   - Estimated bundle: ~45KB
   - **Assessment**: Within acceptable range

---

## 1.4 Third-Party Dependencies Impact

### Client-Side Bundle Contributors
Based on `package.json` dependencies:

```
@supabase/supabase-js:  ~140KB (uncompressed) → ~45KB gzipped
@supabase/ssr:          ~25KB (uncompressed) → ~8KB gzipped
react + react-dom:      ~350KB (uncompressed) → ~130KB gzipped
next (runtime):         ~280KB (uncompressed) → ~90KB gzipped
```

**Total Dependencies**: ~795KB uncompressed → ~273KB gzipped

### Server-Side Only (No Bundle Impact)
- Sharp (image optimization)
- TypeScript (compile-time)
- ESLint (dev-time)
- Supabase CLI (dev-time)

---

## 1.5 Optimization Recommendations

### P0 - Critical (Implement Immediately)
1. **Fix production build timeout**:
   ```typescript
   // next.config.ts - already added:
   eslint: {
     ignoreDuringBuilds: true  // ✅ Done
   }
   ```

2. **Add bundle analyzer**:
   ```bash
   yarn add -D @next/bundle-analyzer
   ```
   ```typescript
   // next.config.ts
   const withBundleAnalyzer = require('@next/bundle-analyzer')({
     enabled: process.env.ANALYZE === 'true',
   })
   module.exports = withBundleAnalyzer(nextConfig)
   ```

### P1 - High Priority (Next 2 Weeks)
3. **Lazy load heavy components**:
   ```typescript
   // src/app/bands/[slug]/page.tsx
   import dynamic from 'next/dynamic'

   const AudioPlayer = dynamic(() => import('@/components/AudioPlayer'), {
     ssr: false,
     loading: () => <div>Loading player...</div>
   })
   ```

4. **Split MusicSubmissionForm** into sections:
   ```typescript
   const BandInfoSection = dynamic(() => import('./BandInfoSection'))
   const TracksUploadSection = dynamic(() => import('./TracksUploadSection'))
   const ReviewSection = dynamic(() => import('./ReviewSection'))
   ```

### P2 - Medium Priority (Next Month)
5. **Implement route groups** for better organization
6. **Add loading.tsx** files for instant feedback
7. **Optimize Tailwind CSS** (purge unused classes)

---

# PART 2: Performance Profile

## 2.1 Performance Considerations

### Core Web Vitals Targets
```
Metric                    Target      Estimated (Current)
-------------------------------------------------------
LCP (Largest Content)     < 2.5s      ~2.8s (needs data)
FID/INP (Interactivity)   < 100ms     Unknown
CLS (Layout Shift)        < 0.1       Unknown
FCP (First Content)       < 1.8s      Unknown
TTI (Time to Interactive) < 3.8s      Unknown
```

**Note**: Live performance audit requires deployed URL and Lighthouse analysis.

---

## 2.2 Performance Risks Identified

### 🔴 Critical Risks

#### 1. Large Initial Bundle (~470KB estimated)
**Impact**: Slow FCP and TTI on slower connections
**Solution**:
- Implement code splitting (see 1.5)
- Lazy load non-critical components
- Target: < 300KB first load

#### 2. Supabase Client Initialization
**Location**: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`
**Impact**: Client/Server separation is correct, but client bundle includes full Supabase SDK
**Solution**:
- Consider tree-shaking unused Supabase features
- Use targeted imports: `import { createClient } from '@supabase/supabase-js/dist/module/SupabaseClient'`

### 🟡 Moderate Risks

#### 3. No Image Optimization Detected
**Observation**: Using `image_url` strings, no Next.js `<Image>` component detected
**Impact**: Unoptimized images increase LCP
**Solution**:
```typescript
import Image from 'next/image'

<Image
  src={band.image_url}
  alt={band.name}
  width={400}
  height={400}
  priority={isFeatured}
/>
```

#### 4. Multiple Database Queries per Page
**Location**: `src/lib/supabase/queries.ts`
**Observation**:
- `getBandBySlug()` - Single query with joins ✅
- `getBandEvents()` - Separate query ⚠️
**Impact**: Sequential queries increase TTI
**Solution**: Combine into single query with `Promise.all()` or use server components' streaming

---

## 2.3 Caching Strategy

### Current State
```
❌ No HTTP caching headers detected
❌ No Supabase query caching
❌ No static generation detected (all SSR/dynamic)
✅ Next.js automatic static optimization (minimal)
```

### Recommended Caching Strategy

#### 1. Static Generation for Public Pages
```typescript
// src/app/bands/[slug]/page.tsx
export const revalidate = 3600 // Revalidate every hour

export async function generateStaticParams() {
  const slugs = await getAllBandSlugs()
  return slugs.map((slug) => ({ slug }))
}
```

#### 2. Supabase Query Caching
```typescript
// Enable caching for public data
const { data } = await supabase
  .from('bands')
  .select('*')
  .cache(3600) // Cache for 1 hour
```

#### 3. CDN Caching (Vercel)
```typescript
// next.config.ts
module.exports = {
  headers: async () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, s-maxage=60, stale-while-revalidate=120' },
      ],
    },
  ],
}
```

---

## 2.4 Performance Monitoring

### Missing Infrastructure
```
❌ No performance monitoring (Vercel Analytics, Sentry, etc.)
❌ No real user monitoring (RUM)
❌ No error tracking
❌ No Core Web Vitals tracking
```

### Recommended Setup

#### 1. Vercel Analytics (Free for Vercel deployments)
```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### 2. Web Vitals Reporting
```typescript
// src/app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next"

<SpeedInsights />
```

---

# PART 3: Database & API Architecture

## 3.1 Database Schema Overview

### Schema Statistics
```
Total Tables:        11+ core tables
Migration Files:     6 files (1,464 lines total)
Properly Organized:  ✅ All in supabase/migrations/
Foreign Keys:        Comprehensive relationship enforcement
RLS Policies:        ✅ Implemented
Storage Buckets:     2 (band-photos, band-music)
```

### Migration Timeline
```
2025-01-05: full_platform_schema.sql       (519 lines) - Base schema
2025-01-05: band_manager_system.sql        (619 lines) - Band claiming
2025-01-05: band_pages.sql                 (231 lines) - Band pages
2025-01-05: rpc_functions.sql              (15 lines)  - RPC functions
2025-01-05: fix_claim_rls.sql              (16 lines)  - RLS fix
2025-01-15: storage_buckets.sql            (64 lines)  - File storage
```

---

## 3.2 Database Entity Relationship Diagram

### Core Entities
```
┌──────────────┐
│   profiles   │ (extends auth.users)
│              │
│ - id (uuid)  │
│ - user_type  │◄───┐
│ - sub_tier   │    │ claimed_by
└──────────────┘    │
                    │
┌──────────────┐    │    ┌──────────────┐
│    bands     │    │    │   venues     │
│              │    │    │              │
│ - id         │◄───┼────│ - id         │
│ - name       │    │    │ - name       │
│ - slug       │    └────┤ - slug       │
│ - featured   │         │ - capacity   │
└──────┬───────┘         └──────┬───────┘
       │                        │
       │ 1:N                    │ 1:N
       │                        │
┌──────▼───────┐         ┌──────▼───────┐
│ band_links   │         │venue_links   │
│ band_genres  │         │venue_photos  │
│ band_tracks  │         └──────────────┘
│ band_photos  │
└──────────────┘
       │
       │ N:M (via event_bands)
       │
┌──────▼───────┐
│    events    │
│              │
│ - id         │
│ - venue_id   │───┐
│ - start_time │   │
└──────────────┘   │
                   │
            ┌──────▼───────┐
            │ event_bands  │ (junction table)
            │              │
            │ - event_id   │
            │ - band_id    │
            │ - slot_order │
            │ - headliner  │
            └──────────────┘
```

---

## 3.3 Database Schema Analysis

### Tables Breakdown

#### 1. Core User Management
```sql
profiles (extends auth.users)
├─ user_type: 'artist', 'venue', 'vendor', 'fan'
├─ subscription_tier: 'free', 'basic', 'premium', 'vip'
└─ Relationships: claimed venues, bands
```

**Assessment**: ✅ Well-designed user system with subscription support

#### 2. Bands System
```sql
bands
├─ name, slug (unique), featured
├─ claimed_by → profiles (nullable)
└─ Related tables:
    ├─ band_links (social media, streaming)
    ├─ band_genres (many-to-many via genres table)
    ├─ band_tracks (audio files, play_count tracking)
    ├─ band_photos (gallery with primary flag)
    └─ band_managers (access control)
```

**Strengths**:
- Proper normalization
- Claiming system for band ownership
- Manager system for multi-user access
- Play count tracking (RPC function: `increment_track_play_count`)

**Schema Quality**: A-

#### 3. Venues System
```sql
venues
├─ name, slug (unique), capacity, amenities (jsonb)
├─ claimed_by → profiles (nullable)
└─ Related tables:
    ├─ venue_links
    ├─ venue_photos
    └─ events (1:many)
```

**Strengths**:
- Similar structure to bands (consistency)
- JSONB for flexible amenities
- Capacity tracking

**Schema Quality**: A

#### 4. Events System
```sql
events
├─ venue_id → venues
├─ start_time, end_time
└─ event_bands (junction table)
    ├─ band_id → bands
    ├─ slot_order (lineup order)
    └─ is_headliner (boolean)
```

**Strengths**:
- Many-to-many relationship properly modeled
- Slot ordering for lineup management
- Headliner designation

**Schema Quality**: A+

#### 5. Episodes System
```sql
episodes
├─ title, date, description
└─ episode_links (e.g., YouTube, Spotify)
```

**Use Case**: Likely for podcast/video content
**Schema Quality**: B+ (basic but functional)

#### 6. Music Submissions
```sql
music_submissions
├─ band_name, contact_email
├─ genre_preferences (array)
├─ streaming_links (array)
├─ photo_url, music_file_url (storage references)
├─ status: 'pending', 'approved', 'rejected'
└─ admin_notes
```

**Strengths**:
- Proper workflow (pending → approved/rejected)
- Admin notes for internal tracking
- Links to storage buckets

**Schema Quality**: A

---

## 3.4 Database Security (RLS Policies)

### Row Level Security Status
```
✅ RLS Enabled on Tables:
   - bands
   - band_managers
   - band_tracks
   - band_photos
   - venues
   - music_submissions

⚠️ RLS Policies Detected:
   - Public read for published content
   - Owner/manager write access
   - Admin override capabilities
   - Storage bucket policies (public upload with limits)
```

### Storage Security
From `20250115_storage_buckets.sql`:
```sql
-- band-photos bucket
File size limit: 5MB
Allowed types: image/jpeg, image/png, image/webp
Policies:
  ✅ Public upload (with size limit)
  ✅ Public read
  ⚠️ Update/delete: Any user (should be restricted to owner)

-- band-music bucket
File size limit: 25MB
Allowed types: audio/mpeg, audio/wav
Policies:
  ✅ Public upload
  ✅ Public read
  ⚠️ Update/delete: Any user (security gap)
```

**Security Issue**: Storage policies allow ANY user to update/delete files. Should restrict to file owner:
```sql
create policy "Users can delete own band photos"
on storage.objects for delete
using (bucket_id = 'band-photos' AND auth.uid() = owner);
```

**Priority**: P1 - Security Risk

---

## 3.5 API Layer Architecture

### Query Pattern Analysis

#### 1. Server-Side Queries (src/lib/supabase/queries.ts)
```typescript
// ✅ Excellent: Single query with joins
getBandBySlug(slug)
  .from('bands')
  .select(`
    *,
    band_links ( * ),
    band_genres ( genre:genres ( id, name ) ),
    band_tracks ( ... ),
    band_photos ( ... )
  `)
  .eq('slug', slug)
  .single()
```

**Strengths**:
- Uses Supabase's PostgREST foreign table syntax
- Single query reduces round trips
- Type-safe with generated types

#### 2. Pagination
```typescript
// ⚠️ Basic: No cursor-based pagination
getBands(limit = 20)
  .order('featured', { ascending: false })
  .order('name', { ascending: true })
  .limit(limit)
```

**Issue**: No offset/cursor support for "Load More"
**Recommendation**: Add pagination params:
```typescript
getBands(page = 1, limit = 20) {
  const offset = (page - 1) * limit
  return supabase
    .from('bands')
    .select('*', { count: 'exact' })
    .range(offset, offset + limit - 1)
}
```

#### 3. RPC Functions
```typescript
// queries.ts:187
incrementTrackPlayCount(trackId)
  await supabase.rpc('increment_track_play_count', { track_id: trackId })
```

**Assessment**: ✅ Proper use of database function for atomic updates

---

## 3.6 API Routes

### Detected API Endpoints
```
1. /api/tracks/[trackId]/play/route.ts
   - Purpose: Track playback endpoint
   - Method: POST
   - Function: Increments play count, streams audio

2. /health/env/route.ts
   - Purpose: Environment diagnostics
   - Method: GET
   - Function: Checks Supabase connection

3. /auth/callback/route.ts
   - Purpose: OAuth callback handler
   - Method: GET
   - Function: Processes authentication tokens

4. Server Actions:
   - src/app/submit/actions.ts (music submission)
   - src/app/actions/claimBand.ts (band claiming)
```

### API Architecture Assessment

**Strengths**:
- Minimal API routes (Next.js Server Actions preferred) ✅
- Proper separation of concerns
- Type-safe server actions

**Weaknesses**:
- No API authentication middleware detected ⚠️
- No rate limiting ⚠️
- No request validation library (Zod, etc.) ⚠️

---

## 3.7 Data Fetching Patterns

### Server Components (Recommended for Next.js 13+)
```typescript
// src/app/bands/page.tsx
export default async function BandsPage() {
  const bands = await getBands(20)  // ✅ Server Component fetch
  return <BandList bands={bands} />
}
```

**Assessment**: ✅ Properly using Server Components for data fetching

### Client-Side Fetching
```typescript
// src/lib/supabase/queries.ts:92
getBandsClient(limit = 20)  // Browser Supabase client
```

**Use Case**: For client-side mutations and real-time subscriptions
**Assessment**: ✅ Proper separation of client/server clients

---

## 3.8 Type Safety

### Supabase Type Generation
```
src/types/supabase.ts (1,373 lines) - Auto-generated
src/types/database.ts (284 lines)   - Custom types
```

**Generation Command** (from package.json):
```bash
yarn db:types
# Runs: supabase gen types typescript --schema public --local --output src/types/supabase.ts
```

**Assessment**: ✅ Excellent type safety with automated type generation

### Type Usage Example
```typescript
// queries.ts:5
type BandWithRelations = Tables<'bands'> & {
  band_links: Tables<'band_links'>[] | null
  band_genres: Array<{ genre: Pick<Tables<'genres'>, 'id' | 'name'> | null }> | null
}
```

**Quality**: A+ (Proper use of utility types and complex type composition)

---

## 3.9 Database Performance Considerations

### Indexing
**Note**: Full index analysis requires database access. Recommended indexes:

```sql
-- Critical indexes (verify these exist)
CREATE INDEX idx_bands_slug ON bands(slug);
CREATE INDEX idx_venues_slug ON venues(slug);
CREATE INDEX idx_events_start_time ON events(start_time);
CREATE INDEX idx_events_venue_id ON events(venue_id);
CREATE INDEX idx_event_bands_event_id ON event_bands(event_id);
CREATE INDEX idx_event_bands_band_id ON event_bands(band_id);
CREATE INDEX idx_band_tracks_band_id ON band_tracks(band_id);
```

### N+1 Query Prevention
```typescript
// ✅ Good: Using Supabase joins to prevent N+1
.select(`
  *,
  band_links ( * ),  // Fetched in same query
  band_genres ( genre:genres ( id, name ) )
`)
```

**Assessment**: ✅ Proper use of joins, no N+1 queries detected

---

## 3.10 Data Integrity

### Foreign Key Constraints
```sql
✅ bands.claimed_by → profiles(id) ON DELETE SET NULL
✅ venues.claimed_by → profiles(id) ON DELETE SET NULL
✅ event_bands.event_id → events(id)
✅ event_bands.band_id → bands(id)
✅ band_tracks.band_id → bands(id) ON DELETE CASCADE
```

**Assessment**: A+ (Proper cascade rules and null handling)

### Data Validation
```sql
✅ CHECK constraints:
   - user_type IN ('artist', 'venue', 'vendor', 'fan')
   - subscription_tier IN ('free', 'basic', 'premium', 'vip')
   - vendor_type IN (defined list)

⚠️ Missing:
   - Email format validation
   - URL format validation
   - Phone number format validation
```

**Recommendation**: Add database-level validation:
```sql
ALTER TABLE profiles
ADD CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$');
```

---

## 3.11 Scalability Analysis

### Current Scale Indicators
```
Expected Scale:
  - Bands: 100-1,000 entries (small to medium)
  - Venues: 50-500 entries (small)
  - Events: 1,000-10,000 entries (medium)
  - Users: 1,000-100,000 (small to large)
```

### Scaling Bottlenecks

#### 1. Play Count Updates (band_tracks.play_count)
**Current**: RPC function with direct update
**Scale Issue**: High-frequency writes can cause lock contention
**Solution** (at scale):
```sql
-- Use a separate analytics table with hourly aggregation
CREATE TABLE track_plays (
  track_id uuid,
  played_at timestamp,
  ...
);
-- Aggregate with cron job
```
**Priority**: P3 (handle when > 10K plays/day)

#### 2. Event Queries (Upcoming Events)
**Current**: `WHERE start_time > now()`
**Scale Issue**: Full table scan without proper indexing
**Solution**:
```sql
CREATE INDEX idx_events_upcoming ON events(start_time)
WHERE start_time > now();  -- Partial index
```
**Priority**: P2 (implement before 1K events)

---

## 3.12 Database Monitoring

### Missing Infrastructure
```
❌ No query performance monitoring
❌ No slow query logging
❌ No connection pool monitoring
❌ No replication lag tracking (if using read replicas)
```

### Recommended Setup
1. **Supabase Dashboard**: Enable slow query logging
2. **pg_stat_statements**: Track query performance
3. **Connection pooling**: Configure PgBouncer (Supabase provides this)

---

## 3.13 Backup & Recovery

### Supabase Managed Backups
```
✅ Automated daily backups (Supabase platform)
✅ Point-in-time recovery (paid plans)
⚠️ No documented recovery process
⚠️ No backup verification tests
```

**Recommendation**: Document disaster recovery procedures in `docs/disaster-recovery.md`

---

## 3.14 Key Findings Summary

### ✅ Database Strengths
1. **Well-normalized schema** (3NF compliance)
2. **Comprehensive relationships** with proper foreign keys
3. **RLS policies implemented** for security
4. **Type-safe** with automated type generation
5. **Proper junction tables** for many-to-many relationships
6. **Storage integration** with file size limits
7. **Manager system** for multi-user band management
8. **Clean query layer** with reusable functions

### ⚠️ Areas for Improvement

#### P0 - Critical
1. **Fix storage RLS policies** - Currently allows any user to delete files

#### P1 - High Priority
2. **Add API rate limiting** - Prevent abuse
3. **Implement request validation** - Add Zod schemas
4. **Add pagination** - Cursor-based pagination for large datasets
5. **Database indexes** - Verify critical indexes exist

#### P2 - Medium Priority
6. **Add query caching** - Reduce database load
7. **Implement monitoring** - Query performance tracking
8. **Email/URL validation** - Database-level constraints
9. **Backup verification** - Test recovery procedures

#### P3 - Low Priority
10. **Optimize play count** - Event-driven analytics at scale
11. **Read replicas** - If query volume increases
12. **Audit logging** - Track data changes

---

## Next Steps

Proceed to **Phase 3: Security & Deployment** to analyze:
- Security headers and CSP
- Authentication flows
- Input validation
- HTTPS enforcement
- Vercel deployment configuration
- CI/CD pipeline
- Environment variable management
