# Mock Data System

A comprehensive mock data system for rapid prototyping and development without backend dependencies.

## Overview

This mock data system provides:
- **Realistic dummy data** across multiple domains (fitness, e-commerce, analytics, etc.)
- **AI response simulation** for chatbot/assistant interfaces
- **Network delay simulation** for realistic UX testing
- **Type-safe TypeScript interfaces** for all data structures
- **Utility functions** for pagination, search, filtering, and more

## Quick Start

```typescript
import {
  mockUsers,
  mockProducts,
  getMockAIService,
  paginateMockData,
} from '@/lib/mock';

// Use mock users
const users = mockUsers;
const demoUser = getUserByEmail('demo@vibecode.app');

// Paginate data
const paginatedProducts = paginateMockData(mockProducts, {
  page: 1,
  pageSize: 10,
});

// Use AI service
const aiService = getMockAIService();
const response = await aiService.sendMessage('Build a fitness tracker');
```

## Configuration

Enable mock mode in your environment:

```env
NEXT_PUBLIC_MOCK_MODE=true
```

Configure behavior in `lib/mock/config.ts`:

```typescript
export const MOCK_CONFIG = {
  enabled: process.env.NEXT_PUBLIC_MOCK_MODE === 'true',
  networkDelay: 500,        // API latency simulation
  errorRate: 0.05,          // 5% error rate
  aiStreamDelay: 50,        // Streaming word delay
  defaultPageSize: 20,
  logRequests: true,
};
```

## Mock Data Files

### Users (`mockUsers.ts`)
```typescript
import { mockUsers, DEMO_CREDENTIALS, authenticateUser } from '@/lib/mock';

// 100 generated users
const allUsers = mockUsers;

// Demo credentials
const { email, password, otp } = DEMO_CREDENTIALS;
// email: 'demo@vibecode.app'
// password: 'demo123'
// otp: '123456'

// Authenticate
const user = authenticateUser(email, password);
```

### Projects (`mockProjects.ts`)
```typescript
import { mockProjects, getProjectsByCategory } from '@/lib/mock';

// 6 sample projects across different domains
const fitnessProjects = getProjectsByCategory('fitness');
const ecommerceProjects = getProjectsByCategory('ecommerce');
```

### Components (`mockComponents.ts`)
```typescript
import { mockComponents, getComponentsByCategory } from '@/lib/mock';

// Pre-built UI components with code
const forms = getComponentsByCategory('form');
const dataDisplay = getComponentsByCategory('data-display');

// Each component includes:
// - React code
// - Props definition
// - Examples
// - Tags for searching
```

### AI Responses (`mockAIResponses.ts`)
```typescript
import { matchPattern, AI_RESPONSES } from '@/lib/mock';

// Pattern matching for common queries
const response = matchPattern('fitness tracker');
// Returns: { response, components, mockData, suggestions }

// Pre-written responses for:
// - Fitness trackers
// - E-commerce sites
// - Social media apps
// - Task management
// - Dashboards
// - Authentication
// - APIs
// - Forms
```

### Workouts (`mockWorkouts.ts`)
Fitness domain data:
```typescript
import {
  mockExercises,
  mockWorkoutLogs,
  mockWorkoutPlans,
  mockProgressEntries,
  mockWorkoutStats,
} from '@/lib/mock';

// Exercise library (8 exercises)
const exercises = mockExercises;

// Workout logs with sets/reps
const logs = mockWorkoutLogs;

// Pre-built workout plans
const plans = mockWorkoutPlans;

// Progress tracking data
const progress = mockProgressEntries;
const stats = mockWorkoutStats;
```

### Products (`mockProducts.ts`)
E-commerce domain data:
```typescript
import {
  mockProducts,
  mockReviews,
  mockOrders,
  mockCategories,
  getFeaturedProducts,
  getBestsellers,
} from '@/lib/mock';

// Product catalog (6 products)
const products = mockProducts;
const featured = getFeaturedProducts();
const bestsellers = getBestsellers();

// Reviews and orders
const reviews = mockReviews;
const orders = mockOrders;

// Categories with subcategories
const categories = mockCategories;
```

