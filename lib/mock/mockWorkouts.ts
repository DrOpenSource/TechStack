/**
 * Mock Workouts Data
 * Fitness domain data for workout tracking apps
 */

export interface Exercise {
  id: string;
  name: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'sports';
  muscleGroup: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  instructions?: string[];
  videoUrl?: string;
  calories: number; // per 30 min
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: Date;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: number;
    weight?: number;
    duration?: number; // minutes
    distance?: number; // km
    notes?: string;
  }>;
  totalDuration: number;
  totalCalories: number;
  mood?: 'energized' | 'tired' | 'normal' | 'sore';
  notes?: string;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  goal: 'strength' | 'weight-loss' | 'endurance' | 'flexibility' | 'general-fitness';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  daysPerWeek: number;
  workouts: Array<{
    day: number;
    name: string;
    exercises: Array<{
      exerciseId: string;
      sets: number;
      reps: number;
      rest: number; // seconds
    }>;
  }>;
}

/**
 * Exercise Library
 */
export const mockExercises: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Bench Press',
    category: 'strength',
    muscleGroup: ['chest', 'triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    difficulty: 'intermediate',
    description: 'Classic chest exercise for building upper body strength',
    instructions: [
      'Lie flat on bench with feet on floor',
      'Grip barbell slightly wider than shoulder width',
      'Lower bar to chest with control',
      'Press bar up to starting position',
    ],
    calories: 200,
  },
  {
    id: 'ex-2',
    name: 'Squats',
    category: 'strength',
    muscleGroup: ['quads', 'glutes', 'hamstrings'],
    equipment: ['barbell', 'squat rack'],
    difficulty: 'intermediate',
    description: 'Fundamental lower body compound exercise',
    instructions: [
      'Position barbell on upper back',
      'Stand with feet shoulder-width apart',
      'Lower body by bending knees and hips',
      'Push through heels to return to standing',
    ],
    calories: 250,
  },
  {
    id: 'ex-3',
    name: 'Deadlift',
    category: 'strength',
    muscleGroup: ['back', 'glutes', 'hamstrings', 'core'],
    equipment: ['barbell'],
    difficulty: 'advanced',
    description: 'Full-body compound lift targeting posterior chain',
    instructions: [
      'Stand with feet hip-width, barbell over mid-foot',
      'Grip bar just outside legs',
      'Keep back straight, lift by extending hips and knees',
      'Lower bar with control',
    ],
    calories: 280,
  },
  {
    id: 'ex-4',
    name: 'Running',
    category: 'cardio',
    muscleGroup: ['legs', 'cardiovascular'],
    equipment: ['none'],
    difficulty: 'beginner',
    description: 'Cardiovascular exercise for endurance and calorie burn',
    calories: 400,
  },
  {
    id: 'ex-5',
    name: 'Pull-ups',
    category: 'strength',
    muscleGroup: ['back', 'biceps', 'shoulders'],
    equipment: ['pull-up bar'],
    difficulty: 'intermediate',
    description: 'Bodyweight exercise for upper body pulling strength',
    instructions: [
      'Hang from bar with hands shoulder-width apart',
      'Pull body up until chin clears bar',
      'Lower with control',
    ],
    calories: 220,
  },
  {
    id: 'ex-6',
    name: 'Yoga Flow',
    category: 'flexibility',
    muscleGroup: ['full body'],
    equipment: ['yoga mat'],
    difficulty: 'beginner',
    description: 'Flexibility and mindfulness practice',
    calories: 180,
  },
  {
    id: 'ex-7',
    name: 'Cycling',
    category: 'cardio',
    muscleGroup: ['legs', 'cardiovascular'],
    equipment: ['bicycle'],
    difficulty: 'beginner',
    description: 'Low-impact cardio exercise',
    calories: 350,
  },
  {
    id: 'ex-8',
    name: 'Push-ups',
    category: 'strength',
    muscleGroup: ['chest', 'triceps', 'shoulders', 'core'],
    equipment: ['none'],
    difficulty: 'beginner',
    description: 'Bodyweight exercise for upper body and core',
    instructions: [
      'Start in plank position',
      'Lower body until chest nearly touches floor',
      'Push back up to starting position',
    ],
    calories: 150,
  },
];

/**
 * Workout Logs
 */
const generateWorkoutDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

export const mockWorkoutLogs: WorkoutLog[] = [
  {
    id: 'log-1',
    userId: 'demo-user-id',
    date: generateWorkoutDate(0),
    exercises: [
      {
        exerciseId: 'ex-1',
        exerciseName: 'Bench Press',
        sets: 4,
        reps: 10,
        weight: 80,
        notes: 'Felt strong today',
      },
      {
        exerciseId: 'ex-5',
        exerciseName: 'Pull-ups',
        sets: 3,
        reps: 8,
      },
      {
        exerciseId: 'ex-8',
        exerciseName: 'Push-ups',
        sets: 3,
        reps: 15,
      },
    ],
    totalDuration: 60,
    totalCalories: 420,
    mood: 'energized',
    notes: 'Great workout, increasing weight next time',
  },
  {
    id: 'log-2',
    userId: 'demo-user-id',
    date: generateWorkoutDate(1),
    exercises: [
      {
        exerciseId: 'ex-2',
        exerciseName: 'Squats',
        sets: 4,
        reps: 12,
        weight: 100,
      },
      {
        exerciseId: 'ex-3',
        exerciseName: 'Deadlift',
        sets: 3,
        reps: 8,
        weight: 120,
      },
    ],
    totalDuration: 50,
    totalCalories: 380,
    mood: 'normal',
  },
  {
    id: 'log-3',
    userId: 'demo-user-id',
    date: generateWorkoutDate(2),
    exercises: [
      {
        exerciseId: 'ex-4',
        exerciseName: 'Running',
        sets: 1,
        reps: 1,
        duration: 30,
        distance: 5.2,
      },
    ],
    totalDuration: 30,
    totalCalories: 400,
    mood: 'energized',
    notes: 'Personal best on 5K!',
  },
  {
    id: 'log-4',
    userId: 'demo-user-id',
    date: generateWorkoutDate(4),
    exercises: [
      {
        exerciseId: 'ex-6',
        exerciseName: 'Yoga Flow',
        sets: 1,
        reps: 1,
        duration: 45,
      },
    ],
    totalDuration: 45,
    totalCalories: 270,
    mood: 'normal',
  },
];

