/**
 * Form Validation Utilities
 * Common validation functions for forms
 */

import type { AuthFormErrors } from '@/types/auth';

export function validateEmail(email: string): string | undefined {
  if (!email) {
    return 'Email is required';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }

  return undefined;
}

export function validateOTP(otp: string): string | undefined {
  if (!otp) {
    return 'OTP is required';
  }

  if (otp.length !== 6) {
    return 'OTP must be 6 digits';
  }

  if (!/^\d+$/.test(otp)) {
    return 'OTP must contain only numbers';
  }

  return undefined;
}

export function validateLoginForm(
  email: string,
  password: string
): AuthFormErrors {
  const errors: AuthFormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateProjectName(name: string): string | undefined {
  if (!name) {
    return 'Project name is required';
  }

  if (name.length < 3) {
    return 'Project name must be at least 3 characters';
  }

  if (name.length > 50) {
    return 'Project name must be less than 50 characters';
  }

  return undefined;
}
