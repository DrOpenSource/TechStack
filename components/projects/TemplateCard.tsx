/**
 * TemplateCard Component
 * Individual template card with preview and details
 */

'use client';

import { useState } from 'react';
import { Sparkles, Clock, Code } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { ProjectTemplate, TemplateComplexity } from '@/types/templates';

interface TemplateCardProps {
  template: ProjectTemplate;
  onSelect: (template: ProjectTemplate) => void;
  selected?: boolean;
}

const complexityColors: Record<TemplateComplexity, string> = {
  Beginner: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Intermediate: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  Advanced: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const complexityIcons: Record<TemplateComplexity, string> = {
  Beginner: '★',
  Intermediate: '★★',
  Advanced: '★★★',
};

export function TemplateCard({ template, onSelect, selected }: TemplateCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className={cn(
        'group relative rounded-xl border bg-card overflow-hidden',
        'transition-all duration-300 cursor-pointer',
        'hover:shadow-lg hover:border-primary/50',
        selected
          ? 'border-primary shadow-md ring-2 ring-primary/20'
          : 'border-border'
      )}
      onClick={() => onSelect(template)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {!imageError ? (
          <img
            src={template.thumbnail}
            alt={template.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Sparkles className="h-12 w-12 text-primary/40" />
          </div>
        )}

        {/* Complexity Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-2.5 py-1',
              'text-xs font-medium backdrop-blur-sm',
              complexityColors[template.complexity]
            )}
          >
            <span>{complexityIcons[template.complexity]}</span>
            {template.complexity}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-background/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-foreground">
            {template.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title & Description */}
        <div>
          <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
            {template.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {template.estimatedTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{template.estimatedTime}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Code className="h-3.5 w-3.5" />
            <span>{template.components.length} components</span>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="flex flex-wrap gap-1.5">
          {template.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center rounded-md bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {tech}
            </span>
          ))}
          {template.techStack.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              +{template.techStack.length - 3}
            </span>
          )}
        </div>

        {/* Use Template Button */}
        <button
          className={cn(
            'w-full rounded-lg px-4 py-2.5 text-sm font-medium',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            selected
              ? 'bg-primary text-primary-foreground'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(template);
          }}
        >
          {selected ? 'Selected' : 'Use Template'}
        </button>
      </div>
    </div>
  );
}
