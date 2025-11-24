"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  Bell,
  User,
  Menu,
} from "lucide-react";
import { useNavigationStore } from "@/lib/stores/navigationStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { haptics } from "@/lib/utils/haptics";
import { useState } from "react";

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
}

export function TopBar({ title, showBack = false, actions }: TopBarProps) {
  const router = useRouter();
  const pageTitle = useNavigationStore((state) => state.pageTitle);
  const openDrawer = useNavigationStore((state) => state.openDrawer);
  const { user } = useAuthStore();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const displayTitle = title || pageTitle;

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const handleMenuClick = () => {
    haptics.light();
    openDrawer();
  };

  const handleProfileClick = () => {
    haptics.light();
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    haptics.light();
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  return (
    <header
      className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b border-border"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left Section */}
        <div className="flex items-center gap-2 flex-1">
          {showBack ? (
            <button
              onClick={handleBack}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors active:scale-95"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleMenuClick}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-lg font-semibold truncate">{displayTitle}</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Custom Actions */}
          {actions}

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-accent transition-colors active:scale-95 relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {/* Notification badge */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Avatar */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-border hover:border-primary transition-colors active:scale-95"
              aria-label="User menu"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/20 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
            </button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
                >
                  {user && (
                    <div className="p-4 border-b border-border">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  )}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push("/settings");
                      }}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-accent transition-colors"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        router.push("/login");
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* More Menu (Actions) */}
          <button
            className="hidden sm:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-accent transition-colors active:scale-95"
            aria-label="More options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showProfileMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowProfileMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
}
