/**
 * Mock Utility Functions
 *
 * Helper functions for realistic mock behavior including delays,
 * error simulation, and random data generation.
 *
 * @see .claude/skills/development/mock-first-development.md
 */

import { mockConfig, logMock } from './mockConfig';

/**
 * Simulates network latency for realistic mock API behavior
 *
 * @param customDelay Optional custom delay in milliseconds
 * @returns Promise that resolves after the delay
 *
 * @example
 * async function mockGetUser() {
 *   await simulateDelay();
 *   return { id: 1, name: 'Alice' };
 * }
 */
export async function simulateDelay(customDelay?: number): Promise<void> {
  if (!mockConfig.enabled) return;

  const delay = customDelay ?? mockConfig.delay;
  logMock(`Simulating ${delay}ms network delay...`);

  return new Promise(resolve => setTimeout(resolve, delay));
}

/**
 * Randomly throws errors based on configured error rate
 * Useful for testing error states and loading indicators
 *
 * @param customRate Optional custom error rate (0-100)
 * @throws Error with simulated network error message
 *
 * @example
 * async function mockApiCall() {
 *   await simulateError(); // May throw based on config
 *   return data;
 * }
 */
export async function simulateError(customRate?: number): Promise<void> {
  if (!mockConfig.enabled) return;

  const errorRate = customRate ?? mockConfig.errorRate;

  if (errorRate > 0) {
    const shouldError = Math.random() * 100 < errorRate;
    if (shouldError) {
      logMock(`Simulating error (${errorRate}% chance)`, { thrown: true });
      throw new Error('Simulated network error - This is intentional for testing');
    }
  }
}

/**
 * Returns a random element from an array
 *
 * @param array Array to choose from
 * @returns Random element from the array
 *
 * @example
 * const status = randomChoice(['active', 'pending', 'completed']);
 */
export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Returns a random integer between min and max (inclusive)
 *
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random integer
 *
 * @example
 * const age = randomInt(18, 80);
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Returns a random boolean value
 *
 * @param probability Probability of true (0-1), defaults to 0.5
 * @returns Random boolean
 *
 * @example
 * const isActive = randomBool(0.7); // 70% chance of true
 */
export function randomBool(probability: number = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Shuffles an array randomly
 *
 * @param array Array to shuffle
 * @returns New shuffled array
 *
 * @example
 * const shuffled = shuffle([1, 2, 3, 4, 5]);
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Creates a paginated response from an array of data
 *
 * @param data Full dataset
 * @param page Current page (1-indexed)
 * @param limit Items per page
 * @returns Paginated response object
 *
 * @example
 * const response = paginate(allUsers, 2, 10);
 * // Returns page 2 with 10 items + pagination metadata
 */
export function paginate<T>(
  data: T[],
  page: number = 1,
  limit: number = 10
): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total: data.length,
      totalPages: Math.ceil(data.length / limit),
      hasNext: end < data.length,
      hasPrev: page > 1,
    },
  };
}

/**
 * Filters array based on search query (case-insensitive)
 *
 * @param data Array to search
 * @param query Search query
 * @param fields Fields to search in
 * @returns Filtered array
 *
 * @example
 * const results = search(users, 'alice', ['name', 'email']);
 */
export function search<T extends Record<string, any>>(
  data: T[],
  query: string,
  fields: (keyof T)[]
): T[] {
  if (!query) return data;

  const lowerQuery = query.toLowerCase();
  return data.filter(item =>
    fields.some(field => {
      const value = String(item[field] || '');
      return value.toLowerCase().includes(lowerQuery);
    })
  );
}

/**
 * Sorts array by field (ascending or descending)
 *
 * @param data Array to sort
 * @param field Field to sort by
 * @param order Sort order
 * @returns Sorted array
 *
 * @example
 * const sorted = sortBy(users, 'createdAt', 'desc');
 */
export function sortBy<T>(
  data: T[],
  field: keyof T,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * In-memory data store for mock CRUD operations
 * Persists data during the session (resets on page reload)
 */
export class MockDataStore<T extends { id: string | number }> {
  private data: T[] = [];

  constructor(initialData: T[] = []) {
    this.data = [...initialData];
  }

  getAll(): T[] {
    return [...this.data];
  }

  getById(id: string | number): T | null {
    return this.data.find(item => item.id === id) || null;
  }

  create(item: T): T {
    this.data.push(item);
    logMock('MockStore: Created item', item);
    return item;
  }

  update(id: string | number, updates: Partial<T>): T | null {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;

    this.data[index] = { ...this.data[index], ...updates };
    logMock('MockStore: Updated item', this.data[index]);
    return this.data[index];
  }

  delete(id: string | number): boolean {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    logMock('MockStore: Deleted item', { id });
    return true;
  }

  filter(predicate: (item: T) => boolean): T[] {
    return this.data.filter(predicate);
  }

  reset(newData?: T[]): void {
    this.data = newData ? [...newData] : [];
    logMock('MockStore: Reset store');
  }
}

/**
 * TypeScript interfaces
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
