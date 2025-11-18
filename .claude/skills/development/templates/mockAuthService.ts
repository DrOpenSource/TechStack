/**
 * Mock Authentication Service
 *
 * Example mock implementation of authentication service.
 * Handles OTP, login, logout without requiring real backend.
 *
 * @see .claude/skills/development/mock-first-development.md
 */

import { simulateDelay, simulateError, logMock } from './mockUtils';
import { DEMO_USER, DEMO_ADMIN, User } from './mockUserService';
import { SAMPLE_OTP } from './sampleData';

/**
 * TypeScript interfaces
 */
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
  refreshToken?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  expiresIn?: number; // seconds
}

export interface AuthService {
  sendOTP(phone: string): Promise<OTPResponse>;
  verifyOTP(phone: string, otp: string): Promise<AuthResponse>;
  refreshToken(token: string): Promise<AuthResponse>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  updatePassword(currentPassword: string, newPassword: string): Promise<void>;
}

/**
 * In-memory session storage
 */
let currentSession: {
  user: User | null;
  token: string | null;
  lastOTP: string | null;
  otpPhone: string | null;
} = {
  user: null,
  token: null,
  lastOTP: null,
  otpPhone: null,
};

/**
 * Mock Authentication Service Implementation
 */
export const mockAuthService: AuthService = {
  /**
   * Send OTP to phone number
   * In mock mode, always succeeds and logs the OTP to console
   */
  async sendOTP(phone: string): Promise<OTPResponse> {
    await simulateDelay();
    await simulateError();

    logMock('AuthService.sendOTP', { phone });

    // In mock mode, always use 123456
    const otp = SAMPLE_OTP.code;
    currentSession.lastOTP = otp;
    currentSession.otpPhone = phone;

    console.log(
      `\n🔐 [MOCK OTP] Code sent to ${phone}: ${otp}\n` +
        `💡 Use "${otp}" to verify\n` +
        `⏰ Valid for ${SAMPLE_OTP.validMinutes} minutes\n`
    );

    return {
      success: true,
      message: `OTP sent successfully to ${phone}`,
      expiresIn: SAMPLE_OTP.validMinutes * 60,
    };
  },

  /**
   * Verify OTP and log in user
   * Accepts the mock OTP (123456) or any 6-digit code in mock mode
   */
  async verifyOTP(phone: string, otp: string): Promise<AuthResponse> {
    await simulateDelay();
    await simulateError();

    logMock('AuthService.verifyOTP', { phone, otp });

    // In mock mode, accept either the sent OTP or the default 123456
    const isValidOTP =
      otp === SAMPLE_OTP.code || otp === currentSession.lastOTP;

    if (!isValidOTP) {
      throw new Error(
        `Invalid OTP. Use ${SAMPLE_OTP.code} or check console for the sent OTP.`
      );
    }

    // Determine which user to log in based on phone number
    let user: User;
    if (phone === DEMO_ADMIN.phone) {
      user = DEMO_ADMIN;
    } else if (phone === DEMO_USER.phone) {
      user = DEMO_USER;
    } else {
      // Create a new demo user for unknown phone numbers
      user = {
        id: `user-mock-${Date.now()}`,
        name: 'Demo User',
        email: 'demo@example.com',
        phone: phone,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // Create mock JWT token
    const token = `mock-jwt-token-${Date.now()}`;

    // Update session
    currentSession = {
      user,
      token,
      lastOTP: null,
      otpPhone: null,
    };

    logMock('User logged in successfully', { userId: user.id, role: user.role });

    return {
      success: true,
      user,
      token,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    };
  },

  /**
   * Refresh authentication token
   */
  async refreshToken(token: string): Promise<AuthResponse> {
    await simulateDelay();
    await simulateError();

    logMock('AuthService.refreshToken', { token });

    if (!currentSession.user) {
      throw new Error('No active session. Please log in again.');
    }

    const newToken = `mock-jwt-token-${Date.now()}`;

    currentSession.token = newToken;

    return {
      success: true,
      user: currentSession.user,
      token: newToken,
      refreshToken: `mock-refresh-token-${Date.now()}`,
    };
  },

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    await simulateDelay();
    await simulateError();

    logMock('AuthService.signOut', { userId: currentSession.user?.id });

    // Clear session
    currentSession = {
      user: null,
      token: null,
      lastOTP: null,
      otpPhone: null,
    };

    console.log('🚪 [MOCK] User signed out successfully');
  },

  /**
   * Get currently authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    await simulateDelay(100); // Shorter delay for frequent calls
    await simulateError();

    logMock('AuthService.getCurrentUser', {
      isAuthenticated: !!currentSession.user,
    });

    return currentSession.user;
  },

  /**
   * Update user password
   */
  async updatePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await simulateDelay();
    await simulateError();

    logMock('AuthService.updatePassword', { userId: currentSession.user?.id });

    if (!currentSession.user) {
      throw new Error('Not authenticated');
    }

    // In mock mode, accept any password
    console.log('🔒 [MOCK] Password updated successfully');
  },
};

/**
 * Helper functions for testing
 */
export const mockAuthHelpers = {
  /**
   * Manually set the current user (useful for testing)
   */
  setCurrentUser(user: User | null) {
    currentSession.user = user;
    currentSession.token = user ? `mock-token-${Date.now()}` : null;
    logMock('Manually set current user', { userId: user?.id });
  },

  /**
   * Get current session state
   */
  getSession() {
    return { ...currentSession };
  },

  /**
   * Reset session
   */
  resetSession() {
    currentSession = {
      user: null,
      token: null,
      lastOTP: null,
      otpPhone: null,
    };
    logMock('Session reset');
  },

  /**
   * Login as demo admin (shortcut for testing)
   */
  async loginAsAdmin() {
    currentSession.user = DEMO_ADMIN;
    currentSession.token = `mock-token-${Date.now()}`;
    logMock('Logged in as demo admin');
    return currentSession.user;
  },

  /**
   * Login as demo user (shortcut for testing)
   */
  async loginAsUser() {
    currentSession.user = DEMO_USER;
    currentSession.token = `mock-token-${Date.now()}`;
    logMock('Logged in as demo user');
    return currentSession.user;
  },
};

/**
 * Export for testing
 */
export const MOCK_VALID_OTP = SAMPLE_OTP.code;
