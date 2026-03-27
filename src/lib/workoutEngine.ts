import { MuscleGroup, Exercise, WorkoutSession, UserProfile } from './types';

// Brzycki formula for 1RM estimation
export function calculate1RM(weight: number, reps: number): number {
  if (reps === 1) return weight;
  if (reps === 0) return 0;
  return weight * (36 / (37 - reps));
}

export function getRecoveryTimeMs(intensity: number): number {
  // Intensity 0-1. Low intensity = 48h, High intensity = 72h.
  const baseHours = 48 + (intensity * 24);
  return baseHours * 60 * 60 * 1000;
}

export function calculateMuscleFreshness(
  sessions: WorkoutSession[],
  exerciseLibrary: Exercise[]
): Record<MuscleGroup, number> {
  const now = new Date().getTime();
  const freshness: Record<MuscleGroup, number> = {
    Chest: 1, Back: 1, Quads: 1, Hamstrings: 1, Shoulders: 1, Triceps: 1, Biceps: 1, Abs: 1, Calves: 1, Glutes: 1
  };

  const muscleToLastSession: Record<string, number> = {};

  // Find most recent session for each muscle group across all sessions
  sessions.forEach(session => {
    const sessionTime = new Date(session.date).getTime();
    session.exercises.forEach(se => {
      const exercise = exerciseLibrary.find(e => e.id === se.exerciseId);
      if (exercise) {
        [...exercise.primaryMuscles, ...(exercise.secondaryMuscles || [])].forEach(m => {
          if (!muscleToLastSession[m] || sessionTime > muscleToLastSession[m]) {
            muscleToLastSession[m] = sessionTime;
          }
        });
      }
    });
  });

  // Calculate freshness percentage (0-1)
  Object.keys(freshness).forEach(m => {
    const mg = m as MuscleGroup;
    const lastSessionTime = muscleToLastSession[mg];
    if (!lastSessionTime) {
      freshness[mg] = 1; // Never trained, perfectly fresh
      return;
    }

    const elapsed = now - lastSessionTime;
    const recoveryMs = getRecoveryTimeMs(0.8); // Assume high intensity for safety
    const freshnessVal = Math.min(1, elapsed / recoveryMs);
    freshness[mg] = freshnessVal;
  });

  return freshness;
}

export interface Recommendation {
  workoutType: string;
  focusArea: string;
  exercises: { exerciseId: string; sets: number; reps: number; label: string }[];
  durationMinutes: number;
}

export function generateRecommendation(
  userProfile: UserProfile,
  sessions: WorkoutSession[],
  exerciseLibrary: Exercise[]
): Recommendation {
  const freshness = calculateMuscleFreshness(sessions, exerciseLibrary);

  // Group by focus areas (simplified logic)
  const focusAreas = [
    { name: 'Push (Chest, Shoulders, Triceps)', muscles: ['Chest', 'Shoulders', 'Triceps'] },
    { name: 'Pull (Back, Biceps)', muscles: ['Back', 'Biceps'] },
    { name: 'Legs (Quads, Hamstrings, Glutes)', muscles: ['Quads', 'Hamstrings', 'Glutes'] }
  ];

  // Pick the freshest focus area
  const areaFreshness = focusAreas.map(area => {
    const avgFreshness = area.muscles.reduce((sum, m) => sum + (freshness[m as MuscleGroup] || 0), 0) / area.muscles.length;
    return { ...area, freshness: avgFreshness };
  });

  areaFreshness.sort((a, b) => b.freshness - a.freshness);
  const selectedArea = areaFreshness[0];

  // Pick exercises from library for this area
  const recommendedExercises = exerciseLibrary
    .filter(e => {
        const isPrimary = e.primaryMuscles.some(m => selectedArea.muscles.includes(m));
        const isEquipmentAvailable = userProfile.equipmentAvailable.includes(e.equipment);
        return isPrimary && isEquipmentAvailable;
    })
    .slice(0, 4) // Max 4 exercises per session
    .map(e => ({
      exerciseId: e.id,
      sets: 3,
      reps: 10,
      label: e.name
    }));

  return {
    workoutType: `Strength — ${selectedArea.name.split(' ')[0]}`,
    focusArea: selectedArea.name,
    exercises: recommendedExercises,
    durationMinutes: 45
  };
}