### Analytics (`mockAnalytics.ts`)
Dashboard domain data:
```typescript
import {
  mockDashboardMetrics,
  mockWebsiteAnalytics,
  mockSalesAnalytics,
  mockCustomerAnalytics,
  mockPerformanceMetrics,
} from '@/lib/mock';

// Dashboard overview
const { overview, timeSeriesData, topProducts } = mockDashboardMetrics;

// Website analytics
const { pageViews, uniqueVisitors, topPages } = mockWebsiteAnalytics;

// Sales analytics
const { totalRevenue, monthlySales, salesByRegion } = mockSalesAnalytics;

// Customer analytics
const { totalCustomers, customerSegments } = mockCustomerAnalytics;

// Performance metrics
const { apiResponseTime, uptime, systemHealth } = mockPerformanceMetrics;
```

## Services

### Mock AI Service (`services/mockAI.ts`)

Simulate AI chat responses with pattern matching:

```typescript
import { getMockAIService } from '@/lib/services';

const aiService = getMockAIService();

// Send message
const response = await aiService.sendMessage('Build a task manager');
console.log(response.data.content);

// Stream message
for await (const chunk of aiService.streamMessage('Create a dashboard')) {
  process.stdout.write(chunk);
}

// Manage conversations
const conversations = aiService.getAllConversations();
const conversation = aiService.getConversation(conversationId);
aiService.deleteConversation(conversationId);
```

### Mock Code Generation Service

Generate component and API code:

```typescript
import { mockCodeGenService } from '@/lib/services';

// Generate React component
const componentResult = await mockCodeGenService.generateComponent(
  'User profile card',
  {
    framework: 'react',
    typescript: true,
    styling: 'tailwind',
  }
);
console.log(componentResult.data.code);

// Generate API route
const apiResult = await mockCodeGenService.generateAPIRoute(
  '/api/users',
  'GET',
  'Fetch all users'
);
console.log(apiResult.data.code);
```

## Utilities

### Pagination

```typescript
import { paginateMockData } from '@/lib/mock';

const result = paginateMockData(mockProducts, {
  page: 2,
  pageSize: 10,
});

console.log(result.data); // Products for page 2
console.log(result.pagination);
// {
//   page: 2,
//   pageSize: 10,
//   total: 50,
//   totalPages: 5,
//   hasNext: true,
//   hasPrev: true,
// }
```

### Search & Filter

```typescript
import { searchMockData, sortMockData } from '@/lib/mock';

// Search
const results = searchMockData(mockProducts, {
  query: 'wireless',
  fields: ['name', 'description'],
  caseSensitive: false,
});

// Sort
const sorted = sortMockData(mockProducts, {
  field: 'price',
  order: 'desc',
});
```

### Delay Simulation

```typescript
import { delay, randomDelay } from '@/lib/mock';

// Fixed delay
await delay(1000); // 1 second

// Random delay (300-1500ms)
await randomDelay();
```

### Error Simulation

```typescript
import { randomError } from '@/lib/mock';

// Throw random error 5% of the time
try {
  randomError(); // Uses MOCK_CONFIG.errorRate
  // Your code here
} catch (error) {
  console.error('Simulated error:', error);
}
```

### Streaming Text

```typescript
import { streamText } from '@/lib/mock';

const text = 'This is a streaming response';
for await (const chunk of streamText(text, 50)) {
  process.stdout.write(chunk);
}
```

## Usage Patterns

### API Route with Mock Data

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CONFIG } from '@/lib/mock/config';
import { mockProducts, paginateMockData, delay } from '@/lib/mock';

export async function GET(request: NextRequest) {
  if (MOCK_CONFIG.enabled) {
    // Simulate network delay
    await delay(MOCK_CONFIG.networkDelay);

    // Get query params
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    // Return paginated mock data
    const result = paginateMockData(mockProducts, { page, pageSize });
    return NextResponse.json(result);
  }

  // Real API implementation
  // ...
}
```

### React Component with Mock Data

```typescript
'use client';

