# 📱 SMS Integrator Skill

**Category:** Integration
**Purpose:** Integrate SMS/OTP providers (Msg91, Twilio, Fast2SMS)

---

## 🎯 Supports Multiple Providers

```typescript
// lib/sms/index.ts
export async function sendSMS(phone: string, message: string) {
  const provider = process.env.SMS_PROVIDER || 'msg91';
  
  switch (provider) {
    case 'msg91': return sendViaMSG91(phone, message);
    case 'twilio': return sendViaTwilio(phone, message);
    case 'fast2sms': return sendViaFast2SMS(phone, message);
  }
}

// Msg91
async function sendViaMSG91(phone: string, message: string) {
  const response = await fetch('https://api.msg91.com/api/v5/flow/', {
    method: 'POST',
    headers: {
      'authkey': process.env.MSG91_AUTH_KEY!,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      flow_id: process.env.MSG91_TEMPLATE_ID,
      sender: process.env.MSG91_SENDER_ID,
      mobiles: phone,
      VAR1: message
    })
  });
  return response.json();
}

// Twilio
async function sendViaTwilio(phone: string, message: string) {
  const twilio = require('twilio')(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  
  return await twilio.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE,
    to: phone
  });
}
```

---

**Used By:** integration-specialist, backend-dev
