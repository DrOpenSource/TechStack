# 🏢 Multi-Tenant Setup Skill

**Category:** Backend
**Purpose:** Implement gym-specific data isolation using Supabase RLS

---

## 🎯 What This Skill Does

Ensures complete data isolation between gyms:
- Row-Level Security policies
- Gym context in authentication
- Automatic gym_id filtering
- Secure multi-tenant queries

---

## 📝 Implementation

### **1. Database RLS Policies**

```sql
-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE weigh_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

-- Members can only see their own data
CREATE POLICY "Members view own data" ON members
  FOR SELECT USING (auth.uid() = id);

-- Trainers can see members from their gym only
CREATE POLICY "Trainers view gym members" ON members
  FOR SELECT USING (
    gym_id IN (
      SELECT gym_id FROM trainers
      WHERE user_id = auth.uid()
    )
  );

-- Owners can see all members from their gym
CREATE POLICY "Owners view gym members" ON members
  FOR SELECT USING (
    gym_id IN (
      SELECT id FROM gyms
      WHERE owner_id = auth.uid()
    )
  );

-- Weigh-ins inherit member access rules
CREATE POLICY "Weigh-ins follow member access" ON weigh_ins
  FOR SELECT USING (
    member_id IN (
      SELECT id FROM members
      -- RLS on members table automatically applies
    )
  );
```

### **2. Application Context**

```typescript
// contexts/GymContext.tsx

interface GymContextType {
  gymId: string;
  gymName: string;
  gymLogo: string | null;
  role: 'owner' | 'trainer' | 'member';
}

export function GymProvider({ children }: { children: ReactNode }) {
  const [gymContext, setGymContext] = useState<GymContextType | null>(null);

  useEffect(() => {
    // Load gym context from auth session
    loadGymContext();
  }, []);

  return (
    <GymContext.Provider value={gymContext}>
      {children}
    </GymContext.Provider>
  );
}
```

---

## ✅ Multi-Tenant Checklist

- [ ] RLS enabled on all tables
- [ ] Policies created for each role (owner, trainer, member)
- [ ] gym_id included in all queries
- [ ] No cross-gym data leaks possible
- [ ] Tested with multiple gyms
- [ ] Gym context stored in auth token

---

**Used By:** system-architect, database-engineer, backend-dev
