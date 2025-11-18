# Quick Start: Mock-First Development

Get started with mock-first development in **5 minutes**.

---

## 🚀 Quick Setup (3 Steps)

### **Step 1: Copy Template Files** (2 minutes)

Copy these templates from `.claude/skills/development/templates/` to your project:

```bash
# Core configuration
cp templates/mockConfig.ts → lib/config/mockConfig.ts
cp templates/mockUtils.ts → lib/mocks/mockUtils.ts
cp templates/sampleData.ts → lib/mocks/sampleData.ts

# Service layer
cp templates/useService.ts → hooks/useService.ts
cp templates/mockUserService.ts → services/mock/mockUserService.ts
cp templates/mockAuthService.ts → services/mock/mockAuthService.ts

# UI components
cp templates/SampleDataComponents.tsx → components/mock/SampleDataComponents.tsx

# Environment setup
cp templates/.env.example → .env.local
```

### **Step 2: Configure Environment** (30 seconds)

Edit `.env.local`:

```bash
NEXT_PUBLIC_MOCK_MODE=true
NEXT_PUBLIC_MOCK_DELAY=800
NEXT_PUBLIC_MOCK_ERROR_RATE=0
```

### **Step 3: Start Development** (30 seconds)

```bash
npm run dev
```

✅ **You're done!** Your app now runs with mocks. No backend setup required.

---

## 📖 Usage Examples

### **Example 1: Create a Mock Service** (5 minutes)

```typescript
// services/mock/mockProductService.ts
import { simulateDelay, MockDataStore } from '@/lib/mocks/mockUtils';

const MOCK_PRODUCTS = [
  { id: '1', name: 'Product A', price: 99.99 },
  { id: '2', name: 'Product B', price: 149.99 },
];

const store = new MockDataStore(MOCK_PRODUCTS);

export const mockProductService = {
  async getAll() {
    await simulateDelay();
    return store.getAll();
  },

  async getById(id: string) {
    await simulateDelay();
    return store.getById(id);
  },

  async create(product) {
    await simulateDelay();
    return store.create({ ...product, id: `prod-${Date.now()}` });
  },
};
```

### **Example 2: Use Service in Component**

```typescript
// components/ProductList.tsx
import { useProductService } from '@/hooks/useProductService';

export function ProductList() {
  const productService = useProductService();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productService.getAll().then(setProducts);
  }, []);

  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name} - ${p.price}</div>
      ))}
    </div>
  );
}
```

### **Example 3: Form with Sample Data**

```typescript
import { FormWithSampleData } from '@/components/mock/SampleDataComponents';
import { SAMPLE_DATA } from '@/lib/mocks/sampleData';

export function UserProfileForm() {
  const [form, setForm] = useState({ name: '', email: '' });

  return (
    <FormWithSampleData
      sampleData={SAMPLE_DATA.userProfile}
      onFill={setForm}
    >
      <input
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
    </FormWithSampleData>
  );
}
```

---

## 🎯 Common Tasks

### **Task: Add New Mock Service**

1. **Create mock service:**
   ```typescript
   // services/mock/mockXService.ts
   export const mockXService = { /* CRUD methods */ };
   ```

2. **Create service hook:**
   ```typescript
   // hooks/useXService.ts
   import { createServiceHook } from '@/hooks/useService';
   import { mockXService } from '@/services/mock/mockXService';
   import { realXService } from '@/services/real/realXService';

   export const useXService = createServiceHook(mockXService, realXService);
   ```

3. **Use in component:**
   ```typescript
   const xService = useXService();
   const data = await xService.getAll();
   ```

### **Task: Switch to Real Backend**

1. **Implement real service:**
   ```typescript
   // services/real/userService.ts
   export const userService = {
     async getAll() {
       const { data } = await supabase.from('users').select('*');
       return data;
     },
   };
   ```

2. **Toggle environment:**
   ```bash
   NEXT_PUBLIC_MOCK_MODE=false npm run dev
   ```

3. **Test both modes:**
   ```bash
   # Mock mode
   NEXT_PUBLIC_MOCK_MODE=true npm run dev

   # Real mode
   NEXT_PUBLIC_MOCK_MODE=false npm run dev
   ```

