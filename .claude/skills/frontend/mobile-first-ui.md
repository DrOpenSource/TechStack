# 📱 Mobile-First UI Skill

**Category:** Frontend
**Purpose:** Design responsive, touch-friendly interfaces optimized for mobile

---

## 🎯 What This Skill Does

Creates mobile-optimized user interfaces:
- Responsive design (mobile → tablet → desktop)
- Touch-friendly interactions (44px+ targets)
- Performance optimized for mobile networks
- Progressive enhancement
- Thumb-friendly layouts

---

## 📝 Mobile-First Patterns

### **1. Responsive Layout System**

```typescript
// Tailwind breakpoints (mobile-first)
// sm: 640px   - Small tablets
// md: 768px   - Tablets
// lg: 1024px  - Laptops
// xl: 1280px  - Desktops
// 2xl: 1536px - Large desktops

// Example: Stack on mobile, grid on desktop
<div className="
  flex flex-col        /* Mobile: Stack vertically */
  md:flex-row          /* Tablet+: Side by side */
  lg:grid lg:grid-cols-3  /* Desktop: 3 columns */
  gap-4
">
  <div>Column 1</div>
  <div>Column 2</div>
  <div>Column 3</div>
</div>
```

---

### **2. Touch-Friendly Components**

```typescript
// components/mobile/TouchButton.tsx

interface TouchButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function TouchButton({ children, onClick, variant = 'primary' }: TouchButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        /* Minimum 44px touch target */
        min-h-[44px] min-w-[44px]
        px-6 py-3

        /* Large text for readability */
        text-lg font-semibold

        /* Rounded corners (easier to tap) */
        rounded-xl

        /* Visual feedback on tap */
        active:scale-95
        transition-transform duration-100

        /* Prevent text selection on double-tap */
        select-none

        /* Variants */
        ${variant === 'primary'
          ? 'bg-blue-600 text-white'
          : 'bg-gray-200 text-gray-800'
        }
      `}
    >
      {children}
    </button>
  );
}
```

---

### **3. Mobile Navigation**

```typescript
// components/mobile/MobileNav.tsx

import { useState } from 'react';

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold">App Name</h1>

          {/* Hamburger Button - 44px touch target */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Drawer */}
          <nav className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 shadow-2xl lg:hidden overflow-y-auto">
            <div className="p-4">
              {/* Navigation items with large touch targets */}
              <a href="/" className="block py-3 text-lg font-medium text-gray-900 min-h-[44px]">
                Home
              </a>
              <a href="/about" className="block py-3 text-lg font-medium text-gray-900 min-h-[44px]">
                About
              </a>
              <a href="/contact" className="block py-3 text-lg font-medium text-gray-900 min-h-[44px]">
                Contact
              </a>
            </div>
          </nav>
        </>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6 px-6 py-4 bg-white border-b border-gray-200">
        <a href="/" className="text-base font-medium text-gray-900 hover:text-blue-600">
          Home
        </a>
        <a href="/about" className="text-base font-medium text-gray-900 hover:text-blue-600">
          About
        </a>
        <a href="/contact" className="text-base font-medium text-gray-900 hover:text-blue-600">
          Contact
        </a>
      </nav>
    </>
  );
}
```

---

### **4. Bottom Tab Navigation (Mobile)**

```typescript
// components/mobile/BottomNav.tsx

