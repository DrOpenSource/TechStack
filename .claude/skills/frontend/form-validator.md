# ✅ Form Validator Skill

**Category:** Frontend
**Purpose:** Client-side form validation with user-friendly error messages

---

## 🎯 What This Skill Does

Implements robust form validation:
- Real-time validation (on blur, on change, on submit)
- User-friendly error messages
- Multiple validation strategies
- Type-safe with TypeScript
- Accessible error announcements

---

## 📝 Validation Patterns

### **1. Using Zod (Recommended)**

```typescript
// lib/validations/userSchema.ts

import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),

  email: z
    .string()
    .email('Please enter a valid email address'),

  phone: z
    .string()
    .regex(/^\+91[6-9]\d{9}$/, 'Please enter a valid Indian mobile number'),

  age: z
    .number()
    .int('Age must be a whole number')
    .min(13, 'You must be at least 13 years old')
    .max(120, 'Please enter a valid age'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  confirmPassword: z.string(),

  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, 'You must agree to the terms and conditions'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type UserProfile = z.infer<typeof userProfileSchema>;
```

---

### **2. useForm Hook with Validation**

```typescript
// hooks/useForm.ts

import { useState, ChangeEvent, FormEvent } from 'react';
import { z } from 'zod';

interface UseFormOptions<T> {
  initialValues: T;
  validationSchema: z.ZodSchema<T>;
  onSubmit: (values: T) => Promise<void> | void;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validationSchema,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkboxes
    const newValue =
      type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    // Handle numbers
    const finalValue =
      type === 'number' ? (value === '' ? '' : Number(value)) : newValue;

    setValues((prev) => ({ ...prev, [name]: finalValue }));

    // Clear error on change
    if (errors[name as keyof T]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate single field
    try {
      validationSchema.parse(values);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldError = error.errors.find((err) => err.path[0] === name);
        if (fieldError) {
          setErrors((prev) => ({ ...prev, [name]: fieldError.message }));
        }
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate all fields
    try {
      const validatedData = validationSchema.parse(values);
      setErrors({});
      setIsSubmitting(true);

      await onSubmit(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, err) => ({ ...acc, [err.path[0]]: err.message }),
          {}
        );
        setErrors(formattedErrors);

        // Focus first error field
        const firstErrorField = error.errors[0]?.path[0];
        if (firstErrorField) {
          document.querySelector(`[name="${String(firstErrorField)}"]`)?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const getFieldError = (name: keyof T) => {
    return touched[name] && errors[name] ? errors[name] : undefined;
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    getFieldError,
    setFieldValue: (name: keyof T, value: any) =>
      setValues((prev) => ({ ...prev, [name]: value })),
  };
}
```

---

### **3. Form Component Example**

```typescript
// components/UserProfileForm.tsx

import { userProfileSchema, UserProfile } from '@/lib/validations/userSchema';
import { useForm } from '@/hooks/useForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export function UserProfileForm() {
  const { values, errors, handleChange, handleBlur, handleSubmit, isSubmitting, getFieldError } =
    useForm<UserProfile>({
      initialValues: {
        name: '',
        email: '',
        phone: '',
        age: 0,
        password: '',
        confirmPassword: '',
        agreeToTerms: false,
      },
      validationSchema: userProfileSchema,
      onSubmit: async (data) => {
        console.log('Form submitted:', data);
        // API call here
      },
    });

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto p-6">
      <Input
        label="Full Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('name')}
        required
      />

      <Input
        label="Email"
        type="email"
        name="email"
        value={values.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('email')}
        required
      />

      <Input
        label="Phone"
        type="tel"
        name="phone"
        value={values.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('phone')}
        placeholder="+919876543210"
        required
      />

      <Input
        label="Age"
        type="number"
        name="age"
        value={values.age}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('age')}
        required
      />

      <Input
        label="Password"
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('password')}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange}
        onBlur={handleBlur}
        error={getFieldError('confirmPassword')}
        required
      />

      <div className="flex items-start">
        <input
          type="checkbox"
          id="agreeToTerms"
          name="agreeToTerms"
          checked={values.agreeToTerms}
          onChange={handleChange}
          onBlur={handleBlur}
          className="mt-1 h-4 w-4 text-blue-600 rounded"
        />
        <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
          I agree to the terms and conditions
        </label>
        {getFieldError('agreeToTerms') && (
          <p className="ml-2 text-sm text-red-600">{getFieldError('agreeToTerms')}</p>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Create Account'}
      </Button>
    </form>
  );
}
```

---

### **4. Common Validation Rules**

