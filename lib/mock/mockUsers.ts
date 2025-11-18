/**
 * Mock Users Data
 * Generated user data with Faker.js patterns
 */

export interface MockUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user' | 'developer' | 'manager' | 'guest';
  status: 'active' | 'inactive' | 'pending';
  bio?: string;
  location?: string;
  company?: string;
  skills?: string[];
  createdAt: Date;
  lastLoginAt?: Date;
  settings?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'auto';
    language: string;
  };
}

/**
 * Demo credentials for testing
 */
export const DEMO_CREDENTIALS = {
  email: 'demo@vibecode.app',
  password: 'demo123',
  otp: '123456',
};

/**
 * Additional demo accounts
 */
export const DEMO_ACCOUNTS = [
  {
    email: 'admin@vibecode.app',
    password: 'admin123',
    role: 'admin',
  },
  {
    email: 'developer@vibecode.app',
    password: 'dev123',
    role: 'developer',
  },
  {
    email: 'user@vibecode.app',
    password: 'user123',
    role: 'user',
  },
];

/**
 * Generate mock users (Faker.js-style generation)
 */
const roles = ['admin', 'user', 'developer', 'manager', 'guest'] as const;
const statuses = ['active', 'inactive', 'pending'] as const;
const themes = ['light', 'dark', 'auto'] as const;
const languages = ['en', 'es', 'fr', 'de', 'ja', 'zh'];

const firstNames = ['Alex', 'Sam', 'Jordan', 'Casey', 'Morgan', 'Taylor', 'Riley', 'Avery', 'Quinn', 'Blake',
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William'];

const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

const companies = ['TechCorp', 'StartupXYZ', 'Innovation Labs', 'Digital Solutions', 'CloudTech',
  'DevWorks', 'CodeCraft', 'DataSystems', 'WebBuilders', 'AppFactory'];

const cities = ['New York', 'San Francisco', 'London', 'Tokyo', 'Berlin',
  'Sydney', 'Toronto', 'Paris', 'Singapore', 'Amsterdam'];

const skillsList = ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go', 'Rust',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API'];

// Helper functions
const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
const randomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};
const randomAvatar = (seed: string): string => {
  const styles = ['pixel-art', 'bottts', 'avataaars', 'identicon'];
  const style = randomItem(styles);
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
};

export const mockUsers: MockUser[] = Array.from({ length: 100 }, (_, index) => {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index > 19 ? index : ''}@example.com`;
  const id = generateUUID();
  const createdAt = randomDate(new Date(2022, 0, 1), new Date());
  const lastLoginAt = Math.random() > 0.3 ? randomDate(createdAt, new Date()) : undefined;

  return {
    id,
    name,
    email,
    avatar: randomAvatar(email),
    role: randomItem(roles),
    status: randomItem(statuses),
    bio: Math.random() > 0.5 ? `${randomItem(['Software Engineer', 'Product Manager', 'Designer', 'Developer'])} at ${randomItem(companies)}` : undefined,
    location: Math.random() > 0.4 ? randomItem(cities) : undefined,
    company: Math.random() > 0.5 ? randomItem(companies) : undefined,
    skills: Math.random() > 0.3 ? randomItems(skillsList, Math.floor(Math.random() * 5) + 2) : undefined,
    createdAt,
    lastLoginAt,
    settings: {
      notifications: Math.random() > 0.3,
      theme: randomItem(themes),
      language: randomItem(languages),
    },
  };
});

/**
 * Get user by ID
 */
export const getUserById = (id: string): MockUser | undefined => {
  return mockUsers.find(user => user.id === id);
};

/**
 * Get user by email
 */
export const getUserByEmail = (email: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email);
};

/**
 * Get demo user
 */
export const getDemoUser = (): MockUser => {
  return {
    id: 'demo-user-id',
    name: 'Demo User',
    email: DEMO_CREDENTIALS.email,
    avatar: randomAvatar(DEMO_CREDENTIALS.email),
    role: 'user',
    status: 'active',
    bio: 'Demo account for testing',
    location: 'San Francisco',
    company: 'VibeCode',
    skills: ['React', 'TypeScript', 'Node.js'],
    createdAt: new Date('2024-01-01'),
    lastLoginAt: new Date(),
    settings: {
      notifications: true,
      theme: 'dark',
      language: 'en',
    },
  };
};

/**
 * Authenticate user (mock)
 */
export const authenticateUser = (email: string, password: string): MockUser | null => {
  // Check demo credentials
  if (email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password) {
    return getDemoUser();
  }

  // Check other demo accounts
  const demoAccount = DEMO_ACCOUNTS.find(acc => acc.email === email && acc.password === password);
  if (demoAccount) {
    const user = getUserByEmail(email) || mockUsers[0];
    return { ...user, role: demoAccount.role as any };
  }

  // Mock: any other email/password combo works in demo mode
  const user = getUserByEmail(email);
  return user || null;
};

/**
 * Verify OTP (mock)
 */
export const verifyOTP = (otp: string): boolean => {
  return otp === DEMO_CREDENTIALS.otp || otp === '123456';
};
