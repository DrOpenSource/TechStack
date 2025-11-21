/**
 * Authentication Store
 * Zustand store for managing authentication state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthStore, LoginCredentials, OTPVerification, User } from '@/types/auth';

// Demo credentials
const DEMO_CREDENTIALS = {
  email: 'demo@vibecode.app',
  password: 'demo123',
};

const DEMO_OTP = '123456';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      selectedAgents: [],

      // Actions
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await delay(1000);

          // Mock login - check credentials
          if (
            credentials.email === DEMO_CREDENTIALS.email &&
            credentials.password === DEMO_CREDENTIALS.password
          ) {
            const user: User = {
              id: '1',
              email: credentials.email,
              name: 'Demo User',
              avatar: '/avatars/demo-user.png',
              createdAt: new Date(),
              lastLoginAt: new Date(),
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Invalid email or password');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },

      loginWithOTP: async (email: string) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate sending OTP
          await delay(800);

          // In production, this would call an API to send OTP
          // For demo, we just simulate success
          set({ isLoading: false });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to send OTP',
          });
          throw error;
        }
      },

      verifyOTP: async (verification: OTPVerification) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await delay(1000);

          // Mock OTP verification
          if (verification.otp === DEMO_OTP) {
            const user: User = {
              id: '1',
              email: verification.email,
              name: 'Demo User',
              avatar: '/avatars/demo-user.png',
              createdAt: new Date(),
              lastLoginAt: new Date(),
            };

            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } else {
            throw new Error('Invalid OTP code');
          }
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'OTP verification failed',
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          selectedAgents: [],
        });
      },

      clearError: () => {
        set({ error: null });
      },

      setSelectedAgents: (agentIds: string[]) => {
        set({ selectedAgents: agentIds });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedAgents: state.selectedAgents,
      }),
    }
  )
);
