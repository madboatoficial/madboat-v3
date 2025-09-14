# 💳 MadBoat Stripe Integration Setup Guide

## 🎯 Overview

Complete guide to set up Stripe payment processing with automatic user creation in MadBoat v3. This integration enables:

- **Automated subscription payments** with multiple pricing plans
- **Automatic user account creation** after successful payment
- **Welcome email automation** for new users
- **Subscription management** and status tracking
- **Webhook-driven user lifecycle** management

## 📋 Prerequisites

Before starting, ensure you have:

- ✅ MadBoat v3 project running locally
- ✅ Supabase database with authentication set up
- ✅ Stripe account (Test mode for development)
- ✅ Access to environment variables configuration

## 🚀 Step-by-Step Setup

### 1. Stripe Dashboard Configuration

#### Create Stripe Products and Prices

1. **Log into Stripe Dashboard** → Products
2. **Create Products** for each plan:

```
Navigator Plan
- Name: MadBoat Navigator
- Description: Perfect for starting your transformation journey
- Price: $97/month (Recurring)

Captain Plan
- Name: MadBoat Captain
- Description: Advanced tools for serious transformers
- Price: $197/month (Recurring)

Admiral Plan
- Name: MadBoat Admiral
- Description: Enterprise-level transformation mastery
- Price: $497/month (Recurring)
```

3. **Copy Price IDs** (starts with `price_`) for each product
4. **Update pricing page** with real Stripe Price IDs:

```typescript
// In apps/web/src/app/pricing/page.tsx
const pricingPlans: PricingPlan[] = [
  {
    // ...
    stripePriceId: 'price_1234567890abcdef', // Replace with real price ID
  },
];
```

#### Configure Webhooks

1. **Go to Stripe Dashboard** → Developers → Webhooks
2. **Add endpoint**: `https://yourdomain.com/api/stripe/webhook`
3. **Select events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. **Copy webhook secret** (starts with `whsec_`)

### 2. Environment Variables Setup

Update your `.env.local` file with Stripe credentials:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_actual_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_actual_webhook_secret

# Supabase Service Role (for user creation)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Application URL
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 3. Database Migration

Apply the Stripe integration migration:

```sql
-- Run this migration in Supabase SQL Editor
-- File: db/migrations/005_stripe_integration.sql

-- This adds subscription fields to profiles table
-- Creates subscription_history table
-- Sets up proper RLS policies
```

### 4. Supabase Service Role Setup

1. **Go to Supabase Dashboard** → Settings → API
2. **Copy Service Role Key** (secret key, not anon key)
3. **Add to environment variables** as shown above

**⚠️ Security Note**: Service Role Key bypasses RLS - only use for admin operations!

### 5. Testing the Integration

#### Local Development Testing

1. **Start the application**:
```bash
npm run dev
```

2. **Visit pricing page**: `http://localhost:3000/pricing`

3. **Use Stripe Test Cards**:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`

4. **Test workflow**:
   - Enter email → Select plan → Complete payment → Check:
     - User created in Supabase Auth
     - Profile created with subscription data
     - Welcome email logged in console
     - Redirect to success page

#### Webhook Testing with Stripe CLI

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local development
stripe listen --forward-to localhost:3000/api/stripe/webhook

# Test webhook manually
stripe trigger checkout.session.completed
```

### 6. Production Deployment

#### Vercel/Netlify Deployment

1. **Set environment variables** in deployment platform
2. **Update webhook endpoint** to production URL
3. **Switch to live Stripe keys** (remove `_test_` from keys)
4. **Test with real payment** (small amount recommended)

#### Domain Configuration

```env
# Production Environment
NEXT_PUBLIC_APP_URL=https://madboat.com
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret
```

## 🔧 Customization Options

### Email Service Integration

Replace mock email with real service (Resend, SendGrid, etc.):

```typescript
// In src/lib/email/welcome-email.ts
const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from: 'MadBoat <welcome@madboat.com>',
    to: data.email,
    subject: emailContent.subject,
    html: emailContent.html,
  }),
});
```

### Custom Pricing Plans

Add new pricing tiers by:

1. Creating product in Stripe Dashboard
2. Adding to `pricingPlans` array
3. Updating database constraints if needed

### Advanced Subscription Features

- **Free trials**: Set `trial_period_days` in Stripe checkout
- **Promo codes**: Enable in Stripe checkout session
- **Usage-based billing**: Configure metered billing in Stripe
- **Multi-currency**: Set different prices per region

## 🛠 Troubleshooting

### Common Issues

**❌ Webhook not receiving events**
- Check webhook endpoint URL is correct
- Verify webhook secret matches environment variable
- Ensure webhook is enabled in Stripe Dashboard

**❌ User creation fails**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
- Check Supabase database permissions
- Review server logs for detailed errors

**❌ Email not sending**
- Confirm email service is configured properly
- Check email service API keys
- Verify email templates render correctly

**❌ Payment success but no user created**
- Check webhook payload includes required metadata
- Verify webhook signature validation
- Review subscription status in Stripe Dashboard

### Debug Mode

Enable detailed logging:

```typescript
// Add to webhook route for debugging
console.log('Full webhook payload:', JSON.stringify(event, null, 2));
console.log('Session metadata:', session.metadata);
console.log('User creation result:', authUser);
```

### Testing Checklist

- [ ] Stripe test payment completes successfully
- [ ] User account created in Supabase
- [ ] Profile data includes subscription info
- [ ] Welcome email sent (logged or received)
- [ ] User can log into dashboard
- [ ] Subscription status updates correctly
- [ ] Webhook handles all event types
- [ ] Production environment variables set
- [ ] Live webhook endpoint configured

## 📊 Monitoring & Analytics

### Key Metrics to Track

- **Conversion Rate**: Pricing page visits → Successful payments
- **Churn Rate**: Subscription cancellations
- **Customer Lifetime Value**: Revenue per subscriber
- **Payment Failures**: Failed transaction rate

### Stripe Dashboard Insights

- Revenue analytics
- Customer retention
- Payment method trends
- Subscription metrics

## 🔐 Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Validate webhook signatures** to prevent fraud
3. **Use HTTPS** for all webhook endpoints
4. **Store sensitive data encrypted** in database
5. **Monitor for suspicious activity** in Stripe Dashboard
6. **Rotate API keys** regularly

## 🎉 Success!

Your MadBoat Stripe integration is now complete! Users can:

✅ **Select subscription plans** from beautiful pricing page
✅ **Complete secure payments** via Stripe Checkout
✅ **Receive automatic account creation** with welcome email
✅ **Access personalized dashboard** immediately after payment
✅ **Enjoy seamless subscription management** throughout their journey

Welcome aboard the automated revenue ship! 🚢💰

---

*Need help? Check the troubleshooting section or contact the development team.*