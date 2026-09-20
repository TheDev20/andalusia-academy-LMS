import React, { useState } from 'react';
import { ArrowRight, Search, Award, Users, BookOpen, Building2, CheckCircle2, Code2, Sparkles, Database } from 'lucide-react';
import Badge from '../../../../components/common/Badge';

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
          <div className="hero-badge-wrap">
            <Badge variant="bronze" dot>
              PREMIER TECH & AI ACADEMY · EST. 2004
            </Badge>
          </div>

          <h1 className="hero-title">
            Where Engineering Mastery Meets <em>Applied Innovation.</em>
          </h1>

          <p className="hero-subtitle">
            Andalusia Academy is the premier technology institute empowering software developers, AI engineers, data scientists, and tech leaders across Egypt and the region with hands-on coding labs, offline cohort sessions, and industry-recognized diplomas.
          </p>

          {/* Search bar */}
          <form className="hero-search-bar" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search software development, AI, data science, ASP.NET Core, React..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search academy courses and programs"
              />
            </div>
            <button type="submit" className="hero-search-btn">
              <span>Find Course</span>
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>

          {/* Quick tags */}
          <div className="hero-quick-tags">
            <span className="quick-tags-label">Trending Tracks:</span>
            <a href="#courses" onClick={() => onSearch && onSearch('ASP.NET Core')}>ASP.NET Core</a>
            <a href="#courses" onClick={() => onSearch && onSearch('Generative AI')}>Generative AI</a>
            <a href="#courses" onClick={() => onSearch && onSearch('Data Science')}>Data Science</a>
            <a href="#courses" onClick={() => onSearch && onSearch('Cloud & DevOps')}>Cloud & DevOps</a>
          </div>

          {/* Action CTAs */}
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
              <span>Explore Programs & Bootcamps</span>
              <ArrowRight size={16} aria-hidden="true" />
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

          {/* Trust Highlights */}
          <div className="hero-trust-bullets">
            <div className="trust-bullet">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Production-Grade Code</span>
            </div>
            <div className="trust-bullet">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Hands-on Project Portfolios</span>
            </div>
            <div className="trust-bullet">
              <CheckCircle2 size={16} aria-hidden="true" />
              <span>Offline Classrooms & Online LMS</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-visual">
          <div className="visual-card-frame">
            <img
              src="/images/tech-hero.jpg"
              alt="Andalusia Academy Modern Tech Lab and Coding Innovation Environment"
              className="hero-main-img"
            />
            <div className="hero-overlay-card top-float">
              <Award size={20} className="float-icon" aria-hidden="true" />
              <div>
                <span className="float-stat">500+</span>
                <span className="float-label">Hands-on Lab Hours</span>
              </div>
            </div>

            <div className="hero-overlay-card bottom-float">
              <Building2 size={20} className="float-icon" aria-hidden="true" />
              <div>
                <span className="float-stat">Tech Hiring Network</span>
                <span className="float-label">Direct Industry Placement & Apprenticeships</span>
              </div>
            </div>
          </div>

          {/* Metric Bar */}
          <div className="hero-metric-bar">
            <div className="metric-col">
              <span className="metric-number">18,500+</span>
              <span className="metric-desc">Developers & Clinicians Trained</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <span className="metric-number">64+</span>
              <span className="metric-desc">Tech Bootcamps & Programs</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-col">
              <span className="metric-number">96.8%</span>
              <span className="metric-desc">Job Placement & Promotion Rate</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
