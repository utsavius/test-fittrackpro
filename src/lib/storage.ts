import { WorkoutSession, UserProfile } from './types';

const SESSIONS_KEY = 'fittrack_sessions';
const PROFILE_KEY = 'fittrack_profile';

export const DEFAULT_USER: UserProfile = {
  name: 'Utsav',
  fitnessLevel: 'Intermediate',
  goals: ['Build Muscle'],
  targetFrequency: 4,
  equipmentAvailable: ['Barbell', 'Dumbbell', 'Bodyweight'],
  restDays: [0, 6]
};

export function getSessions(): WorkoutSession[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveSession(session: WorkoutSession) {
  const sessions = getSessions();
  // Ensure we don't duplicate by ID if editing
  const filtered = sessions.filter(s => s.id !== session.id);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify([...filtered, session]));
}

export function getUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_USER;
  const data = localStorage.getItem(PROFILE_KEY);
  return data ? JSON.parse(data) : DEFAULT_USER;
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export function calculateStreak(sessions: WorkoutSession[]): number {
  if (sessions.length === 0) return 0;
  
  const dates = sessions
    .map(s => new Date(s.date).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i) // Unique dates
    .map(d => new Date(d).getTime())
    .sort((a, b) => b - a);

  let streak = 0;
  let current = new Date();
  current.setHours(0, 0, 0, 0);

  for (let i = 0; i < dates.length; i++) {
    const sessionDate = new Date(dates[i]);
    sessionDate.setHours(0, 0, 0, 0);
    
    // Check if it's today or yesterday
    const diff = (current.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diff <= 1) {
      streak++;
      current = sessionDate;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getWeeklySessionCount(sessions: WorkoutSession[]): number {
  const now = new Date();
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
  startOfWeek.setHours(0, 0, 0, 0);
  
  return sessions.filter(s => new Date(s.date) >= startOfWeek).length;
}

export function seedSampleData() {
  const today = new Date();
  const sampleSessions: WorkoutSession[] = [
    {
      id: 'sample-1',
      name: 'Push Day',
      date: new Date(new Date().setDate(today.getDate() - 3)).toISOString(),
      exercises: [{ exerciseId: 'bench-press', sets: [{ reps: 10, weight: 135, completed: true, type: 'Working' }] }],
      durationMinutes: 45
    },
    {
       id: 'sample-2',
       name: 'Leg Day',
       date: new Date(new Date().setDate(today.getDate() - 2)).toISOString(),
       exercises: [{ exerciseId: 'squat', sets: [{ reps: 8, weight: 185, completed: true, type: 'Working' }] }],
       durationMinutes: 50
    },
    {
       id: 'sample-3',
       name: 'Pull Day',
       date: new Date(new Date().setDate(today.getDate() - 1)).toISOString(),
       exercises: [{ exerciseId: 'pull-up', sets: [{ reps: 12, weight: 0, completed: true, type: 'Working' }] }],
       durationMinutes: 40
    }
  ];
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sampleSessions));
}
