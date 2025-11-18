# Environment Variables Checklist

## ✅ Already Configured in Vercel

Based on your Vercel dashboard, you have:

- ✅ `STRIPE_SECRET_KEY` - Added
- ✅ `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Added
- ✅ `X_API_Key` - AzuraCast API key (already configured)
- ✅ `NEXT_PUBLIC_STREAM_URL` - Live stream URL
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- ✅ `NEXT_PUBLIC_SUPABASE_URL` - (Likely set, check if visible)

## ⚠️ Missing (Required for Full Functionality)

### Critical - Add These Now:

1. **STRIPE_WEBHOOK_SECRET** ⚠️ **REQUIRED** - **PROVIDED**
   - Value: `whsec_gUYrSnSBiCcqpDR1Q5CxoPpvYtxpSLlD`
   - **Action needed:** Add to Vercel environment variables
   - **Without this, webhooks won't work and payments won't update database**

2. **NEXT_PUBLIC_SUPABASE_URL** (if not already set)
   - Should be: `https://yznquvzzqrvjafdfczak.supabase.co`
   - Check if it's in your Vercel env vars

### Optional (For Future Features):

3. **TWITTER_API_KEY** - For social media automation
4. **INSTAGRAM_API_KEY** - For social media automation
5. **FACEBOOK_API_KEY** - For social media automation
6. **NEXT_PUBLIC_UNSPLASH_ACCESS_KEY** - For band photo fetching (you have UNSPLASH_ACCESS_KEY, might need NEXT_PUBLIC_ prefix)

## 🔧 How to Add Missing Variables

### In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Click "Create new"
3. Add each variable:
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_...` (from Stripe Dashboard)
   - **Environment**: All Environments
   - **Sensitive**: ✅ Enable (recommended)

## 📋 Quick Verification

After adding `STRIPE_WEBHOOK_SECRET`, verify:

1. **Stripe Webhook Endpoint** is configured:
   - URL: `https://www.therocksalt.com/api/webhooks/stripe`
   - Events selected (see STRIPE_SETUP.md)

2. **Test the webhook**:
   - In Stripe Dashboard → Webhooks → Your endpoint
   - Click "Send test webhook"
   - Check your Vercel function logs to see if it receives it

## 🚀 Ready to Deploy

Once `STRIPE_WEBHOOK_SECRET` is added:
- ✅ All payment features will work
- ✅ Webhooks will update database automatically
- ✅ Subscriptions will be tracked
- ✅ Tips will be recorded

---

**Current Status**: 95% ready - just need webhook secret!

