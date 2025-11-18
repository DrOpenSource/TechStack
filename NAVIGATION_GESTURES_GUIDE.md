# Navigation & Gestures System

This guide covers the responsive navigation and mobile touch interaction system built for the TechStack mobile app.

## Table of Contents

1. [Navigation Components](#navigation-components)
2. [Gesture Hooks](#gesture-hooks)
3. [Gesture Components](#gesture-components)
4. [Navigation Store](#navigation-store)
5. [Haptics Utilities](#haptics-utilities)
6. [Usage Examples](#usage-examples)

---

## Navigation Components

### BottomNav

Mobile-only bottom navigation bar with smooth animations and haptic feedback.

**Location:** `/components/navigation/BottomNav.tsx`

**Features:**
- 4 main navigation items (Projects, Chat, Preview, Settings)
- Animated active tab indicator
- Haptic feedback on navigation
- Auto-hides on desktop (md: breakpoint)
- Safe area padding for iPhone notch

**Usage:**
```tsx
import { BottomNav } from "@/components/navigation/BottomNav";

// Already included in workspace layout
<BottomNav />
```

---

### Sidebar

Desktop-only collapsible sidebar navigation.

**Location:** `/components/navigation/Sidebar.tsx`

**Features:**
- Collapsible with expand/collapse button
- Logo at top
- User profile section at bottom
- Active route highlighting
- Tooltips in collapsed state
- Sign out button
- Smooth animations with Framer Motion

**Usage:**
```tsx
import { Sidebar } from "@/components/navigation/Sidebar";

// Already included in workspace layout
<Sidebar />
```

---

### TopBar

Header bar with title, actions, and user menu.

**Location:** `/components/navigation/TopBar.tsx`

**Features:**
- Customizable page title
- Back button (mobile)
- Custom action buttons
- Notification bell with dropdown
- User avatar with profile menu
- Transparent background with blur effect
- Safe area padding

**Usage:**
```tsx
import { TopBar } from "@/components/navigation/TopBar";

<TopBar
  title="Projects"
  showBack={false}
  actions={
    <button onClick={handleAction}>
      <Plus className="w-5 h-5" />
    </button>
  }
/>
```

---

### SwipeableDrawer

Mobile drawer that swipes in from the left.

**Location:** `/components/navigation/SwipeableDrawer.tsx`

**Features:**
- Swipe from left edge to open
- Drag to close
- User profile display
- Menu items (Profile, Settings, Notifications, Help)
- Theme toggle placeholder
- Sign out button
- Overlay backdrop
- Smooth animations

**Usage:**
```tsx
import { SwipeableDrawer } from "@/components/navigation/SwipeableDrawer";
import { useNavigationStore } from "@/lib/stores/navigationStore";

function MyComponent() {
  const openDrawer = useNavigationStore(state => state.openDrawer);

  return (
    <>
      <button onClick={openDrawer}>Open Menu</button>
      <SwipeableDrawer />
    </>
  );
}
```

---

## Gesture Hooks

### useSwipeGesture

Hook for detecting swipe gestures in all directions.

**Location:** `/hooks/useSwipeGesture.ts`

**Usage:**
```tsx
import { useSwipeGesture } from "@/hooks/useSwipeGesture";

function MyComponent() {
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => console.log("Swiped left"),
    onSwipeRight: () => console.log("Swiped right"),
    onSwipeUp: () => console.log("Swiped up"),
    onSwipeDown: () => console.log("Swiped down"),
    threshold: 50, // Minimum distance in px
    velocityThreshold: 0.3, // Minimum velocity
    hapticFeedback: true,
  });

  return (
    <div {...swipeHandlers}>
      Swipe me!
    </div>
  );
}
```

---

### useLongPress

Hook for detecting long press gestures.

**Location:** `/hooks/useLongPress.ts`

**Usage:**
```tsx
import { useLongPress } from "@/hooks/useLongPress";

function MyComponent() {
  const longPressHandlers = useLongPress({
    callback: () => console.log("Long pressed!"),
    duration: 500, // ms to trigger
    hapticFeedback: true,
    preventDefault: true,
  });

  return (
    <button {...longPressHandlers}>
      Long press me!
    </button>
  );
}
```

---

### usePullToRefresh

Hook for implementing pull-to-refresh functionality.

**Location:** `/hooks/usePullToRefresh.ts`

**Usage:**
```tsx
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

function MyComponent() {
  const { isPulling, isRefreshing, pullProgress, handlers } = usePullToRefresh({
    onRefresh: async () => {
      // Refresh logic
      await fetchData();
    },
    threshold: 80,
    maxPullDistance: 120,
    hapticFeedback: true,
  });

  return (
    <div {...handlers}>
      {isRefreshing && <div>Refreshing...</div>}
      <div>Scrollable content</div>
    </div>
  );
}
```

---

## Gesture Components

### SwipeableCard

Card component that can be swiped left or right (Tinder-style).

**Location:** `/components/gestures/SwipeableCard.tsx`

**Features:**
- Visual feedback during swipe
- Customizable swipe actions
- Snap back if swipe incomplete
- Rotation and opacity effects
- Haptic feedback

**Usage:**
```tsx
import { SwipeableCard } from "@/components/gestures/SwipeableCard";

<SwipeableCard
  onSwipeLeft={() => console.log("Deleted")}
  onSwipeRight={() => console.log("Liked")}
  threshold={150}
  snapBack={true}
>
  <div className="p-4 bg-card rounded-lg">
    Card content here
  </div>
</SwipeableCard>
```

---

### PullToRefresh

Wrapper component for pull-to-refresh functionality.

**Location:** `/components/gestures/PullToRefresh.tsx`

**Features:**
- Animated loading indicator
- Pull progress feedback
- Customizable threshold
- Smooth animations
- Auto-resets after refresh

**Usage:**
```tsx
import { PullToRefresh } from "@/components/gestures/PullToRefresh";

<PullToRefresh
  onRefresh={async () => {
    await fetchData();
  }}
  threshold={80}
  className="flex-1"
>
  <div>
    Your scrollable content here
  </div>
</PullToRefresh>
```

---

## Navigation Store

Central state management for navigation using Zustand.

**Location:** `/lib/stores/navigationStore.ts`

**State:**
```tsx
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
```

**Usage:**
```tsx
import { useNavigationStore } from "@/lib/stores/navigationStore";

function MyComponent() {
  const openDrawer = useNavigationStore(state => state.openDrawer);
  const setPageTitle = useNavigationStore(state => state.setPageTitle);

  useEffect(() => {
    setPageTitle("My Page");
  }, []);

  return (
    <button onClick={openDrawer}>Open Menu</button>
  );
}
```

---

## Haptics Utilities

Provide tactile feedback for user interactions.

**Location:** `/lib/utils/haptics.ts`

**Patterns:**
```tsx
export const HAPTIC_PATTERNS = {
  light: 10,        // Quick tap
  medium: 20,       // Button press
  heavy: 30,        // Important action
  success: [10, 50, 10],  // Success feedback
  error: [10, 50, 10, 50, 10],  // Error feedback
  warning: [20, 40, 20],  // Warning
  double: [10, 30, 10],   // Double tap
  selection: 5,     // Selection change
};
```

**Usage:**
```tsx
import { haptics, vibrate, isHapticSupported } from "@/lib/utils/haptics";

// Simple usage
haptics.light();
haptics.success();
haptics.error();

// Custom pattern
vibrate([10, 50, 10]);

// Check support
if (isHapticSupported()) {
  haptics.medium();
}
```

---

## Usage Examples

### Complete Page with Navigation & Gestures

```tsx
"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { TopBar } from "@/components/navigation/TopBar";
import { PullToRefresh } from "@/components/gestures/PullToRefresh";
import { SwipeableCard } from "@/components/gestures/SwipeableCard";
import { haptics } from "@/lib/utils/haptics";

export default function ExamplePage() {
  const items = [1, 2, 3, 4, 5];

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    haptics.success();
  };

  const handleDelete = (id: number) => {
    console.log("Deleted:", id);
    haptics.error();
  };

  const handleLike = (id: number) => {
    console.log("Liked:", id);
    haptics.success();
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        title="Example"
        actions={
          <button
            onClick={() => haptics.light()}
            className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-primary-foreground"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      />

      <PullToRefresh onRefresh={handleRefresh} className="flex-1">
        <div className="container mx-auto px-4 py-6 space-y-4">
          {items.map(item => (
            <SwipeableCard
              key={item}
              onSwipeLeft={() => handleDelete(item)}
              onSwipeRight={() => handleLike(item)}
            >
              <div className="p-6 bg-card rounded-lg border border-border">
                <h3 className="text-lg font-semibold">Item {item}</h3>
                <p className="text-sm text-muted-foreground">
                  Swipe left to delete, right to like
                </p>
              </div>
            </SwipeableCard>
          ))}
        </div>
      </PullToRefresh>
    </div>
  );
}
```

---

## Mobile-Specific Features

### Safe Area Insets

All navigation components support safe area insets for iPhone notch and home indicator:

```tsx
// Already applied in globals.css
paddingTop: "env(safe-area-inset-top, 0px)"
paddingBottom: "env(safe-area-inset-bottom, 0px)"
```

### Overscroll Behavior

Prevents default pull-to-refresh when using custom implementation:

```css
body {
  overscroll-behavior-y: contain;
}

.allow-pull-refresh {
  overscroll-behavior-y: auto;
}
```

### Touch Target Sizes

All interactive elements have minimum 44x44px touch targets for accessibility.

### 60fps Animations

All animations use Framer Motion with GPU-accelerated transforms for smooth 60fps performance.

---

## Customization

### Changing Navigation Items

Edit the `navItems` array in `BottomNav.tsx` and `Sidebar.tsx`:

```tsx
const navItems = [
  {
    icon: YourIcon,
    label: "Your Label",
    path: "/your-path",
  },
  // ...
];
```

### Customizing Haptic Patterns

Extend patterns in `haptics.ts`:

```tsx
export const HAPTIC_PATTERNS = {
  ...existing,
  custom: [20, 10, 20, 10, 20],
};
```

### Theming

All components use Tailwind CSS classes and CSS variables defined in `globals.css`. Customize colors in the `:root` and `.dark` sections.

---

## Browser Support

- **Haptic Feedback:** iOS Safari, Chrome Android
- **Safe Area Insets:** iOS Safari 11+, Chrome Android
- **Gestures:** All modern browsers with touch support
- **Animations:** All modern browsers (Framer Motion)

---

## Performance Tips

1. **Use native CSS transforms** for animations (already implemented)
2. **Debounce gesture handlers** for complex operations
3. **Lazy load components** that aren't immediately visible
4. **Optimize images** in navigation components
5. **Use will-change** sparingly for critical animations

---

## Troubleshooting

### Haptics not working
- Check if `navigator.vibrate` is supported
- Ensure HTTPS (required for vibration API)
- Some browsers require user interaction first

### Drawer not opening
- Check if `useNavigationStore` is properly imported
- Verify state updates with React DevTools
- Ensure no CSS overflow issues

### Pull-to-refresh conflicts
- Make sure `overscroll-behavior-y: contain` is set
- Check scroll container has proper height
- Verify touch events aren't being prevented elsewhere

---

## Future Enhancements

- [ ] Add spring physics to swipe gestures
- [ ] Implement custom scroll snap points
- [ ] Add keyboard navigation support
- [ ] Create gesture tutorial/onboarding
- [ ] Add analytics for gesture usage
- [ ] Implement gesture customization settings

---

## License

MIT
