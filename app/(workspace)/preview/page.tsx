"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Monitor, Tablet, RotateCw, Download } from "lucide-react";
import { useProjectStore } from "@/lib/stores/project-store";

type DeviceType = "mobile" | "tablet" | "desktop";

export default function PreviewPage() {
  const [device, setDevice] = useState<DeviceType>("mobile");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const activeProject = useProjectStore((state) => state.activeProject);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const deviceSizes = {
    mobile: "max-w-[375px]",
    tablet: "max-w-[768px]",
    desktop: "max-w-full",
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col safe-top">
      <div className="border-b border-border px-4 py-3 bg-card">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-foreground">
            {activeProject?.name || "Preview"}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDevice("mobile")}
              className={`p-2 rounded-lg ${
                device === "mobile"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("tablet")}
              className={`p-2 rounded-lg ${
                device === "tablet"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevice("desktop")}
              className={`p-2 rounded-lg ${
                device === "desktop"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <div className="w-px h-6 bg-border mx-1" />
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground"
            >
              <RotateCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-muted p-4">
        <motion.div
          layout
          className={`mx-auto bg-background rounded-lg shadow-lg overflow-hidden ${deviceSizes[device]}`}
          style={{ minHeight: "600px" }}
        >
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Monitor className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Live Preview
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Your app will appear here as you build it
            </p>
            <div className="space-y-4 max-w-md mx-auto">
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
              <div className="h-32 bg-muted rounded-lg animate-pulse" />
              <div className="h-12 bg-muted rounded-lg animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
