/**
 * ProjectList Component
 * Display user's projects with list/grid toggle
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Grid3x3,
  List,
  MoreVertical,
  Trash2,
  FolderOpen,
  Archive,
  Plus,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/format';
import { useProjectStore } from '@/lib/stores/project-store';
import type { Project } from '@/lib/stores/project-store';
import type { ViewMode } from '@/types/templates';

interface ProjectListProps {
  onCreateProject: () => void;
}

export function ProjectList({ onCreateProject }: ProjectListProps) {
  const router = useRouter();
  const { projects, setActiveProject, deleteProject } = useProjectStore();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Filter out archived projects if we add that property
  const activeProjects = projects;

  const handleOpenProject = (project: Project) => {
    setActiveProject(project.id);
    router.push('/chat');
  };

  const handleDelete = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
    }
    setOpenMenuId(null);
  };

  const handleArchive = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    // TODO: Add archive functionality to useProjectStore
    console.log('Archive project:', projectId);
    setOpenMenuId(null);
  };

  if (activeProjects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-6 rounded-full bg-primary/10 p-6">
          <Sparkles className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Create your first project
        </h2>
        <p className="mt-2 max-w-md text-sm text-muted-foreground">
          Get started by selecting a template or starting from scratch. Build amazing
          mobile apps with AI assistance.
        </p>
        <button
          onClick={onCreateProject}
          className={cn(
            'mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3',
            'text-sm font-semibold text-primary-foreground',
            'hover:bg-primary/90',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'transition-all duration-200'
          )}
        >
          <Plus className="h-4 w-4" />
          Create New Project
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Your Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeProjects.length} active project{activeProjects.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border bg-background p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'rounded-md p-2 transition-colors',
                viewMode === 'grid'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Grid3x3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'rounded-md p-2 transition-colors',
                viewMode === 'list'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid/List */}
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            : 'space-y-3'
        )}
      >
        {activeProjects.map((project) => {
          // Template is now optional since useProjectStore doesn't track it
          const template = undefined;
          return (
            <ProjectCard
              key={project.id}
              project={project}
              template={template}
              viewMode={viewMode}
              isMenuOpen={openMenuId === project.id}
              onOpen={() => handleOpenProject(project)}
              onToggleMenu={() =>
                setOpenMenuId(openMenuId === project.id ? null : project.id)
              }
              onDelete={(e) => handleDelete(e, project.id)}
              onArchive={(e) => handleArchive(e, project.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  template?: any;
  viewMode: ViewMode;
  isMenuOpen: boolean;
  onOpen: () => void;
  onToggleMenu: () => void;
  onDelete: (e: React.MouseEvent) => void;
  onArchive: (e: React.MouseEvent) => void;
}

function ProjectCard({
  project,
  template,
  viewMode,
  isMenuOpen,
  onOpen,
  onToggleMenu,
  onDelete,
  onArchive,
}: ProjectCardProps) {
  const [imageError, setImageError] = useState(false);

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group relative rounded-lg border border-border bg-card',
          'hover:border-primary/50 hover:shadow-md',
          'transition-all duration-200 cursor-pointer',
          'flex items-center gap-4 p-4'
        )}
        onClick={onOpen}
      >
        {/* Thumbnail */}
        <div className="flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden bg-muted">
          {template && !imageError ? (
            <img
              src={template.thumbnail}
              alt={project.name}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">
            {project.name}
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Updated {formatDate(project.updatedAt)}
          </p>
        </div>

        {/* Template Badge */}
        {template && (
          <div className="hidden sm:block flex-shrink-0">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {template.name}
            </span>
          </div>
        )}

        {/* Menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {isMenuOpen && (
            <ProjectMenu onDelete={onDelete} onArchive={onArchive} />
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-border bg-card overflow-hidden',
        'hover:border-primary/50 hover:shadow-lg',
        'transition-all duration-300 cursor-pointer'
      )}
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {template && !imageError ? (
          <img
            src={template.thumbnail}
            alt={project.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <FolderOpen className="h-12 w-12 text-primary/40" />
          </div>
        )}

        {/* Menu Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className="rounded-lg bg-background/80 backdrop-blur-sm p-2 text-foreground hover:bg-background transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute top-full right-0 mt-1">
              <ProjectMenu onDelete={onDelete} onArchive={onArchive} />
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
          {project.name}
        </h3>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Updated {formatDate(project.updatedAt)}</span>
          {template && (
            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {template.category}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectMenu({
  onDelete,
  onArchive,
}: {
  onDelete: (e: React.MouseEvent) => void;
  onArchive: (e: React.MouseEvent) => void;
}) {
  return (
    <div className="w-48 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-10">
      <button
        onClick={onArchive}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-accent transition-colors"
      >
        <Archive className="h-4 w-4" />
        Archive
      </button>
      <button
        onClick={onDelete}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
}
