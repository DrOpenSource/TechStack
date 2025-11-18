/**
 * Service Selection Hooks
 *
 * React hooks that automatically select between mock and real service
 * implementations based on MOCK_MODE configuration.
 *
 * @see .claude/skills/development/mock-first-development.md
 */

import { useMemo } from 'react';
import { mockConfig } from './mockConfig';

/**
 * Generic service hook factory
 *
 * Creates a hook that switches between mock and real service implementations
 *
 * @param mockService Mock implementation
 * @param realService Real implementation
 * @returns Hook that returns appropriate service
 *
 * @example
 * const useUserService = createServiceHook(mockUserService, realUserService);
 *
 * function MyComponent() {
 *   const userService = useUserService();
 *   // Service auto-routes to mock or real based on config
 * }
 */
export function createServiceHook<T>(mockService: T, realService: T) {
  return function useService(): T {
    return useMemo(() => {
      return mockConfig.enabled ? mockService : realService;
    }, []);
  };
}

/**
 * Example: User Service Hook
 *
 * Usage in your project:
 *
 * 1. Import both implementations:
 * import { userService } from '@/services/real/userService';
 * import { mockUserService } from '@/services/mock/mockUserService';
 *
 * 2. Create the hook:
 * export const useUserService = createServiceHook(mockUserService, userService);
 *
 * 3. Use in components:
 * function UserList() {
 *   const userService = useUserService();
 *
 *   const loadUsers = async () => {
 *     const users = await userService.getAll();
 *     setUsers(users);
 *   };
 * }
 */

/**
 * Alternative: Direct conditional import
 *
 * For simpler cases, you can conditionally import in the hook:
 */
export function useUserServiceExample() {
  return useMemo(() => {
    if (mockConfig.enabled) {
      // Dynamic import for code splitting
      return import('@/services/mock/mockUserService').then(m => m.mockUserService);
    }
    return import('@/services/real/userService').then(m => m.userService);
  }, []);
}

/**
 * Service context pattern (for dependency injection)
 */
import { createContext, useContext, ReactNode } from 'react';

interface ServiceContextValue<T> {
  service: T;
}

export function createServiceContext<T>() {
  const ServiceContext = createContext<ServiceContextValue<T> | null>(null);

  function ServiceProvider({
    mockService,
    realService,
    children,
  }: {
    mockService: T;
    realService: T;
    children: ReactNode;
  }) {
    const service = mockConfig.enabled ? mockService : realService;

    return (
      <ServiceContext.Provider value={{ service }}>
        {children}
      </ServiceContext.Provider>
    );
  }

  function useService(): T {
    const context = useContext(ServiceContext);
    if (!context) {
      throw new Error('useService must be used within ServiceProvider');
    }
    return context.service;
  }

  return {
    ServiceProvider,
    useService,
  };
}

/**
 * Example usage of context pattern:
 *
 * // services/userServiceContext.ts
 * export const { ServiceProvider: UserServiceProvider, useService: useUserService } =
 *   createServiceContext<UserService>();
 *
 * // app/layout.tsx
 * import { UserServiceProvider } from '@/services/userServiceContext';
 * import { userService } from '@/services/real/userService';
 * import { mockUserService } from '@/services/mock/mockUserService';
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <UserServiceProvider mockService={mockUserService} realService={userService}>
 *       {children}
 *     </UserServiceProvider>
 *   );
 * }
 *
 * // components/UserList.tsx
 * import { useUserService } from '@/services/userServiceContext';
 *
 * function UserList() {
 *   const userService = useUserService();
 *   // Service automatically selected based on config
 * }
 */

/**
 * Factory function for non-React environments
 */
export function getService<T>(mockService: T, realService: T): T {
  return mockConfig.enabled ? mockService : realService;
}

/**
 * Example usage:
 *
 * // In API routes or server components
 * import { getService } from '@/lib/useService';
 * import { userService } from '@/services/real/userService';
 * import { mockUserService } from '@/services/mock/mockUserService';
 *
 * export async function GET() {
 *   const service = getService(mockUserService, userService);
 *   const users = await service.getAll();
 *   return Response.json(users);
 * }
 */
