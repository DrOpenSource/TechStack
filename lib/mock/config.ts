/**
 * Mock Configuration
 * Configure behavior of mock data system
 */

export const MOCK_CONFIG = {
  // Enable/disable mock mode
  enabled: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',

  // Network simulation
  networkDelay: 500, // ms - simulate API latency
  minDelay: 300,
  maxDelay: 1500,

  // Error simulation
  errorRate: 0.05, // 5% of requests fail

  // AI streaming
  aiStreamDelay: 50, // ms between words
  aiMinStreamDelay: 30,
  aiMaxStreamDelay: 100,

  // Pagination
  defaultPageSize: 20,
  maxPageSize: 100,

  // Cache
  cacheEnabled: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes

  // Logging
  logRequests: process.env.NODE_ENV === 'development',
  verboseLogging: false,
} as const;

export type MockConfig = typeof MOCK_CONFIG;
