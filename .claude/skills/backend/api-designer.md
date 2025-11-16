# 🔌 API Designer Skill

**Category:** Backend
**Purpose:** Design RESTful API endpoints following best practices

---

## 🎯 What This Skill Does

Creates well-structured REST APIs:
- RESTful naming conventions
- Consistent request/response formats
- Proper HTTP methods and status codes
- Versioning strategy
- Error handling patterns
- Documentation standards

---

## 📝 API Design Patterns

### **1. RESTful Endpoint Structure**

```
/api/v1/resources
/api/v1/resources/:id
/api/v1/resources/:id/sub-resources

Examples:
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/:id
PATCH  /api/v1/users/:id
DELETE /api/v1/users/:id
GET    /api/v1/users/:id/posts
```

---

### **2. HTTP Methods**

```
GET    - Retrieve resource(s)      (Safe, Idempotent)
POST   - Create new resource        (Not idempotent)
PUT    - Replace entire resource    (Idempotent)
PATCH  - Update partial resource    (Idempotent)
DELETE - Remove resource             (Idempotent)
```

---

### **3. Status Codes**

```typescript
// Success
200 OK              - Successful GET, PATCH, PUT, DELETE
201 Created         - Successful POST
204 No Content      - Successful DELETE (no body)

// Client Errors
400 Bad Request     - Invalid input
401 Unauthorized    - Missing/invalid authentication
403 Forbidden       - Authenticated but not allowed
404 Not Found       - Resource doesn't exist
409 Conflict        - Resource already exists
422 Unprocessable   - Validation failed
429 Too Many Requests - Rate limit exceeded

// Server Errors
500 Internal Server Error - Something went wrong
503 Service Unavailable   - Server is down
```

---

### **4. Standard Response Format**

```typescript
// Success Response
{
  "success": true,
  "data": {...},
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}

// Error Response
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "requestId": "req_abc123"
  }
}

// Paginated Response
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

### **5. API Route Examples (Next.js)**

```typescript
// app/api/v1/users/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const CreateUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
});

/**
 * GET /api/v1/users
 * List all users with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Filtering
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = db.from('users').select('*');

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    if (status) {
      query = query.eq('status', status);
    }

    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);

    const { data: users, count } = await query;

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasNext: offset + limit < (count || 0),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch users',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/v1/users
 * Create a new user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validated = CreateUserSchema.parse(body);

    // Check if user exists
    const existing = await db
      .from('users')
      .select('id')
      .eq('email', validated.email)
      .single();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'USER_EXISTS',
            message: 'User with this email already exists',
          },
        },
        { status: 409 }
      );
    }

    // Create user
    const { data: user } = await db
      .from('users')
      .insert(validated)
      .select()
      .single();

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input data',
            details: error.errors.map((err) => ({
              field: err.path.join('.'),
              message: err.message,
            })),
          },
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create user',
        },
      },
      { status: 500 }
    );
  }
}
```

```typescript
// app/api/v1/users/[id]/route.ts

/**
 * GET /api/v1/users/:id
 * Get single user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: user } = await db
      .from('users')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch user',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/v1/users/:id
 * Update user partially
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Update only provided fields
    const { data: user } = await db
      .from('users')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update user',
        },
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/v1/users/:id
 * Delete user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await db
      .from('users')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'User not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'User deleted successfully',
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete user',
        },
      },
      { status: 500 }
    );
  }
}
```

---

### **6. Query Parameters**

```typescript
// Pagination
?page=1&limit=20

// Filtering
?status=active&role=admin

// Sorting
?sortBy=createdAt&sortOrder=desc

// Search
?search=john

// Field selection
?fields=id,name,email

// Relationships
?include=posts,comments

// Date range
?from=2024-01-01&to=2024-01-31

// Combined example
?page=1&limit=20&status=active&sortBy=name&search=john
```

---

### **7. Middleware Pattern**

```typescript
// middleware/auth.ts

export async function withAuth(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>
) {
  return async (req: NextRequest, context: any) => {
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Authentication required',
          },
        },
        { status: 401 }
      );
    }

    // Verify token
    const user = await verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token',
          },
        },
        { status: 401 }
      );
    }

    // Attach user to context
    context.user = user;

    return handler(req, context);
  };
}

// Usage
export const GET = withAuth(async (req, { params, user }) => {
  // user is available here
  return NextResponse.json({ data: user });
});
```

---

## ✅ API Design Checklist

### **Endpoint Design**
- [ ] RESTful naming (plural nouns)
- [ ] Consistent URL structure
- [ ] Proper HTTP methods
- [ ] Versioning (/api/v1/)

### **Request Handling**
- [ ] Input validation (Zod/Yup)
- [ ] Authentication checks
- [ ] Authorization checks
- [ ] Rate limiting

### **Response Format**
- [ ] Consistent structure
- [ ] Proper status codes
- [ ] Error handling
- [ ] Pagination for lists

### **Documentation**
- [ ] API endpoint docs
- [ ] Request/response examples
- [ ] Error codes documented
- [ ] Authentication explained

---

## 🎯 Best Practices

✅ **Use Nouns, Not Verbs**
```
❌ /api/getUsers
✅ /api/users

❌ /api/createPost
✅ POST /api/posts
```

✅ **Consistent Naming**
```
✅ /api/users/:id/posts
✅ /api/posts/:id/comments

❌ /api/user/:id/getPosts (inconsistent)
```

✅ **Pagination by Default**
```typescript
// Always paginate lists
?page=1&limit=20&maxLimit=100
```

✅ **Proper Error Handling**
```typescript
try {
  // operation
} catch (error) {
  logger.error('Operation failed', error);
  return standardErrorResponse(error);
}
```

✅ **API Versioning**
```
/api/v1/users   - Version 1
/api/v2/users   - Version 2 (breaking changes)
```

---

**Used By:** backend-dev, system-architect
**Best With:** auth-setup, database-ops
