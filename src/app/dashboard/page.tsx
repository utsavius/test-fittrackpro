'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, Award, Zap } from 'lucide-react';

const MOCK_CHART_DATA = [
  { date: 'Mar 21', volume: 4500, bench1rm: 185 },
  { date: 'Mar 22', volume: 5200, bench1rm: 185 },
  { date: 'Mar 23', volume: 4800, bench1rm: 190 },
  { date: 'Mar 24', volume: 0, bench1rm: 190 }, // rest day
  { date: 'Mar 25', volume: 6100, bench1rm: 195 },
  { date: 'Mar 26', volume: 5500, bench1rm: 195 },
  { date: 'Mar 27', volume: 5800, bench1rm: 200 },
];

const MUSCLE_DATA = [
  { name: 'Chest', score: 0.8 },
  { name: 'Back', score: 0.1 },
  { name: 'Legs', score: 0.6 },
  { name: 'Shoulders', score: 0.9 },
  { name: 'Arms', score: 0.4 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Volume');

  return (
    <div className="dashboard-container animate-slide-up">
      <header>
        <span className="label-small">YOUR PROGRESS</span>
        <h1 className="text-gradient">Performance Insights</h1>
      </header>

      <div className="overview-row">
         <div className="stat-pill card">
            <Zap size={14} fill="var(--accent)" color="var(--accent)" />
            <span>4wk Volume +12%</span>
         </div>
         <div className="stat-pill card">
            <TrendingUp size={14} color="var(--success)" />
            <span>New 1RM!</span>
         </div>
      </div>

      <section className="chart-section card">
        <div className="chart-header">
           <h2>{activeTab} Trend</h2>
           <div className="tab-switcher">
              <button 
                className={activeTab === 'Volume' ? 'active' : ''} 
                onClick={() => setActiveTab('Volume')}
              >Volume</button>
              <button 
                className={activeTab === 'Strength' ? 'active' : ''} 
                onClick={() => setActiveTab('Strength')}
              >1RM</button>
           </div>
        </div>

        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={240}>
            {activeTab === 'Volume' ? (
              <AreaChart data={MOCK_CHART_DATA}>
                <defs>
                  <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4FF00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4FF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#D4FF00', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="volume" stroke="#D4FF00" strokeWidth={3} fillOpacity={1} fill="url(#colorVol)" />
              </AreaChart>
            ) : (
              <LineChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#888" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#1A1A1A', border: '1px solid #333', borderRadius: '12px' }}
                  itemStyle={{ color: '#D4FF00', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="bench1rm" stroke="#D4FF00" strokeWidth={3} dot={{ fill: '#D4FF00', r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </section>

      <section className="heatmap-section animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h3 style={{ marginBottom: '16px' }}>Recovery Heatmap</h3>
        <div className="heatmap-grid">
          {MUSCLE_DATA.map(m => (
            <div key={m.name} className="muscle-item">
              <span className="muscle-name">{m.name}</span>
              <div className="bar-bg">
                <div className="bar-fill" style={{ width: `${m.score * 100}%`, background: m.score < 0.3 ? 'var(--danger)' : m.score < 0.7 ? '#FFA500' : 'var(--success)' }} />
              </div>
              <span className="muscle-val">{Math.round(m.score * 100)}%</span>
            </div>
          ))}
        </div>
      </section>

      <style jsx>{`
        .dashboard-container { display: flex; flex-direction: column; gap: 24px; padding-bottom: 40px; }
        
        .overview-row { display: flex; gap: 12px; }
        .stat-pill { padding: 8px 16px; border-radius: 100px; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; border: 1px solid var(--border); }
        
        .chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .chart-header h2 { font-size: 1.1rem; margin: 0; }
        
        .tab-switcher { background: var(--surface-hover); padding: 4px; border-radius: 12px; display: flex; gap: 4px; }
        .tab-switcher button { 
          background: none; border: none; color: var(--text-secondary); padding: 6px 12px; 
          font-size: 0.75rem; font-weight: 700; border-radius: 8px; cursor: pointer; transition: all 0.2s;
        }
        .tab-switcher button.active { background: var(--surface); color: white; }

        .chart-wrapper { margin-left: -20px; }

        .heatmap-grid { display: flex; flex-direction: column; gap: 12px; }
        .muscle-item { display: grid; grid-template-columns: 80px 1fr 40px; align-items: center; gap: 16px; }
        .muscle-name { font-size: 0.85rem; font-weight: 600; color: var(--text-secondary); }
        .muscle-val { font-size: 0.85rem; font-weight: 700; text-align: right; }
        
        .bar-bg { height: 8px; background: var(--surface-hover); border-radius: 4px; overflow: hidden; }
        .bar-fill { height: 100%; border-radius: 4px; transition: width 1s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}
