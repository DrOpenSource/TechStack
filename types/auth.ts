/**
 * Authentication Types
 * TypeScript definitions for authentication and user management
 */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithOTP: (email: string) => Promise<void>;
  verifyOTP: (verification: OTPVerification) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export type AuthStore = AuthState & AuthActions;

export interface AuthFormErrors {
  email?: string;
  password?: string;
  otp?: string;
  general?: string;
}

export type AuthStep = 'login' | 'otp' | 'success';
