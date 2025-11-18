/**
 * Projects Store
 * Zustand store for managing projects and templates
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProjectsStore, Project, ProjectCreationData } from '@/types/templates';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const useProjectsStore = create<ProjectsStore>()(
  persist(
    (set, get) => ({
      // State
      projects: [],
      currentProject: null,
      isLoading: false,
      error: null,

      // Actions
      createProject: async (data: ProjectCreationData) => {
        set({ isLoading: true, error: null });

        try {
          // Simulate API call
          await delay(800);

          const newProject: Project = {
            id: `project-${Date.now()}`,
            name: data.name,
            templateId: data.templateId,
            initialPrompt: data.initialPrompt,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'draft',
          };

          set(state => ({
            projects: [newProject, ...state.projects],
            currentProject: newProject,
            isLoading: false,
          }));

          return newProject;
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to create project',
          });
          throw error;
        }
      },

      openProject: (id: string) => {
        const project = get().projects.find(p => p.id === id);
        if (project) {
          const updatedProject = {
            ...project,
            lastOpenedAt: new Date(),
          };

          set(state => ({
            currentProject: updatedProject,
            projects: state.projects.map(p =>
              p.id === id ? updatedProject : p
            ),
          }));
        }
      },

      deleteProject: (id: string) => {
        set(state => ({
          projects: state.projects.filter(p => p.id !== id),
          currentProject: state.currentProject?.id === id ? null : state.currentProject,
        }));
      },

      updateProject: (id: string, data: Partial<Project>) => {
        set(state => ({
          projects: state.projects.map(p =>
            p.id === id
              ? { ...p, ...data, updatedAt: new Date() }
              : p
          ),
          currentProject:
            state.currentProject?.id === id
              ? { ...state.currentProject, ...data, updatedAt: new Date() }
              : state.currentProject,
        }));
      },

      archiveProject: (id: string) => {
        get().updateProject(id, { status: 'archived' });
      },
    }),
    {
      name: 'projects-storage',
      partialize: (state) => ({
        projects: state.projects,
        currentProject: state.currentProject,
      }),
    }
  )
);
