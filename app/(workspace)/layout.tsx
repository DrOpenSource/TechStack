"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/stores/user-store";
import { BottomNav } from "@/components/navigation/BottomNav";
import { Sidebar } from "@/components/navigation/Sidebar";
import { SwipeableDrawer } from "@/components/navigation/SwipeableDrawer";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-auto pb-16 md:pb-0">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Mobile Swipeable Drawer */}
      <SwipeableDrawer />
    </div>
  );
}
