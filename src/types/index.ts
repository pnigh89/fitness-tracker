export interface Workout {
  id: string;
  name: string;
  description: string;
  duration: number; // in seconds
  caloriesBurned: number;
  exercises: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  equipment: EquipmentType;
  sets: Set[];
}

export interface Set {
  id: string;
  reps: number;
  weight: number;
  duration?: number; // in seconds, for timed exercises
  completed: boolean;
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  weight: number; // in pounds
  height: number; // in inches
  age: number;
  goals?: string;
}

export interface Progress {
  id: string;
  date: string;
  workoutId: string;
  completed: boolean;
  exercises: {
    id: string;
    sets: {
      id: string;
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
}

export interface WeeklySchedule {
  weekOffset: number;
  days: WorkoutDay[];
}

export interface WorkoutDay {
  date: Date;
  dayOfWeek: number;
  workoutId: string | null;
  isRestDay: boolean;
  isCompleted: boolean;
}

export type EquipmentType = 
  | 'None'
  | 'Body weight'
  | 'Weight vest 30lb'
  | '25lb dumbbell'
  | '25lb dumbbells'
  | 'Bench'
  | 'Chair'
  | 'Resistance band';
