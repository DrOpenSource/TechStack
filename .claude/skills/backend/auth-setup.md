# 🔐 Auth Setup Skill

**Category:** Backend
**Purpose:** Implement OTP-based authentication with Supabase

---

## 🎯 What This Skill Does

Sets up secure OTP authentication flow:
- Phone number validation
- OTP generation and verification
- JWT token management
- Session handling
- Rate limiting

---

## 📝 Implementation

```typescript
// lib/auth/otp.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function requestOTP(phone: string) {
  // Validate phone format
  if (!/^\+91[6-9]\d{9}$/.test(phone)) {
    throw new Error('Invalid phone number');
  }

  // Check rate limit
  const recentAttempts = await checkRateLimit(phone);
  if (recentAttempts >= 3) {
    throw new Error('Too many attempts. Try again in 1 hour.');
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  // Store in database
  await supabase.from('otp_sessions').insert({
    phone,
    otp,
    expires_at: expiresAt,
    attempts: 0,
  });

  // Send via SMS provider
  await sendSMS(phone, `Your GTT OTP: ${otp}`);

  return { success: true, expires_in: 300 };
}

export async function verifyOTP(phone: string, otp: string) {
  // Get session
  const { data: session } = await supabase
    .from('otp_sessions')
    .select('*')
    .eq('phone', phone)
    .eq('otp', otp)
    .single();

  if (!session) {
    throw new Error('Invalid OTP');
  }

  if (new Date() > new Date(session.expires_at)) {
    throw new Error('OTP expired');
  }

  if (session.attempts >= 3) {
    throw new Error('Too many attempts');
  }

  // Get or create user
  let { data: user } = await supabase
    .from('members')
    .select('*')
    .eq('phone', phone)
    .single();

  if (!user) {
    // Create new user
    const { data: newUser } = await supabase
      .from('members')
      .insert({ phone })
      .select()
      .single();
    user = newUser;
  }

  // Generate JWT token
  const token = await supabase.auth.admin.createUser({
    phone,
    user_metadata: { member_id: user.id },
  });

  // Clear OTP session
  await supabase.from('otp_sessions').delete().eq('phone', phone);

  return {
    user,
    token: token.data.session?.access_token,
    refresh_token: token.data.session?.refresh_token,
  };
}
```

---

## ✅ Security Checklist

- [ ] Rate limiting (3 OTPs/hour per phone)
- [ ] OTP expires in 5 minutes
- [ ] Max 3 verification attempts
- [ ] Phone number validation
- [ ] JWT tokens with expiry
- [ ] Refresh token rotation

---

**Used By:** backend-dev, integration-specialist
