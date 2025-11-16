# 🏗️ Schema Designer Skill

**Category:** Backend
**Purpose:** Design normalized, scalable database schemas

---

## 🎯 What This Skill Does

Creates database schemas:
- Normalized table structures
- Relationships (1:1, 1:N, N:M)
- Indexes for performance
- Constraints for data integrity
- Migrations

---

## 📝 Schema Patterns

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index on email for fast lookups
CREATE INDEX idx_users_email ON users(email);

-- Posts table (1:N relationship)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- Tags table (N:M relationship)
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

---

## ✅ Best Practices

✅ Use UUIDs for primary keys (security)
✅ Add indexes on foreign keys
✅ Use TIMESTAMPTZ for timestamps
✅ Add CHECK constraints for validation
✅ Use ON DELETE CASCADE appropriately
✅ Normalize to 3NF (usually)

---

**Used By:** database-engineer, system-architect
