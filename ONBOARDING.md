# Onboarding Guide

Welcome to The Rock Salt development! This guide will help you get up and running quickly.

## 🚀 Quick Start (5 minutes)

### 1. Clone and Install

```bash
git clone <repository-url>
cd the-rock-salt
yarn install
```

### 2. Environment Setup

Create `.env.local` file:

```bash
# Copy from .env.example (or see README.md for full list)
cp .env.example .env.local
```

**Minimum required variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=random-secret-string
```

### 3. Start Development

```bash
# Start Supabase locally (optional)
yarn db:start

# Start dev server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📚 Key Concepts

### Project Structure

- **`src/app/`** - Next.js pages and API routes
- **`src/components/`** - Reusable React components
- **`src/lib/`** - Business logic and utilities
  - **`lib/events/`** - Event scraping and curation
  - **`lib/supabase/`** - Database queries
  - **`lib/stripe/`** - Payment processing

### Tier System

Bands and events use a tier system:

- **HOF (Hall of Fame)** - Premium tier, dark background, yellow accents
- **Platinum** - High tier, purple accents
- **Featured** - Promoted content, yellow accents
- **Garage** - Emerging artists, orange accents
- **Anon** - Default tier, standard styling

### Event Curation

Events are automatically scraped from:
- SLUG Magazine
- City Weekly
- (Future: Songkick, Bandsintown)

Events are filtered to only include music-related content (excludes dance recitals, trivia nights, etc.)

## 🛠️ Common Tasks

### Adding a New Band

1. Go to `/admin/bands` (if admin)
2. Or use the submission form at `/submit`
3. Bands are reviewed before being added

### Testing Event Curation

```bash
# Manually trigger event sync
curl -X POST http://localhost:3000/api/cron/sync-events \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Database Changes

```bash
# Create migration
supabase migration new your_migration_name

# Apply locally
yarn db:push

# Generate types
yarn db:types
```

## 🐛 Troubleshooting

### "Cannot connect to Supabase"
- Check `.env.local` has correct Supabase credentials
- Verify Supabase project is active

### "Build fails"
- Run `yarn build` locally to see errors
- Check TypeScript errors: `yarn tsc --noEmit`

### "Events not syncing"
- Check `CRON_SECRET` is set
- Verify cron job is configured in Vercel
- Check API route logs

## 📖 Next Steps

1. **Read the README.md** - Full project overview
2. **Check DEPLOYMENT.md** - If deploying
3. **Review code structure** - Explore `src/` directory
4. **Join the team** - Get access to Supabase, Vercel, etc.

## 🆘 Getting Help

- **Documentation:** Check `/docs` folder
- **Issues:** Create GitHub issue
- **Questions:** Ask in team chat/Discord

---

**Welcome aboard!** 🎸

