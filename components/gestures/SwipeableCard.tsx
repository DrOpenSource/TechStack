"use client";

import { useState, ReactNode } from "react";
import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { haptics } from "@/lib/utils/haptics";

export interface SwipeableCardProps {
  children: ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number; // Distance threshold to trigger action
  className?: string;
  snapBack?: boolean; // Whether to snap back if swipe is incomplete
}

export function SwipeableCard({
  children,
  onSwipeLeft,
  onSwipeRight,
  threshold = 150,
  className = "",
  snapBack = true,
}: SwipeableCardProps) {
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(
    null
  );
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-15, 0, 15]);
  const opacity = useTransform(
    x,
    [-threshold * 1.5, -threshold, 0, threshold, threshold * 1.5],
    [0.5, 0.8, 1, 0.8, 0.5]
  );

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    // Determine if swipe was strong enough
    const shouldSwipe = Math.abs(offset) > threshold || Math.abs(velocity) > 500;

    if (shouldSwipe) {
      if (offset > 0 && onSwipeRight) {
        // Swiped right
        haptics.success();
        setExitDirection("right");
        onSwipeRight();
      } else if (offset < 0 && onSwipeLeft) {
        // Swiped left
        haptics.success();
        setExitDirection("left");
        onSwipeLeft();
      }
    } else if (snapBack) {
      // Snap back to center
      haptics.light();
    }
  };

  const handleDrag = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const offset = Math.abs(info.offset.x);

    // Provide haptic feedback at threshold
    if (offset >= threshold && offset < threshold + 10) {
      haptics.selection();
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        x,
        rotate,
        opacity,
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      animate={
        exitDirection
          ? {
              x: exitDirection === "left" ? -500 : 500,
              opacity: 0,
              transition: { duration: 0.3 },
            }
          : {}
      }
      whileTap={{ scale: 0.98, cursor: "grabbing" }}
    >
      {/* Swipe Indicators */}
      {onSwipeLeft && (
        <motion.div
          className="absolute top-0 right-0 bottom-0 w-24 flex items-center justify-center bg-destructive/20 rounded-l-lg pointer-events-none"
          style={{
            opacity: useTransform(
              x,
              [0, -threshold],
              [0, 1]
            ),
          }}
        >
          <div className="text-destructive font-semibold text-sm">
            Delete
          </div>
        </motion.div>
      )}

      {onSwipeRight && (
        <motion.div
          className="absolute top-0 left-0 bottom-0 w-24 flex items-center justify-center bg-green-500/20 rounded-r-lg pointer-events-none"
          style={{
            opacity: useTransform(
              x,
              [0, threshold],
              [0, 1]
            ),
          }}
        >
          <div className="text-green-600 font-semibold text-sm">
            Like
          </div>
        </motion.div>
      )}

      {/* Card Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
