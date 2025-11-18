/**
 * LoginForm Component
 * Email/password login form with demo credentials support
 */

'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { validateEmail, validatePassword } from '@/lib/utils/validation';
import { cn } from '@/lib/utils/cn';
import type { AuthFormErrors } from '@/types/auth';

export function LoginForm() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>({});

  const handleDemoCredentials = () => {
    setEmail('demo@vibecode.app');
    setPassword('demo123');
    setErrors({});
    clearError();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    clearError();

    // Validate form
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err) {
      // Error is handled by the store
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Email Field */}
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
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          className={cn(
            'w-full rounded-lg border bg-background px-4 py-3',
            'text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            errors.email
              ? 'border-destructive focus:ring-destructive'
              : 'border-input'
          )}
          placeholder="demo@vibecode.app"
          disabled={isLoading}
          autoComplete="email"
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-foreground"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                setErrors((prev) => ({ ...prev, password: undefined }));
              }
            }}
            className={cn(
              'w-full rounded-lg border bg-background px-4 py-3 pr-12',
              'text-foreground placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'transition-all duration-200',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              errors.password
                ? 'border-destructive focus:ring-destructive'
                : 'border-input'
            )}
            placeholder="••••••••"
            disabled={isLoading}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            tabIndex={-1}
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Demo Credentials Button */}
      <button
        type="button"
        onClick={handleDemoCredentials}
        className={cn(
          'w-full rounded-lg border border-primary/20 bg-primary/5 px-4 py-3',
          'text-sm font-medium text-primary',
          'hover:bg-primary/10 hover:border-primary/30',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        disabled={isLoading}
      >
        Use Demo Credentials
      </button>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
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
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      {/* OTP Login Link */}
      <button
        type="button"
        onClick={() => router.push('/auth/otp')}
        className={cn(
          'w-full rounded-lg border border-border bg-background px-4 py-3',
          'text-sm font-medium text-foreground',
          'hover:bg-accent hover:border-accent-foreground/20',
          'transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
        disabled={isLoading}
      >
        Login with OTP
      </button>
    </form>
  );
}
