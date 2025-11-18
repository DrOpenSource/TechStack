/**
 * Login Page
 * Main authentication page with email/password login
 */

import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login | VibeCode',
  description: 'Sign in to VibeCode - AI-Powered Mobile Development',
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue building amazing apps"
    >
      <LoginForm />
    </AuthLayout>
  );
}
