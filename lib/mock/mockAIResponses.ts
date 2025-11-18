/**
 * Mock AI Responses
 * Pre-written AI responses for pattern matching
 */

export interface AIResponse {
  response: string;
  components?: string[];
  mockData?: any;
  suggestions?: string[];
  codeSnippets?: Array<{
    language: string;
    code: string;
    filename?: string;
  }>;
}

export const AI_RESPONSES: Record<string, AIResponse> = {
  'fitness tracker': {
    response: `I'll help you build a fitness tracking application. Here's what I recommend:

**Core Features:**
1. Workout logging with exercise library
2. Progress tracking (weight, reps, sets)
3. Custom workout plans
4. Analytics and charts
5. Social features for motivation

**Technical Stack:**
- Frontend: React with TypeScript
- State Management: Zustand or Context API
- Charts: Recharts or Chart.js
- Backend: Next.js API routes
- Database: PostgreSQL with Prisma

**Next Steps:**
1. Create the workout logging interface
2. Build exercise library with search
3. Implement progress tracking
4. Add data visualization

Would you like me to start with any specific feature?`,
    components: ['WorkoutForm', 'ExerciseLibrary', 'ProgressChart'],
    mockData: {
      workouts: [
        { id: 1, name: 'Morning Run', duration: 30, calories: 300 },
        { id: 2, name: 'Weight Training', duration: 60, calories: 400 },
      ],
    },
    suggestions: [
      'Create workout logging form',
      'Build exercise database',
      'Add progress charts',
      'Implement workout plans',
    ],
  },

  'e-commerce': {
    response: `I'll help you create an e-commerce platform. Here's a comprehensive approach:

**Essential Features:**
1. Product catalog with categories and filters
2. Shopping cart and checkout flow
3. Payment processing (Stripe integration)
4. Order management system
5. Admin dashboard for inventory
6. User authentication and profiles

**Recommended Tech Stack:**
- Next.js 14 with App Router
- TypeScript for type safety
- Stripe for payments
- Supabase for database and auth
- TailwindCSS for styling

**Implementation Plan:**
1. Set up product catalog with search
2. Implement shopping cart functionality
3. Integrate Stripe checkout
4. Build order management
5. Create admin panel

Which component should we tackle first?`,
    components: ['ProductCard', 'ShoppingCart', 'CheckoutForm', 'AdminDashboard'],
    mockData: {
      products: [
        { id: 1, name: 'Wireless Headphones', price: 99.99, stock: 50 },
        { id: 2, name: 'Smart Watch', price: 299.99, stock: 30 },
      ],
    },
    suggestions: [
      'Build product catalog',
      'Create shopping cart',
      'Set up Stripe payment',
      'Design admin panel',
    ],
  },

  'social media': {
    response: `I'll help you build a social media application. Here's my recommendation:

**Core Features:**
1. User profiles and authentication
2. Post creation (text, images, videos)
3. News feed with infinite scroll
4. Comments and reactions
5. Real-time notifications
6. Direct messaging
7. Follow/unfollow system

**Technology Recommendations:**
- Next.js with TypeScript
- Real-time: Socket.io or Supabase Realtime
- Media storage: AWS S3 or Cloudinary
- Database: PostgreSQL
- Caching: Redis

**Development Phases:**
1. Authentication and profiles
2. Post creation and feed
3. Social interactions (likes, comments)
4. Real-time features
5. Messaging system

What would you like to start with?`,
    components: ['ProfileCard', 'PostComposer', 'NewsFeed', 'CommentSection'],
    mockData: {
      posts: [
        { id: 1, author: 'John Doe', content: 'Hello world!', likes: 42 },
        { id: 2, author: 'Jane Smith', content: 'Great day!', likes: 18 },
      ],
    },
    suggestions: [
      'Create user profiles',
      'Build post composer',
      'Implement news feed',
      'Add real-time features',
    ],
  },

  'task management': {
    response: `I'll help you create a task management tool. Here's the plan:

**Key Features:**
1. Task creation and editing
2. Project/board organization
3. Priority and due date management
4. Task assignment to team members
5. Status tracking (To Do, In Progress, Done)
6. Time tracking
7. Kanban board view
8. Calendar integration

**Tech Stack:**
- React with TypeScript
- Drag-and-drop: react-beautiful-dnd
- Date handling: date-fns
- State: Zustand or Redux Toolkit
- Backend: Next.js API + PostgreSQL

**Implementation Steps:**
1. Create task CRUD operations
2. Build Kanban board interface
3. Add filtering and sorting
4. Implement team collaboration
5. Add time tracking

Where should we begin?`,
    components: ['TaskCard', 'KanbanBoard', 'TaskForm', 'ProjectList'],
    mockData: {
      tasks: [
        { id: 1, title: 'Design homepage', status: 'in-progress', priority: 'high' },
        { id: 2, title: 'Write documentation', status: 'todo', priority: 'medium' },
      ],
    },
    suggestions: [
      'Build task creation form',
      'Create Kanban board',
      'Add task filtering',
      'Implement drag-and-drop',
    ],
  },

  'dashboard': {
    response: `I'll help you create an analytics dashboard. Here's the approach:

**Dashboard Components:**
1. Key metrics cards (KPIs)
2. Interactive charts and graphs
3. Data tables with sorting/filtering
4. Date range selectors
5. Export functionality
6. Real-time data updates

**Visualization Libraries:**
- Recharts (recommended for React)
- Chart.js (versatile, popular)
- D3.js (advanced, custom visualizations)

**Data Features:**
1. Summary statistics
2. Trend analysis
3. Comparison views
4. Drill-down capabilities

**Best Practices:**
- Responsive design for all screen sizes
- Loading states and skeletons
- Error handling
- Data caching for performance

What metrics do you need to display?`,
    components: ['MetricCard', 'LineChart', 'BarChart', 'DataTable'],
    mockData: {
      metrics: {
        revenue: 125000,
        users: 8500,
        growth: 12.5,
      },
    },
    suggestions: [
      'Create metric cards',
      'Build chart components',
      'Add data filtering',
      'Implement export feature',
    ],
  },

  'authentication': {
    response: `I'll help you implement authentication. Here's a comprehensive solution:

**Authentication Methods:**
1. Email/Password with secure hashing
2. Magic Link (passwordless)
3. OAuth (Google, GitHub, etc.)
4. Two-Factor Authentication (2FA)
5. OTP via SMS/Email

**Security Best Practices:**
- Password hashing with bcrypt
- JWT tokens with refresh mechanism
- CSRF protection
- Rate limiting
- Secure session management

**Recommended Solutions:**
- Supabase Auth (complete solution)
- NextAuth.js (flexible, popular)
- Auth0 (enterprise-grade)
- Custom implementation with Passport.js

**Implementation Steps:**
1. Set up auth provider
2. Create login/signup forms
3. Implement protected routes
4. Add session management
5. Handle auth state globally

Which auth method would you prefer?`,
    components: ['LoginForm', 'SignupForm', 'OTPInput', 'ProtectedRoute'],
    codeSnippets: [
      {
        language: 'typescript',
        code: `// Example auth hook
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check auth status
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading };
}`,
        filename: 'hooks/useAuth.ts',
      },
    ],
    suggestions: [
      'Set up Supabase Auth',
      'Create auth forms',
      'Implement protected routes',
      'Add OAuth providers',
    ],
  },

  'api': {
    response: `I'll help you design and implement APIs. Here's a structured approach:

**API Design Principles:**
1. RESTful conventions (GET, POST, PUT, DELETE)
2. Consistent naming patterns
3. Proper status codes
4. Versioning strategy
5. Comprehensive error handling

**Next.js API Routes:**
\`\`\`
/api/users         GET (list), POST (create)
/api/users/[id]    GET (read), PUT (update), DELETE (delete)
/api/auth/login    POST
/api/auth/logout   POST
\`\`\`

**Best Practices:**
- Input validation with Zod
- Authentication middleware
- Rate limiting
- Request logging
- API documentation (OpenAPI/Swagger)

**Error Handling:**
\`\`\`typescript
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": {...}
  }
}
\`\`\`

What endpoints do you need to create?`,
    codeSnippets: [
      {
        language: 'typescript',
        code: `// Example API route
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const data = await fetchData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}`,
        filename: 'app/api/example/route.ts',
      },
    ],
    suggestions: [
      'Design API structure',
      'Implement CRUD endpoints',
      'Add validation',
      'Set up authentication',
    ],
  },

  'form': {
    response: `I'll help you create forms with validation. Here's the approach:

**Form Libraries:**
1. React Hook Form (recommended - performance)
2. Formik (popular, feature-rich)
3. Native React state (simple cases)

**Validation:**
- Zod (TypeScript-first)
- Yup (schema validation)
- Custom validators

**Features to Include:**
1. Real-time validation
2. Error messages
3. Loading states
4. Success feedback
5. File uploads
6. Multi-step forms

**Example with React Hook Form + Zod:**
\`\`\`typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
\`\`\`

What type of form do you need?`,
    components: ['ContactForm', 'RegistrationForm', 'MultiStepForm'],
    suggestions: [
      'Set up React Hook Form',
      'Add Zod validation',
      'Create reusable form fields',
      'Implement error handling',
    ],
  },

  'default': {
    response: `I'm here to help you build your application! I can assist with:

**Frontend Development:**
- React components and hooks
- State management (Redux, Zustand, Context)
- Styling (TailwindCSS, styled-components)
- Forms and validation
- Data visualization

**Backend Development:**
- Next.js API routes
- Database design and queries
- Authentication and authorization
- File uploads
- Email notifications

**Integration:**
- Payment processing (Stripe)
- Third-party APIs
- Real-time features
- Analytics

**Best Practices:**
- TypeScript for type safety
- Testing (Jest, Playwright)
- Performance optimization
- Accessibility (a11y)

What would you like to build? Please describe your project or feature, and I'll provide specific guidance and code examples.`,
    suggestions: [
      'Tell me about your project',
      'I need help with authentication',
      'How do I build a dashboard?',
      'Create a form with validation',
    ],
  },
};

