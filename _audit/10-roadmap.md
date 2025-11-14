# 90-Day Implementation Roadmap
## The Rock Salt (rocksalt.com)

**Generated**: October 14, 2025
**Project Health**: B (82/100)
**Goal**: Achieve production-ready status with security hardened, tests implemented, and performance optimized

---

## 📅 Timeline Overview

```
Week 1-2:  Emergency Security Fixes (P0)
Week 3-4:  Foundation & Quality (P1)
Month 2:   Performance & Optimization (P1-P2)
Month 3:   Scale & Future-Proof (P2-P3)
```

**Total Estimated Effort**: 77.5 hours (~10 days with 1 developer, ~5 days with 2 developers)

---

## 🚨 Week 1-2: Emergency Fixes (P0 - Must Complete)

**Goal**: Fix critical security issues blocking launch
**Team**: 1 developer
**Total Hours**: 11 hours

### Day 1: Storage Security (1 hour)
**Issue**: SEC-002 - Storage RLS vulnerability
**Priority**: CRITICAL

**Tasks**:
- [ ] Review current storage policies in Supabase dashboard
- [ ] Create migration file: `20251015_fix_storage_rls.sql`
- [ ] Update delete policy to check owner: `auth.uid() = owner`
- [ ] Apply migration to staging
- [ ] Test file deletion as different users
- [ ] Verify only owners can delete their files
- [ ] Apply to production

**Code**:
```sql
-- Fix band-photos policy
DROP POLICY "Users can delete own band photos" ON storage.objects;
CREATE POLICY "Users can delete own band photos"
ON storage.objects FOR DELETE
USING (bucket_id = 'band-photos' AND auth.uid() = owner);

-- Fix band-music policy
DROP POLICY "Users can delete own band music" ON storage.objects;
CREATE POLICY "Users can delete own band music"
ON storage.objects FOR DELETE
USING (bucket_id = 'band-music' AND auth.uid() = owner);
```

**Verification**:
```bash
# Test as user A (should work)
curl -X DELETE https://[project].supabase.co/storage/v1/object/band-photos/[user-a-file]

# Test as user B deleting user A's file (should fail)
curl -X DELETE https://[project].supabase.co/storage/v1/object/band-photos/[user-a-file]
```

---

### Day 2: Dashboard Protection (2 hours)
**Issue**: SEC-003 - No route authentication
**Priority**: CRITICAL

**Tasks**:
- [ ] Create `middleware.ts` in project root
- [ ] Implement Supabase middleware client
- [ ] Add session check for `/dashboard/*` routes
- [ ] Redirect to `/auth/signin` if not authenticated
- [ ] Add `next` parameter for post-login redirect
- [ ] Test accessing dashboard while logged out
- [ ] Test accessing dashboard/bands/[id] while logged out
- [ ] Test normal authenticated access
- [ ] Deploy to staging and verify

**Code**:
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()

  // Protect dashboard routes
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const redirectUrl = new URL('/auth/signin', req.url)
      redirectUrl.searchParams.set('next', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
```

---

### Days 3-4: Rate Limiting (4 hours)
**Issue**: SEC-001 - No brute force protection
**Priority**: CRITICAL

**Day 3: Setup (2 hours)**
- [ ] Sign up for Upstash account (free tier)
- [ ] Create Redis database
- [ ] Save credentials to `.env.local`
- [ ] Install dependencies: `yarn add @upstash/ratelimit @upstash/redis`
- [ ] Create `src/lib/ratelimit.ts` helper
- [ ] Add env vars to Vercel

**Day 4: Implementation (2 hours)**
- [ ] Add rate limiting to signin page (10 req/min per IP)
- [ ] Add rate limiting to signup page (5 req/min per IP)
- [ ] Add rate limiting to submission endpoint (3 req/5min per IP)
- [ ] Test rate limits with multiple requests
- [ ] Implement proper 429 error responses
- [ ] Add user-friendly error messages
- [ ] Deploy to staging and test

**Code**:
```typescript
// src/lib/ratelimit.ts
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

export const authRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'),
  analytics: true,
  prefix: 'ratelimit:auth',
})

