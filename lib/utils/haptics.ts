/**
 * Haptic feedback utilities for mobile devices
 * Provides tactile feedback for user interactions
 */

export const HAPTIC_PATTERNS = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  error: [10, 50, 10, 50, 10],
  warning: [20, 40, 20],
  double: [10, 30, 10],
  selection: 5,
} as const;

export type HapticPattern = keyof typeof HAPTIC_PATTERNS;

/**
 * Trigger haptic feedback if supported by the device
 * @param pattern - The vibration pattern (number or array of numbers)
 */
export function vibrate(pattern: number | number[]): void {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration is not supported or blocked
      console.debug("Vibration not supported:", error);
    }
  }
}

/**
 * Trigger a predefined haptic pattern
 * @param pattern - The name of the predefined pattern
 */
export function haptic(pattern: HapticPattern): void {
  vibrate(HAPTIC_PATTERNS[pattern]);
}

/**
 * Stop any ongoing vibration
 */
export function stopVibration(): void {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(0);
  }
}

/**
 * Check if haptic feedback is supported
 */
export function isHapticSupported(): boolean {
  return typeof window !== "undefined" && "vibrate" in navigator;
}

/**
 * Haptic feedback for common UI interactions
 */
export const haptics = {
  light: () => haptic("light"),
  medium: () => haptic("medium"),
  heavy: () => haptic("heavy"),
  success: () => haptic("success"),
  error: () => haptic("error"),
  warning: () => haptic("warning"),
  selection: () => haptic("selection"),
  double: () => haptic("double"),
};