/**
 * Match user prompt to appropriate response
 */
export const matchPattern = (prompt: string): AIResponse => {
  const lowerPrompt = prompt.toLowerCase();

  // Check for fitness-related keywords
  if (
    lowerPrompt.includes('fitness') ||
    lowerPrompt.includes('workout') ||
    lowerPrompt.includes('exercise') ||
    lowerPrompt.includes('gym')
  ) {
    return AI_RESPONSES['fitness tracker'];
  }

  // E-commerce keywords
  if (
    lowerPrompt.includes('e-commerce') ||
    lowerPrompt.includes('ecommerce') ||
    lowerPrompt.includes('shop') ||
    lowerPrompt.includes('store') ||
    lowerPrompt.includes('product')
  ) {
    return AI_RESPONSES['e-commerce'];
  }

  // Social media keywords
  if (
    lowerPrompt.includes('social') ||
    lowerPrompt.includes('feed') ||
    lowerPrompt.includes('post') ||
    lowerPrompt.includes('follow')
  ) {
    return AI_RESPONSES['social media'];
  }

  // Task management keywords
  if (
    lowerPrompt.includes('task') ||
    lowerPrompt.includes('todo') ||
    lowerPrompt.includes('kanban') ||
    lowerPrompt.includes('project management')
  ) {
    return AI_RESPONSES['task management'];
  }

  // Dashboard keywords
  if (
    lowerPrompt.includes('dashboard') ||
    lowerPrompt.includes('analytics') ||
    lowerPrompt.includes('chart') ||
    lowerPrompt.includes('metric')
  ) {
    return AI_RESPONSES['dashboard'];
  }

  // Authentication keywords
  if (
    lowerPrompt.includes('auth') ||
    lowerPrompt.includes('login') ||
    lowerPrompt.includes('signup') ||
    lowerPrompt.includes('register')
  ) {
    return AI_RESPONSES['authentication'];
  }

  // API keywords
  if (
    lowerPrompt.includes('api') ||
    lowerPrompt.includes('endpoint') ||
    lowerPrompt.includes('rest')
  ) {
    return AI_RESPONSES['api'];
  }

  // Form keywords
  if (
    lowerPrompt.includes('form') ||
    lowerPrompt.includes('validation') ||
    lowerPrompt.includes('input')
  ) {
    return AI_RESPONSES['form'];
  }

  // Default response
  return AI_RESPONSES['default'];
};

/**
 * Get related prompts
 */
export const getRelatedPrompts = (category: string): string[] => {
  const relatedPrompts: Record<string, string[]> = {
    'fitness tracker': [
      'How do I add nutrition tracking?',
      'Create a workout plan builder',
      'Add social challenges feature',
    ],
    'e-commerce': [
      'How do I integrate Stripe?',
      'Add product reviews',
      'Create an admin dashboard',
    ],
    'social media': [
      'Implement real-time notifications',
      'Add direct messaging',
      'Create user profiles',
    ],
  };

  return relatedPrompts[category] || [];
};
