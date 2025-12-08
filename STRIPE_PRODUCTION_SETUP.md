# Stripe Production Setup Guide

## Overview
This guide walks you through switching from Stripe test mode to production mode for real payment processing on the Dan Bizzarro Method platform.

## Current Status
✅ Payment system is production-ready and security-hardened  
✅ All critical vulnerabilities fixed:
- Discount code reuse prevention
- Session validation
- Webhook signature verification
- Enhanced error handling

## Prerequisites
Before switching to production, ensure you have:
1. A verified Stripe account with business details completed
2. Bank account connected for payouts
3. Access to your Stripe Dashboard

---

## Step 1: Obtain Production Stripe Keys

### Get Your Production Secret Key
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle from **Test mode** to **Live mode** (top right corner)
3. Navigate to **Developers** → **API keys**
4. Copy your **Secret key** (starts with `sk_live_`)
5. Copy your **Publishable key** (starts with `pk_live_`)

### Get Your Production Webhook Secret
1. Still in **Live mode**, navigate to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Configure the endpoint:
   - **URL**: `https://danbizzarromethod.com/api/stripe-webhook`
   - **Events to send**: Select the following events:
     - `payment_intent.succeeded` - Confirms successful payments
     - `payment_intent.payment_failed` - Handles failed payments
     - `charge.refunded` - Tracks refunds processed in Stripe Dashboard
     - `charge.dispute.created` - Alerts you to chargebacks/disputes
4. Click **Add endpoint**
5. Click on the newly created endpoint
6. Under **Signing secret**, click **Reveal** and copy the secret (starts with `whsec_`)

---

## Step 2: Update Environment Variables

### Remove Test Keys
In your Replit project, remove the test environment variables:
1. Go to the **Secrets** tab (lock icon in left sidebar)
2. Delete the following secrets:
   - `TESTING_STRIPE_SECRET_KEY`
   - `TESTING_VITE_STRIPE_PUBLIC_KEY`

### Add Production Keys
Add the following secrets with your production values:

| Secret Name | Value | Source |
|------------|-------|--------|
| `STRIPE_SECRET_KEY` | `sk_live_xxxxx` | Stripe Dashboard → API keys → Secret key |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_xxxxx` | Stripe Dashboard → API keys → Publishable key |
| `STRIPE_WEBHOOK_SECRET` | `whsec_xxxxx` | Stripe Dashboard → Webhooks → Signing secret |

**Important Security Notes:**
- Never commit these keys to version control
- Never share these keys with anyone
- Rotate keys immediately if compromised
- `STRIPE_WEBHOOK_SECRET` is **REQUIRED** in production - the webhook endpoint will reject all requests without it

---

## Step 3: Verify Configuration

After adding the production keys, the application will automatically restart. Check the logs for:

```
Stripe initialized with key type: sk_live
```

If you see `sk_test`, the production secret key was not loaded correctly.

---

## Step 4: Test the Webhook Endpoint

Before processing real payments, test the webhook endpoint:

### Using Stripe CLI (Recommended)
1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Run: `stripe login`
3. Forward events to your production URL:
   ```bash
   stripe listen --forward-to https://danbizzarromethod.com/api/stripe-webhook
   ```
4. In another terminal, trigger a test payment event:
   ```bash
   stripe trigger payment_intent.succeeded
   ```
5. Check your application logs for:
   ```
   ✓ Webhook signature verified for event type: payment_intent.succeeded
   ```

### Using Stripe Dashboard
1. Go to **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. Click **Send test webhook**
4. Select `payment_intent.succeeded`
5. Click **Send test webhook**
6. Check the **Response** tab shows a 200 status code

---

## Step 5: Process a Test Payment

### Test with a Real Card (Small Amount)
1. Navigate to a clinic registration page on your live site
2. Select a clinic and sessions
3. Use your own credit card to make a small test payment (e.g., £1)
4. Complete the payment flow
5. Verify in Stripe Dashboard (**Payments** tab) that the payment appears
6. Check your application database to ensure the registration was created with `status: "confirmed"`
7. If you used a discount code, verify it was marked as used

### Refund the Test Payment
1. In Stripe Dashboard, go to **Payments**
2. Click on the test payment
3. Click **Refund payment**
4. Confirm the refund

---

## Step 6: Monitor Production Payments

### Key Metrics to Watch
1. **Stripe Dashboard** → **Payments**: Monitor all transactions
2. **Stripe Dashboard** → **Webhooks**: Check for failed webhook deliveries
3. **Application Logs**: Monitor for payment errors

### Set Up Alerts
Consider setting up email alerts in Stripe for:
- Failed payments
- Disputed payments
- Failed webhook deliveries

---

## Troubleshooting

### Webhook Signature Verification Fails
**Symptom**: Logs show "Webhook signature verification failed"

**Solution**:
1. Verify `STRIPE_WEBHOOK_SECRET` is set correctly (starts with `whsec_`)
2. Ensure the webhook URL in Stripe Dashboard is exactly: `https://danbizzarromethod.com/api/stripe-webhook`
3. Check that the webhook endpoint is in **Live mode** (not Test mode)

