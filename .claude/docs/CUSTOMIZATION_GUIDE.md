# 🎨 Customization Guide

**Purpose:** How to adapt the AI Agent Framework for your specific domain

---

## When to Customize

**✅ Customize When:**
- Your domain has specific terminology (healthcare, finance, education)
- You need domain-specific validation rules
- Compliance requirements differ (HIPAA vs GDPR)
- Standard agents don't fit your workflow

**❌ Don't Customize When:**
- Building generic CRUD application
- First time using the framework (start generic first)
- Unclear on requirements (prototype first, customize later)

---

## Customization Levels

### **Level 1: Configuration Only** (Recommended)
- Fill out PROJECT_TEMPLATE.md with your domain terms
- No code changes to agents
- Reference template when invoking agents

**Example:**
```
"Use backend-dev to implement [refer to MY_PROJECT_CONFIG.md for terminology]
patient vital signs API with HIPAA compliance"
```

---

### **Level 2: Agent Prompts** (Advanced)
- Update agent markdown files with domain-specific examples
- Replace generic examples with your domain patterns
- Keep agent structure intact

**Example:** Customize `06-backend-dev.md`
```markdown
### **Feature:** "Patient Vital Signs API" (was "Data Entry API")

// Change code examples to use:
- patient_id instead of user_id
- vital_signs table instead of data_entries
- HIPAA audit logging
```

---

### **Level 3: Custom Agents** (Expert)
- Create new domain-specific agents
- Add to `.claude/agents/13-custom-agent.md`
- Register with orchestrator

**Example:** Create `13-hipaa-compliance-agent.md`
```markdown
# 🏥 HIPAA Compliance Agent

**Role:** Healthcare Compliance Validation
**Primary Function:** Ensure HIPAA compliance in code and architecture

## When to Use
- After backend-dev creates health data APIs
- Before deploying PHI-handling features
- When creating audit logs
```

---

## Common Customizations

### **1. Healthcare Domain**

**Terminology Changes:**
```bash
# Update these agents:
- 02-system-architect.md: Add HIPAA requirements
- 06-backend-dev.md: Use patient/doctor terminology
- 07-database-engineer.md: Add audit logging tables

# Example change in system-architect.md:
sed -i 's/Generic data privacy/HIPAA compliance/g' 02-system-architect.md
```

**Custom Validation:**
```typescript
// Add to form-validator skill
export const vitalSignsRules = z.object({
  blood_pressure: z.string().regex(/^\d{2,3}\/\d{2,3}$/),
  heart_rate: z.number().min(40).max(200),
  temperature: z.number().min(95).max(105),
});
```

---

### **2. FinTech Domain**

**Compliance Updates:**
```markdown
# Add to 02-system-architect.md

## Financial Compliance
- PCI DSS Level 1 for payment data
- SOC 2 Type II certification
- AML/KYC verification required
- Transaction audit trail (7 years retention)
```

**Custom Agents:**
- `13-fraud-detection-agent.md`
- `14-compliance-validator-agent.md`

---

### **3. E-Commerce Domain**

**Custom Skills:**
```markdown
# Create .claude/skills/ecommerce/inventory-management.md
# Create .claude/skills/ecommerce/order-fulfillment.md
# Create .claude/skills/ecommerce/pricing-engine.md
```

**Integration Updates:**
```yaml
# Update 09-integration-specialist.md examples:
- Stripe payment processing
- Shippo shipping integration
- Klaviyo email marketing
- Google Shopping feed
```

---

## Step-by-Step: Healthcare Customization Example

### **Step 1: Define Terminology**

Create `.claude/docs/HEALTHCARE_TERMS.md`:
```markdown
# Healthcare Terminology Mapping

- user → patient
- admin → physician
- staff → nurse/medical_staff
- data_entry → vital_signs_measurement
- project → treatment_plan
- organization → hospital/clinic
```

### **Step 2: Update System Architect**

Edit `.claude/agents/02-system-architect.md`:

