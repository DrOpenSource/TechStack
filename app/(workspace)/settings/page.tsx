"use client";

import { motion } from "framer-motion";
import { LogOut, Moon, Sun, Sparkles, User, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { useAIProviderStore } from "@/lib/stores/ai-provider-store";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { config, isMockMode, setProvider, setMockMode } = useAIProviderStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-6 safe-top">
      <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

      <div className="space-y-6">
        {/* User Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-4"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </h2>
          <div className="flex items-center gap-4">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full bg-muted"
              />
            )}
            <div>
              <p className="font-medium text-foreground">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </motion.div>

        {/* AI Provider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-lg p-4"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Provider
          </h2>

          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Provider
              </label>
              <select
                value={config.provider}
                onChange={(e) =>
                  setProvider(e.target.value as "claude" | "gemini")
                }
                className="w-full px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="claude">Claude (Anthropic)</option>
                <option value="gemini">Gemini (Google)</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Mock Mode</p>
                <p className="text-xs text-muted-foreground">
                  Use fake AI responses for demo
                </p>
              </div>
              <button
                onClick={() => setMockMode(!isMockMode)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  isMockMode ? "bg-primary" : "bg-muted"
                }`}
              >
                <motion.div
                  layout
                  className="absolute top-1 w-4 h-4 bg-white rounded-full"
                  animate={{ left: isMockMode ? "26px" : "4px" }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-lg p-4"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            About
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Version</span>
              <span className="text-foreground">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Build</span>
              <span className="text-foreground">Next.js 14</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">PWA</span>
              <span className="text-foreground">Enabled</span>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg font-medium"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </motion.button>
      </div>
    </div>
  );
}
