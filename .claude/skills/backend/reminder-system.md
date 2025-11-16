# ⏰ Reminder System Skill

**Category:** Backend
**Purpose:** Implement scheduled reminders for water, meals, protein, and weigh-ins

---

## 🎯 What This Skill Does

Creates automated reminder system:
- Daily water reminders (customizable)
- Meal reminders (breakfast, lunch, dinner)
- Protein tracking reminders
- Weekly weigh-in reminders
- Uses Vercel Cron or external scheduler

---

## 📝 Implementation

### **1. Cron Configuration**

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/hourly-reminders",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/daily-cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### **2. Reminder Endpoint**

```typescript
// api/cron/hourly-reminders/route.ts

export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();

  // Get active members with reminder preferences
  const { data: members } = await supabase
    .from('members')
    .select('id, phone, name, reminder_preferences')
    .eq('is_active', true);

  for (const member of members || []) {
    const prefs = member.reminder_preferences || {};

    // Water reminders
    if (prefs.water_enabled && prefs.water_times?.includes(currentHour)) {
      await sendNotification(member.id, {
        type: 'water',
        title: 'Hydration Time! 💧',
        body: 'Time to drink water. Stay hydrated!',
      });
    }

    // Meal reminders
    if (currentHour === 8 && prefs.breakfast) {
      await sendNotification(member.id, {
        type: 'meal',
        title: 'Breakfast Time! 🍳',
        body: 'Don\'t skip breakfast!',
      });
    }

    // Weekly weigh-in (Monday 9 AM)
    if (currentDay === 1 && currentHour === 9) {
      await sendNotification(member.id, {
        type: 'weigh_in',
        title: 'Weekly Check-In ⚖️',
        body: 'Time to log your weight for this week!',
      });
    }
  }

  return Response.json({ success: true });
}
```

---

## ✅ Reminder Types

- 💧 **Water** - Hourly (customizable)
- 🍳 **Meals** - Breakfast, Lunch, Dinner
- 🥩 **Protein** - Evening reminder to log protein
- ⚖️ **Weigh-In** - Weekly (Monday mornings)

---

**Used By:** backend-dev, integration-specialist