/**
 * Workout Plans
 */
export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'plan-1',
    name: 'Beginner Full Body',
    description: '3-day per week full body workout for beginners',
    goal: 'general-fitness',
    difficulty: 'beginner',
    durationWeeks: 8,
    daysPerWeek: 3,
    workouts: [
      {
        day: 1,
        name: 'Full Body A',
        exercises: [
          { exerciseId: 'ex-2', sets: 3, reps: 10, rest: 90 },
          { exerciseId: 'ex-1', sets: 3, reps: 10, rest: 90 },
          { exerciseId: 'ex-5', sets: 3, reps: 8, rest: 120 },
        ],
      },
      {
        day: 2,
        name: 'Full Body B',
        exercises: [
          { exerciseId: 'ex-3', sets: 3, reps: 8, rest: 120 },
          { exerciseId: 'ex-8', sets: 3, reps: 12, rest: 60 },
          { exerciseId: 'ex-4', sets: 1, reps: 1, rest: 0 },
        ],
      },
      {
        day: 3,
        name: 'Full Body C',
        exercises: [
          { exerciseId: 'ex-2', sets: 3, reps: 12, rest: 90 },
          { exerciseId: 'ex-1', sets: 3, reps: 8, rest: 90 },
          { exerciseId: 'ex-6', sets: 1, reps: 1, rest: 0 },
        ],
      },
    ],
  },
  {
    id: 'plan-2',
    name: 'Weight Loss Program',
    description: 'High-intensity 5-day program for fat loss',
    goal: 'weight-loss',
    difficulty: 'intermediate',
    durationWeeks: 12,
    daysPerWeek: 5,
    workouts: [
      {
        day: 1,
        name: 'Cardio & Core',
        exercises: [
          { exerciseId: 'ex-4', sets: 1, reps: 1, rest: 0 },
          { exerciseId: 'ex-8', sets: 4, reps: 15, rest: 30 },
        ],
      },
      {
        day: 2,
        name: 'Lower Body',
        exercises: [
          { exerciseId: 'ex-2', sets: 4, reps: 15, rest: 60 },
          { exerciseId: 'ex-3', sets: 3, reps: 12, rest: 60 },
        ],
      },
      {
        day: 3,
        name: 'HIIT Cardio',
        exercises: [
          { exerciseId: 'ex-7', sets: 1, reps: 1, rest: 0 },
        ],
      },
      {
        day: 4,
        name: 'Upper Body',
        exercises: [
          { exerciseId: 'ex-1', sets: 4, reps: 12, rest: 60 },
          { exerciseId: 'ex-5', sets: 4, reps: 10, rest: 60 },
        ],
      },
      {
        day: 5,
        name: 'Active Recovery',
        exercises: [
          { exerciseId: 'ex-6', sets: 1, reps: 1, rest: 0 },
        ],
      },
    ],
  },
];

/**
 * Progress Data
 */
export interface ProgressEntry {
  id: string;
  userId: string;
  date: Date;
  weight?: number;
  bodyFat?: number;
  measurements?: {
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    legs?: number;
  };
  photos?: string[];
  notes?: string;
}

export const mockProgressEntries: ProgressEntry[] = Array.from({ length: 12 }, (_, i) => ({
  id: `progress-${i + 1}`,
  userId: 'demo-user-id',
  date: generateWorkoutDate(i * 7),
  weight: 75 - i * 0.5, // Progressive weight loss
  bodyFat: 18 - i * 0.3,
  measurements: {
    chest: 100,
    waist: 85 - i * 0.5,
    hips: 95,
    arms: 35,
    legs: 55,
  },
}));

/**
 * Workout Statistics
 */
export interface WorkoutStats {
  totalWorkouts: number;
  totalDuration: number;
  totalCalories: number;
  averageWorkoutsPerWeek: number;
  favoriteExercises: Array<{ name: string; count: number }>;
  weeklyProgress: Array<{ week: string; workouts: number; calories: number }>;
}

export const mockWorkoutStats: WorkoutStats = {
  totalWorkouts: 48,
  totalDuration: 2880, // minutes
  totalCalories: 18240,
  averageWorkoutsPerWeek: 4.2,
  favoriteExercises: [
    { name: 'Running', count: 15 },
    { name: 'Bench Press', count: 12 },
    { name: 'Squats', count: 12 },
  ],
  weeklyProgress: [
    { week: 'Week 1', workouts: 3, calories: 1200 },
    { week: 'Week 2', workouts: 4, calories: 1500 },
    { week: 'Week 3', workouts: 4, calories: 1600 },
    { week: 'Week 4', workouts: 5, calories: 1800 },
  ],
};

/**
 * Get exercise by ID
 */
export const getExerciseById = (id: string): Exercise | undefined => {
  return mockExercises.find(ex => ex.id === id);
};

/**
 * Get exercises by category
 */
export const getExercisesByCategory = (category: Exercise['category']): Exercise[] => {
  return mockExercises.filter(ex => ex.category === category);
};
