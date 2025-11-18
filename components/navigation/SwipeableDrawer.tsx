"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Bell,
  HelpCircle,
  X,
} from "lucide-react";
import { useNavigationStore } from "@/lib/stores/navigationStore";
import { useUserStore } from "@/lib/stores/user-store";
import { useRouter } from "next/navigation";
import { haptics } from "@/lib/utils/haptics";

const menuItems = [
  {
    icon: User,
    label: "Profile",
    path: "/settings/profile",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
  {
    icon: Bell,
    label: "Notifications",
    path: "/settings/notifications",
  },
  {
    icon: HelpCircle,
    label: "Help & Support",
    path: "/help",
  },
];

export function SwipeableDrawer() {
  const isDrawerOpen = useNavigationStore((state) => state.isDrawerOpen);
  const closeDrawer = useNavigationStore((state) => state.closeDrawer);
  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDrawerOpen) {
        closeDrawer();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen, closeDrawer]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    // Close drawer if dragged left more than 100px or with sufficient velocity
    if (info.offset.x < -100 || info.velocity.x < -500) {
      haptics.light();
      closeDrawer();
    }
  };

  const handleMenuClick = (path: string) => {
    haptics.selection();
    closeDrawer();
    router.push(path);
  };

  const handleLogout = () => {
    haptics.medium();
    logout();
    closeDrawer();
    router.push("/login");
  };

  const handleBackdropClick = () => {
    haptics.light();
    closeDrawer();
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
            onClick={handleBackdropClick}
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.2 }}
            onDragEnd={handleDragEnd}
            className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card border-r border-border z-50 flex flex-col md:hidden overflow-hidden"
            style={{
              paddingTop: "env(safe-area-inset-top, 0px)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => {
                  haptics.light();
                  closeDrawer();
                }}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors active:scale-95"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Section */}
            {user && (
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-2">
              <div className="space-y-1 px-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.path}
                      onClick={() => handleMenuClick(item.path)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-left active:scale-98"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Theme Toggle (placeholder) */}
              <div className="px-2 mt-4">
                <div className="p-4 rounded-lg bg-accent/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Sun className="w-5 h-5 text-muted-foreground" />
                      <span className="text-sm font-medium">Theme</span>
                    </div>
                    <button
                      className="w-12 h-6 rounded-full bg-primary/20 relative transition-colors"
                      aria-label="Toggle theme"
                    >
                      <motion.div
                        className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-primary"
                        animate={{ x: 0 }}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </nav>

            {/* Footer - Sign Out */}
            <div className="border-t border-border p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors active:scale-98"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-semibold">Sign Out</span>
              </button>
            </div>

            {/* Drag Indicator */}
            <div className="absolute top-1/2 -translate-y-1/2 right-2 pointer-events-none">
              <div className="w-1 h-12 rounded-full bg-border/50" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
