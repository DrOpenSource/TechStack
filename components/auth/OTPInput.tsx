/**
 * OTPInput Component
 * 6-digit OTP entry with auto-focus and paste support
 */

'use client';

import { useState, useRef, KeyboardEvent, ClipboardEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils/cn';

interface OTPInputProps {
  email: string;
  onBack?: () => void;
}

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

export function OTPInput({ email, onBack }: OTPInputProps) {
  const router = useRouter();
  const { verifyOTP, loginWithOTP, isLoading, error, clearError } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) {
      return;
    }

    clearError();

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }

    // Auto-submit when all digits are filled
    if (value && index === OTP_LENGTH - 1) {
      const otpString = newOtp.join('');
      if (otpString.length === OTP_LENGTH) {
        handleVerify(otpString);
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      e.preventDefault();

      if (otp[index]) {
        // Clear current digit
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Only process if it's all digits
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    // Take first 6 digits
    const digits = pastedData.slice(0, OTP_LENGTH).split('');
    const newOtp = [...otp];

    digits.forEach((digit, i) => {
      if (i < OTP_LENGTH) {
        newOtp[i] = digit;
      }
    });

    setOtp(newOtp);

    // Focus last filled input or last input
    const lastIndex = Math.min(digits.length, OTP_LENGTH - 1);
    inputRefs.current[lastIndex]?.focus();
    setActiveIndex(lastIndex);

    // Auto-submit if complete
    if (digits.length === OTP_LENGTH) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (otpString: string) => {
    try {
      await verifyOTP({ email, otp: otpString });
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store
      // Clear OTP on error
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    try {
      await loginWithOTP(email);
      setCountdown(RESEND_COOLDOWN);
      setOtp(new Array(OTP_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
      setActiveIndex(0);
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>
      )}

      {/* Email Display */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code sent to
        </p>
        <p className="mt-1 text-sm font-medium text-foreground">{email}</p>
      </div>

      {/* OTP Input Boxes */}
      <div className="flex justify-center gap-2 md:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={() => setActiveIndex(index)}
            className={cn(
              'w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-semibold',
              'rounded-lg border-2 bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              digit
                ? 'border-primary text-foreground'
                : activeIndex === index
                ? 'border-primary'
                : error
                ? 'border-destructive'
                : 'border-input text-muted-foreground'
            )}
            disabled={isLoading}
            autoFocus={index === 0}
          />
        ))}
      </div>

      {/* Demo Hint */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Demo code:{' '}
          <span className="font-mono font-semibold text-primary">123456</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-center text-destructive">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Verifying...
        </div>
      )}

      {/* Resend Button */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-sm text-muted-foreground">
            Resend code in{' '}
            <span className="font-semibold text-foreground">{countdown}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Resend OTP
          </button>
        )}
      </div>

      {/* Manual Submit (optional, for accessibility) */}
      <button
        type="button"
        onClick={() => handleVerify(otp.join(''))}
        disabled={isLoading || otp.some((d) => !d)}
        className={cn(
          'w-full rounded-lg bg-primary px-4 py-3',
          'text-sm font-semibold text-primary-foreground',
          'hover:bg-primary/90',
          'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'flex items-center justify-center gap-2'
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          'Verify OTP'
        )}
      </button>
    </div>
  );
}
