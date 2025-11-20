"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Eye, Folder, Settings, Sparkles, Layers } from "lucide-react";
import { useNavigationStore } from "@/lib/stores/navigationStore";
import { haptics } from "@/lib/utils/haptics";

const navItems = [
  {
    icon: Folder,
    label: "Projects",
    path: "/projects",
  },
  {
    icon: Sparkles,
    label: "Agent",
    path: "/agent-demo",
  },
  {
    icon: Layers,
    label: "Canvas",
    path: "/canvas-demo",
  },
  {
    icon: Settings,
    label: "Settings",
    path: "/settings",
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const setRoute = useNavigationStore((state) => state.setRoute);

  const handleNavClick = (path: string) => {
    if (pathname !== path) {
      haptics.selection();
      setRoute(path);
      router.push(path);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50 md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => handleNavClick(item.path)}
              className="flex flex-col items-center justify-center flex-1 h-full relative min-w-[44px] touch-manipulation active:scale-95 transition-transform"
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-b-full"
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  }}
                />
              )}
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  y: isActive ? -2 : 0,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Icon
                  className={`w-6 h-6 mb-1 ${
                    isActive ? "text-primary" : "text-muted-foreground"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </motion.div>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? "text-primary" : "text-muted-foreground"
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
