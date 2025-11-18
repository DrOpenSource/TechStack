/**
 * Mock Analytics Data
 * Dashboard metrics and analytics data
 */

export interface DashboardMetrics {
  overview: {
    totalRevenue: number;
    revenueChange: number;
    totalUsers: number;
    usersChange: number;
    totalOrders: number;
    ordersChange: number;
    conversionRate: number;
    conversionChange: number;
  };
  timeSeriesData: {
    revenue: Array<{ date: string; value: number }>;
    users: Array<{ date: string; value: number }>;
    orders: Array<{ date: string; value: number }>;
  };
  topProducts: Array<{
    id: string;
    name: string;
    sales: number;
    revenue: number;
    growth: number;
  }>;
  userDemographics: {
    byAge: Array<{ age: string; count: number }>;
    byLocation: Array<{ country: string; count: number }>;
    byDevice: Array<{ device: string; count: number; percentage: number }>;
  };
  trafficSources: Array<{
    source: string;
    visitors: number;
    percentage: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'order' | 'signup' | 'review' | 'support';
    description: string;
    timestamp: Date;
    user?: string;
  }>;
}

/**
 * Generate date labels for charts
 */
const generateDateLabels = (days: number): string[] => {
  const labels: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(date.toISOString().split('T')[0]);
  }
  return labels;
};

/**
 * Generate random data with trend
 */
const generateTrendData = (
  days: number,
  baseValue: number,
  variance: number,
  trend: 'up' | 'down' | 'stable' = 'up'
): number[] => {
  const data: number[] = [];
  let value = baseValue;

  for (let i = 0; i < days; i++) {
    // Add trend
    if (trend === 'up') {
      value += Math.random() * (variance * 0.3);
    } else if (trend === 'down') {
      value -= Math.random() * (variance * 0.3);
    }

    // Add random variance
    const randomVariance = (Math.random() - 0.5) * variance;
    data.push(Math.max(0, Math.round(value + randomVariance)));
  }

  return data;
};

/**
 * Mock Dashboard Metrics
 */
export const mockDashboardMetrics: DashboardMetrics = {
  overview: {
    totalRevenue: 125340,
    revenueChange: 12.5,
    totalUsers: 8924,
    usersChange: 8.3,
    totalOrders: 1547,
    ordersChange: -2.4,
    conversionRate: 3.2,
    conversionChange: 0.8,
  },

  timeSeriesData: {
    revenue: generateDateLabels(30).map((date, i) => ({
      date,
      value: generateTrendData(30, 3500, 800, 'up')[i],
    })),
    users: generateDateLabels(30).map((date, i) => ({
      date,
      value: generateTrendData(30, 250, 60, 'up')[i],
    })),
    orders: generateDateLabels(30).map((date, i) => ({
      date,
      value: generateTrendData(30, 45, 15, 'stable')[i],
    })),
  },

  topProducts: [
    {
      id: 'prod-1',
      name: 'Wireless Headphones',
      sales: 324,
      revenue: 97176,
      growth: 18.5,
    },
    {
      id: 'prod-2',
      name: 'Smart Fitness Watch',
      sales: 289,
      revenue: 72247.11,
      growth: 15.2,
    },
    {
      id: 'prod-4',
      name: 'Mechanical Keyboard',
      sales: 267,
      revenue: 42717.33,
      growth: 22.8,
    },
    {
      id: 'prod-3',
      name: 'Ergonomic Office Chair',
      sales: 156,
      revenue: 62398.44,
      growth: -5.3,
    },
    {
      id: 'prod-5',
      name: 'Bluetooth Speaker',
      sales: 402,
      revenue: 36175.98,
      growth: 31.4,
    },
  ],

  userDemographics: {
    byAge: [
      { age: '18-24', count: 1245 },
      { age: '25-34', count: 3421 },
      { age: '35-44', count: 2156 },
      { age: '45-54', count: 1342 },
      { age: '55+', count: 760 },
    ],
    byLocation: [
      { country: 'United States', count: 4562 },
      { country: 'United Kingdom', count: 1234 },
      { country: 'Canada', count: 987 },
      { country: 'Germany', count: 845 },
      { country: 'Australia', count: 654 },
      { country: 'Others', count: 642 },
    ],
    byDevice: [
      { device: 'Desktop', count: 4523, percentage: 50.7 },
      { device: 'Mobile', count: 3589, percentage: 40.2 },
      { device: 'Tablet', count: 812, percentage: 9.1 },
    ],
  },

  trafficSources: [
    { source: 'Organic Search', visitors: 3821, percentage: 42.8 },
    { source: 'Direct', visitors: 2456, percentage: 27.5 },
    { source: 'Social Media', visitors: 1534, percentage: 17.2 },
    { source: 'Referral', visitors: 789, percentage: 8.8 },
    { source: 'Email', visitors: 324, percentage: 3.7 },
  ],

  recentActivity: [
    {
      id: 'act-1',
      type: 'order',
      description: 'New order #ORD-2024-1547',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      user: 'John Doe',
    },
    {
      id: 'act-2',
      type: 'signup',
      description: 'New user registration',
      timestamp: new Date(Date.now() - 1000 * 60 * 12),
      user: 'Sarah Smith',
    },
    {
      id: 'act-3',
      type: 'review',
      description: 'New 5-star review on Wireless Headphones',
      timestamp: new Date(Date.now() - 1000 * 60 * 23),
      user: 'Mike Johnson',
    },
    {
      id: 'act-4',
      type: 'order',
      description: 'New order #ORD-2024-1546',
      timestamp: new Date(Date.now() - 1000 * 60 * 34),
      user: 'Emma Wilson',
    },
    {
      id: 'act-5',
      type: 'support',
      description: 'New support ticket #SUP-892',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      user: 'Alex Brown',
    },
  ],
};

