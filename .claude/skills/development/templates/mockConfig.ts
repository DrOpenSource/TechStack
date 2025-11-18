/**
 * Mock-First Development Configuration
 *
 * Central configuration for controlling mock vs real service behavior.
 * Set NEXT_PUBLIC_MOCK_MODE=true in .env.local to enable mock mode.
 *
 * @see .claude/skills/development/mock-first-development.md
 */

export interface MockConfig {
  /** Master toggle - enables all mock features */
  enabled: boolean;

  /** Simulated network delay in milliseconds */
  delay: number;

  /** Error simulation rate (0-100) for testing error states */
  errorRate: number;

  /** Feature-specific toggles for granular control */
  features: {
    /** Mock authentication (OTP, login, etc.) */
    auth: boolean;

    /** Mock database queries */
    database: boolean;

    /** Mock file storage operations */
    storage: boolean;

    /** Mock SMS/OTP sending */
    sms: boolean;

    /** Mock payment gateway */
    payments: boolean;

    /** Mock push notifications */
    notifications: boolean;
  };

  /** Console logging for mock operations */
  verbose: boolean;
}

/**
 * Load configuration from environment variables
 */
export const mockConfig: MockConfig = {
  enabled: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  delay: parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '500', 10),
  errorRate: parseInt(process.env.NEXT_PUBLIC_MOCK_ERROR_RATE || '0', 10),

  features: {
    auth: process.env.NEXT_PUBLIC_MOCK_AUTH !== 'false',
    database: process.env.NEXT_PUBLIC_MOCK_DATABASE !== 'false',
    storage: process.env.NEXT_PUBLIC_MOCK_STORAGE !== 'false',
    sms: process.env.NEXT_PUBLIC_MOCK_SMS !== 'false',
    payments: process.env.NEXT_PUBLIC_MOCK_PAYMENTS !== 'false',
    notifications: process.env.NEXT_PUBLIC_MOCK_NOTIFICATIONS !== 'false',
  },

  verbose: process.env.NODE_ENV === 'development',
};

/**
 * Helper functions
 */
export const isMockMode = () => mockConfig.enabled;

export const isMockFeature = (feature: keyof MockConfig['features']) => {
  return mockConfig.enabled && mockConfig.features[feature];
};

export const logMock = (message: string, data?: any) => {
  if (mockConfig.verbose) {
    console.log(`[MOCK] ${message}`, data || '');
  }
};

/**
 * Environment variable setup guide:
 *
 * # .env.local (Development with Mocks)
 * NEXT_PUBLIC_MOCK_MODE=true
 * NEXT_PUBLIC_MOCK_DELAY=800
 * NEXT_PUBLIC_MOCK_ERROR_RATE=0
 *
 * # .env.production (Production with Real Services)
 * NEXT_PUBLIC_MOCK_MODE=false
 */
