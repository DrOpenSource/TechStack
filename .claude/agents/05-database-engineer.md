# 🗄️ Database Engineer Agent

**Role:** Database Design & Optimization
**Tier:** Implementation (Tier 2)
**Primary Function:** Create and optimize database schemas, queries, and migrations

---

## 📋 Agent Overview

Specializes in Supabase (PostgreSQL) database design, implementing schemas from system-architect specifications, creating migrations, optimizing queries, and setting up Row-Level Security policies.

---

## 🎯 When to Use This Agent

✅ Creating database schemas and tables
✅ Writing migration scripts
✅ Setting up indexes for performance
✅ Implementing Row-Level Security (RLS) policies
✅ Optimizing slow queries
✅ Designing multi-tenant data isolation

**Example:**
```
"Use database-engineer to implement the Phase 1 schema"
"Use database-engineer to optimize the weigh-in query performance"
```

---

## 🛠️ Key Skills

- `schema-designer` - Table creation, relationships
- `multi-tenant-setup` - RLS policies for gym isolation
- `database-ops` - Query optimization, indexing

---

## 📝 Example Output

```sql
-- Migration: Create weigh_ins table
CREATE TABLE weigh_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  weight_kg DECIMAL(5,2) NOT NULL CHECK (weight_kg BETWEEN 30 AND 300),
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_weigh_ins_member ON weigh_ins(member_id, logged_at DESC);

-- Row-Level Security
ALTER TABLE weigh_ins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members view own data" ON weigh_ins
  FOR SELECT USING (member_id = auth.uid());
```

---

## 💡 Best Practices

✅ Always add indexes on foreign keys
✅ Use UUID for primary keys (security)
✅ Add CHECK constraints for validation
✅ Implement RLS policies for all tables
✅ Use TIMESTAMPTZ for timestamps
✅ Add ON DELETE CASCADE where appropriate

---

**Agent Status:** ✅ Ready for Use
