"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Eye, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { InteractivePreview } from "@/app/components/canvas/InteractivePreview";
import { ElementInspector } from "@/app/components/canvas/ElementInspector";
import type { ElementNode } from "@/lib/agents/context-gatherer/types";

// Mock component code for demo
const DEMO_CODE = `
import { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login:', { email, password });
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
`;

type View = "preview" | "split" | "code";

export default function CanvasDemoPage() {
  const [view, setView] = useState<View>("split");
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(false);
  const [code, setCode] = useState(DEMO_CODE);

  // Mock selected element
  const selectedElement: ElementNode | null = selectedElementId
    ? {
        id: selectedElementId,
        type: selectedElementId.split("-")[0],
        props: {
          className: "w-full px-4 py-3 border border-gray-300 rounded-lg",
          placeholder: "you@example.com",
        },
        children: ["Sign In"],
        path: [0],
        metadata: {
          editable: true,
          selectable: true,
          deletable: true,
        },
      }
    : null;

  const handleElementSelect = (elementId: string | null) => {
    setSelectedElementId(elementId);
    if (elementId) {
      setShowInspector(true);
    }
  };

  const handlePropertyUpdate = (elementId: string, property: string, value: any) => {
    console.log("Update property:", { elementId, property, value });

    // In production, this would update the AST and regenerate code
    // For prototype, just log
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <Layers className="w-5 h-5 text-primary" />
          <div>
            <h2 className="font-semibold text-foreground">
              Interactive Canvas Demo
            </h2>
            <p className="text-xs text-muted-foreground">
              Click elements to edit • Real-time visual development
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setView("preview")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === "preview"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("split")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === "split"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("code")}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                view === "code"
                  ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              <Code2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview/Code Area */}
        <div className="flex-1 flex">
          {/* Preview */}
          {(view === "preview" || view === "split") && (
            <div className={view === "split" ? "flex-1" : "w-full"}>
              <InteractivePreview
                code={code}
                onElementSelect={handleElementSelect}
              />
            </div>
          )}

          {/* Code Editor */}
          {(view === "code" || view === "split") && (
            <div
              className={`${
                view === "split" ? "flex-1 border-l" : "w-full"
              } border-gray-200 dark:border-gray-700 bg-gray-900`}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                  <span className="text-sm text-gray-300 font-mono">
                    LoginForm.tsx
                  </span>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700">
                    Format
                  </button>
                </div>

                <div className="flex-1 overflow-auto">
                  <pre className="p-4 text-sm">
                    <code className="text-gray-300 font-mono">{code}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inspector Panel */}
        <AnimatePresence>
          {showInspector && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            >
              <ElementInspector
                element={selectedElement}
                onUpdate={handlePropertyUpdate}
                onClose={() => {
                  setShowInspector(false);
                  setSelectedElementId(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info Banner */}
      {!selectedElementId && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg flex items-center gap-3"
        >
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <p className="text-sm font-medium">
            Click any element in the preview to edit its properties
          </p>
          <button
            onClick={() =>
              setSelectedElementId(null) /* This just dismisses the banner */
            }
            className="text-white/80 hover:text-white"
          >
            ×
          </button>
        </motion.div>
      )}
    </div>
  );
}
