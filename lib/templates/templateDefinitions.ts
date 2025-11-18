/**
 * Template Definitions
 * Pre-built project templates for quick start
 */

import type { ProjectTemplate } from '@/types/templates';

export const TEMPLATES: ProjectTemplate[] = [
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracker',
    description: 'Track workouts, nutrition, and progress',
    longDescription: 'A comprehensive fitness tracking application with workout logging, nutrition tracking, progress visualization, and goal setting features.',
    thumbnail: '/templates/fitness.png',
    category: 'Health',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Recharts', 'Zustand'],
    components: [
      {
        name: 'WorkoutList',
        description: 'Display and manage workout sessions',
        path: '/components/fitness/WorkoutList.tsx',
      },
      {
        name: 'NutritionLog',
        description: 'Track daily nutrition intake',
        path: '/components/fitness/NutritionLog.tsx',
      },
      {
        name: 'ProgressChart',
        description: 'Visualize fitness progress over time',
        path: '/components/fitness/ProgressChart.tsx',
      },
    ],
    complexity: 'Beginner',
    estimatedTime: '2-3 hours',
    features: [
      'Workout logging with sets and reps',
      'Nutrition tracking with calorie counter',
      'Progress charts and analytics',
      'Goal setting and tracking',
      'Exercise library with instructions',
    ],
  },
  {
    id: 'ecommerce-dashboard',
    name: 'E-commerce Dashboard',
    description: 'Sales analytics and product management',
    longDescription: 'Admin dashboard for e-commerce businesses with sales analytics, inventory management, order tracking, and customer insights.',
    thumbnail: '/templates/ecommerce.png',
    category: 'Business',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Recharts', 'React Query'],
    components: [
      {
        name: 'SalesChart',
        description: 'Revenue and sales analytics',
        path: '/components/ecommerce/SalesChart.tsx',
      },
      {
        name: 'ProductGrid',
        description: 'Product catalog management',
        path: '/components/ecommerce/ProductGrid.tsx',
      },
      {
        name: 'OrderTable',
        description: 'Order management interface',
        path: '/components/ecommerce/OrderTable.tsx',
      },
    ],
    complexity: 'Intermediate',
    estimatedTime: '4-6 hours',
    features: [
      'Real-time sales analytics',
      'Product inventory management',
      'Order tracking and fulfillment',
      'Customer insights dashboard',
      'Revenue forecasting',
    ],
  },
  {
    id: 'social-feed',
    name: 'Social Media Feed',
    description: 'Instagram-style social feed with posts and stories',
    longDescription: 'A modern social media application with infinite scroll feed, story carousel, likes, comments, and user profiles.',
    thumbnail: '/templates/social.png',
    category: 'Social',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    components: [
      {
        name: 'PostFeed',
        description: 'Infinite scroll feed of posts',
        path: '/components/social/PostFeed.tsx',
      },
      {
        name: 'StoryCarousel',
        description: 'Story viewer with auto-advance',
        path: '/components/social/StoryCarousel.tsx',
      },
      {
        name: 'UserProfile',
        description: 'User profile with posts grid',
        path: '/components/social/UserProfile.tsx',
      },
    ],
    complexity: 'Intermediate',
    estimatedTime: '3-5 hours',
    features: [
      'Infinite scroll feed',
      'Story carousel with auto-advance',
      'Like and comment functionality',
      'User profiles and followers',
      'Image upload and filters',
    ],
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Kanban board for project management',
    longDescription: 'Agile project management tool with drag-and-drop kanban board, task assignments, deadlines, and team collaboration features.',
    thumbnail: '/templates/tasks.png',
    category: 'Productivity',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Zustand'],
    components: [
      {
        name: 'KanbanBoard',
        description: 'Drag-and-drop task board',
        path: '/components/tasks/KanbanBoard.tsx',
      },
      {
        name: 'TaskCard',
        description: 'Individual task with details',
        path: '/components/tasks/TaskCard.tsx',
      },
      {
        name: 'TeamMembers',
        description: 'Team member management',
        path: '/components/tasks/TeamMembers.tsx',
      },
    ],
    complexity: 'Beginner',
    estimatedTime: '2-4 hours',
    features: [
      'Drag-and-drop kanban board',
      'Task creation and assignment',
      'Deadline tracking',
      'Team collaboration',
      'Project milestones',
    ],
  },
  {
    id: 'analytics-dashboard',
    name: 'Analytics Dashboard',
    description: 'Data visualization and metrics tracking',
    longDescription: 'Comprehensive analytics platform with real-time metrics, custom charts, KPI tracking, and data export capabilities.',
    thumbnail: '/templates/analytics.png',
    category: 'Dashboard',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Recharts'],
    components: [
      {
        name: 'MetricsGrid',
        description: 'KPI cards with trends',
        path: '/components/analytics/MetricsGrid.tsx',
      },
      {
        name: 'ChartGallery',
        description: 'Multiple chart types',
        path: '/components/analytics/ChartGallery.tsx',
      },
      {
        name: 'DataTable',
        description: 'Sortable data table',
        path: '/components/analytics/DataTable.tsx',
      },
    ],
    complexity: 'Advanced',
    estimatedTime: '5-8 hours',
    features: [
      'Real-time metrics tracking',
      'Multiple chart types',
      'Custom date ranges',
      'Data filtering and sorting',
      'CSV/PDF export',
    ],
  },
  {
    id: 'restaurant-menu',
    name: 'Restaurant Menu',
    description: 'Digital menu with ordering system',
    longDescription: 'Modern restaurant ordering system with digital menu, cart management, order customization, and payment integration.',
    thumbnail: '/templates/restaurant.png',
    category: 'E-commerce',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Zustand'],
    components: [
      {
        name: 'MenuGrid',
        description: 'Food items with images',
        path: '/components/restaurant/MenuGrid.tsx',
      },
      {
        name: 'CartDrawer',
        description: 'Shopping cart sidebar',
        path: '/components/restaurant/CartDrawer.tsx',
      },
      {
        name: 'OrderSummary',
        description: 'Order review and checkout',
        path: '/components/restaurant/OrderSummary.tsx',
      },
    ],
    complexity: 'Beginner',
    estimatedTime: '3-4 hours',
    features: [
      'Digital menu with categories',
      'Add to cart functionality',
      'Order customization',
      'Cart management',
      'Payment integration ready',
    ],
  },
  {
    id: 'learning-platform',
    name: 'Learning Platform',
    description: 'Online courses with video lessons',
    longDescription: 'Educational platform with course catalog, video player, progress tracking, quizzes, and certificates.',
    thumbnail: '/templates/learning.png',
    category: 'Education',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Zustand'],
    components: [
      {
        name: 'CourseCatalog',
        description: 'Browse available courses',
        path: '/components/learning/CourseCatalog.tsx',
      },
      {
        name: 'VideoPlayer',
        description: 'Lesson video player',
        path: '/components/learning/VideoPlayer.tsx',
      },
      {
        name: 'ProgressTracker',
        description: 'Course completion tracking',
        path: '/components/learning/ProgressTracker.tsx',
      },
    ],
    complexity: 'Intermediate',
    estimatedTime: '5-7 hours',
    features: [
      'Course catalog and search',
      'Video lesson player',
      'Progress tracking',
      'Quizzes and assessments',
      'Certificate generation',
    ],
  },
  {
    id: 'music-player',
    name: 'Music Player',
    description: 'Spotify-like music streaming app',
    longDescription: 'Modern music player with playlist management, audio controls, album artwork, and search functionality.',
    thumbnail: '/templates/music.png',
    category: 'Entertainment',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Framer Motion'],
    components: [
      {
        name: 'MusicPlayer',
        description: 'Audio player controls',
        path: '/components/music/MusicPlayer.tsx',
      },
      {
        name: 'PlaylistView',
        description: 'Playlist management',
        path: '/components/music/PlaylistView.tsx',
      },
      {
        name: 'AlbumGallery',
        description: 'Browse albums and artists',
        path: '/components/music/AlbumGallery.tsx',
      },
    ],
    complexity: 'Advanced',
    estimatedTime: '6-8 hours',
    features: [
      'Audio playback controls',
      'Playlist creation and management',
      'Search and filter',
      'Album artwork display',
      'Queue management',
    ],
  },
  {
    id: 'weather-app',
    name: 'Weather App',
    description: 'Current weather and forecast',
    longDescription: 'Beautiful weather application with current conditions, hourly and daily forecasts, weather maps, and location search.',
    thumbnail: '/templates/weather.png',
    category: 'Productivity',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Recharts'],
    components: [
      {
        name: 'CurrentWeather',
        description: 'Current conditions display',
        path: '/components/weather/CurrentWeather.tsx',
      },
      {
        name: 'ForecastCard',
        description: 'Daily forecast cards',
        path: '/components/weather/ForecastCard.tsx',
      },
      {
        name: 'WeatherMap',
        description: 'Interactive weather map',
        path: '/components/weather/WeatherMap.tsx',
      },
    ],
    complexity: 'Beginner',
    estimatedTime: '2-3 hours',
    features: [
      'Current weather conditions',
      'Hourly and daily forecasts',
      'Location search',
      'Weather maps',
      'Severe weather alerts',
    ],
  },
  {
    id: 'blog-platform',
    name: 'Blog Platform',
    description: 'Personal blog with rich text editor',
    longDescription: 'Modern blogging platform with markdown editor, syntax highlighting, categories, tags, and SEO optimization.',
    thumbnail: '/templates/blog.png',
    category: 'Social',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
    components: [
      {
        name: 'PostEditor',
        description: 'Rich text markdown editor',
        path: '/components/blog/PostEditor.tsx',
      },
      {
        name: 'PostList',
        description: 'Blog post listing',
        path: '/components/blog/PostList.tsx',
      },
      {
        name: 'PostView',
        description: 'Single post display',
        path: '/components/blog/PostView.tsx',
      },
    ],
    complexity: 'Intermediate',
    estimatedTime: '4-6 hours',
    features: [
      'Markdown editor',
      'Syntax highlighting',
      'Categories and tags',
      'SEO optimization',
      'Comment system',
    ],
  },
  {
    id: 'blank',
    name: 'Start from Scratch',
    description: 'Empty project with basic setup',
    longDescription: 'Start with a clean slate. Includes basic Next.js setup with TypeScript, TailwindCSS, and essential utilities.',
    thumbnail: '/templates/blank.png',
    category: 'Dashboard',
    techStack: ['Next.js', 'React', 'TypeScript', 'TailwindCSS'],
    components: [],
    complexity: 'Beginner',
    estimatedTime: '1-2 hours',
    features: [
      'Clean Next.js setup',
      'TypeScript configured',
      'TailwindCSS ready',
      'Basic routing structure',
      'Essential utilities',
    ],
  },
];

export const TEMPLATE_CATEGORIES = [
  'All',
  'Health',
  'Business',
  'Social',
  'Dashboard',
  'E-commerce',
  'Education',
  'Entertainment',
  'Productivity',
] as const;

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  if (category === 'All') {
    return TEMPLATES;
  }
  return TEMPLATES.filter(template => template.category === category);
}

export function searchTemplates(query: string): ProjectTemplate[] {
  const lowerQuery = query.toLowerCase();
  return TEMPLATES.filter(
    template =>
      template.name.toLowerCase().includes(lowerQuery) ||
      template.description.toLowerCase().includes(lowerQuery) ||
      template.category.toLowerCase().includes(lowerQuery)
  );
}