export const submitRatelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, '5 m'),
  analytics: true,
  prefix: 'ratelimit:submit',
})

// Usage in signin page
const identifier = req.headers.get('x-forwarded-for') || 'anonymous'
const { success, limit, remaining, reset } = await authRatelimit.limit(identifier)

if (!success) {
  return {
    error: `Too many attempts. Try again in ${Math.ceil((reset - Date.now()) / 1000)} seconds.`
  }
}
```

---

### Day 5: Legal Pages (4 hours)
**Issue**: LEGAL-001 - Terms & Privacy missing
**Priority**: CRITICAL

**Tasks**:
- [ ] Create `src/app/terms/page.tsx`
- [ ] Create `src/app/privacy/page.tsx`
- [ ] Use template from termsfeed.com or get legal review
- [ ] Add last updated dates
- [ ] Link from footer
- [ ] Link from signup flow
- [ ] Test all links work
- [ ] Review with legal team (if available)
- [ ] Deploy to staging

**Template Resources**:
- Terms: https://www.termsfeed.com/terms-conditions/generator/
- Privacy: https://www.termsfeed.com/privacy-policy/generator/

**Code**:
```typescript
// src/app/terms/page.tsx
export default function TermsPage() {
  return (
    <Container className="py-12">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div className="prose prose-lg max-w-none">
        <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        {/* Terms content */}
      </div>
    </Container>
  )
}
```

---

### 🎯 End of Week 1-2 Checkpoint

**Deliverables**:
- ✅ Storage RLS fixed and verified
- ✅ Dashboard authentication enforced
- ✅ Rate limiting on auth and submissions
- ✅ Terms & Privacy pages live

**Ready for**: Internal testing, security review

**NOT YET ready for**: Public launch (need testing + monitoring)

---

## 🏗️ Week 3-4: Foundation & Quality (P1)

**Goal**: Build testing foundation, improve validation, monitoring
**Team**: 1-2 developers
**Total Hours**: 27 hours

### Week 3, Days 1-3: Testing Infrastructure (12 hours)

**Issue**: TEST-001 - Zero test coverage
**Status**: IN PROGRESS (libraries added ✅)

**Day 1: Setup & Config (4 hours)**
- [x] ✅ DONE: Install Vitest, Testing Library, Happy-DOM
- [x] ✅ DONE: Add test scripts to package.json
- [ ] Create `vitest.config.ts`
- [ ] Create `src/test/setup.ts` for global test setup
- [ ] Configure Supabase mocking
- [ ] Set up test database or use mock
- [ ] Write first passing test (smoke test)

**Code**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Day 2: Auth Tests (4 hours)**
- [ ] Test signup form validation
- [ ] Test signup success flow
- [ ] Test signup error handling
- [ ] Test signin form validation
- [ ] Test signin success flow
- [ ] Test signin error handling
- [ ] Test password strength validation
- [ ] Mock Supabase auth responses

**Example Test**:
```typescript
// src/app/auth/__tests__/signup.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SignUpPage from '../signup/page'

