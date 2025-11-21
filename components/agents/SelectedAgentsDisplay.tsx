/**
 * SelectedAgentsDisplay Component
 * Shows the currently selected AI team members with their avatars
 */

'use client';

import React, { useState } from 'react';
import { Users, ChevronDown, X } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { AI_AGENTS } from '@/lib/data/agents';
import { AgentSelector } from './AgentSelector';
import { motion, AnimatePresence } from 'framer-motion';

interface SelectedAgentsDisplayProps {
  onSelectionChange?: () => void;
}

export function SelectedAgentsDisplay({ onSelectionChange }: SelectedAgentsDisplayProps) {
  const { selectedAgents, setSelectedAgents } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const selectedAgentObjects = AI_AGENTS.filter(a => selectedAgents.includes(a.id));

  const handleRemoveAgent = (agentId: string) => {
    setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    onSelectionChange?.();
  };

  const handleSelectionChange = (agentIds: string[]) => {
    setSelectedAgents(agentIds);
    onSelectionChange?.();
  };

  if (selectedAgents.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-lg">
        <Users className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">No team selected</span>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-auto text-xs text-primary hover:underline"
        >
          Select team
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Compact display */}
      <div className="flex items-center gap-2 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
        <Users className="w-4 h-4 text-primary flex-shrink-0" />

        {/* Avatar stack */}
        <div className="flex -space-x-2">
          {selectedAgentObjects.slice(0, 3).map((agent) => (
            <img
              key={agent.id}
              src={agent.avatar}
              alt={agent.name}
              className="w-6 h-6 rounded-full border-2 border-background"
              title={agent.name}
            />
          ))}
          {selectedAgents.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground border-2 border-background flex items-center justify-center text-xs font-medium">
              +{selectedAgents.length - 3}
            </div>
          )}
        </div>

        <span className="text-sm font-medium text-foreground flex-1">
          {selectedAgents.length === 1
            ? selectedAgentObjects[0]?.name
            : `${selectedAgents.length} agents`}
        </span>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Toggle team selection"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded agent list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-3 bg-card border border-border rounded-lg space-y-3">
              {/* Current team */}
              <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                  Current Team
                </h4>
                <div className="space-y-1.5">
                  {selectedAgentObjects.map((agent) => (
                    <div
                      key={agent.id}
                      className="flex items-center gap-2 p-2 bg-background rounded-lg group hover:bg-accent transition-colors"
                    >
                      <img
                        src={agent.avatar}
                        alt={agent.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {agent.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {agent.role}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveAgent(agent.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-all"
                        title="Remove agent"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agent selector */}
              <div className="pt-2 border-t border-border">
                <AgentSelector
                  selectedAgents={selectedAgents}
                  onSelectionChange={handleSelectionChange}
                  variant="compact"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
