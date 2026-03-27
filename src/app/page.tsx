'use client';

import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import RecommendationCard from '@/components/RecommendationCard';
import { generateRecommendation, Recommendation } from '@/lib/workoutEngine';
import { UserProfile, WorkoutSession } from '@/lib/types';
import exercises from '@/data/exercises.json';
import { getSessions, getUserProfile, calculateStreak, getWeeklySessionCount } from '@/lib/storage';

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    const p = getUserProfile();
    const s = getSessions();
    setProfile(p);
    setSessions(s);
    setRecommendation(generateRecommendation(p, s, exercises as any));
  }, []);

  const handleShuffle = () => {
    if (profile) {
      setRecommendation(generateRecommendation(profile, sessions, exercises as any));
    }
  };

  const handleAccept = () => {
    if (recommendation) {
      // Pass the recommended workout focus/type via query params for the logger to pre-fill
      router.push(`/log?template=${encodeURIComponent(recommendation.workoutType)}&focus=${encodeURIComponent(recommendation.focusArea)}`);
    }
  };

  if (!profile || !recommendation) return null;

  const streak = calculateStreak(sessions);
  const weeklyCount = getWeeklySessionCount(sessions);

  return (
    <div className="home-container">
      <header className="animate-slide-up">
        <span className="label-small">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}</span>
        <h1 className="text-gradient">Welcome back, {profile.name}</h1>
      </header>

      <section className="stats-row animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="stat-card">
          <Calendar size={18} color="var(--accent)" />
          <div className="stat-info">
            <span className="stat-val">{streak} Days</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={18} color="var(--accent)" />
          <div className="stat-info">
            <span className="stat-val">{weeklyCount}/{profile.targetFrequency}</span>
            <span className="stat-label">This Week</span>
          </div>
        </div>
      </section>

      <section className="recommendation-section">
        <RecommendationCard 
          recommendation={recommendation} 
          onShuffle={handleShuffle} 
          onAccept={handleAccept} 
        />
      </section>

      <section className="quick-actions animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Quick Start</h3>
        <div className="action-grid">
          <button className="btn-secondary action-btn" onClick={() => router.push('/log')}>
             <Award size={18} />
             <span>Custom Session</span>
          </button>
          <button className="btn-secondary action-btn" onClick={() => router.push('/dashboard')}>
             <TrendingUp size={18} />
             <span>View Dashboard</span>
          </button>
        </div>
      </section>

      <style jsx>{`
        .home-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        header {
          margin-top: 20px;
        }

        .stats-row {
          display: flex;
          gap: 16px;
        }

        .stat-card {
          flex: 1;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-val {
          font-weight: 700;
          font-size: 1.1rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }

        .action-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .action-btn {
          flex-direction: row;
          justify-content: flex-start;
          padding: 14px 20px;
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
