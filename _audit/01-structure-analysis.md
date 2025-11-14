# Phase 1.1: Project Structure Analysis

**Date**: October 14, 2025
**Project**: The Rock Salt (rocksalt.com)
**Framework**: Next.js 15.5.4 + TypeScript + Supabase

---

## Executive Summary

The Rock Salt is a modern web application built with Next.js 15 (App Router), TypeScript, React 19, and Supabase backend. The codebase is relatively lean with 44 TypeScript files totaling ~6,746 lines of code, indicating an early/mid-stage application.

**Health Indicators**:
- Framework: Next.js 15.5.4 (Latest stable)
- TypeScript: Configured with strict mode
- Dependencies: 275MB node_modules (reasonable size)
- Architecture: Modern App Router pattern
- Backend: Supabase (PostgreSQL + Auth + Storage)

---

## 1. Framework Identification

### Primary Stack
```
Next.js:        15.5.4 (Latest - released Oct 2024)
React:          19.1.0 (Latest - experimental features)
TypeScript:     5.x (strict mode enabled)
Backend:        Supabase 2.48.3
Styling:        Tailwind CSS 4.x
Package Mgr:    Yarn 1.22.22
```

### Key Configuration Files
```
✓ package.json          - 5 dependencies, 8 devDependencies (lean)
✓ next.config.ts        - Security headers configured
✓ tsconfig.json         - Strict TypeScript with path aliases (@/*)
✓ eslint.config.mjs     - ESLint 9 with Next.js rules
✓ postcss.config.mjs    - Tailwind CSS 4 PostCSS setup
✓ .gitignore            - Standard Next.js patterns
```

---

## 2. Project Structure

### Directory Layout
```
the-rock-salt/
├── src/
│   ├── app/                    # Next.js App Router (28 files)
│   │   ├── about/              # Static page
│   │   ├── auth/               # Auth flows (signin, signup, callback, error)
│   │   ├── bands/              # Band listing + dynamic [slug] pages
│   │   ├── venues/             # Venue listing + dynamic [slug] pages
│   │   ├── events/             # Events listing
│   │   ├── episodes/           # Episodes listing
│   │   ├── submit/             # Submission form + server actions
│   │   ├── dashboard/          # Protected dashboard + band management
│   │   ├── test-db/            # Database testing page
│   │   ├── api/                # API routes
│   │   │   └── tracks/[trackId]/play/  # Track playback endpoint
│   │   ├── health/env/         # Environment health check
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   ├── error.tsx           # Error boundary
│   │   └── not-found.tsx       # 404 page
│   │
│   ├── components/             # React components (9 files)
│   │   ├── AudioPlayer.tsx
│   │   ├── MusicSubmissionForm.tsx
│   │   ├── UploadPhotoForm.tsx
│   │   ├── UploadTrackForm.tsx
│   │   ├── ClaimBandButton.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Logo.tsx
│   │   └── Button.tsx
│   │
│   ├── lib/                    # Utilities and API clients
│   │   ├── supabase/           # Supabase client setup
│   │   │   ├── client.ts       # Client-side Supabase
│   │   │   ├── server.ts       # Server-side Supabase
│   │   │   └── queries.ts      # Database queries
│   │   └── apis/
│   │       └── unsplash.ts     # Unsplash API integration
│   │
│   ├── hooks/                  # Custom React hooks
│   │   └── useAuth.ts          # Authentication hook
│   │
│   └── types/                  # TypeScript definitions
│       ├── supabase.ts         # Auto-generated Supabase types
│       ├── database.ts         # Custom database types
│       └── submission.ts       # Form submission types
│
├── supabase/                   # Supabase project config
│   └── migrations/             # Database migrations
│
├── public/                     # Static assets
│
├── docs/                       # Documentation
│
├── .next/                      # Next.js build output
├── .vercel/                    # Vercel deployment config
│
└── [30+ SQL migration files]   # Database setup scripts (see note below)
```

### Observations
- **Clean separation**: App logic (src/app), reusable components, utilities
- **App Router pattern**: Fully migrated to Next.js 13+ App Router
- **Type safety**: Dedicated types directory with Supabase codegen
- **API organization**: Minimal API routes, leveraging Server Actions

---

## 3. Entry Points

### Main Entry Points
| File | Purpose | Type |
|------|---------|------|
| `src/app/layout.tsx` | Root layout, global HTML structure | Layout |
| `src/app/page.tsx` | Homepage | Page |
| `src/app/submit/page.tsx` | Music submission form | Page |
| `src/app/dashboard/page.tsx` | User dashboard | Protected Page |

### API Endpoints
- `/api/tracks/[trackId]/play` - Track playback handler
- `/health/env` - Environment variable diagnostics
- `/robots.txt` - SEO robots file
- Server Actions in `src/app/submit/actions.ts` and `src/app/actions/claimBand.ts`

---

## 4. Build Configuration

