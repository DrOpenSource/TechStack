/**
 * Dashboard Page
 * Main dashboard with project list and creation
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthStore } from '@/lib/stores/authStore';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProjectCreationModal } from '@/components/projects/ProjectCreationModal';

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <svg
                className="h-5 w-5 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">VibeCode</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Create Project Button */}
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2',
                'text-sm font-semibold text-primary-foreground',
                'hover:bg-primary/90',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'transition-all duration-200'
              )}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New Project</span>
            </button>

            {/* User Menu */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <span className="hidden sm:inline text-sm font-medium text-foreground">
                {user?.name || 'User'}
              </span>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className={cn(
                'rounded-lg border border-border bg-background p-2',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
                'transition-colors'
              )}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <ProjectList onCreateProject={() => setIsCreateModalOpen(true)} />
      </main>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