/**
 * Website Analytics
 */
export interface WebsiteAnalytics {
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number; // seconds
  bounceRate: number; // percentage
  topPages: Array<{
    path: string;
    views: number;
    avgTime: number;
    bounceRate: number;
  }>;
  hourlyTraffic: Array<{
    hour: number;
    visitors: number;
  }>;
}

export const mockWebsiteAnalytics: WebsiteAnalytics = {
  pageViews: 45678,
  uniqueVisitors: 12345,
  avgSessionDuration: 245, // 4 min 5 sec
  bounceRate: 42.3,

  topPages: [
    { path: '/', views: 12456, avgTime: 132, bounceRate: 38.5 },
    { path: '/products', views: 8932, avgTime: 201, bounceRate: 35.2 },
    { path: '/about', views: 3421, avgTime: 89, bounceRate: 56.7 },
    { path: '/contact', views: 2145, avgTime: 67, bounceRate: 62.3 },
    { path: '/blog', views: 1876, avgTime: 312, bounceRate: 28.9 },
  ],

  hourlyTraffic: Array.from({ length: 24 }, (_, hour) => ({
    hour,
    visitors: Math.round(
      200 + Math.sin((hour - 6) / 4) * 150 + Math.random() * 50
    ),
  })),
};

/**
 * Sales Analytics
 */
export interface SalesAnalytics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  returningCustomerRate: number;
  topSellingCategories: Array<{
    category: string;
    revenue: number;
    orders: number;
    growth: number;
  }>;
  monthlySales: Array<{
    month: string;
    revenue: number;
    orders: number;
    customers: number;
  }>;
  salesByRegion: Array<{
    region: string;
    revenue: number;
    percentage: number;
  }>;
}