### Next.js Config (next.config.ts:3-11)
**Security Headers Configured**:
- ✅ `Strict-Transport-Security` (HSTS)
- ✅ `X-Content-Type-Options: nosniff`
- ✅ `X-Frame-Options: SAMEORIGIN`
- ✅ `Referrer-Policy: no-referrer`
- ✅ `Permissions-Policy` (camera, mic, geolocation disabled)
- ✅ `X-XSS-Protection: 0` (modern browsers use CSP instead)
- ⚠️ **Missing**: Content-Security-Policy (CSP)

### TypeScript Config (tsconfig.json:7)
- **Strict mode**: Enabled
- **Target**: ES2017 (modern browsers)
- **Module resolution**: Bundler (optimal for Next.js)
- **Path aliases**: `@/*` maps to `src/*`

---

## 5. Environment Configuration

### Environment Files Found
```
.env.example        - Template file (safe)
.env.local          - Local development secrets
.env.production     - Production environment variables
.env.l              - Unknown/orphaned file (needs cleanup)
```

**Security Note**: Multiple .env files detected. Ensure `.env.local` and `.env.production` are in `.gitignore`.

---

## 6. Database & Migrations

### Supabase Setup
- **Migration files**: 30+ SQL files in root directory (messy)
- **Migration types**: Schema setup, RLS policies, seed data, storage config
- **Supabase CLI**: Integrated with `db:*` npm scripts

**Key Files**:
- `MASTER_SETUP.sql`, `MASTER_SETUP_SAFE.sql` - Complete database setup
- `SETUP_STORAGE_AND_RLS.sql` - Storage bucket configuration
- `COMPLETE_RLS_POLICIES.sql` - Row Level Security policies
- Multiple seed files: `SEED_FINAL.sql`, `SEED_NO_CONFLICT.sql`, etc.

**⚠️ CRITICAL ISSUE**: SQL migration files should be in `supabase/migrations/` directory, not root. This creates:
- Versioning confusion
- Difficult to track migration history
- Hard to understand which migrations have been applied
- Risk of applying outdated/conflicting migrations

---

## 7. Code Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| **Total TypeScript files** | 44 | Small/Medium codebase |
| **Total lines of code** | ~6,746 | Early/mid-stage app |
| **node_modules size** | 275 MB | Reasonable (lean dependency tree) |
| **Dependencies** | 5 | Excellent - minimal bloat |
| **DevDependencies** | 8 | Clean development setup |
| **Pages/Routes** | ~15 | Moderate route complexity |
| **Components** | 9 | Could benefit from more abstraction |

---

## 8. Documentation Found

### Project Documentation
- `README.md` - Main project readme
- `QUICK_START.md` - Quick start guide
- `PLATFORM_BLUEPRINT.md` - Architecture overview
- `BAND_MANAGER_BLUEPRINT.md` - Band management feature spec
- `SUBMISSION_FORM_README.md` - Form documentation
- `SETUP_CHECKLIST.md` - Setup instructions
- Multiple `*_SETUP.md` and `*_INSTRUCTIONS.md` files

**Assessment**: Well-documented for an early-stage project, but documentation is scattered across root directory.

---

## 9. Key Findings

### ✅ Strengths
1. **Modern stack**: Latest Next.js 15 + React 19 + TypeScript
2. **Security-conscious**: Security headers configured
3. **Type safety**: Strict TypeScript + Supabase type generation
4. **Clean architecture**: Proper separation of concerns
5. **Lean dependencies**: Only 5 production dependencies
6. **Documentation**: Comprehensive setup guides

### ⚠️ Issues Identified

#### P0 - Critical
- **SQL files in root**: 30+ migration files cluttering root directory
- **Multiple .env files**: Potential for environment variable confusion
- **Missing CSP**: Content-Security-Policy header not configured

#### P1 - High Priority
- **Orphaned file**: `.env.l` file purpose unclear
- **Documentation sprawl**: Too many markdown files in root
- **No test files**: No evidence of testing infrastructure

#### P2 - Medium Priority
- **Component organization**: Could benefit from feature-based grouping
- **Limited error handling**: Only global error.tsx, no granular boundaries

---

## 10. Recommendations

### Immediate Actions (Week 1)
1. **Organize migrations**: Move all SQL files to `supabase/migrations/` with proper naming (timestamp-based)
2. **Environment audit**: Consolidate .env files, remove `.env.l`, verify .gitignore
3. **Add CSP header**: Implement Content-Security-Policy in next.config.ts
4. **Documentation cleanup**: Move docs to `docs/` directory

### Short-term (Week 2-4)
5. Set up testing framework (Vitest + Testing Library)
6. Add error boundaries for critical user flows
7. Implement component library organization
8. Set up pre-commit hooks for type checking

### Architecture Notes
- **Supabase integration**: Well-structured with separate client/server modules
- **Server Actions**: Good use of Next.js 13+ patterns for form handling
- **Dynamic routes**: Proper use of [slug] patterns for bands/venues
- **Auth flow**: Complete auth implementation with callback handling

---

## Next Steps

Proceed to **Phase 1.2: Dependency Health Check** to analyze:
- Outdated packages
- Security vulnerabilities
- Dependency tree efficiency
- Potential breaking changes in updates
