/**
 * TemplateGallery Component
 * Template selection with search and filtering
 */

'use client';

import { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates/templateDefinitions';
import { TemplateCard } from './TemplateCard';
import type { ProjectTemplate } from '@/types/templates';

interface TemplateGalleryProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  selectedTemplate?: ProjectTemplate;
}

export function TemplateGallery({
  onSelectTemplate,
  selectedTemplate,
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    let filtered = TEMPLATES;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(
        (template) => template.category === selectedCategory
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query) ||
          template.techStack.some((tech) =>
            tech.toLowerCase().includes(query)
          )
      );
    }

    return filtered;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            'w-full rounded-lg border border-input bg-background pl-10 pr-10 py-3',
            'text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            'transition-all duration-200'
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TEMPLATE_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={cn(
              'flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium',
              'transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
              selectedCategory === category
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filteredTemplates.length} template
          {filteredTemplates.length !== 1 ? 's' : ''} found
        </p>
        {(searchQuery || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={onSelectTemplate}
              selected={selectedTemplate?.id === template.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No templates found
          </h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