describe('SignUpPage', () => {
  it('shows error for weak password', async () => {
    render(<SignUpPage />)

    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText(/^password$/i)
    const submitButton = screen.getByRole('button', { name: /create account/i })

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '12345' } })  // Too short
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('shows success message on signup', async () => {
    // Mock Supabase response
    render(<SignUpPage />)

    // Fill form with valid data
    // Submit
    // Assert success message shown
  })
})
```

**Day 3: Submission & Query Tests (4 hours)**
- [ ] Test music submission form validation
- [ ] Test file upload validation (size, type)
- [ ] Test email validation
- [ ] Test required fields
- [ ] Test getBands() query function
- [ ] Test getBandBySlug() query function
- [ ] Test getVenues() query function
- [ ] Mock Supabase database responses

---

### Week 3, Days 4-5: Validation & Security (5 hours)

**Day 4: Stronger Passwords (1 hour)**
**Issue**: SEC-004 - Weak password requirements

- [ ] Update validation to require 8+ characters
- [ ] Require uppercase letter
- [ ] Require number
- [ ] Require special character
- [ ] Update error messages
- [ ] Write tests for new validation
- [ ] Update signup page UI

**Code**:
```typescript
// src/lib/validations/password.ts
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters')
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain an uppercase letter')
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain a number')
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain a special character')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}
```

**Day 5: Zod Validation (4 hours)**
**Issue**: VALID-001 - No validation library

- [ ] Install Zod: `yarn add zod`
- [ ] Create `src/lib/validations/submission.ts`
- [ ] Define MusicSubmissionSchema
- [ ] Update `src/app/submit/actions.ts` to use Zod
- [ ] Add proper error handling
- [ ] Test with invalid inputs
- [ ] Update form to show Zod errors

**Code**:
```typescript
// src/lib/validations/submission.ts
import { z } from 'zod'

export const MusicSubmissionSchema = z.object({
  band_name: z.string().min(2, 'Band name must be at least 2 characters').max(100),
  contact_email: z.string().email('Invalid email address'),
  contact_name: z.string().min(2).max(100),
  hometown: z.string().min(2).max(100),
  band_bio: z.string().min(50, 'Bio must be at least 50 characters').max(1000),
  music_description: z.string().min(20).max(500),
  genre: z.string().min(2),
  website: z.string().url().optional().or(z.literal('')),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  spotify: z.string().optional(),
})

// Usage in actions.ts
const result = MusicSubmissionSchema.safeParse(formData)
if (!result.success) {
  return {
    success: false,
    errors: result.error.flatten().fieldErrors
  }
}
```

---

### Week 4, Days 1-2: Dependency Updates (1 hour)

**Issue**: DEP-001 - Outdated packages

- [ ] Update Next.js: `yarn upgrade next@15.5.5 eslint-config-next@15.5.5`
- [ ] Update Supabase: `yarn upgrade @supabase/supabase-js@2.75.0`
- [ ] Update React: `yarn upgrade react@19.2.0 react-dom@19.2.0`
- [ ] Update types: `yarn upgrade @types/react@latest @types/react-dom@latest`
- [ ] Update Supabase CLI: `yarn upgrade supabase@2.51.0`
- [ ] Run tests after updates
- [ ] Test build locally
- [ ] Deploy to staging
- [ ] Verify app functionality
- [ ] Commit with clear message

---

### Week 4, Days 3-4: CI/CD Pipeline (3 hours)

**Issue**: CI-001 - No automated testing

**Tasks**:
- [ ] Create `.github/workflows/ci.yml`
- [ ] Add install step with frozen lockfile
- [ ] Add type-check job
- [ ] Add lint job
- [ ] Add test job
- [ ] Add security audit job
- [ ] Configure to run on push and pull_request
- [ ] Set up branch protection (require CI pass)
- [ ] Configure Vercel to wait for CI
- [ ] Test by creating PR with failing test

**Code**:
```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Type check
        run: yarn type-check

      - name: Lint
        run: yarn lint

      - name: Run tests
        run: yarn test:run

      - name: Security audit
        run: yarn audit --level=high
        continue-on-error: true  # Don't fail on warnings
