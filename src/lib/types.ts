export type MuscleGroup = 
  | 'Chest' 
  | 'Back' 
  | 'Quads' 
  | 'Hamstrings' 
  | 'Shoulders' 
  | 'Triceps' 
  | 'Biceps' 
  | 'Abs' 
  | 'Calves' 
  | 'Glutes';

export type Equipment = 'Barbell' | 'Dumbbell' | 'Machine' | 'Bodyweight' | 'Cable';

export interface Exercise {
  id: string;
  name: string;
  primaryMuscles: MuscleGroup[];
  secondaryMuscles?: MuscleGroup[];
  equipment: Equipment;
  category: 'Strength' | 'Cardio' | 'Flexibility';
  instructions: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface Set {
  reps: number;
  weight: number;
  completed: boolean;
  type: 'Working' | 'Warmup' | 'Drop' | 'Failure';
}

export interface WorkoutSession {
  id: string;
  date: string; // ISO string
  name: string;
  exercises: {
    exerciseId: string;
    sets: Set[];
  }[];
  durationMinutes: number;
  notes?: string;
}

export interface UserProfile {
  name: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  goals: ('Build Muscle' | 'Lose Weight' | 'Improve Endurance' | 'General Fitness')[];
  targetFrequency: number; // sessions per week
  equipmentAvailable: Equipment[];
  restDays: number[]; // 0-6 (Sun-Sat)
}
