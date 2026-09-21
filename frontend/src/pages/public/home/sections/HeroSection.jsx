import React, { useState } from 'react';
import { ArrowRight, Search, Terminal } from 'lucide-react';

export default function HeroSection({ onNavigate, onSearch }) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" aria-label="Hero">
      <div className="hero-bg-accent" aria-hidden="true" />
      <div className="hero-container">
        <div className="hero-content">

          <h1 className="hero-title">
            Where Engineering Mastery Meets <em>Applied Innovation.</em>
          </h1>

          <p className="hero-subtitle">
            Andalusia Academy is the premier technology institute empowering software developers, AI engineers, and data leaders with production-grade coding labs, offline cohort sessions, and verified credentials.
          </p>

          {/* Clean, concise search bar */}
          <form className="hero-search-bar" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search courses or skills..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search academy courses and programs"
              />
            </div>
            <button type="submit" className="hero-search-btn">
              <span>Find Course</span>
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </form>

          {/* Quick tags */}
          <div className="hero-quick-tags">
            <span className="quick-tags-label">Trending:</span>
            <button type="button" className="quick-tag-pill" onClick={() => onSearch && onSearch('ASP.NET Core')}>ASP.NET Core</button>
            <button type="button" className="quick-tag-pill" onClick={() => onSearch && onSearch('Generative AI')}>Generative AI</button>
            <button type="button" className="quick-tag-pill" onClick={() => onSearch && onSearch('Data Science')}>Data Science</button>
            <button type="button" className="quick-tag-pill" onClick={() => onSearch && onSearch('DevOps')}>DevOps</button>
          </div>

          {/* Perfectly aligned Action CTAs */}
          <div className="hero-actions">
            <a
              href="#courses"
              className="btn-primary-hero"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Explore Programs</span>
              <ArrowRight size={15} aria-hidden="true" />
            </a>
            <a
              href="#career-paths"
              className="btn-secondary-hero"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('career-paths');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Career Path Discovery</span>
            </a>
          </div>

          {/* Clean trust highlights - No check marks */}
          <div className="hero-trust-bullets">
            <span className="trust-pill">Production-Grade Code</span>
            <span className="trust-sep">·</span>
            <span className="trust-pill">Hands-on Capstones</span>
            <span className="trust-sep">·</span>
            <span className="trust-pill">Offline Studios & Online LMS</span>
          </div>
        </div>

        {/* Clean, Uncluttered Visual Showcase */}
        <div className="hero-visual">
          <div className="visual-card-frame clean-frame">
            <img
              src="/images/tech-hero.jpg"
              alt="Andalusia Academy Modern Tech Lab"
              className="hero-main-img"
            />
          </div>

          {/* Minimal, elegant metric bar */}
          <div className="hero-metric-bar">
            <div className="metric-col">
              <span className="metric-number">18,500+</span>
              <span className="metric-desc">Graduated Developers</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <span className="metric-number">64+</span>
              <span className="metric-desc">Tech Bootcamps</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <span className="metric-number">96.8%</span>
              <span className="metric-desc">Career Placement Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
