"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Loader2, ArrowDown } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPullDistance?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  maxPullDistance = 120,
  className = "",
}: PullToRefreshProps) {
  const { isPulling, isRefreshing, pullDistance, pullProgress, handlers } =
    usePullToRefresh({
      onRefresh,
      threshold,
      maxPullDistance,
    });

  const indicatorScale = Math.min(pullProgress, 1);
  const indicatorRotation = pullProgress * 180;

  return (
    <div className={`relative ${className}`}>
      {/* Pull to Refresh Indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-10"
        animate={{
          height: isPulling || isRefreshing ? pullDistance : 0,
          opacity: isPulling || isRefreshing ? 1 : 0,
        }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-2"
          animate={{
            scale: indicatorScale,
            y: Math.min(pullDistance - 40, 40),
          }}
        >
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          ) : (
            <motion.div
              animate={{
                rotate: indicatorRotation,
              }}
            >
              <ArrowDown
                className={`w-6 h-6 transition-colors ${
                  pullProgress >= 1 ? "text-primary" : "text-muted-foreground"
                }`}
              />
            </motion.div>
          )}
          <span
            className={`text-xs font-medium transition-colors ${
              pullProgress >= 1 || isRefreshing
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {isRefreshing
              ? "Refreshing..."
              : pullProgress >= 1
              ? "Release to refresh"
              : "Pull to refresh"}
          </span>
        </motion.div>
      </motion.div>

      {/* Scrollable Content */}
      <div
        {...handlers}
        className="overflow-y-auto overscroll-y-contain"
        style={{
          touchAction: "pan-y",
        }}
      >
        {/* Spacer for indicator */}
        <motion.div
          animate={{
            height: isPulling || isRefreshing ? pullDistance : 0,
          }}
          transition={{ duration: 0.2 }}
        />
        {children}
      </div>
    </div>
  );
}
