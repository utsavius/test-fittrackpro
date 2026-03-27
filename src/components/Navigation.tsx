'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, History, PieChart, User } from 'lucide-react';

const navItems = [
  { label: 'Home', icon: Home, path: '/' },
  { label: 'Library', icon: Dumbbell, path: '/library' },
  { label: 'Log', icon: History, path: '/log' },
  { label: 'Stats', icon: PieChart, path: '/dashboard' }
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="nav-container">
      {navItems.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link key={item.path} href={item.path} className={`nav-item ${isActive ? 'active' : ''}`}>
            <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            <span>{item.label}</span>
          </Link>
        );
      })}
      
      <style jsx>{`
        .nav-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          height: 85px;
          background: rgba(18, 18, 18, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: space-around;
          align-items: center;
          padding: 0 10px 20px 10px;
          z-index: 1000;
        }

        .nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: #888888;
          text-decoration: none;
          transition: all 0.2s ease;
          width: 25%;
        }

        .nav-item span {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.02em;
        }

        .nav-item.active {
          color: #D4FF00;
        }

        .nav-item:active {
          transform: scale(0.9);
        }
      `}</style>
    </nav>
  );
}
