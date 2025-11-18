/**
 * Mock Projects Data
 * Sample projects across different domains
 */

export interface MockProject {
  id: string;
  name: string;
  description: string;
  category: 'fitness' | 'ecommerce' | 'social' | 'productivity' | 'finance' | 'education';
  status: 'active' | 'completed' | 'archived' | 'planning';
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  owner: {
    id: string;
    name: string;
    avatar: string;
  };
  team: Array<{
    id: string;
    name: string;
    role: string;
    avatar: string;
  }>;
  tech: string[];
  features: string[];
  metrics?: {
    users?: number;
    revenue?: number;
    downloads?: number;
  };
  links?: {
    github?: string;
    demo?: string;
    docs?: string;
  };
}

const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateId = (): string => {
  return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const mockProjects: MockProject[] = [
  {
    id: generateId(),
    name: 'FitTrack Pro',
    description: 'Comprehensive fitness tracking application with workout planning, nutrition logging, and progress analytics. Built for athletes and fitness enthusiasts.',
    category: 'fitness',
    status: 'active',
    progress: 75,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-11-15'),
    dueDate: new Date('2024-12-31'),
    owner: {
      id: 'user-1',
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    },
    team: [
      { id: 'user-2', name: 'Sarah Chen', role: 'Frontend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah' },
      { id: 'user-3', name: 'Mike Rodriguez', role: 'Backend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike' },
      { id: 'user-4', name: 'Emma Davis', role: 'Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma' },
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'TailwindCSS'],
    features: [
      'Workout tracking with exercise library',
      'Custom workout plans',
      'Nutrition logging and calorie tracking',
      'Progress photos and measurements',
      'Social features and challenges',
      'Wearable device integration',
    ],
    metrics: {
      users: 15420,
      downloads: 32100,
    },
    links: {
      github: 'https://github.com/example/fittrack',
      demo: 'https://fittrack-demo.vercel.app',
      docs: 'https://docs.fittrack.app',
    },
  },
  {
    id: generateId(),
    name: 'ShopHub',
    description: 'Modern e-commerce platform with real-time inventory management, secure payments, and AI-powered product recommendations.',
    category: 'ecommerce',
    status: 'active',
    progress: 60,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-11-10'),
    dueDate: new Date('2025-02-28'),
    owner: {
      id: 'user-5',
      name: 'David Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    },
    team: [
      { id: 'user-6', name: 'Lisa Wang', role: 'Full Stack', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa' },
      { id: 'user-7', name: 'Tom Anderson', role: 'DevOps', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=tom' },
      { id: 'user-8', name: 'Nina Patel', role: 'Product Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nina' },
    ],
    tech: ['Next.js', 'TypeScript', 'Stripe', 'Supabase', 'Redis'],
    features: [
      'Product catalog with search and filters',
      'Shopping cart and checkout',
      'Payment processing with Stripe',
      'Order management and tracking',
      'Admin dashboard',
      'Email notifications',
    ],
    metrics: {
      users: 8900,
      revenue: 125000,
    },
    links: {
      demo: 'https://shophub-demo.vercel.app',
    },
  },
  {
    id: generateId(),
    name: 'ConnectHub',
    description: 'Social networking platform for professionals with real-time messaging, post sharing, and networking features.',
    category: 'social',
    status: 'planning',
    progress: 25,
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-11-01'),
    dueDate: new Date('2025-06-30'),
    owner: {
      id: 'user-9',
      name: 'Rachel Green',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rachel',
    },
    team: [
      { id: 'user-10', name: 'Chris Martin', role: 'Tech Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chris' },
      { id: 'user-11', name: 'Amy Wu', role: 'UI/UX Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amy' },
    ],
    tech: ['React Native', 'TypeScript', 'Firebase', 'WebRTC'],
    features: [
      'User profiles and connections',
      'Real-time messaging',
      'Post creation and sharing',
      'Comments and reactions',
      'Notifications system',
      'Video calls',
    ],
    metrics: {
      users: 1200,
    },
  },
  {
    id: generateId(),
    name: 'TaskMaster Pro',
    description: 'Advanced task management and project planning tool with team collaboration, time tracking, and Gantt charts.',
    category: 'productivity',
    status: 'completed',
    progress: 100,
    createdAt: new Date('2023-06-01'),
    updatedAt: new Date('2024-08-30'),
    owner: {
      id: 'user-12',
      name: 'James Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=james',
    },
    team: [
      { id: 'user-13', name: 'Sophie Turner', role: 'Frontend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sophie' },
      { id: 'user-14', name: 'Daniel Lee', role: 'Backend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=daniel' },
    ],
    tech: ['Vue.js', 'TypeScript', 'Express', 'MongoDB'],
    features: [
      'Task creation and assignment',
      'Project boards (Kanban)',
      'Gantt chart timeline',
      'Time tracking',
      'Team collaboration',
      'File attachments',
    ],
    metrics: {
      users: 25600,
      revenue: 89000,
    },
    links: {
      github: 'https://github.com/example/taskmaster',
      demo: 'https://taskmaster-demo.vercel.app',
      docs: 'https://docs.taskmaster.app',
    },
  },
  {
    id: generateId(),
    name: 'BudgetWise',
    description: 'Personal finance management app with expense tracking, budgeting tools, and financial insights.',
    category: 'finance',
    status: 'active',
    progress: 85,
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-11-12'),
    dueDate: new Date('2024-12-15'),
    owner: {
      id: 'user-15',
      name: 'Maria Garcia',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
    },
    team: [
      { id: 'user-16', name: 'Kevin Brown', role: 'Full Stack', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kevin' },
      { id: 'user-17', name: 'Jessica Taylor', role: 'Data Analyst', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jessica' },
    ],
    tech: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Chart.js'],
    features: [
      'Expense tracking',
      'Budget creation and monitoring',
      'Financial goals',
      'Reports and analytics',
      'Bank account linking',
      'Bill reminders',
    ],
    metrics: {
      users: 42000,
      revenue: 156000,
    },
    links: {
      demo: 'https://budgetwise-demo.vercel.app',
    },
  },
  {
    id: generateId(),
    name: 'LearnHub Academy',
    description: 'Online learning platform with course creation, video streaming, quizzes, and student progress tracking.',
    category: 'education',
    status: 'active',
    progress: 70,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-11-08'),
    dueDate: new Date('2025-03-31'),
    owner: {
      id: 'user-18',
      name: 'Robert Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=robert',
    },
    team: [
      { id: 'user-19', name: 'Emily White', role: 'Frontend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emily' },
      { id: 'user-20', name: 'Michael Scott', role: 'Backend Dev', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael' },
      { id: 'user-21', name: 'Anna Martinez', role: 'Content Manager', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=anna' },
    ],
    tech: ['Next.js', 'TypeScript', 'Prisma', 'AWS S3', 'Mux'],
    features: [
      'Course creation and management',
      'Video lessons with streaming',
      'Quizzes and assessments',
      'Student progress tracking',
      'Discussion forums',
      'Certificates of completion',
    ],
    metrics: {
      users: 18900,
      revenue: 78000,
    },
    links: {
      demo: 'https://learnhub-demo.vercel.app',
      docs: 'https://docs.learnhub.academy',
    },
  },
];

/**
 * Get project by ID
 */
export const getProjectById = (id: string): MockProject | undefined => {
  return mockProjects.find(project => project.id === id);
};

/**
 * Get projects by category
 */
export const getProjectsByCategory = (category: MockProject['category']): MockProject[] => {
  return mockProjects.filter(project => project.category === category);
};

/**
 * Get projects by status
 */
export const getProjectsByStatus = (status: MockProject['status']): MockProject[] => {
  return mockProjects.filter(project => project.status === status);
};