```

---

### Week 4, Day 5: Error Tracking (2 hours)

**Issue**: MONITOR-001 - No error monitoring

**Tasks**:
- [ ] Sign up for Sentry account (free tier)
- [ ] Install `@sentry/nextjs`
- [ ] Run setup wizard: `npx @sentry/wizard@latest -i nextjs`
- [ ] Configure DSN in `.env.local`
- [ ] Add DSN to Vercel environment variables
- [ ] Test error reporting in development
- [ ] Trigger test error in staging
- [ ] Verify error appears in Sentry dashboard
- [ ] Set up email notifications
- [ ] Configure alert rules

**Code** (auto-generated by wizard):
```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,  // 10% of transactions
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === 'development') return null
    return event
  },
})
```

---

### 🎯 End of Week 3-4 Checkpoint

**Deliverables**:
- ✅ Test coverage: 40%+ (auth, submission, queries)
- ✅ Zod validation implemented
- ✅ Stronger password requirements
- ✅ CI/CD pipeline operational
- ✅ Error tracking live (Sentry)
- ✅ All dependencies updated

**Ready for**: Beta testing, limited public launch

---

## ⚡ Month 2: Performance & Optimization (P1-P2)

**Goal**: Optimize performance, refactor code, improve UX
**Team**: 1 developer
**Total Hours**: 21 hours

### Week 5: Code Splitting & Bundle Optimization (8 hours)

**Issue**: PERF-001 - Large bundle size (~470KB)

**Days 1-2: Component Lazy Loading (4 hours)**
- [ ] Identify heavy components (AudioPlayer, MusicSubmissionForm)
- [ ] Implement dynamic imports with next/dynamic
- [ ] Add loading skeletons for lazy-loaded components
- [ ] Test page load times before/after
- [ ] Measure bundle size reduction
- [ ] Add bundle analyzer: `yarn add -D @next/bundle-analyzer`
- [ ] Run analyzer: `ANALYZE=true yarn build`
- [ ] Identify other optimization opportunities

**Code**:
```typescript
// src/app/bands/[slug]/page.tsx
import dynamic from 'next/dynamic'

const AudioPlayer = dynamic(() => import('@/components/AudioPlayer'), {
  ssr: false,
  loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded" />
})

// Only load when needed
{band.band_tracks && band.band_tracks.length > 0 && (
  <AudioPlayer tracks={band.band_tracks} />
)}
```

**Days 3-4: Component Refactoring (4 hours)**
**Issue**: CODE-001 - MusicSubmissionForm too large

- [ ] Create `src/components/submission/` directory
- [ ] Extract BandInfoSection component (name, bio, hometown)
- [ ] Extract TracksUploadSection component
- [ ] Extract PhotoUploadSection component
- [ ] Extract GenreSelectionSection component
- [ ] Extract LinksSection component
- [ ] Extract ReviewSection component
- [ ] Update parent form to use new sections
- [ ] Test form still works
- [ ] Lazy load non-critical sections

---

### Week 6: Caching Strategy (6 hours)

**Issue**: PERF-002 - No caching (Partial: venue pages done ✅)

**Days 1-2: ISR Implementation (3 hours)**
- [ ] Add `export const revalidate = 3600` to band listing page
- [ ] Add `export const revalidate = 3600` to band detail pages
- [ ] Implement `generateStaticParams` for top 20 bands
- [ ] Test ISR works (page cached for 1 hour)
- [ ] Monitor cache hit rates
- [ ] Add cache headers for API routes

**Code**:
```typescript
// src/app/bands/[slug]/page.tsx
export const revalidate = 3600  // Revalidate every hour

export async function generateStaticParams() {
  const bands = await getBands(20)  // Pre-generate top 20
  return bands.map((band) => ({
    slug: band.slug,
  }))
}
```

**Days 3-4: CDN & Cache Headers (3 hours)**
- [ ] Configure cache headers in next.config.ts
- [ ] Set up Supabase CDN caching
- [ ] Add stale-while-revalidate headers
- [ ] Test cache headers with curl
- [ ] Monitor CDN hit rates in Vercel dashboard

**Code**:
```typescript
// next.config.ts
module.exports = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ]
  },
}
```

---

### Week 7: Security Hardening (7 hours)

**Week 7, Days 1-2: File Validation (3 hours)**
**Issue**: VALID-002 - No content validation

- [ ] Install file-type: `yarn add file-type`
- [ ] Add magic number checking for uploads
- [ ] Sanitize filenames (remove special chars, path traversal)
- [ ] Add maximum filename length check
- [ ] Test with fake/malicious files
- [ ] Document accepted file types

**Code**:
```typescript
import { fileTypeFromBuffer } from 'file-type'

