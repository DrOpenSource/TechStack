# Mock Data System - Usage Examples

Real-world examples of using the mock data system in your application.

## Table of Contents

1. [Authentication](#authentication)
2. [Product Catalog](#product-catalog)
3. [AI Chat Interface](#ai-chat-interface)
4. [Dashboard Analytics](#dashboard-analytics)
5. [Fitness Tracking](#fitness-tracking)
6. [API Routes](#api-routes)

---

## Authentication

### Login Component

```typescript
'use client';

import { useState } from 'react';
import { authenticateUser, verifyOTP, DEMO_CREDENTIALS } from '@/lib/mock';

export default function LoginForm() {
  const [email, setEmail] = useState(DEMO_CREDENTIALS.email);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Use mock authentication
    const user = authenticateUser(email, password);

    if (user) {
      console.log('Logged in as:', user);
      // Redirect or update app state
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="error">{error}</p>}
      <button type="submit">Sign In</button>

      <p className="hint">
        Demo credentials: {DEMO_CREDENTIALS.email} / {DEMO_CREDENTIALS.password}
      </p>
    </form>
  );
}
```

### OTP Verification

```typescript
'use client';

import { useState } from 'react';
import { verifyOTP } from '@/lib/mock';

export default function OTPVerification() {
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);

  const handleVerify = () => {
    if (verifyOTP(otp)) {
      setVerified(true);
      // Proceed with authentication
    } else {
      alert('Invalid OTP');
    }
  };

  return (
    <div>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP (hint: 123456)"
        maxLength={6}
      />
      <button onClick={handleVerify}>Verify</button>
      {verified && <p>✓ Verified successfully!</p>}
    </div>
  );
}
```

---

## Product Catalog

### Product List with Pagination

```typescript
'use client';

import { useState } from 'react';
import { mockProducts, paginateMockData } from '@/lib/mock';

export default function ProductCatalog() {
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const { data: products, pagination } = paginateMockData(mockProducts, {
    page,
    pageSize,
  });

  return (
    <div>
      <h1>Products</h1>

      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p className="text-sm text-gray-600">
              {product.shortDescription}
            </p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-2xl font-bold">
                ${product.price}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.compareAtPrice}
                </span>
              )}
            </div>
            <div className="flex items-center mt-2">
              <span>⭐ {product.rating}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({product.reviewCount} reviews)
              </span>
            </div>
            <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-8">
        <button
          onClick={() => setPage(p => p - 1)}
          disabled={!pagination.hasPrev}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setPage(p => p + 1)}
          disabled={!pagination.hasNext}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

### Product Search

```typescript
'use client';

import { useState } from 'react';
import { mockProducts, searchMockData } from '@/lib/mock';

export default function ProductSearch() {
  const [query, setQuery] = useState('');

  const results = searchMockData(mockProducts, {
    query,
    fields: ['name', 'description', 'brand'],
  });

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-full px-4 py-2 border rounded"
      />

      <p className="mt-4 text-gray-600">
        {results.length} results found
      </p>

      <div className="mt-4 space-y-4">
        {results.map(product => (
          <div key={product.id} className="border p-4 rounded">
            <h3>{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <span className="text-xl font-bold">${product.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## AI Chat Interface

### Basic Chat with Streaming

```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import { getMockAIService } from '@/lib/services';
import type { Message } from '@/lib/services';

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const aiService = getMockAIService();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;

    const userMessage = input;
    setInput('');
    setIsStreaming(true);

    // Add user message
    setMessages(prev => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        content: userMessage,
        timestamp: new Date(),
      },
    ]);

    // Stream AI response
    let aiResponse = '';
    const aiMessageId = `ai-${Date.now()}`;

    try {
      for await (const chunk of aiService.streamMessage(userMessage)) {
        aiResponse += chunk;

        setMessages(prev => {
          const existingIndex = prev.findIndex(m => m.id === aiMessageId);

          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex].content = aiResponse;
            return updated;
          } else {
            return [
              ...prev,
              {
                id: aiMessageId,
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date(),
              },
            ];
          }
        });
      }
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            disabled={isStreaming}
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            type="submit"
            disabled={isStreaming || !input.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isStreaming ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}
```

### Conversation History

```typescript
'use client';

import { useState, useEffect } from 'react';
import { getMockAIService } from '@/lib/services';
import type { Conversation } from '@/lib/services';

export default function ConversationList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const aiService = getMockAIService();

  useEffect(() => {
    // Load conversations
    setConversations(aiService.getAllConversations());
  }, []);

  const handleDelete = (id: string) => {
    aiService.deleteConversation(id);
    setConversations(aiService.getAllConversations());
  };

  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold">Conversations</h2>

      {conversations.map(conv => (
        <div key={conv.id} className="border rounded p-4 hover:bg-gray-50">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold">{conv.title}</h3>
              <p className="text-sm text-gray-600">
                {conv.messages.length} messages
              </p>
              <p className="text-xs text-gray-500">
                Updated {conv.updatedAt.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(conv.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {conversations.length === 0 && (
        <p className="text-gray-500 text-center py-8">
          No conversations yet. Start a chat to begin!
        </p>
      )}
    </div>
  );
}
```

---

## Dashboard Analytics

### Metrics Overview

```typescript
'use client';

import { mockDashboardMetrics } from '@/lib/mock';

export default function DashboardMetrics() {
  const { overview } = mockDashboardMetrics;

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${overview.totalRevenue.toLocaleString()}`,
      change: overview.revenueChange,
    },
    {
      title: 'Total Users',
      value: overview.totalUsers.toLocaleString(),
      change: overview.usersChange,
    },
    {
      title: 'Total Orders',
      value: overview.totalOrders.toLocaleString(),
      change: overview.ordersChange,
    },
    {
      title: 'Conversion Rate',
      value: `${overview.conversionRate}%`,
      change: overview.conversionChange,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {metrics.map(metric => (
        <div key={metric.title} className="bg-white rounded-lg shadow p-6">
          <p className="text-sm font-medium text-gray-600">{metric.title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {metric.value}
          </p>
          <div className="flex items-center mt-2">
            <span
              className={`text-sm font-medium ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
            </span>
            <span className="text-sm text-gray-500 ml-2">vs last period</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Revenue Chart (with Recharts)

```typescript
'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { mockDashboardMetrics } from '@/lib/mock';

export default function RevenueChart() {
  const { timeSeriesData } = mockDashboardMetrics;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={timeSeriesData.revenue}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

---

## Fitness Tracking

### Workout Logger

```typescript
'use client';

import { useState } from 'react';
import { mockExercises, getExercisesByCategory } from '@/lib/mock';

export default function WorkoutLogger() {
  const [selectedExercise, setSelectedExercise] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [weight, setWeight] = useState(0);

  const strengthExercises = getExercisesByCategory('strength');

  const handleLog = () => {
    const exercise = mockExercises.find(ex => ex.id === selectedExercise);
    console.log('Logging workout:', {
      exercise: exercise?.name,
      sets,
      reps,
      weight,
    });
    // Save to state/API
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Log Workout</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Exercise
          </label>
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Select exercise</option>
            {strengthExercises.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sets
            </label>
            <input
              type="number"
              value={sets}
              onChange={(e) => setSets(parseInt(e.target.value))}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Reps
            </label>
            <input
              type="number"
              value={reps}
              onChange={(e) => setReps(parseInt(e.target.value))}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(parseInt(e.target.value))}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={handleLog}
          disabled={!selectedExercise}
          className="w-full bg-blue-600 text-white py-2 rounded-md disabled:opacity-50"
        >
          Log Workout
        </button>
      </div>
    </div>
  );
}
```

---

## API Routes

### Products API

```typescript
// app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CONFIG } from '@/lib/mock/config';
import { mockProducts, paginateMockData, delay } from '@/lib/mock';

export async function GET(request: NextRequest) {
  if (MOCK_CONFIG.enabled) {
    // Simulate network delay
    await delay(MOCK_CONFIG.networkDelay);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const result = paginateMockData(mockProducts, { page, pageSize });

    return NextResponse.json({
      success: true,
      ...result,
    });
  }

  // Real implementation
  // const products = await db.products.findMany();
  // return NextResponse.json({ success: true, data: products });
}
```

### Chat API

```typescript
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { MOCK_CONFIG } from '@/lib/mock/config';
import { getMockAIService } from '@/lib/services';

export async function POST(request: NextRequest) {
  if (MOCK_CONFIG.enabled) {
    const { message, conversationId } = await request.json();
    const aiService = getMockAIService();

    const response = await aiService.sendMessage(message, conversationId);

    return NextResponse.json(response);
  }

  // Real implementation with actual AI service
  // const response = await openai.chat.completions.create({ ... });
  // return NextResponse.json({ success: true, data: response });
}
```

---

## Tips & Best Practices

1. **Environment Variables**: Use `NEXT_PUBLIC_MOCK_MODE=true` to enable mock mode
2. **Type Safety**: Import TypeScript types for better IDE support
3. **Realistic UX**: Use delay functions to simulate network latency
4. **Error Testing**: Test error states with `randomError()`
5. **Gradual Migration**: Start with mock data, then replace with real APIs incrementally
6. **Documentation**: Document which components use mock data for team clarity

---

For more information, see [README.md](./README.md)
