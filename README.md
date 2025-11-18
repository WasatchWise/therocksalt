# The Rock Salt 🎸

**Salt Lake's Music Hub** - Since 2002

A comprehensive platform for Utah's music scene featuring live radio, event curation, artist directories, and community engagement.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and Yarn
- Supabase account and project
- (Optional) Stripe account for monetization
- (Optional) AzuraCast instance for live streaming

### Installation

```bash
# Install dependencies
yarn install

# Set up environment variables (see .env.example)
cp .env.example .env.local

# Start Supabase locally (optional)
yarn db:start

# Run development server
yarn dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📋 Environment Variables

See [.env.example](.env.example) for all required environment variables.

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)

**Optional:**
- `STRIPE_SECRET_KEY` - For payment processing
- `STRIPE_WEBHOOK_SECRET` - For Stripe webhooks
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `X_API_Key` - AzuraCast API key for live streaming
- `NEXT_PUBLIC_STREAM_URL` - Live stream URL
- `CRON_SECRET` - Secret for cron job authentication
- `SONGKICK_API_KEY` - For event curation
- `BANDSINTOWN_APP_ID` - For event curation

## 🏗️ Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── api/          # API routes
│   ├── bands/        # Band directory pages
│   ├── events/       # Event listings
│   ├── live/         # Live radio player
│   └── ...
├── components/       # React components
├── lib/             # Utilities and business logic
│   ├── events/      # Event curation scrapers
│   ├── supabase/   # Database queries
│   └── stripe/      # Payment processing
└── types/           # TypeScript types
```

## 🎯 Key Features

### Event Curation
- Automated event scraping from multiple sources (SLUG Magazine, City Weekly)
- Music-focused filtering (excludes non-music events)
- Tier-based event display (HOF, Featured, Free)
- Automatic sync via cron jobs

### Band Directory
- Comprehensive artist profiles
- Tier system (Hall of Fame, Platinum, Featured, Garage, Anon)
- Genre tagging and filtering
- Save bands feature (localStorage)
- Band claiming system

### Live Radio
- 24/7 streaming integration with AzuraCast
- Real-time "Now Playing" display
- Floating audio player

### Venues
- Venue directory with photos
- Capacity and amenities tracking
- Location-based filtering

## 🛠️ Development

### Database

```bash
# Start Supabase locally
yarn db:start

# Push migrations
yarn db:push

# Generate TypeScript types
yarn db:types
```

### Event Curation

Event curation runs automatically via cron job (`/api/cron/sync-events`) every 6 hours.

To manually trigger:
```bash
curl -X POST https://your-domain.com/api/cron/sync-events \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Testing

```bash
# Run tests
yarn test

# Run tests with UI
yarn test:ui

# Coverage report
yarn test:coverage
```

## 📦 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push to `main`

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Environment Setup

Before deploying, ensure all environment variables are set in your hosting platform:
- Vercel: Project Settings → Environment Variables
- Add variables for Production, Preview, and Development environments

## 📚 Documentation

- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [ENVIRONMENT_VARIABLES_CHECKLIST.md](ENVIRONMENT_VARIABLES_CHECKLIST.md) - Environment setup
- [EVENT_CURATION_SETUP.md](EVENT_CURATION_SETUP.md) - Event scraping configuration
- [LIVE_RADIO_SETUP_DOCUMENTATION.md](LIVE_RADIO_SETUP_DOCUMENTATION.md) - Radio streaming setup
- [STRIPE_SETUP.md](STRIPE_SETUP.md) - Payment processing setup

## 🎨 Design System

The site uses a refined, professional design with:
- Tier-based visual hierarchy (subtle left borders, clean badges)
- Consistent typography scale
- Dark mode support
- Responsive grid layouts
- Generational bridge design (appeals to Gen Alpha + Gen X)

## 🔐 Security

- Environment variables are never committed
- API routes use authentication where required
- Cron jobs require secret authentication
- Stripe webhooks verify signatures
- Supabase RLS policies enforce data access

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 License

Private - The Rock Salt

## 🆘 Support

For issues or questions:
- Email: music@therocksalt.com
- Discord: [Salt Vault](https://therocksalt.discourse.group)

---

**Built with:** Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase, Stripe
