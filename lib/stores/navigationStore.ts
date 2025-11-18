import { create } from "zustand";

interface NavigationState {
  currentRoute: string;
  isDrawerOpen: boolean;
  isSidebarCollapsed: boolean;
  pageTitle: string;
  canGoBack: boolean;
  setRoute: (route: string) => void;
  toggleDrawer: () => void;
  closeDrawer: () => void;
  openDrawer: () => void;
  toggleSidebar: () => void;
  setPageTitle: (title: string) => void;
  setCanGoBack: (canGoBack: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentRoute: "/projects",
  isDrawerOpen: false,
  isSidebarCollapsed: false,
  pageTitle: "Projects",
  canGoBack: false,
  setRoute: (route) => set({ currentRoute: route }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  closeDrawer: () => set({ isDrawerOpen: false }),
  openDrawer: () => set({ isDrawerOpen: true }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setPageTitle: (title) => set({ pageTitle: title }),
  setCanGoBack: (canGoBack) => set({ canGoBack }),
}));
