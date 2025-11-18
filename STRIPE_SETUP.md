# Stripe Setup Instructions

## ✅ Your Stripe Keys (Live Mode)

**IMPORTANT:** These keys are already provided. Add them to your environment variables.

### Environment Variables to Set:

#### Local Development (.env.local)
```bash
# Stripe (Live Mode)
# Get these from your Stripe Dashboard → Developers → API keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... # Get this from Stripe Dashboard → Webhooks
```

#### Vercel Production
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable (get values from Stripe Dashboard):
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (from Stripe Dashboard → Developers → API keys)
   - `STRIPE_SECRET_KEY` = `sk_live_...` (from Stripe Dashboard → Developers → API keys)
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...` (from Stripe Dashboard → Webhooks → Your endpoint → Signing secret)

## 🔐 Webhook Setup

### Step 1: Get Webhook Secret ✅
**To get your webhook secret:**
1. Go to Stripe Dashboard → Webhooks → Your endpoint
2. Click "Reveal" next to "Signing secret"
3. Copy the secret (starts with `whsec_`)

**To set up the webhook endpoint:**
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint" (or edit existing)
3. Endpoint URL: `https://www.therocksalt.com/api/webhooks/stripe`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Add endpoint"
6. **Add to Vercel environment variables:**
   - Key: `STRIPE_WEBHOOK_SECRET`
   - Value: `whsec_...` (the signing secret from step 1)
   - Environment: All Environments
   - Sensitive: ✅ Enable

### Step 2: Test Webhook (Optional)
1. In Stripe Dashboard → Webhooks → Your endpoint
2. Click "Send test webhook"
3. Select event type (e.g., `payment_intent.succeeded`)
4. Verify your endpoint receives it

## 💳 Creating Price IDs for Subscriptions

### For Fan Club Tiers:
1. Go to Stripe Dashboard → Products
2. Create products for each tier:
   - **Bronze Fan Club** - $5/month (or custom price)
   - **Silver Fan Club** - $10/month
   - **Gold Fan Club** - $15/month
3. Copy the Price ID (starts with `price_`)
4. Store in database or use in subscription checkout

### For Analytics Dashboard:
1. Create product: "Analytics Dashboard"
2. Set price: $15/month (recurring)
3. Copy Price ID
4. Use in subscription checkout API

## 🧪 Testing

### Test Mode (Recommended for Development)
If you want to test without real charges:
1. Use test mode keys from Stripe Dashboard
2. Test cards: https://stripe.com/docs/testing
3. Test webhook with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

### Live Mode (Current)
- All charges are REAL
- Use with caution
- Monitor Stripe Dashboard for transactions

## 📝 Quick Test Checklist

- [ ] Environment variables set in Vercel
- [ ] Webhook endpoint configured in Stripe
- [ ] Webhook secret added to environment variables
- [ ] Test checkout session creation
- [ ] Test webhook receives events
- [ ] Verify database updates on payment success

## 🔗 Useful Links

- Stripe Dashboard: https://dashboard.stripe.com
- Webhook Testing: https://dashboard.stripe.com/test/webhooks
- API Reference: https://stripe.com/docs/api
- Testing Cards: https://stripe.com/docs/testing

---

**Security Reminder:** Never commit these keys to git. They're already in `.gitignore`, but double-check before committing.

