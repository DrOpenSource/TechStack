/**
 * Mock Data System - Central Export
 * Import all mock data and utilities from here
 */

// Configuration
export { MOCK_CONFIG } from './config';
export type { MockConfig } from './config';

// Utilities
export {
  delay,
  randomDelay,
  randomError,
  paginateMockData,
  searchMockData,
  sortMockData,
  generateId,
  randomItem,
  randomItems,
  logMockRequest,
  streamText,
  createMockResponse,
  mockFileUpload,
} from './utils';
export type {
  PaginationParams,
  PaginatedResult,
  SearchParams,
  SortParams,
  MockResponse,
} from './utils';

// Users
export {
  mockUsers,
  DEMO_CREDENTIALS,
  DEMO_ACCOUNTS,
  getUserById,
  getUserByEmail,
  getDemoUser,
  authenticateUser,
  verifyOTP,
} from './mockUsers';
export type { MockUser } from './mockUsers';

// Projects
export {
  mockProjects,
  getProjectById,
  getProjectsByCategory,
  getProjectsByStatus,
} from './mockProjects';
export type { MockProject } from './mockProjects';

// Components
export {
  mockComponents,
  getComponentById,
  getComponentsByCategory,
  searchComponentsByTag,
} from './mockComponents';
export type { MockComponent } from './mockComponents';

// AI Responses
export {
  AI_RESPONSES,
  matchPattern,
  getRelatedPrompts,
} from './mockAIResponses';
export type { AIResponse } from './mockAIResponses';

// Workouts (Fitness Domain)
export {
  mockExercises,
  mockWorkoutLogs,
  mockWorkoutPlans,
  mockProgressEntries,
  mockWorkoutStats,
  getExerciseById,
  getExercisesByCategory,
} from './mockWorkouts';
export type {
  Exercise,
  WorkoutLog,
  WorkoutPlan,
  ProgressEntry,
  WorkoutStats,
} from './mockWorkouts';

// Products (E-commerce Domain)
export {
  mockProducts,
  mockReviews,
  mockOrders,
  mockCartItems,
  mockCategories,
  getProductById,
  getProductsByCategory,
  getFeaturedProducts,
  getBestsellers,
} from './mockProducts';
export type {
  Product,
  ProductReview,
  Order,
  CartItem,
  Category,
} from './mockProducts';

// Analytics (Dashboard Domain)
export {
  mockDashboardMetrics,
  mockWebsiteAnalytics,
  mockSalesAnalytics,
  mockCustomerAnalytics,
  mockPerformanceMetrics,
  getMetricsForDateRange,
  getComparisonData,
} from './mockAnalytics';
export type {
  DashboardMetrics,
  WebsiteAnalytics,
  SalesAnalytics,
  CustomerAnalytics,
  PerformanceMetrics,
  ComparisonData,
} from './mockAnalytics';
