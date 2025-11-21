/**
 * Agent Selection Page
 * Allow users to select AI team members after login
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { AgentSelector } from '@/components/agents/AgentSelector';
import { motion } from 'framer-motion';

export default function SelectTeamPage() {
  const router = useRouter();
  const { selectedAgents, setSelectedAgents, isAuthenticated } = useAuthStore();
  const [localSelection, setLocalSelection] = useState<string[]>(selectedAgents);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleContinue = () => {
    // Save selection to store
    setSelectedAgents(localSelection);

    // Navigate to dashboard
    router.push('/dashboard');
  };

  const handleSkip = () => {
    // Clear selection and go to dashboard
    setSelectedAgents([]);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Meet Your AI Team
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Build Your Dream Tech Team
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the AI specialists you want to work with. Each agent brings unique expertise to your project.
            You can change your team anytime from the dashboard.
          </p>
        </motion.div>

        {/* Agent Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AgentSelector
            selectedAgents={localSelection}
            onSelectionChange={setLocalSelection}
            variant="full"
          />
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={handleSkip}
            className="px-6 py-3 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
          >
            Skip for now
          </button>
          <button
            onClick={handleContinue}
            disabled={localSelection.length === 0}
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25"
          >
            {localSelection.length === 0 ? (
              'Select at least one agent'
            ) : (
              <>
                Continue with {localSelection.length} {localSelection.length === 1 ? 'Agent' : 'Agents'}
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-xs text-muted-foreground">
            Don&apos;t worry! You can modify your team selection anytime from your dashboard settings.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
