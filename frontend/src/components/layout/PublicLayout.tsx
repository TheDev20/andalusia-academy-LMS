import React from 'react';
import PublicNavbar from './PublicNavbar';
import PublicFooter from './PublicFooter';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AppRoute, NavigateFunction } from '../../types/navigation';

export interface PublicLayoutProps {
  currentPath: AppRoute | string;
  onNavigate: NavigateFunction;
  children: React.ReactNode;
}

export default function PublicLayout({ currentPath, onNavigate, children }: PublicLayoutProps) {
  return (
    <div className="public-shell">
      {/* Top Admissions Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <Sparkles size={14} className="announcement-icon" aria-hidden="true" />
          <span className="announcement-text">
            <strong>Fall 2026 Admissions Now Open</strong> — Software Engineering, AI & Data Science Cohorts. Early Applications Close September 30.
          </span>
          <a
            href="#courses"
            className="announcement-link"
            onClick={(e) => {
              e.preventDefault();
              if (currentPath !== 'home') {
                onNavigate('home');
                setTimeout(() => {
                  const el = document.getElementById('courses');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              } else {
                const el = document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Tech Programs <ArrowRight size={12} aria-hidden="true" />
          </a>
        </div>
      </div>

      {/* Main Glassmorphism Navbar */}
      <PublicNavbar currentPath={currentPath} onNavigate={onNavigate} />

      {/* Page Body */}
      <main className="public-main-content">
        {children}
      </main>

      {/* Public Footer */}
      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}
