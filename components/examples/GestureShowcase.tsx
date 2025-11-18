"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Trash2, RotateCcw } from "lucide-react";
import { SwipeableCard } from "@/components/gestures/SwipeableCard";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { useLongPress } from "@/hooks/useLongPress";
import { haptics } from "@/lib/utils/haptics";

/**
 * Gesture Showcase Component
 * Demonstrates all gesture features including swipe, long press, and haptic feedback
 */
export function GestureShowcase() {
  const [cards, setCards] = useState([
    { id: 1, title: "Card 1", description: "Swipe left to delete, right to like" },
    { id: 2, title: "Card 2", description: "Swipe left to delete, right to like" },
    { id: 3, title: "Card 3", description: "Swipe left to delete, right to like" },
  ]);
  const [swipeDirection, setSwipeDirection] = useState<string>("");
  const [longPressCount, setLongPressCount] = useState(0);

  // Swipe gesture example
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      setSwipeDirection("⬅️ Left");
      haptics.light();
    },
    onSwipeRight: () => {
      setSwipeDirection("➡️ Right");
      haptics.light();
    },
    onSwipeUp: () => {
      setSwipeDirection("⬆️ Up");
      haptics.light();
    },
    onSwipeDown: () => {
      setSwipeDirection("⬇️ Down");
      haptics.light();
    },
    threshold: 50,
  });

  // Long press example
  const longPressHandlers = useLongPress({
    callback: () => {
      setLongPressCount(prev => prev + 1);
      haptics.heavy();
    },
    duration: 500,
  });

  const handleCardSwipeLeft = (id: number) => {
    haptics.error();
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const handleCardSwipeRight = (id: number) => {
    haptics.success();
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const resetCards = () => {
    haptics.medium();
    setCards([
      { id: Date.now(), title: "Card 1", description: "Swipe left to delete, right to like" },
      { id: Date.now() + 1, title: "Card 2", description: "Swipe left to delete, right to like" },
      { id: Date.now() + 2, title: "Card 3", description: "Swipe left to delete, right to like" },
    ]);
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Gesture Showcase</h1>
        <p className="text-muted-foreground">
          Try all the touch interactions and gestures
        </p>
      </div>

      {/* Swipeable Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Swipeable Cards</h2>
          <button
            onClick={resetCards}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {cards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-muted rounded-lg text-center"
          >
            <p className="text-muted-foreground mb-4">All cards swiped!</p>
            <button
              onClick={resetCards}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Reset Cards
            </button>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {cards.map((card, index) => (
              <SwipeableCard
                key={card.id}
                onSwipeLeft={() => handleCardSwipeLeft(card.id)}
                onSwipeRight={() => handleCardSwipeRight(card.id)}
                threshold={120}
                className="cursor-grab active:cursor-grabbing"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-gradient-to-br from-card to-card/80 border border-border rounded-xl shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <div className="flex gap-2">
                      <Heart className="w-5 h-5 text-green-500" />
                      <Trash2 className="w-5 h-5 text-destructive" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </motion.div>
              </SwipeableCard>
            ))}
          </div>
        )}
      </div>

      {/* Swipe Detection Area */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Swipe Detection</h2>
        <div
          {...swipeHandlers}
          className="p-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-dashed border-primary/30 rounded-xl text-center cursor-grab active:cursor-grabbing select-none"
        >
          <p className="text-sm text-muted-foreground mb-2">
            Swipe in any direction
          </p>
          <motion.div
            key={swipeDirection}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl font-bold text-primary"
          >
            {swipeDirection || "👆 Swipe me!"}
          </motion.div>
        </div>
      </div>

      {/* Long Press Area */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Long Press</h2>
        <button
          {...longPressHandlers}
          className="w-full p-8 bg-gradient-to-br from-secondary to-secondary/80 border border-border rounded-xl text-center transition-all active:scale-95"
        >
          <p className="text-sm text-muted-foreground mb-2">
            Hold for 500ms
          </p>
          <div className="text-3xl font-bold">
            {longPressCount > 0 ? `🎉 ${longPressCount}` : "👇 Long press me!"}
          </div>
        </button>
      </div>

      {/* Haptic Feedback Tests */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Haptic Feedback</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => haptics.light()}
            className="p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="text-sm font-medium mb-1">Light</div>
            <div className="text-xs text-muted-foreground">Quick tap</div>
          </button>
          <button
            onClick={() => haptics.medium()}
            className="p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="text-sm font-medium mb-1">Medium</div>
            <div className="text-xs text-muted-foreground">Button press</div>
          </button>
          <button
            onClick={() => haptics.heavy()}
            className="p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="text-sm font-medium mb-1">Heavy</div>
            <div className="text-xs text-muted-foreground">Important</div>
          </button>
          <button
            onClick={() => haptics.success()}
            className="p-4 bg-green-500/10 border border-green-500/30 text-green-600 rounded-lg hover:bg-green-500/20 transition-colors"
          >
            <div className="text-sm font-medium mb-1">Success</div>
            <div className="text-xs opacity-70">Pattern</div>
          </button>
          <button
            onClick={() => haptics.error()}
            className="p-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg hover:bg-destructive/20 transition-colors"
          >
            <div className="text-sm font-medium mb-1">Error</div>
            <div className="text-xs opacity-70">Pattern</div>
          </button>
          <button
            onClick={() => haptics.double()}
            className="p-4 bg-card border border-border rounded-lg hover:bg-accent transition-colors"
          >
            <div className="text-sm font-medium mb-1">Double</div>
            <div className="text-xs text-muted-foreground">Two taps</div>
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>• Swipe cards left (delete) or right (like)</li>
          <li>• Swipe in any direction in the detection area</li>
          <li>• Long press and hold the button for 500ms</li>
          <li>• Tap haptic buttons to feel different vibration patterns</li>
          <li>• All interactions include haptic feedback (on supported devices)</li>
        </ul>
      </div>
    </div>
  );
}
