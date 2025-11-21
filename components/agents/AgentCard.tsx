'use client';

import React from 'react';
import { Check, Sparkles } from 'lucide-react';
import { Agent } from '@/lib/data/agents';
import { motion } from 'framer-motion';

interface AgentCardProps {
  agent: Agent;
  selected?: boolean;
  onSelect?: (agentId: string) => void;
  variant?: 'default' | 'compact';
}

export function AgentCard({ agent, selected = false, onSelect, variant = 'default' }: AgentCardProps) {
  const colorClasses = {
    indigo: 'from-indigo-500 to-purple-600',
    pink: 'from-pink-500 to-rose-600',
    blue: 'from-blue-500 to-cyan-600',
    green: 'from-green-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-600',
    violet: 'from-violet-500 to-purple-600',
    teal: 'from-teal-500 to-cyan-600',
    red: 'from-red-500 to-rose-600',
    cyan: 'from-cyan-500 to-blue-600',
    orange: 'from-orange-500 to-red-600',
    lime: 'from-lime-500 to-green-600',
    purple: 'from-purple-500 to-pink-600',
  };

  const gradientClass = colorClasses[agent.color as keyof typeof colorClasses] || colorClasses.indigo;

  if (variant === 'compact') {
    return (
      <motion.button
        onClick={() => onSelect?.(agent.id)}
        className={`
          relative flex items-center gap-3 p-3 rounded-lg border-2 transition-all
          ${selected
            ? 'border-primary bg-primary/5 shadow-md'
            : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Avatar */}
        <div className={`relative w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} p-0.5`}>
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-full h-full rounded-full bg-white"
          />
          {!agent.available && (
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
              <span className="text-xs text-white font-medium">Busy</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 text-left">
          <h4 className="font-semibold text-sm text-foreground">{agent.name}</h4>
          <p className="text-xs text-muted-foreground">{agent.role}</p>
        </div>

        {/* Selection indicator */}
        {selected && (
          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
            <Check className="w-4 h-4 text-primary-foreground" />
          </div>
        )}
      </motion.button>
    );
  }

  return (
    <motion.div
      className={`
        relative group rounded-xl border-2 overflow-hidden transition-all
        ${selected
          ? 'border-primary shadow-lg shadow-primary/20'
          : 'border-border bg-card hover:border-primary/30 hover:shadow-md'}
      `}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header with gradient */}
      <div className={`relative h-24 bg-gradient-to-br ${gradientClass} flex items-end p-4`}>
        {/* Tier badge */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full">
          <span className="text-xs font-medium text-white">{agent.tier}</span>
        </div>

        {/* Avatar */}
        <div className="relative -mb-8 w-16 h-16 rounded-full bg-white p-1 shadow-lg">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-full h-full rounded-full"
          />
          {agent.available && (
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pt-10">
        {/* Name and Role */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
            {agent.name}
            {agent.available && <Sparkles className="w-4 h-4 text-yellow-500" />}
          </h3>
          <p className="text-sm text-primary font-medium">{agent.role}</p>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {agent.description}
        </p>

        {/* Skills */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-foreground mb-2">Core Skills</h4>
          <div className="flex flex-wrap gap-1">
            {agent.skills.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full"
              >
                {skill}
              </span>
            ))}
            {agent.skills.length > 3 && (
              <span className="px-2 py-1 text-xs text-muted-foreground">
                +{agent.skills.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Select Button */}
        {onSelect && (
          <button
            onClick={() => onSelect(agent.id)}
            className={`
              w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors
              ${selected
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground'}
            `}
          >
            {selected ? (
              <span className="flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Selected
              </span>
            ) : (
              'Select Agent'
            )}
          </button>
        )}
      </div>

      {/* Selected overlay */}
      {selected && (
        <div className="absolute top-3 left-3 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg">
          <Check className="w-5 h-5 text-primary-foreground" />
        </div>
      )}
    </motion.div>
  );
}
