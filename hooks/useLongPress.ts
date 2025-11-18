import { useCallback, useRef, MouseEvent, TouchEvent } from "react";
import { haptics } from "@/lib/utils/haptics";

export interface LongPressConfig {
  callback: () => void;
  duration?: number; // Duration in ms to trigger long press
  hapticFeedback?: boolean; // Enable haptic feedback
  preventDefault?: boolean; // Prevent default context menu
}

export function useLongPress(config: LongPressConfig) {
  const {
    callback,
    duration = 500,
    hapticFeedback = true,
    preventDefault = true,
  } = config;

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const start = useCallback(() => {
    isLongPressRef.current = false;

    timerRef.current = setTimeout(() => {
      if (hapticFeedback) {
        haptics.medium();
      }
      isLongPressRef.current = true;
      callback();
    }, duration);
  }, [callback, duration, hapticFeedback]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isLongPressRef.current = false;
  }, []);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }
      start();
    },
    [start, preventDefault]
  );

  const handleMouseUp = useCallback(() => {
    clear();
  }, [clear]);

  const handleMouseLeave = useCallback(() => {
    clear();
  }, [clear]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }
      start();
    },
    [start, preventDefault]
  );

  const handleTouchEnd = useCallback(() => {
    clear();
  }, [clear]);

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      if (preventDefault) {
        e.preventDefault();
      }
    },
    [preventDefault]
  );

  return {
    onMouseDown: handleMouseDown,
    onMouseUp: handleMouseUp,
    onMouseLeave: handleMouseLeave,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onContextMenu: handleContextMenu,
    isLongPress: () => isLongPressRef.current,
  };
}