```typescript
// lib/validations/rules.ts

import { z } from 'zod';

// Email
export const emailRule = z.string().email('Please enter a valid email address');

// Phone (Indian)
export const phoneIndiaRule = z
  .string()
  .regex(/^\+91[6-9]\d{9}$/, 'Please enter a valid Indian mobile number');

// Phone (International)
export const phoneInternationalRule = z
  .string()
  .regex(/^\+[1-9]\d{1,14}$/, 'Please enter a valid phone number with country code');

// Password (Strong)
export const strongPasswordRule = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

// URL
export const urlRule = z.string().url('Please enter a valid URL');

// Number range
export const ageRule = z
  .number()
  .int('Age must be a whole number')
  .min(13, 'You must be at least 13 years old')
  .max(120, 'Please enter a valid age');

// Weight (kg)
export const weightRule = z
  .number()
  .min(30, 'Weight must be at least 30 kg')
  .max(300, 'Weight must be less than 300 kg');

// Percentage
export const percentageRule = z
  .number()
  .min(0, 'Percentage must be at least 0')
  .max(100, 'Percentage must be at most 100');

// Credit Card (basic)
export const creditCardRule = z
  .string()
  .regex(/^\d{13,19}$/, 'Please enter a valid credit card number');

// Date (not in past)
export const futureDateRule = z
  .string()
  .refine(
    (date) => new Date(date) > new Date(),
    'Date must be in the future'
  );

// File size
export const fileSizeRule = (maxSizeMB: number) =>
  z
    .instanceof(File)
    .refine(
      (file) => file.size <= maxSizeMB * 1024 * 1024,
      `File size must be less than ${maxSizeMB}MB`
    );

// File type
export const fileTypeRule = (allowedTypes: string[]) =>
  z
    .instanceof(File)
    .refine(
      (file) => allowedTypes.includes(file.type),
      `File type must be one of: ${allowedTypes.join(', ')}`
    );
```

---

### **5. Async Validation (e.g., Check Email Availability)**

```typescript
// lib/validations/asyncValidation.ts

import { z } from 'zod';

export const checkEmailAvailability = async (email: string): Promise<boolean> => {
  const response = await fetch(`/api/check-email?email=${email}`);
  const data = await response.json();
  return data.available;
};

export const uniqueEmailRule = z
  .string()
  .email('Please enter a valid email address')
  .refine(
    async (email) => {
      const available = await checkEmailAvailability(email);
      return available;
    },
    { message: 'This email is already registered' }
  );
```

---

### **6. Custom Validation Messages**

```typescript
// Custom error messages
const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.code === z.ZodIssueCode.invalid_type) {
    if (issue.expected === 'string') {
      return { message: 'This field is required' };
    }
  }
  if (issue.code === z.ZodIssueCode.too_small) {
    if (issue.type === 'string') {
      return { message: `Minimum ${issue.minimum} characters required` };
    }
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);
```

---

## ✅ Validation Checklist

### **Required Fields**
- [ ] Clear visual indicator (asterisk, "required" label)
- [ ] Show error on submit if empty
- [ ] Prevent form submission

### **Real-Time Validation**
- [ ] On blur (after user leaves field)
- [ ] On change (for certain fields like password strength)
- [ ] On submit (always validate everything)

### **Error Messages**
- [ ] Clear and specific ("Email is required" not "Invalid input")
- [ ] Positioned near the field
- [ ] Announced to screen readers
- [ ] Red color with icon

### **Success Indicators**
- [ ] Green checkmark for valid fields (optional)
- [ ] Success message on form submission
- [ ] Clear form after successful submission

### **User Experience**
- [ ] Focus first error field on submit
- [ ] Scroll to first error
- [ ] Don't clear valid fields on error
- [ ] Show overall form status (X errors)

---

## 🎯 Best Practices

✅ **Progressive Validation**
- Don't show errors until user interacts with field
- Validate on blur, not on every keystroke (except password strength)
- Show success indicators sparingly

✅ **Clear Error Messages**
```
❌ "Invalid input"
✅ "Email must be in format: you@example.com"

❌ "Password error"
✅ "Password must be at least 8 characters and contain one uppercase letter"
```

✅ **Prevent Invalid Input**
```typescript
// For phone numbers, only allow digits
<input
  type="tel"
  inputMode="numeric"
  pattern="[0-9]*"
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  }}
/>
```

✅ **Accessible Validation**
```typescript
<input
  aria-invalid={error ? 'true' : 'false'}
  aria-describedby={error ? `${id}-error` : undefined}
/>
{error && (
  <p id={`${id}-error`} role="alert" className="text-red-600">
    {error}
  </p>
)}
```

---

## 📊 Validation Strategies

### **On Blur (Recommended)**
- Best for most fields
- Doesn't interrupt user
- Shows errors after field is complete

### **On Change**
- Password strength meters
- Character counters
- Real-time search

### **On Submit**
- Always validate on submit
- Final check before API call
- Show all errors at once

### **Async Validation**
- Email/username availability
- Debounce input (300-500ms)
- Show loading indicator
- Cache results

---

**Used By:** frontend-dev
**Dependencies:** zod (recommended) or yup, joi
**Best With:** component-library
