'use client';

import { useState } from 'react';
import { Search, Info, Dumbbell, ChevronRight, X } from 'lucide-react';
import exercises from '@/data/exercises.json';
import { Exercise } from '@/lib/types';

export default function Library() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const filteredExercises = exercises.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.primaryMuscles.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="library-container animate-slide-up">
      <header>
        <span className="label-small">500+ EXERCISES</span>
        <h1 className="text-gradient">Exercise Library</h1>
      </header>

      <div className="search-bar card">
        <Search size={18} color="var(--text-secondary)" />
        <input 
          type="text" 
          placeholder="Search exercise or muscle group..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="exercise-list">
        {filteredExercises.map(ex => (
          <div key={ex.id} className="exercise-row card" onClick={() => setSelectedExercise(ex as any)}>
            <div className="ex-icon">
              <Dumbbell size={20} color="var(--accent)" />
            </div>
            <div className="ex-brief">
              <span className="ex-name">{ex.name}</span>
              <span className="ex-muscles">{ex.primaryMuscles.join(', ')}</span>
            </div>
            <ChevronRight size={18} color="var(--border)" />
          </div>
        ))}
      </div>

      {selectedExercise && (
        <div className="modal-overlay">
          <div className="modal card">
            <div className="modal-header">
              <h2>{selectedExercise.name}</h2>
              <button onClick={() => setSelectedExercise(null)} className="remove-btn"><X size={24} /></button>
            </div>
            
            <div className="modal-content">
               <div className="info-grid">
                  <div className="info-item">
                     <span className="info-label">Equipment</span>
                     <span className="info-val">{selectedExercise.equipment}</span>
                  </div>
                  <div className="info-item">
                     <span className="info-label">Difficulty</span>
                     <span className="info-val">{selectedExercise.difficulty}</span>
                  </div>
               </div>

               <h3 style={{ marginTop: '24px', marginBottom: '12px', fontSize: '1rem' }}>Instructions</h3>
               <ol className="instructions-list">
                  {selectedExercise.instructions.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
               </ol>

               <button className="btn-primary" style={{ marginTop: '32px' }} onClick={() => setSelectedExercise(null)}>
                  Got it
               </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .library-container { display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }
        
        .search-bar { padding: 12px 20px; display: flex; align-items: center; gap: 12px; border-radius: 100px; -webkit-backdrop-filter: blur(10px); }
        .search-bar input { background: none; border: none; color: white; width: 100%; outline: none; font-family: inherit; font-size: 1rem; }
        
        .exercise-list { display: flex; flex-direction: column; gap: 8px; }
        .exercise-row { padding: 16px; flex-direction: row; align-items: center; display: flex; gap: 16px; cursor: pointer; border-radius: 20px; transition: all 0.2s; }
        .exercise-row:active { transform: scale(0.98); background: var(--surface-hover); }

        .ex-icon { width: 40px; height: 40px; background: var(--accent-muted); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .ex-brief { flex: 1; display: flex; flex-direction: column; gap: 2px; }
        .ex-name { font-weight: 700; font-size: 1rem; }
        .ex-muscles { font-size: 0.8rem; color: var(--text-secondary); }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: flex-end; z-index: 2000; animation: fadeIn 0.3s ease; }
        .modal { width: 100%; border-radius: 32px 32px 0 0; padding: 32px; max-height: 90vh; overflow-y: auto; background: var(--background); border-color: var(--border); }
        
        .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
        .remove-btn { background: none; border: none; color: white; cursor: pointer; }

        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .info-item { background: var(--surface); padding: 16px; border-radius: 20px; border: 1px solid var(--border); }
        .info-label { display: block; font-size: 0.75rem; color: var(--text-secondary); margin-bottom: 4px; font-weight: 600; text-transform: uppercase; }
        .info-val { font-weight: 700; color: var(--accent); }

        .instructions-list { color: var(--text-secondary); padding-left: 20px; line-height: 1.6; }
        .instructions-list li { margin-bottom: 8px; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