const buffer = await file.arrayBuffer()
const fileType = await fileTypeFromBuffer(Buffer.from(buffer))

if (!['image/jpeg', 'image/png', 'image/webp'].includes(fileType?.mime || '')) {
  return { error: 'Invalid file type. File may be corrupted or disguised.' }
}

// Sanitize filename
const sanitizeFilename = (filename: string) => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')  // Remove special chars
    .replace(/\.{2,}/g, '.')           // Prevent ../../../
    .replace(/^\.+/, '')               // Remove leading dots
    .substring(0, 255)                 // Limit length
}
```

**Week 7, Days 3-4: CSP Improvements (2 hours)**
**Issue**: SEC-005 - CSP uses unsafe-inline

- [ ] Research CSP nonce implementation for Next.js
- [ ] Evaluate trade-offs (complexity vs. security gain)
- [ ] If implementing: add nonce generation
- [ ] Update CSP to use nonces
- [ ] Test all pages load correctly
- [ ] Monitor CSP violations

**Week 7, Day 5: CSP Reporting (2 hours)**
**Issue**: SEC-006 - No CSP violation reporting

- [ ] Create `/api/csp-report` endpoint
- [ ] Parse CSP violation reports
- [ ] Log to Sentry or database
- [ ] Add report-uri to CSP header
- [ ] Trigger test violation
- [ ] Verify report received
- [ ] Set up alerts for repeated violations

**Code**:
```typescript
// src/app/api/csp-report/route.ts
import { NextRequest } from 'next/server'
import * as Sentry from '@sentry/nextjs'

export async function POST(req: NextRequest) {
  const report = await req.json()

  // Log to Sentry
  Sentry.captureMessage('CSP Violation', {
    level: 'warning',
    extra: {
      'csp-report': report['csp-report'],
    },
  })

  return new Response('OK', { status: 200 })
}
```

---

### 🎯 End of Month 2 Checkpoint

**Deliverables**:
- ✅ Bundle size reduced by 30-40%
- ✅ MusicSubmissionForm refactored into smaller components
- ✅ ISR caching on all public pages
- ✅ CDN cache headers configured
- ✅ File content validation implemented
- ✅ CSP reporting operational

**Metrics**:
- Bundle size: ~320KB (down from ~470KB)
- LCP: < 2.5s (improved)
- Test coverage: 50%+
- Error rate: < 0.5%

---

## 🚀 Month 3: Scale & Future-Proof (P2-P3)

**Goal**: Prepare for scale, add nice-to-have features, documentation
**Team**: 1 developer
**Total Hours**: 18.5 hours

### Week 9: Advanced Security (6 hours)

**Week 9, Days 1-2: HSTS Preload (1 hour)**
**Issue**: SEC-007 - Not in HSTS preload list

- [ ] Update HSTS header to max-age=63072000 (2 years)
- [ ] Add 'preload' directive
- [ ] Test header in production
- [ ] Submit to https://hstspreload.org/
- [ ] Monitor preload status (takes weeks)
- [ ] Document in security docs

**Week 9, Days 3-4: 2FA Support (8 hours, Optional)**
**Issue**: FEAT-001 - No 2FA option

- [ ] Enable MFA in Supabase dashboard
- [ ] Create `/dashboard/settings/mfa` page
- [ ] Add MFA enrollment UI (QR code)
- [ ] Add MFA challenge UI (6-digit code)
- [ ] Test TOTP-based MFA with Google Authenticator
- [ ] Add recovery codes
- [ ] Document MFA setup for users
- [ ] Add "2FA" badge for users with MFA enabled

**Note**: Only implement if targeting high-value users or premium tier.

**Week 9, Day 5: Security.txt (0.5 hours)**
**Issue**: LEGAL-002 - No security.txt

- [ ] Create `public/.well-known/security.txt`
- [ ] Add contact: security@rocksalt.com
- [ ] Add expiration date (1 year from now)
- [ ] Add canonical URL
- [ ] Test https://rocksalt.com/.well-known/security.txt
- [ ] Verify format at https://securitytxt.org/

---

### Week 10: Performance & Image Optimization (6.5 hours)

**Week 10, Days 1-3: Image Optimization (6 hours)**
**Issue**: PERF-003 - No image optimization

- [ ] Audit all `<img>` tags in codebase
- [ ] Replace with Next.js `<Image>` component
- [ ] Add width/height attributes
- [ ] Enable lazy loading (default)
- [ ] Use `priority` for above-the-fold images
- [ ] Configure image domains in next.config.ts
- [ ] Test images load correctly
- [ ] Measure LCP improvement

**Code**:
```typescript
import Image from 'next/image'

