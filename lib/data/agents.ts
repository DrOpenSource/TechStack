/**
 * AI Agent Team Members
 * Based on TechStack Framework's 13 specialized agents
 */

export interface Agent {
  id: string;
  name: string;
  role: string;
  tier: string;
  avatar: string;
  description: string;
  skills: string[];
  specialties: string[];
  color: string;
  available: boolean;
}

export const AI_AGENTS: Agent[] = [
  // Tier 0 - Meta-Level
  {
    id: '00-orchestrator',
    name: 'Alex Chen',
    role: 'Team Orchestrator',
    tier: 'Meta-Level',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=6366f1',
    description: 'Coordinates the entire AI team, optimizes workflows, and ensures seamless collaboration between all agents.',
    skills: ['Multi-agent coordination', 'Performance optimization', 'Workflow management', 'Metrics tracking'],
    specialties: ['Team leadership', 'Resource allocation', 'Quality assurance', 'Delivery optimization'],
    color: 'indigo',
    available: true,
  },

  // Tier 1 - Planning
  {
    id: '01-product-architect',
    name: 'Sarah Johnson',
    role: 'Product Architect',
    tier: 'Planning',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ec4899',
    description: 'Transforms your ideas into detailed product requirements, user stories, and acceptance criteria.',
    skills: ['Requirements gathering', 'User story writing', 'Product roadmapping', 'Stakeholder alignment'],
    specialties: ['Feature prioritization', 'MVP scoping', 'User research', 'Product strategy'],
    color: 'pink',
    available: true,
  },
  {
    id: '02-system-architect',
    name: 'David Kumar',
    role: 'System Architect',
    tier: 'Planning',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=3b82f6',
    description: 'Designs scalable system architecture, database schemas, and technical blueprints for your application.',
    skills: ['System design', 'Architecture patterns', 'Database design', 'Technology selection'],
    specialties: ['Microservices', 'API design', 'Scalability', 'Security architecture'],
    color: 'blue',
    available: true,
  },

  // Tier 1.5 - Prototyping
  {
    id: '03-prototype-dev',
    name: 'Emma Rodriguez',
    role: 'Prototype Developer',
    tier: 'Prototyping',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=10b981',
    description: 'Rapidly builds interactive UI prototypes with realistic mock data to validate concepts quickly.',
    skills: ['Rapid prototyping', 'UI/UX design', 'Mock data generation', 'Component library'],
    specialties: ['Figma to code', 'Interactive prototypes', 'Design systems', 'User testing'],
    color: 'green',
    available: true,
  },
  {
    id: '04-design-qa',
    name: 'Marcus Williams',
    role: 'Design QA Specialist',
    tier: 'Prototyping',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=f59e0b',
    description: 'Validates prototypes for usability, accessibility, and design consistency before development.',
    skills: ['Design validation', 'Accessibility testing', 'UI consistency', 'Design review'],
    specialties: ['WCAG compliance', 'Cross-browser testing', 'Mobile responsiveness', 'Design systems audit'],
    color: 'amber',
    available: true,
  },

  // Tier 2 - Implementation
  {
    id: '05-frontend-dev',
    name: 'Lily Zhang',
    role: 'Frontend Developer',
    tier: 'Implementation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lily&backgroundColor=8b5cf6',
    description: 'Builds beautiful, responsive React/Next.js interfaces with modern best practices and animations.',
    skills: ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    specialties: ['Component architecture', 'State management', 'Performance optimization', 'Animations'],
    color: 'violet',
    available: true,
  },
  {
    id: '06-backend-dev',
    name: 'James Anderson',
    role: 'Backend Developer',
    tier: 'Implementation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=14b8a6',
    description: 'Develops robust APIs, business logic, and server-side functionality with security and scalability.',
    skills: ['Node.js', 'API design', 'Authentication', 'Business logic', 'Data validation'],
    specialties: ['RESTful APIs', 'GraphQL', 'Serverless', 'Microservices', 'Security'],
    color: 'teal',
    available: true,
  },
  {
    id: '07-database-engineer',
    name: 'Priya Patel',
    role: 'Database Engineer',
    tier: 'Implementation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ef4444',
    description: 'Designs efficient database schemas, optimizes queries, and ensures data integrity and performance.',
    skills: ['PostgreSQL', 'MongoDB', 'Schema design', 'Query optimization', 'Data modeling'],
    specialties: ['Indexing', 'Migrations', 'Backup strategies', 'Performance tuning', 'Data security'],
    color: 'red',
    available: true,
  },
  {
    id: '08-qa-engineer',
    name: 'Omar Hassan',
    role: 'QA Engineer',
    tier: 'Implementation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Omar&backgroundColor=06b6d4',
    description: 'Writes comprehensive tests, catches bugs early, and ensures quality throughout the development cycle.',
    skills: ['Test automation', 'Unit testing', 'Integration testing', 'E2E testing', 'Bug detection'],
    specialties: ['Jest', 'Playwright', 'Vitest', 'Test-driven development', 'Quality metrics'],
    color: 'cyan',
    available: true,
  },
  {
    id: '09-integration-specialist',
    name: 'Sofia Martinez',
    role: 'Integration Specialist',
    tier: 'Implementation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia&backgroundColor=f97316',
    description: 'Integrates third-party services, APIs, and tools seamlessly into your application.',
    skills: ['API integration', 'OAuth', 'Payment gateways', 'SMS services', 'Third-party SDKs'],
    specialties: ['Stripe', 'Twilio', 'SendGrid', 'Firebase', 'AWS services'],
    color: 'orange',
    available: true,
  },
  {
    id: '10-devops-agent',
    name: 'Alex Thompson',
    role: 'DevOps Engineer',
    tier: 'Implementation',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AlexT&backgroundColor=84cc16',
    description: 'Sets up CI/CD pipelines, manages deployments, and ensures infrastructure reliability.',
    skills: ['CI/CD', 'Docker', 'Kubernetes', 'Cloud deployment', 'Monitoring'],
    specialties: ['Vercel', 'AWS', 'GitHub Actions', 'Infrastructure as Code', 'Performance monitoring'],
    color: 'lime',
    available: true,
  },

  // Tier 3 - Support
  {
    id: '11-report-generator',
    name: 'Rachel Green',
    role: 'Technical Writer',
    tier: 'Support',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel&backgroundColor=a855f7',
    description: 'Creates comprehensive documentation, API references, and technical reports for your project.',
    skills: ['Technical writing', 'API documentation', 'User guides', 'Architecture docs', 'Markdown'],
    specialties: ['README generation', 'Code comments', 'Architecture diagrams', 'Changelog management'],
    color: 'purple',
    available: true,
  },
  {
    id: '12-code-reviewer',
    name: 'Michael Lee',
    role: 'Code Reviewer',
    tier: 'Support',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=6366f1',
    description: 'Reviews code for quality, security, performance, and adherence to best practices.',
    skills: ['Code review', 'Security audit', 'Performance analysis', 'Best practices', 'Refactoring'],
    specialties: ['SOLID principles', 'Design patterns', 'Code smells', 'Security vulnerabilities', 'Performance optimization'],
    color: 'indigo',
    available: true,
  },
];

// Helper functions
export function getAgentById(id: string): Agent | undefined {
  return AI_AGENTS.find(agent => agent.id === id);
}

export function getAgentsByTier(tier: string): Agent[] {
  return AI_AGENTS.filter(agent => agent.tier === tier);
}

export function getAgentsByRole(role: string): Agent[] {
  return AI_AGENTS.filter(agent => agent.role.toLowerCase().includes(role.toLowerCase()));
}

export const AGENT_TIERS = [
  { name: 'Meta-Level', description: 'Team coordination and optimization', color: 'indigo' },
  { name: 'Planning', description: 'Requirements and architecture', color: 'blue' },
  { name: 'Prototyping', description: 'Rapid UI/UX validation', color: 'green' },
  { name: 'Implementation', description: 'Full-stack development', color: 'purple' },
  { name: 'Support', description: 'Documentation and quality', color: 'pink' },
];
