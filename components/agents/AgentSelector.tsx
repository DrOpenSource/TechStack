'use client';

import React, { useState } from 'react';
import { X, Users, Sparkles, ChevronDown } from 'lucide-react';
import { AI_AGENTS, AGENT_TIERS, Agent } from '@/lib/data/agents';
import { AgentCard } from './AgentCard';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentSelectorProps {
  selectedAgents: string[];
  onSelectionChange: (agentIds: string[]) => void;
  maxSelection?: number;
  variant?: 'full' | 'compact';
}

export function AgentSelector({
  selectedAgents,
  onSelectionChange,
  maxSelection,
  variant = 'full'
}: AgentSelectorProps) {
  const [filterTier, setFilterTier] = useState<string>('All');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      onSelectionChange(selectedAgents.filter(id => id !== agentId));
    } else {
      if (maxSelection && selectedAgents.length >= maxSelection) {
        return;
      }
      onSelectionChange([...selectedAgents, agentId]);
    }
  };

  const handleSelectAll = () => {
    const allAgentIds = filteredAgents.map(a => a.id);
    onSelectionChange(allAgentIds);
  };

  const handleClearAll = () => {
    onSelectionChange([]);
  };

  const filteredAgents = filterTier === 'All'
    ? AI_AGENTS
    : AI_AGENTS.filter(agent => agent.tier === filterTier);

  const selectedAgentObjects = AI_AGENTS.filter(a => selectedAgents.includes(a.id));

  if (variant === 'compact') {
    return (
      <div className="space-y-3">
        {/* Compact trigger */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 bg-card border-2 border-border rounded-lg hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-medium text-sm">
              {selectedAgents.length === 0
                ? 'Select AI Team Members'
                : `${selectedAgents.length} ${selectedAgents.length === 1 ? 'Agent' : 'Agents'} Selected`}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        {/* Selected agents preview */}
        {selectedAgents.length > 0 && !isExpanded && (
          <div className="flex flex-wrap gap-2">
            {selectedAgentObjects.map(agent => (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
              >
                <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full" />
                <span>{agent.name.split(' ')[0]}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleAgent(agent.id);
                  }}
                  className="hover:bg-primary/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Expanded selection */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 bg-card border-2 border-border rounded-lg space-y-3">
                {/* Controls */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSelectAll}
                    className="text-sm text-primary hover:underline"
                  >
                    Select All
                  </button>
                  {selectedAgents.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Agent list */}
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredAgents.map(agent => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      selected={selectedAgents.includes(agent.id)}
                      onSelect={handleToggleAgent}
                      variant="compact"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Select Your AI Team
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Choose the specialists you need for your project
          </p>
        </div>
        {selectedAgents.length > 0 && (
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{selectedAgents.length}</div>
            <div className="text-xs text-muted-foreground">agents selected</div>
          </div>
        )}
      </div>

      {/* Selection summary */}
      {selectedAgents.length > 0 && (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              Selected Team Members
            </h3>
            <button
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedAgentObjects.map(agent => (
              <div
                key={agent.id}
                className="flex items-center gap-2 px-3 py-1.5 bg-card rounded-full text-sm border border-border"
              >
                <img src={agent.avatar} alt={agent.name} className="w-5 h-5 rounded-full" />
                <span className="font-medium">{agent.name}</span>
                <button
                  onClick={() => handleToggleAgent(agent.id)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tier filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterTier('All')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterTier === 'All'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
          }`}
        >
          All Teams ({AI_AGENTS.length})
        </button>
        {AGENT_TIERS.map(tier => {
          const count = AI_AGENTS.filter(a => a.tier === tier.name).length;
          return (
            <button
              key={tier.name}
              onClick={() => setFilterTier(tier.name)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterTier === tier.name
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/10'
              }`}
            >
              {tier.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Quick actions */}
      <div className="flex gap-2">
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
        >
          Select All {filterTier !== 'All' && filterTier}
        </button>
        {selectedAgents.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 bg-destructive/10 text-destructive rounded-lg text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Agent grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            selected={selectedAgents.includes(agent.id)}
            onSelect={handleToggleAgent}
          />
        ))}
      </div>

      {maxSelection && (
        <p className="text-xs text-center text-muted-foreground">
          You can select up to {maxSelection} agents
        </p>
      )}
    </div>
  );
}
