'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Calendar, TrendingUp, Award } from 'lucide-react';
import RecommendationCard from '@/components/RecommendationCard';
import { generateRecommendation, Recommendation } from '@/lib/workoutEngine';
import { UserProfile, WorkoutSession } from '@/lib/types';
import exercises from '@/data/exercises.json';

const MOCK_USER: UserProfile = {
  name: 'Utsav',
  fitnessLevel: 'Intermediate',
  goals: ['Build Muscle'],
  targetFrequency: 4,
  equipmentAvailable: ['Barbell', 'Dumbbell', 'Bodyweight'],
  restDays: [0, 6]
};

const MOCK_SESSIONS: WorkoutSession[] = []; // Empty for initial recommendation

export default function Home() {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);

  useEffect(() => {
    // Generate initial recommendation
    setRecommendation(generateRecommendation(MOCK_USER, MOCK_SESSIONS, exercises as any));
  }, []);

  const handleShuffle = () => {
    setRecommendation(generateRecommendation(MOCK_USER, MOCK_SESSIONS, exercises as any));
  };

  const handleAccept = () => {
    alert('Workout started! In a full app, this would open the logger.');
  };

  if (!recommendation) return null;

  return (
    <div className="home-container">
      <header className="animate-slide-up">
        <span className="label-small">FRIDAY, MARCH 27</span>
        <h1 className="text-gradient">Welcome back, {MOCK_USER.name}</h1>
      </header>

      <section className="stats-row animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="stat-card">
          <Calendar size={18} color="var(--accent)" />
          <div className="stat-info">
            <span className="stat-val">4 Days</span>
            <span className="stat-label">Streak</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={18} color="var(--accent)" />
          <div className="stat-info">
            <span className="stat-val">2/4</span>
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
          <button className="btn-secondary action-btn">
             <Award size={18} />
             <span>Custom Session</span>
          </button>
          <button className="btn-secondary action-btn">
             <TrendingUp size={18} />
             <span>View Goals</span>
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