### Payments Not Appearing
**Symptom**: Customer completes payment but registration status stays "pending"

**Solution**:
1. Check Stripe Dashboard → **Webhooks** for delivery failures
2. Verify webhook endpoint is receiving events
3. Check application logs for errors during webhook processing

### Discount Codes Not Being Marked as Used
**Symptom**: Discount code can be reused after successful payment

**Solution**:
1. Verify `payment_intent.succeeded` webhook is being received
2. Check logs for "Marked loyalty discount as used"
3. Ensure `STRIPE_WEBHOOK_SECRET` is configured (webhooks won't process without it)

### Payment Intent Creation Fails
**Symptom**: Error when clicking "Proceed to Payment"

**Solution**:
1. Check application logs for specific error message
2. Verify `STRIPE_SECRET_KEY` is set correctly (starts with `sk_live_`)
3. Ensure clinic sessions are valid and have correct pricing
4. Check that discount code (if used) is valid and not expired

---

## Security Checklist

Before going live, verify:
- [ ] `STRIPE_SECRET_KEY` is set to production key (`sk_live_`)
- [ ] `VITE_STRIPE_PUBLIC_KEY` is set to production key (`pk_live_`)
- [ ] `STRIPE_WEBHOOK_SECRET` is configured
- [ ] Webhook endpoint URL is correct: `https://danbizzarromethod.com/api/stripe-webhook`
- [ ] Webhook is configured for `payment_intent.succeeded` and `payment_intent.payment_failed`
- [ ] Test keys (`TESTING_*`) are removed from environment
- [ ] Webhook signature verification tested successfully
- [ ] Test payment processed and refunded successfully

---

## Known Limitations

### Idempotency Keys Not Implemented
**What it means**: If a user clicks "Submit Payment" multiple times rapidly due to network issues, multiple payment intents *could* be created.

**Mitigations in place**:
- Stripe's built-in duplicate detection (same payment details within ~24 hours)
- Frontend button disabling during payment processing
- Registration endpoint verifies payment status before confirming

**Future improvement**: Implement client-generated UUIDs as idempotency keys (documented as TODO in code)

**Risk level**: Low - Stripe's protections + frontend UX make this rare

---

## Production Monitoring

### Daily Checks
- Review Stripe Dashboard for any failed payments
- Check webhook delivery status
- Monitor application logs for payment errors

### Weekly Checks
- Review successful payment volume
- Check for any disputed payments
- Verify discount code usage tracking

### Monthly Checks
- Review payout schedule and amounts
- Check for any unusual payment patterns
- Update webhook endpoint URL if domain changes

---

## Support

### Stripe Support
- Dashboard: [https://dashboard.stripe.com/](https://dashboard.stripe.com/)
- Documentation: [https://stripe.com/docs](https://stripe.com/docs)
- Support: Available in Stripe Dashboard

### Emergency Procedures

#### Disable Payments Immediately
If you need to disable payments urgently:
1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click on the webhook endpoint
3. Click **Disable endpoint**
4. Or: Remove `STRIPE_SECRET_KEY` from environment (will prevent new payment intents)

#### Suspected Security Breach
If you suspect API keys are compromised:
1. Immediately rotate keys in Stripe Dashboard
2. Update environment variables with new keys
3. Monitor Stripe Dashboard for unauthorized transactions
4. Contact Stripe support

---

## Conclusion

Your payment system is now production-ready! The platform has been hardened with:
- Webhook signature verification (prevents forged payment events)
- Discount code reuse prevention
- Session validation (prevents payment manipulation)
- Enhanced error handling and logging

Follow the steps above carefully, and monitor the first few real transactions closely to ensure everything works smoothly.

**Remember**: Always test webhook delivery and process a small test payment before promoting to customers!