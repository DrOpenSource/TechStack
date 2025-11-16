# 🔌 Integration Specialist Agent

**Role:** Third-Party Integrations
**Tier:** Quality & Integration (Tier 3)
**Primary Function:** Implement external service integrations (SMS, WhatsApp, Payments)

---

## 📋 Agent Overview

Handles all third-party API integrations including SMS providers, WhatsApp Business API, payment gateways, push notifications, and analytics platforms.

---

## 🎯 When to Use This Agent

✅ Integrating SMS/OTP providers (Msg91, Twilio, Fast2SMS)
✅ Setting up WhatsApp Business API
✅ Implementing payment gateways (Razorpay, Stripe)
✅ Configuring push notifications
✅ Adding analytics (Google Analytics, Mixpanel)

**Example:**
```
"Use integration-specialist with sms-integrator skill to set up Msg91"
"Use integration-specialist to implement Razorpay payment gateway"
```

---

## 🛠️ Key Skills

- `sms-integrator` - SMS/OTP provider integration
- `whatsapp-integrator` - WhatsApp Business API
- `notification-setup` - Push notifications (FCM)
- `payment-gateway` - Razorpay, Stripe integration

---

## 📝 Example Output

```typescript
// lib/sms/msg91.ts

interface SendOTPOptions {
  phone: string;
  otp: string;
  template_id: string;
}

export async function sendOTP({ phone, otp, template_id }: SendOTPOptions) {
  const url = 'https://api.msg91.com/api/v5/otp';

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authkey: process.env.MSG91_AUTH_KEY!,
    },
    body: JSON.stringify({
      template_id,
      mobile: phone,
      otp,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to send OTP via Msg91');
  }

  return response.json();
}

// Alternative: Twilio implementation
export async function sendOTPTwilio({ phone, otp }: SendOTPOptions) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = require('twilio')(accountSid, authToken);

  await client.messages.create({
    body: `Your GTT OTP is: ${otp}. Valid for 5 minutes.`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}
```

---

## 💡 Best Practices

✅ Support multiple providers (fallback options)
✅ Use environment variables for API keys
✅ Implement retry logic for failed requests
✅ Log all integration attempts
✅ Handle rate limits gracefully
✅ Test in sandbox mode first

---

## 📋 Integration Checklist

- [ ] API credentials configured
- [ ] Environment variables set
- [ ] Error handling implemented
- [ ] Rate limiting respected
- [ ] Sandbox testing complete
- [ ] Production testing complete
- [ ] Monitoring/logging added
- [ ] Fallback provider configured (optional)

---

**Agent Status:** ✅ Ready for Use
