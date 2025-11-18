/**
 * Theme Store - Zustand store for theme management
 *
 * Note: This store is provided as an alternative to the ThemeProvider context.
 * You can use either approach based on your preference:
 * - ThemeProvider (components/theme/ThemeProvider.tsx) - React Context API
 * - themeStore (this file) - Zustand state management
 *
 * Both provide the same functionality. Choose one and stick with it.
 */

// Commenting out until zustand is installed
// If you want to use this approach, run: npm install zustand

/*
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  effectiveTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  initTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const calculateEffectiveTheme = (theme: Theme): 'light' | 'dark' => {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
};

const applyTheme = (theme: 'light' | 'dark') => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);

  // Update meta theme-color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute(
      'content',
      theme === 'dark' ? '#0a0a0a' : '#ffffff'
    );
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      effectiveTheme: 'light',

      setTheme: (theme: Theme) => {
        const effective = calculateEffectiveTheme(theme);
        set({ theme, effectiveTheme: effective });
        applyTheme(effective);
      },

      initTheme: () => {
        const { theme } = get();
        const effective = calculateEffectiveTheme(theme);
        set({ effectiveTheme: effective });
        applyTheme(effective);

        // Listen for system theme changes
        if (typeof window !== 'undefined') {
          const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
          const handleChange = (e: MediaQueryListEvent) => {
            const { theme } = get();
            if (theme === 'system') {
              const newEffective = e.matches ? 'dark' : 'light';
              set({ effectiveTheme: newEffective });
              applyTheme(newEffective);
            }
          };

          mediaQuery.addEventListener('change', handleChange);
        }
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.initTheme();
        }
      },
    }
  )
);

// Hook to use theme store
export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  const effectiveTheme = useThemeStore((state) => state.effectiveTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const initTheme = useThemeStore((state) => state.initTheme);

  return { theme, effectiveTheme, setTheme, initTheme };
};
*/

// Export a placeholder until zustand is installed
export const useThemeStore = null;
export const useTheme = null;

export const THEME_INSTALLATION_INSTRUCTIONS = `
To use the Zustand theme store:

1. Install zustand:
   npm install zustand

2. Uncomment the code in this file (lib/stores/themeStore.ts)

3. Use in your components:
   import { useTheme } from '@/lib/stores/themeStore';

   function MyComponent() {
     const { theme, setTheme, effectiveTheme } = useTheme();
     // ... your component code
   }

For now, use the ThemeProvider context approach from components/theme/ThemeProvider.tsx
`;