export const mockSalesAnalytics: SalesAnalytics = {
  totalRevenue: 125340,
  totalOrders: 1547,
  averageOrderValue: 81.02,
  returningCustomerRate: 34.5,

  topSellingCategories: [
    {
      category: 'Electronics',
      revenue: 87456,
      orders: 1024,
      growth: 16.8,
    },
    {
      category: 'Furniture',
      revenue: 37884,
      orders: 523,
      growth: 8.2,
    },
  ],

  monthlySales: [
    { month: 'Jan', revenue: 98450, orders: 1234, customers: 856 },
    { month: 'Feb', revenue: 102340, orders: 1289, customers: 892 },
    { month: 'Mar', revenue: 110230, orders: 1367, customers: 945 },
    { month: 'Apr', revenue: 105670, orders: 1312, customers: 912 },
    { month: 'May', revenue: 115890, orders: 1425, customers: 987 },
    { month: 'Jun', revenue: 120450, orders: 1478, customers: 1023 },
    { month: 'Jul', revenue: 118920, orders: 1456, customers: 1008 },
    { month: 'Aug', revenue: 122340, orders: 1489, customers: 1034 },
    { month: 'Sep', revenue: 119870, orders: 1467, customers: 1015 },
    { month: 'Oct', revenue: 123560, orders: 1501, customers: 1042 },
    { month: 'Nov', revenue: 125340, orders: 1547, customers: 1067 },
  ],

  salesByRegion: [
    { region: 'North America', revenue: 62670, percentage: 50.0 },
    { region: 'Europe', revenue: 37602, percentage: 30.0 },
    { region: 'Asia Pacific', revenue: 18801, percentage: 15.0 },
    { region: 'Others', revenue: 6267, percentage: 5.0 },
  ],
};

/**
 * Customer Analytics
 */
export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  activeCustomers: number;
  customerLifetimeValue: number;
  customerRetentionRate: number;
  customerSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    avgOrderValue: number;
  }>;
  customerSatisfaction: {
    score: number; // out of 5
    responseRate: number;
    nps: number; // Net Promoter Score
  };
}

export const mockCustomerAnalytics: CustomerAnalytics = {
  totalCustomers: 8924,
  newCustomers: 742,
  activeCustomers: 3456,
  customerLifetimeValue: 245.67,
  customerRetentionRate: 68.5,

  customerSegments: [
    {
      segment: 'VIP Customers',
      count: 245,
      revenue: 45678,
      avgOrderValue: 186.44,
    },
    {
      segment: 'Regular Customers',
      count: 3211,
      revenue: 62340,
      avgOrderValue: 94.12,
    },
    {
      segment: 'Occasional Buyers',
      count: 4256,
      revenue: 15234,
      avgOrderValue: 42.56,
    },
    {
      segment: 'One-time Buyers',
      count: 1212,
      revenue: 2088,
      avgOrderValue: 32.45,
    },
  ],

  customerSatisfaction: {
    score: 4.6,
    responseRate: 78.5,
    nps: 62,
  },
};

/**
 * Performance Metrics
 */
export interface PerformanceMetrics {
  apiResponseTime: number; // ms
  pageLoadTime: number; // ms
  errorRate: number; // percentage
  uptime: number; // percentage
  requestsPerSecond: number;
  activeUsers: number;
  systemHealth: Array<{
    metric: string;
    status: 'healthy' | 'warning' | 'critical';
    value: string;
  }>;
}

export const mockPerformanceMetrics: PerformanceMetrics = {
  apiResponseTime: 145,
  pageLoadTime: 1234,
  errorRate: 0.23,
  uptime: 99.98,
  requestsPerSecond: 342,
  activeUsers: 1245,

  systemHealth: [
    { metric: 'Database', status: 'healthy', value: '98% capacity' },
    { metric: 'Cache', status: 'healthy', value: '45% hit rate' },
    { metric: 'Storage', status: 'warning', value: '78% used' },
    { metric: 'CPU', status: 'healthy', value: '42% usage' },
    { metric: 'Memory', status: 'healthy', value: '56% usage' },
  ],
};

/**
 * Get metrics for date range
 */
export const getMetricsForDateRange = (
  startDate: Date,
  endDate: Date
): Partial<DashboardMetrics> => {
  // In a real implementation, this would filter data by date range
  // For mock, we return the same data
  return mockDashboardMetrics;
};

/**
 * Get comparison data (current vs previous period)
 */
export interface ComparisonData {
  current: {
    revenue: number;
    users: number;
    orders: number;
  };
  previous: {
    revenue: number;
    users: number;
    orders: number;
  };
  change: {
    revenue: number;
    users: number;
    orders: number;
  };
}

export const getComparisonData = (): ComparisonData => {
  return {
    current: {
      revenue: 125340,
      users: 8924,
      orders: 1547,
    },
    previous: {
      revenue: 111450,
      users: 8234,
      orders: 1585,
    },
    change: {
      revenue: 12.5,
      users: 8.3,
      orders: -2.4,
    },
  };
};