### **Task: Test Error States**

```bash
# Simulate 20% error rate
NEXT_PUBLIC_MOCK_ERROR_RATE=20 npm run dev
```

### **Task: Test Slow Networks**

```bash
# Simulate 3-second network delay
NEXT_PUBLIC_MOCK_DELAY=3000 npm run dev
```

---

## 🧪 Testing Workflows

### **Demo to Stakeholders**

```bash
# Pre-filled forms, fast responses
NEXT_PUBLIC_MOCK_MODE=true \
NEXT_PUBLIC_MOCK_DELAY=500 \
npm run dev
```

### **Test Loading States**

```bash
# Slow network simulation
NEXT_PUBLIC_MOCK_MODE=true \
NEXT_PUBLIC_MOCK_DELAY=2000 \
npm run dev
```

### **Test Error Handling**

```bash
# Random errors
NEXT_PUBLIC_MOCK_MODE=true \
NEXT_PUBLIC_MOCK_ERROR_RATE=15 \
npm run dev
```

### **Integration Testing**

```bash
# Real backend
NEXT_PUBLIC_MOCK_MODE=false npm run test:e2e
```

---

## 📁 Project Structure After Setup

```
your-project/
├── lib/
│   ├── config/
│   │   └── mockConfig.ts          ✅ Central config
│   └── mocks/
│       ├── mockUtils.ts            ✅ Utilities
│       └── sampleData.ts           ✅ Sample data
├── services/
│   ├── mock/                       ✅ Mock implementations
│   │   ├── mockUserService.ts
│   │   ├── mockAuthService.ts
│   │   └── mockProductService.ts
│   └── real/                       ⏳ Real implementations (later)
│       ├── userService.ts
│       └── authService.ts
├── hooks/
│   └── useService.ts               ✅ Service selector
├── components/
│   └── mock/
│       └── SampleDataComponents.tsx ✅ UI helpers
└── .env.local                      ✅ Mock mode enabled
```

---

## ✅ Checklist: Is My Setup Working?

- [ ] `.env.local` has `NEXT_PUBLIC_MOCK_MODE=true`
- [ ] Console shows `[MOCK]` logs when calling services
- [ ] Forms have sample data hints below fields
- [ ] "Use Sample Data" button appears in dev mode
- [ ] OTP shows `123456` in console
- [ ] Login works with any email + `123456` OTP
- [ ] No Supabase connection required
- [ ] App works offline

---

## 🔄 Migration Timeline

| Week | Activity | Mock Mode |
|------|----------|-----------|
| **Week 1** | Build UI + mock services | ✅ ON |
| **Week 2** | Complete user flows | ✅ ON |
| **Week 3** | Implement real backend | ✅/❌ Toggle |
| **Week 4** | Test integration | ❌ OFF |
| **Week 5** | Deploy to production | ❌ OFF |

---

## 🆘 Troubleshooting

### **Mock mode not working?**

Check:
1. `.env.local` exists and has correct values
2. Restart dev server after changing `.env.local`
3. Browser console shows `[MOCK]` logs
4. `mockConfig.enabled` is `true` in console

### **Services still calling real backend?**

Check:
1. Using `useService()` hook (not direct import)
2. Hook uses `createServiceHook(mock, real)`
3. Service factory checks `mockConfig.enabled`

### **Sample data not showing?**

Check:
1. `NEXT_PUBLIC_MOCK_MODE=true` in `.env.local`
2. Using `<SampleDataHint>` component
3. Components imported from correct path

---

## 📚 Next Steps

1. **Read Full Documentation:** `.claude/skills/development/mock-first-development.md`
2. **Create Your First Mock Service:** Follow Example 1 above
3. **Build Complete User Flow:** With mocks only
4. **Switch to Real Backend:** When ready

---

## 🎓 Pro Tips

1. **Always start with mocks** - Build UI first, backend later
2. **Keep mocks simple** - Match real service interface
3. **Use fixtures for tests** - Deterministic data
4. **Test both modes** - Toggle before shipping
5. **Keep mocks updated** - When real API changes

---

**Questions?** See the main skill documentation: `.claude/skills/development/mock-first-development.md`

**Happy Building! 🚀**
