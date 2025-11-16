# ⏰ Scheduled Notification System Skill

**Category:** Backend
**Purpose:** Implement scheduled notifications and reminders

---

## 🎯 What This Skill Does

Creates automated notification system:
- Scheduled notifications (customizable timing)
- Recurring reminders (daily, weekly, custom intervals)
- User preference-based notifications
- Uses Vercel Cron or external scheduler

---

## 📝 Implementation

### **1. Cron Configuration**

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/scheduled-notifications",
      "schedule": "0 * * * *"
    },
    {
      "path": "/api/cron/daily-cleanup",
      "schedule": "0 2 * * *"
    }
  ]
}
```

### **2. Notification Endpoint**

```typescript
// api/cron/scheduled-notifications/route.ts

export async function GET(request: Request) {
  // Verify cron secret
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const currentHour = new Date().getHours();
  const currentDay = new Date().getDay();

  // Get active users with notification preferences
  const { data: users } = await supabase
    .from('users')
    .select('id, phone, name, notification_preferences')
    .eq('is_active', true);

  for (const user of users || []) {
    const prefs = user.notification_preferences || {};

    // Hourly notifications
    if (prefs.hourly_enabled && prefs.hourly_times?.includes(currentHour)) {
      await sendNotification(user.id, {
        type: 'hourly',
        title: prefs.hourly_title || 'Reminder',
        body: prefs.hourly_message || 'Time for your scheduled activity!',
      });
    }

    // Daily notifications
    if (currentHour === prefs.daily_time) {
      await sendNotification(user.id, {
        type: 'daily',
        title: prefs.daily_title || 'Daily Reminder',
        body: prefs.daily_message || 'Don\'t forget to complete your daily task!',
      });
    }

    // Weekly notifications (configurable day and time)
    if (currentDay === prefs.weekly_day && currentHour === prefs.weekly_time) {
      await sendNotification(user.id, {
        type: 'weekly',
        title: prefs.weekly_title || 'Weekly Check-In',
        body: prefs.weekly_message || 'Time for your weekly update!',
      });
    }
  }

  return Response.json({ success: true });
}
```

---

## ✅ Notification Types

- ⏰ **Scheduled** - Time-based notifications
- 🔄 **Recurring** - Daily, weekly, or custom intervals
- 🎯 **Event-based** - Triggered by specific conditions
- 📅 **Reminder** - User-configured reminders

---

**Used By:** backend-dev, integration-specialist
