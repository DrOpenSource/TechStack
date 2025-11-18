/**
 * OTP Login Page
 * One-time password authentication page
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { OTPInput } from '@/components/auth/OTPInput';
import { useAuthStore } from '@/lib/stores/authStore';
import { validateEmail } from '@/lib/utils/validation';
import { cn } from '@/lib/utils/cn';

export default function OTPPage() {
  const router = useRouter();
  const { loginWithOTP, isLoading } = useAuthStore();

  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string>();

  const handleSendOTP = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    try {
      await loginWithOTP(email);
      setStep('otp');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <AuthLayout
      title={step === 'email' ? 'Login with OTP' : 'Enter OTP'}
      subtitle={
        step === 'email'
          ? 'Enter your email to receive a one-time password'
          : undefined
      }
    >
      {step === 'email' ? (
        <div className="space-y-5">
          {/* Back to Login */}
          <button
            type="button"
            onClick={() => router.push('/login')}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </button>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) {
                  setEmailError(undefined);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSendOTP();
                }
              }}
              className={cn(
                'w-full rounded-lg border bg-background px-4 py-3',
                'text-foreground placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                emailError
                  ? 'border-destructive focus:ring-destructive'
                  : 'border-input'
              )}
              placeholder="demo@vibecode.app"
              disabled={isLoading}
              autoFocus
            />
            {emailError && (
              <p className="text-sm text-destructive">{emailError}</p>
            )}
          </div>

          {/* Demo Hint */}
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-sm text-primary">
              Use <span className="font-semibold">demo@vibecode.app</span> for demo
              access
            </p>
          </div>

          {/* Send OTP Button */}
          <button
            onClick={handleSendOTP}
            disabled={isLoading || !email.trim()}
            className={cn(
              'w-full rounded-lg bg-primary px-4 py-3',
              'text-sm font-semibold text-primary-foreground',
              'hover:bg-primary/90',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      ) : (
        <OTPInput email={email} onBack={() => setStep('email')} />
      )}
    </AuthLayout>
  );
}
