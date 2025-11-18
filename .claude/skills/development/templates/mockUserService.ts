/**
 * Mock User Service
 *
 * Example mock implementation of a user service.
 * This demonstrates the pattern for creating mock services.
 *
 * @see .claude/skills/development/mock-first-development.md
 */

import {
  simulateDelay,
  simulateError,
  paginate,
  search,
  sortBy,
  MockDataStore,
  logMock,
} from './mockUtils';

/**
 * TypeScript interfaces (shared with real service)
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserInput {
  name: string;
  email: string;
  phone: string;
  bio?: string;
  role?: 'admin' | 'user';
}

export interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  status?: 'active' | 'inactive';
}

export interface UserService {
  getAll(options?: GetAllOptions): Promise<PaginatedResponse<User>>;
  getById(id: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: UpdateUserInput): Promise<User>;
  delete(id: string): Promise<void>;
  search(query: string): Promise<User[]>;
}

export interface GetAllOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof User;
  sortOrder?: 'asc' | 'desc';
  status?: User['status'];
  role?: User['role'];
}

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

/**
 * Mock fixture data
 */
const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    name: 'Alice Johnson',
    email: 'alice.demo@example.com',
    phone: '+919876543210',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Product designer passionate about user experience',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'user-002',
    name: 'Bob Smith',
    email: 'bob.demo@example.com',
    phone: '+919876543211',
    avatar: 'https://i.pravatar.cc/150?img=2',
    bio: 'Full-stack developer',
    role: 'user',
    status: 'active',
    createdAt: '2024-02-10T14:20:00Z',
    updatedAt: '2024-02-10T14:20:00Z',
  },
  {
    id: 'user-003',
    name: 'Charlie Davis',
    email: 'charlie.demo@example.com',
    phone: '+919876543212',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Data scientist and ML engineer',
    role: 'user',
    status: 'active',
    createdAt: '2024-03-05T09:15:00Z',
    updatedAt: '2024-03-05T09:15:00Z',
  },
  {
    id: 'user-004',
    name: 'Diana Prince',
    email: 'diana.demo@example.com',
    phone: '+919876543213',
    avatar: 'https://i.pravatar.cc/150?img=4',
    bio: 'DevOps engineer',
    role: 'user',
    status: 'active',
    createdAt: '2024-04-12T16:45:00Z',
    updatedAt: '2024-04-12T16:45:00Z',
  },
  {
    id: 'user-005',
    name: 'Eve Martinez',
    email: 'eve.demo@example.com',
    phone: '+919876543214',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Security researcher',
    role: 'admin',
    status: 'inactive',
    createdAt: '2024-05-20T11:00:00Z',
    updatedAt: '2024-05-20T11:00:00Z',
  },
];

/**
 * In-memory data store
 */
const userStore = new MockDataStore<User>(MOCK_USERS);

/**
 * Mock User Service Implementation
 */
export const mockUserService: UserService = {
  /**
   * Get all users with pagination and filtering
   */
  async getAll(options?: GetAllOptions): Promise<PaginatedResponse<User>> {
    await simulateDelay();
    await simulateError();

    logMock('UserService.getAll', options);

    let users = userStore.getAll();

    // Apply filters
    if (options?.status) {
      users = users.filter(u => u.status === options.status);
    }

    if (options?.role) {
      users = users.filter(u => u.role === options.role);
    }

    // Apply sorting
    if (options?.sortBy) {
      users = sortBy(users, options.sortBy, options.sortOrder || 'asc');
    }

    // Apply pagination
    return paginate(users, options?.page, options?.limit);
  },

  /**
   * Get user by ID
   */
  async getById(id: string): Promise<User | null> {
    await simulateDelay();
    await simulateError();

    logMock('UserService.getById', { id });

    const user = userStore.getById(id);
    if (!user) {
      logMock('User not found', { id });
    }
    return user;
  },

  /**
   * Create new user
   */
  async create(data: CreateUserInput): Promise<User> {
    await simulateDelay();
    await simulateError();

    logMock('UserService.create', data);

    const newUser: User = {
      id: `user-mock-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      bio: data.bio,
      role: data.role || 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return userStore.create(newUser);
  },

  /**
   * Update existing user
   */
  async update(id: string, data: UpdateUserInput): Promise<User> {
    await simulateDelay();
    await simulateError();

    logMock('UserService.update', { id, data });

    const updated = userStore.update(id, {
      ...data,
      updatedAt: new Date().toISOString(),
    });

    if (!updated) {
      throw new Error(`User with id ${id} not found`);
    }

    return updated;
  },

  /**
   * Delete user
   */
  async delete(id: string): Promise<void> {
    await simulateDelay();
    await simulateError();

    logMock('UserService.delete', { id });

    const deleted = userStore.delete(id);
    if (!deleted) {
      throw new Error(`User with id ${id} not found`);
    }
  },

  /**
   * Search users by name or email
   */
  async search(query: string): Promise<User[]> {
    await simulateDelay();
    await simulateError();

    logMock('UserService.search', { query });

    const users = userStore.getAll();
    return search(users, query, ['name', 'email', 'phone', 'bio']);
  },
};

/**
 * Export individual mock users for testing
 */
export const DEMO_ADMIN = MOCK_USERS[0];
export const DEMO_USER = MOCK_USERS[1];
