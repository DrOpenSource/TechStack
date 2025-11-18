"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Eye, Folder, Settings } from "lucide-react";

const navItems = [
  {
    icon: Folder,
    label: "Projects",
    path: "/projects",
  },
  {
    icon: MessageSquare,
    label: "Chat",
    path: "/chat",
  },
  {
    icon: Eye,
    label: "Preview",
    path: "/preview",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export function MobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={`w-6 h-6 mb-1 relative ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-xs relative ${
                  isActive ? "text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
