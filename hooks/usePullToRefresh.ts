import { useCallback, useRef, useState, TouchEvent } from "react";
import { haptics } from "@/lib/utils/haptics";

export interface PullToRefreshConfig {
  onRefresh: () => Promise<void>;
  threshold?: number; // Pull distance threshold in px
  maxPullDistance?: number; // Maximum pull distance
  hapticFeedback?: boolean;
  resistance?: number; // Pull resistance factor (0-1)
}

export interface PullToRefreshState {
  isPulling: boolean;
  isRefreshing: boolean;
  pullDistance: number;
  pullProgress: number; // 0-1
}

export function usePullToRefresh(config: PullToRefreshConfig) {
  const {
    onRefresh,
    threshold = 80,
    maxPullDistance = 120,
    hapticFeedback = true,
    resistance = 0.5,
  } = config;

  const [state, setState] = useState<PullToRefreshState>({
    isPulling: false,
    isRefreshing: false,
    pullDistance: 0,
    pullProgress: 0,
  });

  const touchStartY = useRef<number>(0);
  const scrollElement = useRef<HTMLElement | null>(null);
  const hasTriggeredHaptic = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      const target = e.currentTarget as HTMLElement;
      scrollElement.current = target;

      // Only start pull if at top of scroll
      if (target.scrollTop === 0) {
        touchStartY.current = e.touches[0].clientY;
      }
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const target = e.currentTarget as HTMLElement;

      // Only allow pull if at top of scroll
      if (target.scrollTop === 0 && !state.isRefreshing) {
        const touchY = e.touches[0].clientY;
        const deltaY = touchY - touchStartY.current;

        if (deltaY > 0) {
          // Apply resistance to pull
          const adjustedDistance = Math.min(
            deltaY * resistance,
            maxPullDistance
          );
          const progress = Math.min(adjustedDistance / threshold, 1);

          setState({
            isPulling: true,
            isRefreshing: false,
            pullDistance: adjustedDistance,
            pullProgress: progress,
          });

          // Trigger haptic feedback at threshold
          if (
            hapticFeedback &&
            !hasTriggeredHaptic.current &&
            progress >= 1
          ) {
            haptics.medium();
            hasTriggeredHaptic.current = true;
          }

          // Prevent default scroll behavior while pulling
          if (deltaY > 10) {
            e.preventDefault();
          }
        }
      }
    },
    [state.isRefreshing, threshold, maxPullDistance, resistance, hapticFeedback]
  );

  const handleTouchEnd = useCallback(async () => {
    const { pullDistance, isPulling } = state;

    if (isPulling && pullDistance >= threshold) {
      // Trigger refresh
      if (hapticFeedback) {
        haptics.success();
      }

      setState((prev) => ({
        ...prev,
        isPulling: false,
        isRefreshing: true,
      }));

      try {
        await onRefresh();
      } finally {
        setState({
          isPulling: false,
          isRefreshing: false,
          pullDistance: 0,
          pullProgress: 0,
        });
      }
    } else {
      // Reset pull state
      setState({
        isPulling: false,
        isRefreshing: false,
        pullDistance: 0,
        pullProgress: 0,
      });
    }

    hasTriggeredHaptic.current = false;
    touchStartY.current = 0;
  }, [state, threshold, onRefresh, hapticFeedback]);

  return {
    ...state,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
