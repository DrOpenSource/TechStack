# 🗄️ Database Operations Skill

**Category:** Backend
**Purpose:** Efficient CRUD operations and query optimization

---

## 🎯 What This Skill Does

Implements database operations:
- CRUD operations (Create, Read, Update, Delete)
- Query optimization
- Transaction handling
- Connection pooling
- Error handling

---

## 📝 Common Patterns (Supabase)

```typescript
// Create
const { data, error } = await supabase
  .from('table')
  .insert({ field: 'value' })
  .select()
  .single();

// Read (single)
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('id', id)
  .single();

// Read (list with filters)
const { data } = await supabase
  .from('table')
  .select('*')
  .eq('status', 'active')
  .gte('created_at', '2024-01-01')
  .order('created_at', { ascending: false })
  .limit(10);

// Update
const { data } = await supabase
  .from('table')
  .update({ field: 'new value' })
  .eq('id', id)
  .select();

// Delete
const { error } = await supabase
  .from('table')
  .delete()
  .eq('id', id);

// Joins
const { data } = await supabase
  .from('users')
  .select('*, posts(*)')
  .eq('id', userId);

// Transactions
const { data, error } = await supabase.rpc('transaction_function', {
  param1: 'value1'
});
```

---

## ✅ Best Practices

✅ Use indexes for frequently queried columns
✅ Avoid N+1 queries (use joins)
✅ Use pagination for large datasets
✅ Handle errors gracefully
✅ Use connection pooling
✅ Close connections properly

---

**Used By:** backend-dev, database-engineer
