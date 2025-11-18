import { create } from "zustand";
import { persist } from "zustand/middleware";
import { generateMockProject } from "@/lib/mock/projects";

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  files: ProjectFile[];
  previewUrl?: string;
}

export interface ProjectFile {
  id: string;
  path: string;
  content: string;
  language: string;
}

interface ProjectStore {
  projects: Project[];
  activeProject: Project | null;
  createProject: (data: { name: string; description: string }) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
  addFileToProject: (projectId: string, file: ProjectFile) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProject: null,

      createProject: (data) => {
        const newProject = generateMockProject(data);
        set((state) => ({
          projects: [newProject, ...state.projects],
          activeProject: newProject,
        }));
      },

      updateProject: (id, data) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date() } : p
          ),
          activeProject:
            state.activeProject?.id === id
              ? { ...state.activeProject, ...data, updatedAt: new Date() }
              : state.activeProject,
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          activeProject:
            state.activeProject?.id === id ? null : state.activeProject,
        }));
      },

      setActiveProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (project) {
          set({ activeProject: project });
        }
      },

      addFileToProject: (projectId, file) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === projectId
              ? { ...p, files: [...p.files, file], updatedAt: new Date() }
              : p
          ),
        }));
      },
    }),
    {
      name: "project-storage",
    }
  )
);