import { useEffect, useState } from 'react';
import { MOCK_CONFIG, mockProducts } from '@/lib/mock';

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      if (MOCK_CONFIG.enabled) {
        // Use mock data
        setProducts(mockProducts);
      } else {
        // Fetch from API
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
      }
    }

    loadProducts();
  }, []);

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

### AI Chat Interface

```typescript
'use client';

import { useState } from 'react';
import { getMockAIService } from '@/lib/services';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setStreaming(true);

    // Stream AI response
    const aiService = getMockAIService();
    let response = '';

    try {
      for await (const chunk of aiService.streamMessage(input)) {
        response += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];

          if (lastMessage?.role === 'assistant') {
            lastMessage.content = response;
          } else {
            newMessages.push({ role: 'assistant', content: response });
          }

          return newMessages;
        });
      }
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={streaming}
        />
        <button type="submit" disabled={streaming}>
          Send
        </button>
      </form>
    </div>
  );
}
```

## Best Practices

1. **Environment-based toggling**: Use `NEXT_PUBLIC_MOCK_MODE` to switch between mock and real data
2. **Consistent interfaces**: Mock data matches production API response shapes
3. **Realistic delays**: Simulate network latency for better UX testing
4. **Error handling**: Test error states with `randomError()`
5. **Type safety**: Use TypeScript interfaces for all mock data
6. **Centralized imports**: Import from `@/lib/mock` or `@/lib/services`

## File Structure

```
lib/
├── mock/
│   ├── config.ts              # Mock configuration
│   ├── utils.ts               # Helper utilities
│   ├── mockUsers.ts           # User data
│   ├── mockProjects.ts        # Project data
│   ├── mockComponents.ts      # UI components
│   ├── mockAIResponses.ts     # AI responses
│   ├── mockWorkouts.ts        # Fitness data
│   ├── mockProducts.ts        # E-commerce data
│   ├── mockAnalytics.ts       # Analytics data
│   └── index.ts               # Central exports
├── services/
│   ├── mockAI.ts              # AI service
│   └── index.ts               # Central exports
└── README.md                  # This file
```

## Extending the System

### Add New Mock Data

1. Create new file in `lib/mock/` (e.g., `mockBlogPosts.ts`)
2. Define TypeScript interfaces
3. Generate realistic data
4. Export data and helper functions
5. Add exports to `lib/mock/index.ts`

```typescript
// lib/mock/mockBlogPosts.ts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

export const mockBlogPosts: BlogPost[] = [
  // ... your data
];

export const getPostById = (id: string) => {
  return mockBlogPosts.find(post => post.id === id);
};
```

### Add New AI Response Patterns

Edit `lib/mock/mockAIResponses.ts`:

```typescript
export const AI_RESPONSES: Record<string, AIResponse> = {
  // ... existing patterns

  'blog platform': {
    response: 'I\'ll help you build a blog platform...',
    components: ['PostEditor', 'PostList', 'CommentSection'],
    mockData: { posts: [...] },
    suggestions: ['Add rich text editor', 'Implement tags'],
  },
};

// Update matchPattern function
export const matchPattern = (prompt: string): AIResponse => {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes('blog')) {
    return AI_RESPONSES['blog platform'];
  }

  // ... other patterns
};
```

## TypeScript Support

All mock data includes full TypeScript type definitions:

```typescript
import type {
  MockUser,
  Product,
  WorkoutLog,
  DashboardMetrics,
  Message,
  Conversation,
} from '@/lib/mock';

// Type-safe usage
const user: MockUser = mockUsers[0];
const product: Product = mockProducts[0];
```

## License

MIT - Part of the TechStack AI Agent Development Framework

---

**Framework Version:** 1.0.0
**Last Updated:** 2025-11-18