export function BottomNav() {
  const tabs = [
    { icon: '🏠', label: 'Home', href: '/' },
    { icon: '📊', label: 'Stats', href: '/stats' },
    { icon: '➕', label: 'Add', href: '/add' },
    { icon: '🔔', label: 'Alerts', href: '/alerts' },
    { icon: '👤', label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="
      lg:hidden
      fixed bottom-0 left-0 right-0
      bg-white border-t border-gray-200
      safe-area-inset-bottom
      z-40
    ">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => (
          <a
            key={tab.href}
            href={tab.href}
            className="
              flex flex-col items-center justify-center
              py-2 px-3
              min-w-[60px]
              min-h-[56px]  /* Larger for thumb reach */
              text-gray-600 hover:text-blue-600
              transition-colors
            "
          >
            <span className="text-2xl mb-1">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
```

---

### **5. Mobile Form Layout**

```typescript
// components/mobile/MobileForm.tsx

export function MobileForm() {
  return (
    <form className="
      max-w-lg mx-auto
      px-4 py-6
      space-y-6
    ">
      {/* Large, readable inputs */}
      <div>
        <label className="block text-base font-medium text-gray-700 mb-2">
          Email
        </label>
        <input
          type="email"
          className="
            w-full
            px-4 py-4          /* Large padding for easy tapping */
            text-lg            /* Large text for readability */
            border-2 border-gray-300
            rounded-xl
            focus:border-blue-500 focus:outline-none

            /* Prevent zoom on iOS */
            text-[16px]
          "
          placeholder="you@example.com"
        />
      </div>

      {/* Submit button - full width on mobile */}
      <button className="
        w-full
        bg-blue-600 text-white
        py-4              /* Large tap target */
        text-lg font-semibold
        rounded-xl
        min-h-[52px]      /* Minimum 52px for primary actions */
        active:scale-98
        transition-transform
      ">
        Submit
      </button>
    </form>
  );
}
```

---

### **6. Pull-to-Refresh**

```typescript
// hooks/usePullToRefresh.ts

import { useState, useCallback, useRef } from 'react';

export function usePullToRefresh(onRefresh: () => Promise<void>) {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const startY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (window.scrollY === 0) {
      const distance = e.touches[0].clientY - startY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 120));
        setIsPulling(true);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(async () => {
    if (pullDistance > 80) {
      await onRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
  }, [pullDistance, onRefresh]);

  return { isPulling, pullDistance, handleTouchStart, handleTouchMove, handleTouchEnd };
}
```

---

### **7. Responsive Typography**

```css
/* Mobile-first typography */
.heading-1 {
  @apply text-2xl font-bold leading-tight;
  @apply md:text-3xl lg:text-4xl;
}

.heading-2 {
  @apply text-xl font-bold leading-tight;
  @apply md:text-2xl lg:text-3xl;
}

.body-text {
  @apply text-base leading-relaxed;
  @apply md:text-lg;
}

.small-text {
  @apply text-sm;
  @apply md:text-base;
}
```

---

### **8. Safe Area Handling (iOS)**

```typescript
// tailwind.config.js

module.exports = {
  theme: {
    extend: {
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.safe-area-inset-top': {
          paddingTop: 'env(safe-area-inset-top)',
        },
        '.safe-area-inset-bottom': {
          paddingBottom: 'env(safe-area-inset-bottom)',
        },
      });
    },
  ],
};

// Usage
<div className="pt-safe-top pb-safe-bottom">
  Content respects notch and home indicator
</div>
```

---

## ✅ Mobile-First Checklist

### **Touch Targets**
- [ ] All interactive elements ≥44px (iOS) or ≥48px (Android)
- [ ] Sufficient spacing between tap targets (8px minimum)
- [ ] Visual feedback on tap (active states)
- [ ] No double-tap zoom (text ≥16px on inputs)

### **Navigation**
- [ ] Bottom navigation for primary actions (thumb zone)
- [ ] Hamburger menu for secondary navigation
- [ ] Swipe gestures supported
- [ ] Back button behavior handled

### **Forms**
- [ ] Large input fields (min 44px height)
- [ ] Clear labels above inputs
- [ ] Appropriate input types (tel, email, number)
- [ ] Input mode attributes set
- [ ] Auto-capitalize/autocorrect configured

### **Layout**
- [ ] Single column on mobile
- [ ] Generous whitespace
- [ ] Content within thumb reach
- [ ] Fixed headers/footers don't block content

### **Performance**
- [ ] Images optimized for mobile (WebP, lazy loading)
- [ ] Minimal JavaScript for interactions
- [ ] Fast loading (< 3s on 3G)
- [ ] No layout shift (CLS < 0.1)

### **Typography**
- [ ] Base font size ≥16px (prevents zoom)
- [ ] Line height 1.5+ for readability
- [ ] Adequate contrast (WCAG AA: 4.5:1)

---

## 🎯 Best Practices

✅ **Design for Thumbs**
- Place primary actions in thumb zone (bottom 1/3 of screen)
- Avoid top corners for critical actions
- Use bottom sheets for mobile

✅ **Optimize for One Hand**
- Keep navigation within reach
- Support swipe gestures
- Avoid hamburger menus for critical features

✅ **Prevent Accidental Taps**
- Space out buttons
- Confirm destructive actions
- Use swipe for delete/archive

✅ **Respect Device Features**
- Safe areas (notch, home indicator)
- Dark mode support
- Landscape orientation (where appropriate)

✅ **Progressive Enhancement**
- Works without JavaScript
- Graceful degradation
- Feature detection over user-agent sniffing

---

## 📊 Responsive Breakpoint Strategy

```typescript
// Mobile-first approach
// Default: Mobile (< 640px)
// sm: 640px  - Large phones, small tablets
// md: 768px  - Tablets
// lg: 1024px - Laptops
// xl: 1280px - Desktops

// Example component
<div className="
  /* Mobile */
  px-4 py-6

  /* Tablet */
  md:px-6 md:py-8

  /* Desktop */
  lg:px-8 lg:py-12
  lg:max-w-7xl lg:mx-auto
">
  Content
</div>
```

---

**Used By:** frontend-dev, mobile-dev
**Best With:** component-library, pwa-builder
