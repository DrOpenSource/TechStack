# 🏢 Multi-Tenant Setup Skill

**Category:** Backend
**Purpose:** Implement organization-specific data isolation using Supabase RLS

---

## 🎯 What This Skill Does

Ensures complete data isolation between organizations:
- Row-Level Security policies
- Organization context in authentication
- Automatic organization_id filtering
- Secure multi-tenant queries

---

## 📝 Implementation

### **1. Database RLS Policies**

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users view own data" ON users
  FOR SELECT USING (auth.uid() = id);

-- Staff can see users from their organization only
CREATE POLICY "Staff view organization users" ON users
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM staff
      WHERE user_id = auth.uid()
    )
  );

-- Admins can see all users from their organization
CREATE POLICY "Admins view organization users" ON users
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM organizations
      WHERE owner_id = auth.uid()
    )
  );

-- Data entries inherit user access rules
CREATE POLICY "Data entries follow user access" ON data_entries
  FOR SELECT USING (
    user_id IN (
      SELECT id FROM users
      -- RLS on users table automatically applies
    )
  );
```

### **2. Application Context**

```typescript
// contexts/OrganizationContext.tsx

interface OrganizationContextType {
  organizationId: string;
  organizationName: string;
  organizationLogo: string | null;
  role: 'admin' | 'staff' | 'user';
}

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [orgContext, setOrgContext] = useState<OrganizationContextType | null>(null);

  useEffect(() => {
    // Load organization context from auth session
    loadOrganizationContext();
  }, []);

  return (
    <OrganizationContext.Provider value={orgContext}>
      {children}
    </OrganizationContext.Provider>
  );
}
```

---

## ✅ Multi-Tenant Checklist

- [ ] RLS enabled on all tables
- [ ] Policies created for each role (admin, staff, user)
- [ ] organization_id included in all queries
- [ ] No cross-organization data leaks possible
- [ ] Tested with multiple organizations
- [ ] Organization context stored in auth token

---

**Used By:** system-architect, database-engineer, backend-dev