**Add compliance section:**
```markdown
## Healthcare Compliance Requirements

### HIPAA Security Rule
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- Access controls (RBAC)
- Audit logs (all PHI access)

### Database Design
CREATE TABLE patients (
  id UUID PRIMARY KEY,
  mrn VARCHAR(20) UNIQUE, -- Medical Record Number
  phi_data JSONB,  -- Protected Health Information
  consent_status VARCHAR(20),
  hipaa_authorization_date TIMESTAMP
);

-- Audit logging
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR(50),
  resource_type VARCHAR(50),
  resource_id UUID,
  phi_accessed BOOLEAN,
  ip_address INET,
  logged_at TIMESTAMP DEFAULT NOW()
);
```

### **Step 3: Update Backend Dev**

Edit `.claude/agents/06-backend-dev.md`:

**Replace data entry example with vital signs:**
```typescript
// api/vital-signs/route.ts
const VitalSignsSchema = z.object({
  patient_id: z.string().uuid(),
  blood_pressure_systolic: z.number().min(70).max(200),
  blood_pressure_diastolic: z.number().min(40).max(130),
  heart_rate: z.number().min(40).max(200),
  temperature_f: z.number().min(95).max(105),
  recorded_by: z.string().uuid(), // Physician/Nurse ID
});

// Add HIPAA audit logging
await logHIPAAAudit({
  user_id: user.id,
  action: 'CREATE_VITAL_SIGNS',
  patient_id: validatedData.patient_id,
  phi_accessed: true,
  ip_address: request.headers.get('x-forwarded-for'),
});
```

### **Step 4: Create Custom Agent**

Create `.claude/agents/13-hipaa-compliance.md`:
```markdown
# 🏥 HIPAA Compliance Agent

**Role:** Healthcare Compliance Validation
**Tier:** Review (Tier 3)

## What This Agent Does

### Input
- API specifications
- Database schemas
- Authentication flows
- Data access patterns

### Output
- HIPAA compliance checklist
- Security gaps identified
- Remediation recommendations
- Audit logging requirements

## Example Invocation
"Use hipaa-compliance to review the patient vitals API for HIPAA violations"

## Validation Checks
- ✅ PHI encrypted at rest?
- ✅ PHI encrypted in transit?
- ✅ Access logged to audit trail?
- ✅ Minimum necessary access?
- ✅ Patient consent verified?
- ✅ Business Associate Agreement in place?
```

### **Step 5: Test Customization**

```bash
"Use product-architect to create user stories for patient registration"
# Expected: Healthcare-specific stories

"Use system-architect to design patient vital signs API with HIPAA compliance"
# Expected: HIPAA-compliant design

"Use hipaa-compliance to review the design"
# Expected: Compliance validation report
```

---

## Best Practices

### **DO:**
✅ Start with PROJECT_TEMPLATE.md configuration
✅ Document all customizations in dedicated file
✅ Test agents after each customization
✅ Keep generic agents as reference
✅ Version control all changes

### **DON'T:**
❌ Customize before understanding generic framework
❌ Remove generic examples (add domain-specific alongside)
❌ Hard-code domain terms in agent instructions
❌ Skip testing after customization
❌ Customize all agents at once (incremental is better)

---

## Rollback Strategy

If customization causes issues:

```bash
# Option 1: Git reset
git checkout .claude/agents/06-backend-dev.md

# Option 2: Keep both versions
cp .claude/agents/06-backend-dev.md .claude/agents/06-backend-dev.CUSTOM.md
git checkout .claude/agents/06-backend-dev.md

# Option 3: Branch strategy
git checkout -b healthcare-customization
# Make customizations
# If issues, switch back to main
git checkout main
```

---

## Sharing Customizations

If you create valuable domain-specific customizations:

1. **Document thoroughly**
2. **Test with multiple projects**
3. **Create PR to framework repo** (with domain prefix)
4. **Share in community**

Example PR structure:
```
.claude/agents/healthcare/
├── 13-hipaa-compliance.md
├── 14-clinical-validator.md

.claude/skills/healthcare/
├── vital-signs-validator.md
├── prescription-manager.md
```

---

## Support & Community

**Questions about customization?**
- Review existing domain examples in `/examples` folder
- Check documentation at docs.claude.com
- Ask in community forums

**Ready to customize?** Start with Level 1 (configuration) and progress to Level 2/3 as needed.

**Customization Status:** Framework supports unlimited customization
