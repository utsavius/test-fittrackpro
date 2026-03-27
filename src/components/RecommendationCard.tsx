'use client';

import { CheckCircle2, RefreshCcw, Sparkles } from 'lucide-react';
import { Recommendation } from '@/lib/workoutEngine';

interface Props {
  recommendation: Recommendation;
  onAccept: () => void;
  onShuffle: () => void;
}

export default function RecommendationCard({ recommendation, onAccept, onShuffle }: Props) {
  return (
    <div className="card animate-slide-up" style={{ borderColor: 'var(--accent)', borderWidth: '2px' }}>
      <div className="header">
        <div className="badge">
          <Sparkles size={14} fill="var(--accent)" color="var(--accent)" />
          <span>DAILY PICK</span>
        </div>
        <button onClick={onShuffle} className="shuffle-btn">
          <RefreshCcw size={18} />
        </button>
      </div>

      <h2 style={{ marginTop: '12px', fontSize: '1.75rem' }}>{recommendation.workoutType}</h2>
      <p style={{ marginBottom: '20px' }}>Focus: {recommendation.focusArea}</p>

      <div className="exercise-list">
        {recommendation.exercises.map((ex, i) => (
          <div key={i} className="exercise-item">
            <div className="dot" />
            <div className="ex-info">
              <span className="ex-name">{ex.label}</span>
              <span className="ex-sets">{ex.sets} sets × {ex.reps} reps</span>
            </div>
          </div>
        ))}
      </div>

      <button onClick={onAccept} className="btn-primary" style={{ marginTop: '24px' }}>
        <CheckCircle2 size={20} />
        Accept & Start Workout
      </button>

      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .badge {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--accent-muted);
          padding: 6px 12px;
          border-radius: 100px;
          color: var(--accent);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
        }

        .shuffle-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .shuffle-btn:hover {
          color: white;
          transform: rotate(180deg);
        }

        .exercise-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid var(--border);
          padding-top: 20px;
        }

        .exercise-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: var(--accent);
          border-radius: 50%;
        }

        .ex-info {
          display: flex;
          flex-direction: column;
        }

        .ex-name {
          font-weight: 600;
          font-size: 1rem;
        }

        .ex-sets {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
