# 📈 Chart Builder Skill

**Category:** Frontend
**Purpose:** Create data visualizations with Recharts

---

## 🎯 What This Skill Does

Builds interactive, responsive charts for displaying progress trends, metrics, and analytics using Recharts library.

---

## 📝 Implementation

```typescript
// components/charts/ProgressChart.tsx

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

interface DataPoint {
  period: number;
  value: number;
  date: string;
}

interface ProgressChartProps {
  data: DataPoint[];
  targetValue?: number;
  valueLabel?: string;
  periodLabel?: string;
}

export function ProgressChart({
  data,
  targetValue,
  valueLabel = 'Value',
  periodLabel = 'Period',
}: ProgressChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

        <XAxis
          dataKey="period"
          label={{ value: periodLabel, position: 'insideBottom', offset: -5 }}
          stroke="#6b7280"
        />

        <YAxis
          label={{ value: valueLabel, angle: -90, position: 'insideLeft' }}
          stroke="#6b7280"
          domain={['dataMin - 5', 'dataMax + 5']}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
          }}
          formatter={(value: number) => [`${value.toFixed(1)}`, valueLabel]}
          labelFormatter={(period) => `${periodLabel} ${period}`}
        />

        <Area
          type="monotone"
          dataKey="value"
          stroke="#3b82f6"
          strokeWidth={3}
          fill="url(#valueGradient)"
          dot={{ fill: '#3b82f6', r: 5 }}
          activeDot={{ r: 7 }}
        />

        {/* Target value line */}
        {targetValue && (
          <Line
            type="monotone"
            dataKey={() => targetValue}
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

- **Line Chart** - Progress tracking over time
- **Bar Chart** - Comparative metrics
- **Progress Ring** - Goal completion percentage
- **Stacked Bar** - Multi-category breakdown

---

**Used By:** frontend-dev, report-generator
