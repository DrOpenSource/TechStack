/**
 * AuthLayout Component
 * Wrapper for authentication pages with branding and responsive design
 */

'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-background to-primary/5 dark:from-background dark:via-background dark:to-primary/10">
      <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Branding */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
                <svg
                  className="h-10 w-10 text-primary-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              VibeCode
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-Powered Mobile Development
            </p>
          </div>

          {/* Auth Card */}
          <div
            className={cn(
              'rounded-2xl border border-border bg-card shadow-lg',
              'transition-all duration-200',
              'md:p-8 p-6'
            )}
          >
            {/* Title and Subtitle */}
            {(title || subtitle) && (
              <div className="mb-6">
                {title && (
                  <h2 className="text-2xl font-bold text-card-foreground">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {/* Content */}
            {children}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              By continuing, you agree to our{' '}
              <a
                href="/terms"
                className="text-primary hover:underline"
              >
                Terms of Service
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
