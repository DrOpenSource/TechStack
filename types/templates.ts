/**
 * Project Template Types
 * TypeScript definitions for project templates and creation
 */

export type TemplateCategory =
  | 'Health'
  | 'Business'
  | 'Social'
  | 'Dashboard'
  | 'E-commerce'
  | 'Education'
  | 'Entertainment'
  | 'Productivity';

export type TemplateComplexity = 'Beginner' | 'Intermediate' | 'Advanced';

export type TechStack =
  | 'Next.js'
  | 'React'
  | 'TypeScript'
  | 'TailwindCSS'
  | 'Recharts'
  | 'Framer Motion'
  | 'Zustand'
  | 'React Query'
  | 'Prisma'
  | 'Supabase';

export interface TemplateComponent {
  name: string;
  description: string;
  path: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  thumbnail: string;
  category: TemplateCategory;
  techStack: TechStack[];
  components: TemplateComponent[];
  mockData?: any;
  complexity: TemplateComplexity;
  estimatedTime?: string;
  features?: string[];
  demoUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  templateId: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  lastOpenedAt?: Date;
  initialPrompt?: string;
  status: 'active' | 'archived' | 'draft';
}

export interface ProjectCreationData {
  name: string;
  templateId: string;
  initialPrompt?: string;
}

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
}

export interface ProjectsActions {
  createProject: (data: ProjectCreationData) => Promise<Project>;
  openProject: (id: string) => void;
  deleteProject: (id: string) => void;
  updateProject: (id: string, data: Partial<Project>) => void;
  archiveProject: (id: string) => void;
}

export type ProjectsStore = ProjectsState & ProjectsActions;

export type ViewMode = 'grid' | 'list';
