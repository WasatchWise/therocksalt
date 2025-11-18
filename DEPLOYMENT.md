# Deployment Guide

Complete guide for deploying The Rock Salt to production.

## 🚀 Pre-Deployment Checklist

### 1. Environment Variables

Ensure all required environment variables are set in your hosting platform:

**Required:**
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `CRON_SECRET`

**Optional (but recommended):**
- ✅ `STRIPE_SECRET_KEY`
- ✅ `STRIPE_WEBHOOK_SECRET`
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- ✅ `X_API_Key` (AzuraCast)
- ✅ `NEXT_PUBLIC_STREAM_URL`

See [ENVIRONMENT_VARIABLES_CHECKLIST.md](ENVIRONMENT_VARIABLES_CHECKLIST.md) for complete list.

### 2. Database Migrations

All Supabase migrations should be applied:

```bash
# If using Supabase CLI
supabase db push

# Or apply migrations manually in Supabase dashboard
```

### 3. Stripe Configuration

If using payments:

1. **Webhook Endpoint:**
   - URL: `https://your-domain.com/api/webhooks/stripe`
   - Events: `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `checkout.session.completed`, `payment_intent.succeeded`

2. **Add Webhook Secret:**
   - Copy webhook signing secret from Stripe Dashboard
   - Add as `STRIPE_WEBHOOK_SECRET` in environment variables

See [STRIPE_SETUP.md](STRIPE_SETUP.md) for details.

### 4. Cron Jobs

The event sync cron is configured in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/sync-events",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

Ensure `CRON_SECRET` is set in environment variables.

## 📦 Deploying to Vercel

### Initial Setup

1. **Connect Repository:**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project:**
   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `yarn build` (or `npm run build`)
   - Output Directory: `.next` (default)

3. **Add Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.example`
   - Set for Production, Preview, and Development

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `your-project.vercel.app`

### Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `therocksalt.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

### Automatic Deployments

- **Production:** Deploys on push to `main` branch
- **Preview:** Deploys on pull requests
- **Development:** Deploys on push to other branches

## 🔄 Post-Deployment

### 1. Verify Environment Variables

Check that all variables are accessible:

```bash
# Visit your health check endpoint
curl https://your-domain.com/health/env
```

### 2. Test Critical Features

- ✅ Homepage loads
- ✅ Band directory works
- ✅ Events page displays
- ✅ Live radio player works
- ✅ Authentication flows
- ✅ (If enabled) Payment processing

### 3. Monitor Cron Jobs

Check Vercel logs to ensure cron jobs are running:

```bash
# In Vercel Dashboard → Functions → Logs
# Look for successful cron executions
```

### 4. Set Up Monitoring

- **Vercel Analytics:** Enable in project settings
- **Error Tracking:** Consider Sentry or similar
- **Uptime Monitoring:** Set up external monitoring

## 🐛 Troubleshooting

### Build Failures

**Issue:** Build fails with TypeScript errors
- **Solution:** Run `yarn build` locally first, fix errors

**Issue:** Missing environment variables
- **Solution:** Check Vercel dashboard, ensure all vars are set

### Runtime Errors

**Issue:** Database connection fails
- **Solution:** Verify Supabase URL and keys are correct

**Issue:** Cron jobs not running
- **Solution:** Check `CRON_SECRET` is set, verify cron path in `vercel.json`

**Issue:** Stripe webhooks failing
- **Solution:** Verify `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard

### Performance

**Issue:** Slow page loads
- **Solution:** 
  - Enable Vercel Edge Caching
  - Optimize images
  - Check database query performance

## 🔐 Security Checklist

- ✅ All secrets in environment variables (never committed)
- ✅ Supabase RLS policies enabled
- ✅ API routes authenticated where needed
- ✅ Cron jobs require secret
- ✅ Stripe webhooks verify signatures
- ✅ HTTPS enabled (automatic on Vercel)

## 📊 Monitoring

### Vercel Dashboard

- **Analytics:** Page views, performance metrics
- **Functions:** API route execution logs
- **Cron:** Scheduled job execution history

### Supabase Dashboard

- **Database:** Query performance, connection pool
- **Auth:** User signups, active sessions
- **Storage:** Band photos, file uploads

## 🚨 Rollback

If deployment has issues:

1. **Vercel:**
   - Go to Deployments
   - Find previous working deployment
   - Click "..." → "Promote to Production"

2. **Database:**
   - If migrations caused issues, revert in Supabase dashboard
   - Or create new migration to fix

## 📝 Maintenance

### Regular Tasks

- **Weekly:** Review error logs
- **Monthly:** Update dependencies (`yarn upgrade`)
- **Quarterly:** Review and optimize database queries
- **As needed:** Update event curation scrapers

### Updates

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
yarn install

# Test locally
yarn dev

# Deploy (automatic on push to main)
git push origin main
```

---

**Need Help?** Check the main [README.md](README.md) or contact support.