<Image
  src={band.image_url}
  alt={band.name}
  width={400}
  height={400}
  className="rounded-lg"
  priority={isFeaturedBand}
/>
```

**Week 10, Day 4: Lighthouse Audit (0.5 hours)**
- [ ] Run Lighthouse on production homepage
- [ ] Run Lighthouse on band detail page
- [ ] Run Lighthouse on submission page
- [ ] Review all recommendations
- [ ] Create tickets for improvements
- [ ] Aim for 90+ score on all metrics

---

### Week 11: Operations & Compliance (6 hours)

**Week 11, Days 1-2: Disaster Recovery Docs (2 hours)**
**Issue**: DOC-001 - No DR procedure

- [ ] Document Supabase backup restoration
- [ ] Document Vercel rollback procedure
- [ ] List emergency contacts (Supabase, Vercel support)
- [ ] Create incident response runbook
- [ ] Test backup restoration in staging
- [ ] Review with team

**Week 11, Days 3-4: Data Retention Automation (4 hours)**
**Issue**: OPS-001 - No data retention policy

- [ ] Define retention policy (e.g., 90 days for rejected submissions)
- [ ] Create cleanup SQL function
- [ ] Schedule with pg_cron (Supabase)
- [ ] Test cleanup function in staging
- [ ] Monitor execution logs
- [ ] Document policy in Privacy Policy

**Code**:
```sql
-- Function to clean up old rejected submissions
CREATE OR REPLACE FUNCTION cleanup_old_submissions()
RETURNS void AS $$
BEGIN
  DELETE FROM music_submissions
  WHERE status = 'rejected'
  AND created_at < now() - interval '90 days';

  DELETE FROM music_submissions
  WHERE status = 'pending'
  AND created_at < now() - interval '180 days';  -- 6 months for pending
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule daily at 2 AM
SELECT cron.schedule(
  'cleanup-old-submissions',
  '0 2 * * *',  -- Daily at 2 AM UTC
  'SELECT cleanup_old_submissions()'
);
```

---

### Week 12: Final Testing & Documentation (Ongoing)

**Week 12, Days 1-5: Comprehensive Testing**
- [ ] Run full regression test suite
- [ ] Test all auth flows end-to-end
- [ ] Test submission flow end-to-end
- [ ] Test file uploads with edge cases
- [ ] Test rate limiting edge cases
- [ ] Load test API endpoints (100 req/s)
- [ ] Security scan with OWASP ZAP
- [ ] Accessibility audit with axe DevTools
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Mobile testing (iOS Safari, Android Chrome)

**Documentation Updates**:
- [ ] Update README with setup instructions
- [ ] Document all environment variables
- [ ] Create API documentation (if external API)
- [ ] Update architecture diagram
- [ ] Document deployment process
- [ ] Create troubleshooting guide
- [ ] Document common errors and solutions

---

## 🎯 End of 90 Days: Production-Ready ✅

### Final Deliverables Checklist

#### Security
- [x] All P0 security issues resolved
- [x] Rate limiting operational
- [x] Storage RLS fixed
- [x] Dashboard protected
- [x] Terms & Privacy pages live
- [x] CSP violation reporting
- [x] HSTS preloaded
- [x] Input validation (Zod)
- [x] File content validation
- [ ] Optional: 2FA implemented

#### Quality
- [x] Test coverage > 70%
- [x] CI/CD pipeline operational
- [x] Error tracking live (Sentry)
- [x] All critical paths tested
- [x] E2E tests for main flows
- [x] Accessibility audit passed
- [x] Cross-browser compatibility verified

#### Performance
- [x] Bundle size < 350KB (down from ~470KB)
- [x] LCP < 2.5s
- [x] FID < 100ms
- [x] CLS < 0.1
- [x] Lighthouse score > 90
- [x] ISR caching on all public pages
- [x] Images optimized with Next.js Image

#### Operations
- [x] Disaster recovery documented
- [x] Incident response plan
- [x] Data retention automated
- [x] Monitoring dashboards set up
- [x] Alerts configured
- [x] Documentation complete

---

## 📊 Success Metrics

### Week 4 (End of P0+P1)
```
Security Score: 85/100 (up from 75)
Test Coverage: 40%
Error Rate: < 1%
All P0 blockers resolved ✅
```

### Month 2 (End of P1+P2)
```
Security Score: 90/100
Test Coverage: 50%
Bundle Size: ~320KB (32% reduction)
LCP: < 2.5s
Error Rate: < 0.5%
```

### Month 3 (Production Ready)
```
Security Score: 95/100
Test Coverage: 70%+
Bundle Size: < 350KB
All Core Web Vitals: Green
Error Rate: < 0.2%
Lighthouse Score: 90+
Uptime: 99.9%
```

---

## 🚦 Go/No-Go Decision Points

### After Week 2 (P0 Complete)
**GO if**:
- ✅ All 4 P0 issues fixed
- ✅ Storage RLS verified secure
- ✅ Rate limiting tested under load
- ✅ Dashboard auth tested
- ✅ Legal pages reviewed

**NO-GO if**:
- ❌ Any P0 issue unresolved
- ❌ Rate limiting not working
- ❌ Auth bypass possible

### After Week 4 (P1 Complete)
**GO for Beta Launch if**:
- ✅ Test coverage > 40%
- ✅ CI/CD operational
- ✅ Error tracking live
- ✅ No critical bugs in staging
- ✅ All P0+P1 issues resolved

**NO-GO if**:
- ❌ Test coverage < 30%
- ❌ Critical bugs in staging
- ❌ No error monitoring

### After Month 3 (Production Ready)
**GO for Public Launch if**:
- ✅ Test coverage > 70%
- ✅ All Core Web Vitals green
- ✅ Lighthouse score > 90
- ✅ Security audit passed
- ✅ Load testing passed
- ✅ Disaster recovery tested

---

## 💡 Tips for Success

### Development Best Practices
1. **Write tests first** (TDD) for new features
2. **Review security** before merging PRs
3. **Monitor errors daily** in Sentry
4. **Keep dependencies updated** weekly
5. **Document as you go** - don't leave for later

### Communication
1. **Daily standups** - Quick sync on progress
2. **Weekly demos** - Show completed work to stakeholders
3. **Bi-weekly retrospectives** - Reflect and improve
4. **Document decisions** - Keep a decision log

### Risk Mitigation
1. **Feature flags** - Deploy features hidden, enable gradually
2. **Staged rollout** - Deploy to 10% → 50% → 100% of users
3. **Canary deployments** - Test with small % before full rollout
4. **Rollback plan** - Always have a way to revert quickly

---

## 📞 Support & Resources

### Internal
- Audit Reports: `_audit/` directory
- Prioritized Backlog: `_audit/09-prioritized-backlog.json`
- Executive Summary: `_audit/00-EXECUTIVE-SUMMARY.md`

### External
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Testing Library: https://testing-library.com/docs/react-testing-library/intro/
- Web.dev Guides: https://web.dev/

### Emergency Contacts
- Supabase Support: support@supabase.io
- Vercel Support: support@vercel.com
- Sentry Support: support@sentry.io

---

**Roadmap Complete**: Ready for implementation!
**Good luck, and ship it! 🚀**
