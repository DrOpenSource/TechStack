/**
 * ProjectCreationModal Component
 * Modal dialog for creating a new project
 */

'use client';

import { useState, useEffect, FormEvent } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { validateProjectName } from '@/lib/utils/validation';
import { useProjectStore } from '@/lib/stores/project-store';
import { TemplateGallery } from './TemplateGallery';
import type { ProjectTemplate } from '@/types/templates';

interface ProjectCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTemplate?: ProjectTemplate;
}

export function ProjectCreationModal({
  isOpen,
  onClose,
  defaultTemplate,
}: ProjectCreationModalProps) {
  const router = useRouter();
  const { createProject } = useProjectStore();
  const [isLoading, setIsLoading] = useState(false);

  const [step, setStep] = useState<'template' | 'details'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | undefined>(
    defaultTemplate
  );
  const [projectName, setProjectName] = useState('');
  const [initialPrompt, setInitialPrompt] = useState('');
  const [nameError, setNameError] = useState<string>();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep(defaultTemplate ? 'details' : 'template');
      setSelectedTemplate(defaultTemplate);
      setProjectName('');
      setInitialPrompt('');
      setNameError(undefined);
    }
  }, [isOpen, defaultTemplate]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template);
    setStep('details');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedTemplate) {
      return;
    }

    // Validate project name
    const error = validateProjectName(projectName);
    if (error) {
      setNameError(error);
      return;
    }

    try {
      setIsLoading(true);

      // Create project with template info in description
      createProject({
        name: projectName,
        description: selectedTemplate.name + (initialPrompt ? `: ${initialPrompt}` : ''),
      });

      // Navigate to chat page where the active project will be available
      router.push('/chat');
      onClose();
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          'relative z-10 w-full max-w-4xl max-h-[90vh]',
          'mx-4 overflow-hidden rounded-2xl',
          'border border-border bg-card shadow-2xl',
          'flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-6">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              {step === 'template' ? 'Choose Template' : 'Create Project'}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === 'template'
                ? 'Select a template to get started quickly'
                : `Using ${selectedTemplate?.name} template`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            disabled={isLoading}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {step === 'template' ? (
            <TemplateGallery
              onSelectTemplate={handleTemplateSelect}
              selectedTemplate={selectedTemplate}
            />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Template Summary */}
              {selectedTemplate && (
                <div className="rounded-lg border border-border bg-muted/50 p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground">
                        {selectedTemplate.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {selectedTemplate.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {selectedTemplate.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep('template')}
                      className="text-sm text-primary hover:underline"
                      disabled={isLoading}
                    >
                      Change
                    </button>
                  </div>
                </div>
              )}

              {/* Project Name */}
              <div className="space-y-2">
                <label
                  htmlFor="projectName"
                  className="block text-sm font-medium text-foreground"
                >
                  Project Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="projectName"
                  type="text"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value);
                    if (nameError) {
                      setNameError(undefined);
                    }
                  }}
                  className={cn(
                    'w-full rounded-lg border bg-background px-4 py-3',
                    'text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'transition-all duration-200',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    nameError
                      ? 'border-destructive focus:ring-destructive'
                      : 'border-input'
                  )}
                  placeholder="My Awesome Project"
                  disabled={isLoading}
                  autoFocus
                />
                {nameError && (
                  <p className="text-sm text-destructive">{nameError}</p>
                )}
              </div>

              {/* Initial Prompt */}
              <div className="space-y-2">
                <label
                  htmlFor="initialPrompt"
                  className="block text-sm font-medium text-foreground"
                >
                  Initial Prompt{' '}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </label>
                <textarea
                  id="initialPrompt"
                  value={initialPrompt}
                  onChange={(e) => setInitialPrompt(e.target.value)}
                  rows={4}
                  className={cn(
                    'w-full rounded-lg border border-input bg-background px-4 py-3',
                    'text-foreground placeholder:text-muted-foreground',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                    'transition-all duration-200 resize-none',
                    'disabled:opacity-50 disabled:cursor-not-allowed'
                  )}
                  placeholder="Describe what you want to build... (e.g., 'Create a fitness tracker with workout logging and progress charts')"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Describe your project to get AI-powered suggestions and scaffolding
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {step === 'details' && (
          <div className="flex items-center justify-end gap-3 border-t border-border p-6">
            <button
              type="button"
              onClick={() => setStep('template')}
              className={cn(
                'rounded-lg border border-border bg-background px-4 py-2.5',
                'text-sm font-medium text-foreground',
                'hover:bg-accent hover:border-accent-foreground/20',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
              disabled={isLoading}
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || !projectName.trim()}
              className={cn(
                'rounded-lg bg-primary px-6 py-2.5',
                'text-sm font-semibold text-primary-foreground',
                'hover:bg-primary/90',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'flex items-center gap-2'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create Project
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
