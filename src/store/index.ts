import { create } from 'zustand';
import { Workout, User, Progress } from '../types';

export interface AppState {
  workouts: Workout[];
  user: User | null;
  progress: Progress[];
  activeWorkout: Workout | null;
  currentWeekOffset: number;
  
  // Actions
  setWorkouts: (workouts: Workout[]) => void;
  setUser: (user: User) => void;
  setProgress: (progress: Progress[]) => void;
  startWorkout: (workout: Workout) => void;
  endWorkout: () => void;
  setCurrentWeekOffset: (offset: number) => void;
}

// Helper function to generate unique IDs
const generateId = () => Math.random().toString(36).substring(2, 10);

export const useAppStore = create<AppState>((set) => ({
  workouts: [
    {
      id: 'upper-push',
      name: 'Upper Body Push',
      description: 'Focus on chest, shoulders, and triceps',
      duration: 3600, // 60 minutes
      caloriesBurned: 350,
      exercises: [
        {
          id: generateId(),
          name: 'Warm-Up: Dynamic Mobility',
          description: 'Dynamic stretches to warm up the upper body',
          equipment: 'None',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 300, notes: 'Arm circles, shoulder rolls, pushup position planks, etc.', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Push-Ups',
          description: 'Standard push-ups with proper form',
          equipment: 'Body weight',
          sets: [
            { id: generateId(), reps: 12, weight: 0, notes: 'Chest to ground, full lockout', completed: false },
            { id: generateId(), reps: 10, weight: 0, notes: 'Chest to ground, full lockout', completed: false },
            { id: generateId(), reps: 8, weight: 0, notes: 'Chest to ground, full lockout', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Weighted Push-Ups',
          description: 'Push-ups with weight vest for added resistance',
          equipment: 'Weight vest 30lb',
          sets: [
            { id: generateId(), reps: 8, weight: 30, notes: 'If too difficult, use weight for partial set', completed: false },
            { id: generateId(), reps: 8, weight: 30, notes: 'Rest 90 seconds between sets', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Dumbbell Overhead Press',
          description: 'Press weights overhead while standing',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 10, weight: 25, notes: 'Press directly overhead', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Rest 60-90 seconds between sets', completed: false },
            { id: generateId(), reps: 8, weight: 25, notes: 'Maintain core stability', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Dumbbell Lateral Raises',
          description: 'Raise weights to sides to target medial deltoids',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 12, weight: 25, notes: 'Raise to shoulder height', completed: false },
            { id: generateId(), reps: 12, weight: 25, notes: 'Keep slight bend in elbows', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Control the movement', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Diamond Push-Ups',
          description: 'Push-ups with hands close together forming a diamond shape',
          equipment: 'Body weight',
          sets: [
            { id: generateId(), reps: 10, weight: 0, notes: 'Keep elbows close to body', completed: false },
            { id: generateId(), reps: 8, weight: 0, notes: 'Focus on triceps', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Dumbbell Tricep Extensions',
          description: 'Overhead tricep extensions with dumbbell',
          equipment: '25lb dumbbell',
          sets: [
            { id: generateId(), reps: 12, weight: 25, notes: 'Hold with both hands', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Keep elbows pointing up', completed: false }
          ]
        }
      ],
    },
    {
      id: 'lower-body',
      name: 'Lower Body',
      description: 'Focus on quads, glutes, and hamstrings',
      duration: 3000, // 50 minutes
      caloriesBurned: 400,
      exercises: [
        {
          id: generateId(),
          name: 'Warm-Up: Dynamic Mobility',
          description: 'Dynamic stretches to warm up the lower body',
          equipment: 'None',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 300, notes: 'Leg swings, hip circles, bodyweight squats, etc.', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Goblet Squats',
          description: 'Squat while holding dumbbell at chest height',
          equipment: '25lb dumbbell',
          sets: [
            { id: generateId(), reps: 15, weight: 25, notes: 'Keep chest up, full depth', completed: false },
            { id: generateId(), reps: 15, weight: 25, notes: 'Keep core engaged', completed: false },
            { id: generateId(), reps: 12, weight: 25, notes: 'Drive through heels', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Weighted Lunges',
          description: 'Forward lunges with dumbbells',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 10, weight: 25, notes: '10 per leg', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: '10 per leg', completed: false },
            { id: generateId(), reps: 8, weight: 25, notes: '8 per leg', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Romanian Deadlifts',
          description: 'Hip-hinge movement targeting hamstrings',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 12, weight: 25, notes: 'Keep back flat', completed: false },
            { id: generateId(), reps: 12, weight: 25, notes: 'Feel stretch in hamstrings', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Hinge at hips', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Weighted Step-Ups',
          description: 'Step ups onto bench or stable platform with weights',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 10, weight: 25, notes: '10 per leg', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: '10 per leg', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Calf Raises',
          description: 'Standing calf raises with weights',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 15, weight: 25, notes: 'Full range of motion', completed: false },
            { id: generateId(), reps: 15, weight: 25, notes: 'Full range of motion', completed: false },
            { id: generateId(), reps: 15, weight: 25, notes: 'Slow and controlled', completed: false }
          ]
        }
      ],
    },
    {
      id: 'upper-pull',
      name: 'Upper Body Pull',
      description: 'Focus on back, biceps, and core',
      duration: 2700, // 45 minutes
      caloriesBurned: 320,
      exercises: [
        {
          id: generateId(),
          name: 'Warm-Up: Dynamic Mobility',
          description: 'Dynamic stretches to warm up the upper body',
          equipment: 'None',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 300, notes: 'Arm circles, cat-cow, thoracic rotations, etc.', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Dumbbell Rows',
          description: 'Bent-over dumbbell rows for back strength',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 12, weight: 25, notes: 'Both arms simultaneously', completed: false },
            { id: generateId(), reps: 12, weight: 25, notes: 'Squeeze shoulder blades', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Keep back flat', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Superman Hold',
          description: 'Lying face down, raise arms and legs simultaneously',
          equipment: 'Body weight',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 30, notes: '30-second hold', completed: false },
            { id: generateId(), reps: 0, weight: 0, duration: 30, notes: '30-second hold', completed: false },
            { id: generateId(), reps: 0, weight: 0, duration: 30, notes: '30-second hold', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Dumbbell Curls',
          description: 'Standing dumbbell bicep curls',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 10, weight: 25, notes: 'Alternating arms', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Focus on bicep contraction', completed: false },
            { id: generateId(), reps: 8, weight: 25, notes: 'Full range of motion', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Dumbbell Hammer Curls',
          description: 'Bicep curls with neutral grip',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 10, weight: 25, notes: 'Thumbs facing up', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Targets brachialis and brachioradialis', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Plank',
          description: 'Core stabilization exercise',
          equipment: 'Body weight',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 60, notes: '60-second hold', completed: false },
            { id: generateId(), reps: 0, weight: 0, duration: 45, notes: '45-second hold', completed: false },
            { id: generateId(), reps: 0, weight: 0, duration: 30, notes: '30-second hold', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Russian Twists',
          description: 'Seated twisting motion for obliques',
          equipment: '25lb dumbbell',
          sets: [
            { id: generateId(), reps: 20, weight: 25, notes: '10 per side', completed: false },
            { id: generateId(), reps: 20, weight: 25, notes: '10 per side', completed: false }
          ]
        }
      ],
    },
    {
      id: 'full-body',
      name: 'Full Body + Conditioning',
      description: 'Full body workout with conditioning elements',
      duration: 3600, // 60 minutes
      caloriesBurned: 450,
      exercises: [
        {
          id: generateId(),
          name: 'Warm-Up: Dynamic Mobility',
          description: 'Dynamic stretches for full body',
          equipment: 'None',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 300, notes: 'Jumping jacks, high knees, arm circles, etc.', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Thrusters',
          description: 'Squat to overhead press combination',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 12, weight: 25, notes: 'Squat deep, press overhead', completed: false },
            { id: generateId(), reps: 12, weight: 25, notes: 'Explosive movement', completed: false },
            { id: generateId(), reps: 10, weight: 25, notes: 'Full range of motion', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Renegade Rows',
          description: 'Plank position with rowing motion',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 16, weight: 25, notes: '8 per arm', completed: false },
            { id: generateId(), reps: 16, weight: 25, notes: '8 per arm', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Weighted Burpees',
          description: 'Burpees with weight vest',
          equipment: 'Weight vest 30lb',
          sets: [
            { id: generateId(), reps: 10, weight: 30, notes: 'Full burpee with jump', completed: false },
            { id: generateId(), reps: 8, weight: 30, notes: 'Full burpee with jump', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Dumbbell Walking Lunges',
          description: 'Walking lunges with dumbbells',
          equipment: '25lb dumbbells',
          sets: [
            { id: generateId(), reps: 20, weight: 25, notes: '10 per leg', completed: false },
            { id: generateId(), reps: 20, weight: 25, notes: '10 per leg', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'HIIT: Dumbbell Swing',
          description: 'High-intensity kettlebell swing alternative',
          equipment: '25lb dumbbell',
          sets: [
            { id: generateId(), reps: 15, weight: 25, notes: 'Use kettlebell swing form', completed: false },
            { id: generateId(), reps: 15, weight: 25, notes: 'Explosive hip hinge', completed: false },
            { id: generateId(), reps: 15, weight: 25, notes: 'Control the movement', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Mountain Climbers',
          description: 'High-intensity core exercise',
          equipment: 'Body weight',
          sets: [
            { id: generateId(), reps: 30, weight: 0, notes: '15 per leg, fast pace', completed: false },
            { id: generateId(), reps: 30, weight: 0, notes: '15 per leg, fast pace', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Finisher: Tabata',
          description: '4-minute high-intensity interval training',
          equipment: 'Body weight',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 240, notes: '20 sec work, 10 sec rest x 8 rounds of bodyweight squats or push-ups', completed: false }
          ]
        }
      ],
    },
    {
      id: 'rest-day',
      name: 'Rest Day',
      description: 'Active recovery day - light activity only',
      duration: 1200, // 20 minutes
      caloriesBurned: 100,
      exercises: [
        {
          id: generateId(),
          name: 'Light Walking',
          description: 'Easy pace walking for active recovery',
          equipment: 'None',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 900, notes: '15 minutes at comfortable pace', completed: false }
          ]
        },
        {
          id: generateId(),
          name: 'Stretching Routine',
          description: 'Full body stretching sequence',
          equipment: 'None',
          sets: [
            { id: generateId(), reps: 0, weight: 0, duration: 300, notes: '5 minutes of total body stretching', completed: false }
          ]
        }
      ],
    }
  ],
  
  user: {
    id: '1',
    name: 'Peter',
    weight: 180,
    height: 72,
    age: 35,
    goals: 'Build strength and improve mobility'
  },
  
  progress: [],
  activeWorkout: null,
  currentWeekOffset: 0,
  
  setWorkouts: (workouts) => set({ workouts }),
  setUser: (user) => set({ user }),
  setProgress: (progress) => set({ progress }),
  startWorkout: (workout) => set({ activeWorkout: workout }),
  endWorkout: () => set({ activeWorkout: null }),
  setCurrentWeekOffset: (offset) => set({ currentWeekOffset: offset }),
}));
