# Quick Stripe Setup - Final Step

## ✅ You Have Everything!

**Stripe Keys:**
- ✅ `STRIPE_SECRET_KEY` - Already in Vercel
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Already in Vercel
- ✅ `STRIPE_WEBHOOK_SECRET` - **Add this now:** `whsec_gUYrSnSBiCcqpDR1Q5CxoPpvYtxpSLlD`

## 🚀 Add Webhook Secret to Vercel

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Click "Create new"
3. Fill in:
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_gUYrSnSBiCcqpDR1Q5CxoPpvYtxpSLlD`
   - **Environment**: All Environments
   - **Sensitive**: ✅ Enable (recommended)
4. Click "Save"
5. **Redeploy** your project (or wait for next deployment)

## 🔗 Set Up Webhook Endpoint in Stripe

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint" (or edit existing)
3. **Endpoint URL**: `https://www.therocksalt.com/api/webhooks/stripe`
4. **Description**: "The Rock Salt Payment Webhooks"
5. **Events to send**:
   - ✅ `payment_intent.succeeded`
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
6. Click "Add endpoint"
7. Verify the signing secret matches: `whsec_gUYrSnSBiCcqpDR1Q5CxoPpvYtxpSLlD`

## ✅ Verification Checklist

After adding the webhook secret:

- [ ] `STRIPE_WEBHOOK_SECRET` added to Vercel
- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] All 5 events selected in Stripe
- [ ] Project redeployed (or next deployment will include it)
- [ ] Test webhook sent from Stripe Dashboard
- [ ] Check Vercel function logs to verify webhook received

## 🧪 Test Payment Flow

Once webhook is set up:

1. Create a test checkout session via API
2. Complete payment in Stripe test mode (or use test card)
3. Check Vercel logs to see webhook received
4. Verify database updated (check `song_requests`, `tips`, etc.)

## 🎉 You're Ready!

Once the webhook secret is in Vercel and the endpoint is configured in Stripe, your entire payment system will be fully operational!

---

**All Stripe configuration is complete. Just add the webhook secret to Vercel and configure the endpoint in Stripe Dashboard.**

