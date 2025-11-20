"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Tablet, Monitor, RotateCw, RefreshCw } from "lucide-react";
import { createSelectionManager } from "@/packages/core/canvas/selection-manager";
import type { SelectionState } from "@/packages/core/types";

interface InteractivePreviewProps {
  code: string;
  onElementSelect: (elementId: string | null) => void;
}

type Viewport = "mobile" | "tablet" | "desktop";

const viewportSizes = {
  mobile: { width: 375, height: 667, icon: Smartphone },
  tablet: { width: 768, height: 1024, icon: Tablet },
  desktop: { width: 1440, height: 900, icon: Monitor },
};

export function InteractivePreview({
  code,
  onElementSelect,
}: InteractivePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [viewport, setViewport] = useState<Viewport>("mobile");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [selectionManager] = useState(() => createSelectionManager());
  const [isReady, setIsReady] = useState(false);

  // Setup selection manager
  useEffect(() => {
    if (iframeRef.current && isReady) {
      selectionManager.attachToPreview(iframeRef.current);

      // Subscribe to selection changes
      selectionManager.subscribe("preview", (state: SelectionState) => {
        onElementSelect(state.selectedId);
      });

      return () => {
        selectionManager.unsubscribe("preview");
      };
    }
  }, [isReady, selectionManager, onElementSelect]);

  // Render preview in iframe
  useEffect(() => {
    if (iframeRef.current) {
      const previewHTML = generatePreviewHTML(code);

      const iframe = iframeRef.current;
      const doc = iframe.contentDocument;

      if (doc) {
        doc.open();
        doc.write(previewHTML);
        doc.close();

        // Mark as ready after a short delay
        setTimeout(() => setIsReady(true), 100);
      }
    }
  }, [code]);

  const toggleOrientation = () => {
    setOrientation((prev) => (prev === "portrait" ? "landscape" : "portrait"));
  };

  const refresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const currentSize = viewportSizes[viewport];
  const width = orientation === "portrait" ? currentSize.width : currentSize.height;
  const height = orientation === "portrait" ? currentSize.height : currentSize.width;

  return (
    <div className="flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {(Object.keys(viewportSizes) as Viewport[]).map((vp) => {
            const Icon = viewportSizes[vp].icon;
            return (
              <button
                key={vp}
                onClick={() => setViewport(vp)}
                className={`p-2 rounded-lg transition-colors ${
                  viewport === vp
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
                title={vp.charAt(0).toUpperCase() + vp.slice(1)}
              >
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleOrientation}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Rotate"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={refresh}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-auto">
        <motion.div
          key={`${viewport}-${orientation}`}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden"
          style={{
            width: `${width}px`,
            height: `${height}px`,
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        >
          <iframe
            ref={iframeRef}
            className="w-full h-full border-0"
            title="Component Preview"
            sandbox="allow-same-origin allow-scripts"
          />
        </motion.div>
      </div>

      {/* Info Footer */}
      <div className="px-4 py-2 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          {width} × {height}px • Click any element to edit
        </p>
      </div>
    </div>
  );
}

/**
 * Generate preview HTML with component code
 */
function generatePreviewHTML(code: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 16px;
      font-family: system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      background: #f9fafb;
    }
    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script type="module">
    // This is a simplified preview - in production, we'd use proper React rendering
    // For now, we'll create a mock render

    const root = document.getElementById('root');

    // Parse the component code and render a simplified version
    const componentHTML = \`
      <div class="max-w-md mx-auto">
        <div class="bg-white rounded-lg shadow-lg p-6" data-element-id="root">
          <h2 class="text-2xl font-bold text-gray-900 mb-6" data-element-id="h2-0">
            Sign In
          </h2>

          <form class="space-y-4" data-element-id="form-0">
            <div data-element-id="div-0">
              <label class="block text-sm font-medium text-gray-700 mb-2" data-element-id="label-0">
                Email
              </label>
              <input
                type="email"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
                data-element-id="input-0"
              />
            </div>

            <div data-element-id="div-1">
              <label class="block text-sm font-medium text-gray-700 mb-2" data-element-id="label-1">
                Password
              </label>
              <input
                type="password"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
                data-element-id="input-1"
              />
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
              data-element-id="button-0"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    \`;

    root.innerHTML = componentHTML;

    // Prevent form submission
    document.querySelectorAll('form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
      });
    });

    // Add hover effects for selectable elements
    document.querySelectorAll('[data-element-id]').forEach(el => {
      el.style.cursor = 'pointer';
      el.style.transition = 'outline 0.2s ease';

      el.addEventListener('mouseenter', () => {
        el.style.outline = '2px solid #8b5cf6';
        el.style.outlineOffset = '2px';
      });

      el.addEventListener('mouseleave', () => {
        if (!el.hasAttribute('data-selected')) {
          el.style.outline = 'none';
        }
      });
    });
  </script>
</body>
</html>
  `;
}
