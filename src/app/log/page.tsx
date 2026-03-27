'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, X, Check, Dumbbell, History, Save } from 'lucide-react';
import { Exercise, Set, WorkoutSession } from '@/lib/types';
import exercisesData from '@/data/exercises.json';
import { saveSession } from '@/lib/storage';

function LogWorkoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [session, setSession] = useState<Partial<WorkoutSession>>({
    name: searchParams.get('template') || 'New Session',
    exercises: [],
    date: new Date().toISOString()
  });

  const [isAddingExercise, setIsAddingExercise] = useState(false);

  useEffect(() => {
    const focus = searchParams.get('focus');
    if (focus && session.exercises?.length === 0) {
      // Pre-fill with exercises that match the focus area
      const recommended = exercisesData.filter(e => 
        e.primaryMuscles.some(m => focus.toLowerCase().includes(m.toLowerCase()))
      ).slice(0, 4);

      setSession(prev => ({
        ...prev,
        exercises: recommended.map(e => ({
          exerciseId: e.id,
          sets: [{ reps: 10, weight: 0, completed: false, type: 'Working' }]
        }))
      }));
    }
  }, [searchParams]);

  const addExercise = (exercise: Exercise) => {
    setSession(prev => ({
      ...prev,
      exercises: [
        ...(prev.exercises || []),
        { exerciseId: exercise.id, sets: [{ reps: 0, weight: 0, completed: false, type: 'Working' }] }
      ]
    }));
    setIsAddingExercise(false);
  };

  const addSet = (exIndex: number) => {
    const newExercises = [...(session.exercises || [])];
    newExercises[exIndex].sets.push({ reps: 0, weight: 0, completed: false, type: 'Working' });
    setSession({ ...session, exercises: newExercises });
  };

  const updateSet = (exIndex: number, setIndex: number, field: keyof Set, value: any) => {
    const newExercises = [...(session.exercises || [])];
    (newExercises[exIndex].sets[setIndex] as any)[field] = value;
    setSession({ ...session, exercises: newExercises });
  };

  const removeExercise = (index: number) => {
    const newExercises = [...(session.exercises || [])];
    newExercises.splice(index, 1);
    setSession({ ...session, exercises: newExercises });
  };

  const handleSave = () => {
    if (!session.exercises || session.exercises.length === 0) {
        alert('Please add at least one exercise.');
        return;
    }
    
    const finalSession: WorkoutSession = {
      id: Math.random().toString(36).substr(2, 9),
      name: session.name || 'Strength Session',
      date: session.date || new Date().toISOString(),
      exercises: session.exercises as any,
      durationMinutes: 45 // Estimate
    };
    
    saveSession(finalSession);
    router.push('/dashboard');
  };

  return (
    <div className="log-container animate-slide-up">
      <header className="log-header">
        <h1 className="text-gradient">Log Workout</h1>
        <button className="save-btn" onClick={handleSave}>
          <Save size={18} />
          <span>Save</span>
        </button>
      </header>

      <div className="session-info card">
        <input 
          type="text" 
          value={session.name} 
          onChange={(e) => setSession({...session, name: e.target.value})}
          className="session-name-input"
        />
        <div className="session-meta">
          <History size={14} /> {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="exercises-container">
        {session.exercises?.map((ex, exIdx) => {
          const exerciseInfo = exercisesData.find(e => e.id === ex.exerciseId);
          return (
            <div key={exIdx} className="exercise-log card">
              <div className="ex-log-header">
                <h3>{exerciseInfo?.name}</h3>
                <button onClick={() => removeExercise(exIdx)} className="remove-btn"><X size={16} /></button>
              </div>

              <div className="sets-list">
                <div className="set-row header">
                  <span className="set-num">SET</span>
                  <span className="set-input-label">LBS</span>
                  <span className="set-input-label">REPS</span>
                  <span className="set-check"></span>
                </div>
                {ex.sets.map((set, setIdx) => (
                  <div key={setIdx} className={`set-row ${set.completed ? 'completed' : ''}`}>
                    <span className="set-num">{setIdx + 1}</span>
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={set.weight || ''}
                      onChange={(e) => updateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value))}
                    />
                    <input 
                      type="number" 
                      placeholder="0" 
                      value={set.reps || ''}
                      onChange={(e) => updateSet(exIdx, setIdx, 'reps', parseInt(e.target.value))}
                    />
                    <button 
                      className={`check-btn ${set.completed ? 'active' : ''}`}
                      onClick={() => updateSet(exIdx, setIdx, 'completed', !set.completed)}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <button className="add-set-btn" onClick={() => addSet(exIdx)}>
                <Plus size={14} /> Add Set
              </button>
            </div>
          );
        })}
      </div>

      <button className="btn-secondary" onClick={() => setIsAddingExercise(true)} style={{ marginTop: '20px' }}>
        <Plus size={20} /> Add Exercise
      </button>

      {isAddingExercise && (
        <div className="modal-overlay">
          <div className="modal card">
             <div className="modal-header">
               <h2>Select Exercise</h2>
               <button onClick={() => setIsAddingExercise(false)} className="remove-btn"><X size={20} /></button>
             </div>
             <div className="exercise-picker">
                {exercisesData.map(e => (
                  <div key={e.id} className="picker-item" onClick={() => addExercise(e as any)}>
                    <Dumbbell size={18} />
                    <span>{e.name}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .log-container { display: flex; flex-direction: column; gap: 16px; min-height: 100vh; }
        .log-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        
        .save-btn { 
          background: var(--accent); color: black; border: none; padding: 10px 18px; 
          border-radius: 100px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px;
        }

        .session-name-input { 
          background: transparent; border: none; color: white; font-size: 1.5rem; font-weight: 700; width: 100%; outline: none;
        }
        
        .session-meta { display: flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 0.85rem; margin-top: 8px; }

        .ex-log-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
        .remove-btn { background: none; border: none; color: var(--text-secondary); cursor: pointer; }

        .sets-list { display: flex; flex-direction: column; gap: 8px; }
        .set-row { display: grid; grid-template-columns: 40px 1fr 1fr 40px; gap: 12px; align-items: center; }
        .set-row.header { color: var(--text-secondary); font-size: 10px; font-weight: 800; }
        .set-num { background: var(--surface-hover); color: var(--text-secondary); font-size: 10px; font-weight: 700; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 6px; }
        
        input[type="number"] {
          background: var(--surface-hover); border: 1px solid var(--border); border-radius: 12px; padding: 10px; color: white; text-align: center; font-weight: 600; font-family: inherit; outline: none;
        }
        input[type="number"]:focus { border-color: var(--accent); }

        .check-btn { 
          width: 32px; height: 32px; border-radius: 10px; border: 1px solid var(--border); 
          background: var(--surface-hover); color: transparent; cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center;
        }
        .check-btn.active { background: var(--success); color: black; border-color: var(--success); }

        .add-set-btn { 
          background: none; border: 1px dashed var(--border); color: var(--text-secondary); 
          padding: 8px; border-radius: 12px; margin-top: 16px; cursor: pointer; width: 100%;
        }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: flex-end; z-index: 2000; }
        .modal { width: 100%; border-radius: 32px 32px 0 0; padding: 24px; max-height: 80vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .exercise-picker { display: flex; flex-direction: column; gap: 8px; }
        .picker-item { padding: 16px; background: var(--surface-hover); border-radius: 16px; display: flex; align-items: center; gap: 16px; cursor: pointer; font-weight: 600; }
        .picker-item:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
}

export default function LogWorkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LogWorkoutContent />
    </Suspense>
  );
}
