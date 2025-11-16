# 📈 Chart Builder Skill

**Category:** Frontend
**Purpose:** Create data visualizations with Recharts

---

## 🎯 What This Skill Does

Builds interactive, responsive charts for displaying member progress, weight trends, and analytics using Recharts library.

---

## 📝 Implementation

```typescript
// components/charts/WeightProgressChart.tsx

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

interface WeightDataPoint {
  week: number;
  weight: number;
  date: string;
}

interface WeightProgressChartProps {
  data: WeightDataPoint[];
  targetWeight?: number;
}

export function WeightProgressChart({
  data,
  targetWeight,
}: WeightProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis
          dataKey="week"
          label={{ value: 'Week', position: 'insideBottom', offset: -5 }}
          stroke="#6b7280"
        />

        <YAxis
          label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
          stroke="#6b7280"
          domain={['dataMin - 5', 'dataMax + 5']}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`${value.toFixed(1)} kg`, 'Weight']}
          labelFormatter={(week) => `Week ${week}`}
        />

        <Area
          type="monotone"
          dataKey="weight"
          stroke="#3b82f6"
          strokeWidth={3}
          fill="url(#weightGradient)"
          dot={{ fill: '#3b82f6', r: 5 }}
          activeDot={{ r: 7 }}
        />

        {/* Target weight line */}
        {targetWeight && (
          <Line
            type="monotone"
            dataKey={() => targetWeight}
            stroke="#10b981"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  );
}
```

---

## ✅ Chart Types Available

- **Line Chart** - Weight progress over time
- **Bar Chart** - Weekly protein intake
- **Progress Ring** - Goal completion percentage
- **Stacked Bar** - Macro breakdown

---

**Used By:** frontend-dev, report-generator
