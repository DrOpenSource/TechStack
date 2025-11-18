/**
 * Mock Utilities
 * Helper functions for mock data operations
 */

import { MOCK_CONFIG } from './config';

/**
 * Simulate network delay
 */
export const delay = (ms?: number): Promise<void> => {
  const delayTime = ms ?? MOCK_CONFIG.networkDelay;
  return new Promise(resolve => setTimeout(resolve, delayTime));
};

/**
 * Random delay within range
 */
export const randomDelay = (): Promise<void> => {
  const ms = Math.floor(
    Math.random() * (MOCK_CONFIG.maxDelay - MOCK_CONFIG.minDelay) + MOCK_CONFIG.minDelay
  );
  return delay(ms);
};

/**
 * Simulate occasional errors
 */
export const randomError = (errorRate = MOCK_CONFIG.errorRate): void => {
  if (Math.random() < errorRate) {
    const errors = [
      new Error('Network timeout'),
      new Error('Service unavailable'),
      new Error('Rate limit exceeded'),
      new Error('Invalid request'),
    ];
    throw errors[Math.floor(Math.random() * errors.length)];
  }
};

/**
 * Paginate array data
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  offset?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const paginateMockData = <T>(
  data: T[],
  params: PaginationParams = {}
): PaginatedResult<T> => {
  const {
    page = 1,
    pageSize = MOCK_CONFIG.defaultPageSize,
    offset,
    limit,
  } = params;

  // Support both page-based and offset-based pagination
  const start = offset !== undefined ? offset : (page - 1) * pageSize;
  const end = limit !== undefined ? start + limit : start + pageSize;

  const paginatedData = data.slice(start, end);
  const total = data.length;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data: paginatedData,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNext: end < total,
      hasPrev: start > 0,
    },
  };
};

/**
 * Search/filter mock data
 */
export interface SearchParams {
  query?: string;
  fields?: string[];
  caseSensitive?: boolean;
}

export const searchMockData = <T extends Record<string, any>>(
  data: T[],
  params: SearchParams
): T[] => {
  const { query, fields, caseSensitive = false } = params;

  if (!query) return data;

  const searchTerm = caseSensitive ? query : query.toLowerCase();

  return data.filter(item => {
    const searchFields = fields || Object.keys(item);

    return searchFields.some(field => {
      const value = item[field];
      if (value === null || value === undefined) return false;

      const stringValue = String(value);
      const searchValue = caseSensitive ? stringValue : stringValue.toLowerCase();

      return searchValue.includes(searchTerm);
    });
  });
};

/**
 * Sort mock data
 */
export interface SortParams {
  field: string;
  order?: 'asc' | 'desc';
}

export const sortMockData = <T extends Record<string, any>>(
  data: T[],
  params: SortParams
): T[] => {
  const { field, order = 'asc' } = params;

  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];

    if (aVal === bVal) return 0;

    const comparison = aVal < bVal ? -1 : 1;
    return order === 'asc' ? comparison : -comparison;
  });
};

/**
 * Generate random ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Pick random item from array
 */
export const randomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

/**
 * Pick multiple random items from array
 */
export const randomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

/**
 * Log mock request (if enabled)
 */
export const logMockRequest = (
  service: string,
  method: string,
  params?: any
): void => {
  if (MOCK_CONFIG.logRequests) {
    console.log(`[Mock] ${service}.${method}`, params);
  }
};

/**
 * Simulate streaming text response
 */
export async function* streamText(
  text: string,
  delayMs?: number
): AsyncGenerator<string> {
  const words = text.split(' ');
  const streamDelay = delayMs ?? MOCK_CONFIG.aiStreamDelay;

  for (let i = 0; i < words.length; i++) {
    yield words[i] + (i < words.length - 1 ? ' ' : '');
    await delay(streamDelay);
  }
}

/**
 * Create mock response wrapper
 */
export interface MockResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
  timestamp: number;
}

export const createMockResponse = <T>(
  data: T,
  success = true
): MockResponse<T> => {
  return {
    success,
    data: success ? data : undefined,
    error: success ? undefined : { message: 'Mock error occurred' },
    timestamp: Date.now(),
  };
};

/**
 * Simulate file upload
 */
export const mockFileUpload = async (file: File): Promise<{
  url: string;
  filename: string;
  size: number;
  type: string;
}> => {
  await randomDelay();

  return {
    url: `https://mock-cdn.example.com/${Date.now()}-${file.name}`,
    filename: file.name,
    size: file.size,
    type: file.type,
  };
};
