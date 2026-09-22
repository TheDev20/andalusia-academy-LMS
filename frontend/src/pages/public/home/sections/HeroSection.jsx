import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Search, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  Play, 
  Sparkles, 
  Cpu, 
  Database, 
  Code2, 
  Cloud, 
  ShieldCheck, 
  Check,
  Flame,
  Award,
  Users,
  Files,
  GitBranch,
  Bug,
  Blocks,
  User,
  Settings,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  X,
  Plus,
  Trash2,
  Bell,
  ArrowLeft,
  Maximize2,
  Minus
} from 'lucide-react';

export default function HeroSection({ onNavigate, onSearch }) {
  const [query, setQuery] = useState('');
  const [activeFile, setActiveFile] = useState('App.tsx');
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 8,
    minutes: 45,
    seconds: 21,
  });

  // Dynamic ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrackClick = (trackQuery) => {
    if (onSearch) onSearch(trackQuery);
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // High-demand market technology branches
  const techTracks = [
    { label: 'Generative AI & LLMs', query: 'Generative AI', icon: Cpu, badge: 'High Demand' },
    { label: 'Data Science & ML', query: 'Data Science', icon: Database, badge: 'Popular' },
    { label: '.NET & Full-Stack', query: 'ASP.NET Core', icon: Code2 },
    { label: 'Cloud & DevOps', query: 'DevOps', icon: Cloud },
    { label: 'Cybersecurity', query: 'Cybersecurity', icon: ShieldCheck },
  ];

  // Authentic Multi-File IDE project tree matching reference layout
  const ideFiles = {
    'App.tsx': {
      name: 'App.tsx',
      icon: '⚛',
      iconColor: '#38bdf8',
      path: 'src > App.tsx',
      lang: 'TypeScript JSX',
      lnCol: 'Ln 18, Col 3',
      lines: [
        { num: 1, tokens: [{ t: 'kw', v: 'import' }, { t: 'plain', v: ' { ' }, { t: 'fn', v: 'useState' }, { t: 'plain', v: ', ' }, { t: 'fn', v: 'useEffect' }, { t: 'plain', v: ' } ' }, { t: 'kw', v: 'from' }, { t: 'plain', v: ' ' }, { t: 'str', v: "'react'" }, { t: 'plain', v: ';' }] },
        { num: 2, tokens: [{ t: 'kw', v: 'import' }, { t: 'plain', v: ' ' }, { t: 'str', v: "'./styles.css'" }, { t: 'plain', v: ';' }] },
        { num: 3, tokens: [{ t: 'plain', v: '' }] },
        { num: 4, tokens: [{ t: 'kw', v: 'export' }, { t: 'plain', v: ' ' }, { t: 'kw', v: 'default' }, { t: 'plain', v: ' ' }, { t: 'kw', v: 'function' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'App' }, { t: 'plain', v: '() {' }] },
        { num: 5, tokens: [{ t: 'plain', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'plain', v: ' [' }, { t: 'var', v: 'count' }, { t: 'plain', v: ', ' }, { t: 'fn', v: 'setCount' }, { t: 'plain', v: '] = ' }, { t: 'fn', v: 'useState' }, { t: 'plain', v: '(' }, { t: 'num', v: '0' }, { t: 'plain', v: ');' }] },
        { num: 6, tokens: [{ t: 'plain', v: '  ' }, { t: 'kw', v: 'const' }, { t: 'plain', v: ' [' }, { t: 'var', v: 'track' }, { t: 'plain', v: '] = ' }, { t: 'fn', v: 'useState' }, { t: 'plain', v: '(' }, { t: 'str', v: "'AI & Full-Stack'" }, { t: 'plain', v: ');' }] },
        { num: 7, tokens: [{ t: 'plain', v: '' }] },
        { num: 8, tokens: [{ t: 'plain', v: '  ' }, { t: 'kw', v: 'return' }, { t: 'plain', v: ' (' }] },
        { num: 9, tokens: [{ t: 'plain', v: '    ' }, { t: 'tag', v: '<' }, { t: 'fn', v: 'div' }, { t: 'plain', v: ' ' }, { t: 'prop', v: 'className' }, { t: 'op', v: '=' }, { t: 'str', v: '"andalusia-app"' }, { t: 'tag', v: '>' }] },
        { num: 10, tokens: [{ t: 'plain', v: '      ' }, { t: 'tag', v: '<' }, { t: 'fn', v: 'header' }, { t: 'plain', v: ' ' }, { t: 'prop', v: 'className' }, { t: 'op', v: '=' }, { t: 'str', v: '"header"' }, { t: 'tag', v: '>' }] },
        { num: 11, tokens: [{ t: 'plain', v: '        ' }, { t: 'tag', v: '<' }, { t: 'fn', v: 'h1' }, { t: 'tag', v: '>' }, { t: 'plain', v: 'Andalusia Production Lab' }, { t: 'tag', v: '</' }, { t: 'fn', v: 'h1' }, { t: 'tag', v: '>' }] },
        { num: 12, tokens: [{ t: 'plain', v: '        ' }, { t: 'tag', v: '<' }, { t: 'fn', v: 'p' }, { t: 'tag', v: '>' }, { t: 'plain', v: 'Cohort 2026 · AI & Data Science' }, { t: 'tag', v: '</' }, { t: 'fn', v: 'p' }, { t: 'tag', v: '>' }] },
        { num: 13, tokens: [{ t: 'plain', v: '      ' }, { t: 'tag', v: '</' }, { t: 'fn', v: 'header' }, { t: 'tag', v: '>' }] },
        { num: 14, tokens: [{ t: 'plain', v: '      ' }, { t: 'tag', v: '<' }, { t: 'fn', v: 'button' }, { t: 'plain', v: ' ' }, { t: 'prop', v: 'onClick' }, { t: 'op', v: '=' }, { t: 'plain', v: '{() => ' }, { t: 'fn', v: 'setCount' }, { t: 'plain', v: '(c => c + 1)}' }, { t: 'tag', v: '>' }] },
        { num: 15, tokens: [{ t: 'plain', v: '        Active Labs: {' }, { t: 'var', v: 'count' }, { t: 'plain', v: '}' }] },
        { num: 16, tokens: [{ t: 'plain', v: '      ' }, { t: 'tag', v: '</' }, { t: 'fn', v: 'button' }, { t: 'tag', v: '>' }] },
        { num: 17, tokens: [{ t: 'plain', v: '    ' }, { t: 'tag', v: '</' }, { t: 'fn', v: 'div' }, { t: 'tag', v: '>' }] },
        { num: 18, tokens: [{ t: 'plain', v: '  );' }] },
        { num: 19, tokens: [{ t: 'plain', v: '}' }] },
      ],
      terminal: [
        { t: 'cmd', v: '➜ my-app npm run dev' },
        { t: 'sub', v: '> my-app@0.0.0 dev' },
        { t: 'sub', v: '> vite' },
        { t: 'blank', v: '' },
        { t: 'ok', v: '  VITE v5.0.8 ready in 317ms' },
        { t: 'blank', v: '' },
        { t: 'link', v: '  ➜ Local:   http://localhost:5173/' },
        { t: 'dim', v: '  ➜ press h to show help' },
      ],
    },
    'styles.css': {
      name: 'styles.css',
      icon: '#',
      iconColor: '#38bdf8',
      path: 'src > styles.css',
      lang: 'CSS',
      lnCol: 'Ln 12, Col 1',
      lines: [
        { num: 1, tokens: [{ t: 'comm', v: '/* Andalusia Academy Design Tokens */' }] },
        { num: 2, tokens: [{ t: 'kw', v: ':root' }, { t: 'plain', v: ' {' }] },
        { num: 3, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: '--color-gold' }, { t: 'plain', v: ': ' }, { t: 'str', v: '#d8a56f' }, { t: 'plain', v: ';' }] },
        { num: 4, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: '--color-espresso' }, { t: 'plain', v: ': ' }, { t: 'str', v: '#1c1612' }, { t: 'plain', v: ';' }] },
        { num: 5, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: '--glass-bevel' }, { t: 'plain', v: ': ' }, { t: 'str', v: 'rgba(255, 255, 255, 0.45)' }, { t: 'plain', v: ';' }] },
        { num: 6, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: '--backdrop' }, { t: 'plain', v: ': ' }, { t: 'fn', v: 'blur' }, { t: 'plain', v: '(' }, { t: 'num', v: '48px' }, { t: 'plain', v: ');' }] },
        { num: 7, tokens: [{ t: 'plain', v: '}' }] },
        { num: 8, tokens: [{ t: 'plain', v: '' }] },
        { num: 9, tokens: [{ t: 'kw', v: '.andalusia-app' }, { t: 'plain', v: ' {' }] },
        { num: 10, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: 'display' }, { t: 'plain', v: ': ' }, { t: 'str', v: 'flex' }, { t: 'plain', v: ';' }] },
        { num: 11, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: 'flex-direction' }, { t: 'plain', v: ': ' }, { t: 'str', v: 'column' }, { t: 'plain', v: ';' }] },
        { num: 12, tokens: [{ t: 'plain', v: '}' }] },
      ],
      terminal: [
        { t: 'cmd', v: '➜ my-app npm run build:css' },
        { t: 'ok', v: '  ✓ PostCSS compiled in 14ms' },
        { t: 'dim', v: '  ➜ 0 errors · 0 warnings' },
      ],
    },
    'train_agent.py': {
      name: 'train_agent.py',
      icon: '🐍',
      iconColor: '#facc15',
      path: 'src > train_agent.py',
      lang: 'Python 3.12',
      lnCol: 'Ln 11, Col 4',
      lines: [
        { num: 1, tokens: [{ t: 'kw', v: 'import' }, { t: 'plain', v: ' ' }, { t: 'var', v: 'torch' }] },
        { num: 2, tokens: [{ t: 'kw', v: 'from' }, { t: 'plain', v: ' ' }, { t: 'var', v: 'transformers' }, { t: 'plain', v: ' ' }, { t: 'kw', v: 'import' }, { t: 'plain', v: ' ' }, { t: 'type', v: 'AutoModelForCausalLM' }, { t: 'plain', v: ', ' }, { t: 'type', v: 'Trainer' }] },
        { num: 3, tokens: [{ t: 'plain', v: '' }] },
        { num: 4, tokens: [{ t: 'comm', v: '# Initialize Andalusia Fine-Tuned LLM Pipeline' }] },
        { num: 5, tokens: [{ t: 'var', v: 'model' }, { t: 'op', v: ' = ' }, { t: 'type', v: 'AutoModelForCausalLM' }, { t: 'op', v: '.' }, { t: 'fn', v: 'from_pretrained' }, { t: 'plain', v: '(' }, { t: 'str', v: '"andalusia-7b"' }, { t: 'plain', v: ')' }] },
        { num: 6, tokens: [{ t: 'var', v: 'optimizer' }, { t: 'op', v: ' = ' }, { t: 'var', v: 'torch' }, { t: 'op', v: '.' }, { t: 'var', v: 'optim' }, { t: 'op', v: '.' }, { t: 'type', v: 'AdamW' }, { t: 'plain', v: '(' }, { t: 'var', v: 'model' }, { t: 'op', v: '.' }, { t: 'fn', v: 'parameters' }, { t: 'plain', v: '(), ' }, { t: 'prop', v: 'lr' }, { t: 'op', v: '=' }, { t: 'num', v: '2e-5' }, { t: 'plain', v: ')' }] },
        { num: 7, tokens: [{ t: 'plain', v: '' }] },
        { num: 8, tokens: [{ t: 'kw', v: 'def' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'evaluate_agent' }, { t: 'plain', v: '(' }, { t: 'prop', v: 'eval_dataset' }, { t: 'plain', v: '):' }] },
        { num: 9, tokens: [{ t: 'plain', v: '    ' }, { t: 'var', v: 'metrics' }, { t: 'op', v: ' = ' }, { t: 'var', v: 'trainer' }, { t: 'op', v: '.' }, { t: 'fn', v: 'evaluate' }, { t: 'plain', v: '(' }, { t: 'prop', v: 'eval_dataset' }, { t: 'plain', v: ')' }] },
        { num: 10, tokens: [{ t: 'plain', v: '    ' }, { t: 'kw', v: 'return' }, { t: 'plain', v: ' {' }, { t: 'str', v: '"accuracy"' }, { t: 'op', v: ': ' }, { t: 'num', v: '0.994' }, { t: 'plain', v: ', ' }, { t: 'str', v: '"loss"' }, { t: 'op', v: ': ' }, { t: 'num', v: '0.042' }, { t: 'plain', v: '}' }] },
      ],
      terminal: [
        { t: 'cmd', v: '➜ my-app python train_agent.py --eval' },
        { t: 'sub', v: '> Detected 8x NVIDIA H100 GPU Cluster' },
        { t: 'sub', v: '> Model Checkpoint: andalusia-7b-v2' },
        { t: 'blank', v: '' },
        { t: 'ok', v: '  ✓ Validation Complete: 99.4% Accuracy · Loss: 0.042' },
        { t: 'link', v: '  ➜ Latency: 14ms · Zero Hallucination Guardrails Active' },
      ],
    },
    'package.json': {
      name: 'package.json',
      icon: '{ }',
      iconColor: '#f97316',
      path: 'package.json',
      lang: 'JSON',
      lnCol: 'Ln 10, Col 2',
      lines: [
        { num: 1, tokens: [{ t: 'plain', v: '{' }] },
        { num: 2, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: '"name"' }, { t: 'plain', v: ': ' }, { t: 'str', v: '"andalusia-lms"' }, { t: 'plain', v: ',' }] },
        { num: 3, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: '"version"' }, { t: 'plain', v: ': ' }, { t: 'str', v: '"2.0.0"' }, { t: 'plain', v: ',' }] },
        { num: 4, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: '"dependencies"' }, { t: 'plain', v: ': {' }] },
        { num: 5, tokens: [{ t: 'plain', v: '    ' }, { t: 'prop', v: '"react"' }, { t: 'plain', v: ': ' }, { t: 'str', v: '"^19.1.0"' }, { t: 'plain', v: ',' }] },
        { num: 6, tokens: [{ t: 'plain', v: '    ' }, { t: 'prop', v: '"@andalusia/core"' }, { t: 'plain', v: ': ' }, { t: 'str', v: '"^2.4.0"' }, { t: 'plain', v: ',' }] },
        { num: 7, tokens: [{ t: 'plain', v: '    ' }, { t: 'prop', v: '"torch"' }, { t: 'plain', v: ': ' }, { t: 'str', v: '"^2.3.0"' }] },
        { num: 8, tokens: [{ t: 'plain', v: '  }' }] },
        { num: 9, tokens: [{ t: 'plain', v: '}' }] },
      ],
      terminal: [
        { t: 'cmd', v: '➜ my-app npm audit' },
        { t: 'ok', v: '  ✓ found 0 vulnerabilities' },
      ],
    },
    'vite.config.ts': {
      name: 'vite.config.ts',
      icon: '⚡',
      iconColor: '#a855f7',
      path: 'vite.config.ts',
      lang: 'TypeScript',
      lnCol: 'Ln 6, Col 1',
      lines: [
        { num: 1, tokens: [{ t: 'kw', v: 'import' }, { t: 'plain', v: ' { ' }, { t: 'fn', v: 'defineConfig' }, { t: 'plain', v: ' } ' }, { t: 'kw', v: 'from' }, { t: 'plain', v: ' ' }, { t: 'str', v: "'vite'" }, { t: 'plain', v: ';' }] },
        { num: 2, tokens: [{ t: 'kw', v: 'import' }, { t: 'plain', v: ' ' }, { t: 'var', v: 'react' }, { t: 'plain', v: ' ' }, { t: 'kw', v: 'from' }, { t: 'plain', v: ' ' }, { t: 'str', v: "'@vitejs/plugin-react'" }, { t: 'plain', v: ';' }] },
        { num: 3, tokens: [{ t: 'plain', v: '' }] },
        { num: 4, tokens: [{ t: 'kw', v: 'export' }, { t: 'plain', v: ' ' }, { t: 'kw', v: 'default' }, { t: 'plain', v: ' ' }, { t: 'fn', v: 'defineConfig' }, { t: 'plain', v: '({' }] },
        { num: 5, tokens: [{ t: 'plain', v: '  ' }, { t: 'prop', v: 'plugins' }, { t: 'plain', v: ': [' }, { t: 'fn', v: 'react' }, { t: 'plain', v: '()],' }] },
        { num: 6, tokens: [{ t: 'plain', v: '});' }] },
      ],
      terminal: [
        { t: 'cmd', v: '➜ my-app vite --version' },
        { t: 'ok', v: '  vite/5.0.8 win32-x64' },
      ],
    },
  };

  const currentFile = ideFiles[activeFile] || ideFiles['App.tsx'];

  return (
    <section className="hero-section" aria-label="Hero">
      <div className="hero-bg-accent" aria-hidden="true" />
      <div className="hero-container">
        
        {/* Left Column: Information & Conversion */}
        <div className="hero-content">
          
          {/* Live Cohort Countdown Pill */}
          <div className="hero-countdown-badge">
            <span className="live-pulsing-dot" aria-hidden="true" />
            <span className="countdown-label">LIVE COHORT STARTS IN:</span>
            <div className="countdown-timer">
              <span className="time-val">{timeLeft.days}d</span>
              <span className="time-sep">:</span>
              <span className="time-val">{String(timeLeft.hours).padStart(2, '0')}h</span>
              <span className="time-sep">:</span>
              <span className="time-val">{String(timeLeft.minutes).padStart(2, '0')}m</span>
              <span className="time-sep">:</span>
              <span className="time-val time-sec">{String(timeLeft.seconds).padStart(2, '0')}s</span>
            </div>
          </div>

          {/* Hero Main Headline */}
          <h1 className="hero-title">
            Master Modern Tech: <em>AI, Data Science</em> & Full-Stack Systems.
          </h1>

          <p className="hero-subtitle">
            Accelerate your engineering career with rigorous hands-on bootcamps, production codebases, and offline cohort sessions across the market's highest-demand disciplines.
          </p>

          {/* Primary Action Buttons */}
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
              <span>Explore All Programs</span>
              <ArrowRight size={16} aria-hidden="true" />
            </a>

            <a
              href="#cohort-schedule"
              className="btn-secondary-hero"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('cohort-schedule') || document.getElementById('courses');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span>Upcoming Cohorts</span>
            </a>
          </div>

          {/* Real-World Production Outcomes Metric Bar */}
          <div className="hero-metrics-inline" aria-label="Academy Achievements">
            <div className="inline-metric-item">
              <span className="inline-metric-val">18,500+</span>
              <span className="inline-metric-lbl">Graduated Developers</span>
            </div>
            <div className="inline-metric-div" />
            <div className="inline-metric-item">
              <span className="inline-metric-val">96.8%</span>
              <span className="inline-metric-lbl">Career Placement</span>
            </div>
            <div className="inline-metric-div" />
            <div className="inline-metric-item">
              <span className="inline-metric-val">100%</span>
              <span className="inline-metric-lbl">Production Labs</span>
            </div>
          </div>

          {/* Market Technology Branches Pill Filters */}
          <div className="hero-tech-branches-wrap">
            <span className="tech-branches-title">Explore Core Technology Tracks:</span>
            <div className="tech-branches-list">
              {techTracks.map((track) => {
                const IconComponent = track.icon;
                return (
                  <button
                    key={track.query}
                    type="button"
                    className="tech-track-btn"
                    onClick={() => handleTrackClick(track.query)}
                  >
                    <IconComponent size={14} className="track-icon" aria-hidden="true" />
                    <span>{track.label}</span>
                    {track.badge && <span className="track-mini-badge">{track.badge}</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Unified Discovery Search Bar */}
          <form className="hero-search-bar" onSubmit={handleSearchSubmit}>
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search courses, tracks, or skills (e.g. AI, Python)..."
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

          {/* Alumni Hiring Trust Banner with Authentic Company Logos */}
          <div className="hero-alumni-trust">
            <span className="alumni-trust-title">WHERE OUR ALUMNI ENGINEER THE FUTURE</span>
            <div className="alumni-logos-row" aria-label="Alumni employment partners">
              <div className="company-logo-item" title="Google">
                <img src="/images/logos/google.svg" alt="Google" className="company-logo-img google" />
              </div>

              <div className="company-logo-item" title="Microsoft">
                <img src="/images/logos/microsoft.svg" alt="Microsoft" className="company-logo-img microsoft" />
              </div>

              <div className="company-logo-item" title="Amazon">
                <img src="/images/logos/amazon.svg" alt="Amazon" className="company-logo-img amazon" />
              </div>

              <div className="company-logo-item" title="Stripe">
                <img src="/images/logos/stripe.svg" alt="Stripe" className="company-logo-img stripe" />
              </div>

              <div className="company-logo-item" title="Meta">
                <img src="/images/logos/meta.svg" alt="Meta" className="company-logo-img meta" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Full Authentic VS Code Studio in Website Theme */}
        <div className="hero-visual">
          
          <div className="vscode-studio-window">
            
            {/* 1. Title Bar */}
            <div className="vscode-titlebar">
              <div className="titlebar-left">
                <div className="window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <div className="titlebar-nav">
                  <ArrowLeft size={13} className="nav-arrow" />
                  <ArrowRight size={13} className="nav-arrow" />
                </div>
              </div>

              <div className="titlebar-center">
                <div className="command-palette-pill">
                  <Search size={12} className="cmd-icon" />
                  <span className="cmd-text">my-app</span>
                </div>
              </div>

              <div className="titlebar-right">
                <button type="button" className="btn-run-action" title="Run Code">
                  <Play size={11} fill="currentColor" />
                  <ChevronDown size={10} />
                </button>
                <div className="titlebar-win-controls">
                  <Minus size={11} />
                  <Maximize2 size={10} />
                  <X size={11} />
                </div>
              </div>
            </div>

            {/* 2. Main Studio Workspace (Activity Bar + Explorer + Editor/Terminal) */}
            <div className="vscode-main-workspace">
              
              {/* Activity Bar */}
              <div className="vscode-activity-bar">
                <div className="activity-top">
                  <div className="activity-item brand-badge">
                    <Code2 size={16} />
                  </div>
                  <button type="button" className="activity-item is-active" title="Explorer">
                    <Files size={17} />
                  </button>
                  <button type="button" className="activity-item" title="Search">
                    <Search size={17} />
                  </button>
                  <button type="button" className="activity-item" title="Source Control">
                    <GitBranch size={17} />
                  </button>
                  <button type="button" className="activity-item" title="Run and Debug">
                    <Bug size={17} />
                  </button>
                  <button type="button" className="activity-item" title="Extensions">
                    <Blocks size={17} />
                  </button>
                </div>
                <div className="activity-bottom">
                  <button type="button" className="activity-item" title="Accounts">
                    <User size={16} />
                  </button>
                  <button type="button" className="activity-item" title="Settings">
                    <Settings size={16} />
                  </button>
                </div>
              </div>

              {/* Sidebar Explorer */}
              <div className="vscode-sidebar">
                <div className="sidebar-header">
                  <span className="sidebar-title">EXPLORER</span>
                  <MoreHorizontal size={13} className="sidebar-opt-icon" />
                </div>

                <div className="sidebar-tree">
                  <div className="tree-project-root">
                    <ChevronDown size={11} />
                    <span className="root-name">MY-APP</span>
                  </div>

                  <div className="tree-items-list">
                    <div className="tree-row folder">
                      <ChevronRight size={10} />
                      <span>node_modules</span>
                    </div>
                    <div className="tree-row folder">
                      <ChevronRight size={10} />
                      <span>public</span>
                    </div>
                    
                    <div className="tree-row folder is-open">
                      <ChevronDown size={10} />
                      <span>src</span>
                    </div>

                    <div className="tree-children">
                      <div className="tree-row folder sub-folder">
                        <ChevronRight size={10} />
                        <span>components</span>
                      </div>

                      {/* App.tsx */}
                      <button
                        type="button"
                        className={`tree-row file ${activeFile === 'App.tsx' ? 'is-selected' : ''}`}
                        onClick={() => setActiveFile('App.tsx')}
                      >
                        <span className="file-glyph react">⚛</span>
                        <span className="file-name">App.tsx</span>
                      </button>

                      {/* styles.css */}
                      <button
                        type="button"
                        className={`tree-row file ${activeFile === 'styles.css' ? 'is-selected' : ''}`}
                        onClick={() => setActiveFile('styles.css')}
                      >
                        <span className="file-glyph css">#</span>
                        <span className="file-name">styles.css</span>
                      </button>

                      {/* train_agent.py */}
                      <button
                        type="button"
                        className={`tree-row file ${activeFile === 'train_agent.py' ? 'is-selected' : ''}`}
                        onClick={() => setActiveFile('train_agent.py')}
                      >
                        <span className="file-glyph python">🐍</span>
                        <span className="file-name">train_agent.py</span>
                      </button>
                    </div>

                    {/* Root Files */}
                    <button
                      type="button"
                      className={`tree-row file root-file ${activeFile === 'package.json' ? 'is-selected' : ''}`}
                      onClick={() => setActiveFile('package.json')}
                    >
                      <span className="file-glyph json">&#123; &#125;</span>
                      <span className="file-name">package.json</span>
                    </button>

                    <div className="tree-row file root-file">
                      <span className="file-glyph ts">TS</span>
                      <span className="file-name">tsconfig.json</span>
                    </div>

                    <button
                      type="button"
                      className={`tree-row file root-file ${activeFile === 'vite.config.ts' ? 'is-selected' : ''}`}
                      onClick={() => setActiveFile('vite.config.ts')}
                    >
                      <span className="file-glyph vite">⚡</span>
                      <span className="file-name">vite.config.ts</span>
                    </button>
                  </div>

                  <div className="sidebar-accordion">
                    <div className="accordion-row">
                      <ChevronRight size={10} />
                      <span>OUTLINE</span>
                    </div>
                    <div className="accordion-row">
                      <ChevronRight size={10} />
                      <span>TIMELINE</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Code Editor & Integrated Terminal */}
              <div className="vscode-editor-panel">
                
                {/* Editor File Tabs */}
                <div className="editor-tabs-bar">
                  <div className="tabs-list">
                    <button
                      type="button"
                      className={`editor-tab ${activeFile === 'App.tsx' ? 'is-active' : ''}`}
                      onClick={() => setActiveFile('App.tsx')}
                    >
                      <span className="tab-glyph react">⚛</span>
                      <span className="tab-title">App.tsx</span>
                      <X size={11} className="tab-close" />
                    </button>

                    <button
                      type="button"
                      className={`editor-tab ${activeFile === 'styles.css' ? 'is-active' : ''}`}
                      onClick={() => setActiveFile('styles.css')}
                    >
                      <span className="tab-glyph css">#</span>
                      <span className="tab-title">styles.css</span>
                      <X size={11} className="tab-close" />
                    </button>

                    {activeFile === 'train_agent.py' && (
                      <button
                        type="button"
                        className="editor-tab is-active"
                      >
                        <span className="tab-glyph python">🐍</span>
                        <span className="tab-title">train_agent.py</span>
                        <X size={11} className="tab-close" />
                      </button>
                    )}

                    {activeFile === 'package.json' && (
                      <button
                        type="button"
                        className="editor-tab is-active"
                      >
                        <span className="tab-glyph json">&#123; &#125;</span>
                        <span className="tab-title">package.json</span>
                        <X size={11} className="tab-close" />
                      </button>
                    )}

                    {activeFile === 'vite.config.ts' && (
                      <button
                        type="button"
                        className="editor-tab is-active"
                      >
                        <span className="tab-glyph vite">⚡</span>
                        <span className="tab-title">vite.config.ts</span>
                        <X size={11} className="tab-close" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Breadcrumbs Row */}
                <div className="editor-breadcrumbs">
                  <span className="crumb-path">{currentFile.path}</span>
                  <span className="crumb-sep">&gt;</span>
                  <span className="crumb-func">...</span>
                </div>

                {/* Code Lines Pane */}
                <div className="editor-code-body">
                  <pre className="code-pre">
                    <code>
                      {currentFile.lines.map((line, idx) => (
                        <div key={idx} className="code-line-row">
                          <span className="line-num">{line.num}</span>
                          <span className="line-code">
                            {line.tokens.map((tok, tIdx) => (
                              <span key={tIdx} className={`tok-${tok.t}`}>
                                {tok.v}
                              </span>
                            ))}
                          </span>
                        </div>
                      ))}
                    </code>
                  </pre>
                </div>

                {/* Integrated Bottom Terminal Panel */}
                <div className="vscode-terminal-panel">
                  <div className="terminal-header">
                    <div className="terminal-tabs">
                      <span className="term-tab">PROBLEMS</span>
                      <span className="term-tab">OUTPUT</span>
                      <span className="term-tab">DEBUG CONSOLE</span>
                      <span className="term-tab is-active">TERMINAL</span>
                      <span className="term-tab">PORTS</span>
                    </div>

                    <div className="terminal-controls">
                      <Plus size={12} className="term-ctrl-icon" />
                      <div className="terminal-profile-select">
                        <span>zsh</span>
                        <ChevronDown size={10} />
                      </div>
                      <Trash2 size={12} className="term-ctrl-icon" />
                      <MoreHorizontal size={12} className="term-ctrl-icon" />
                      <X size={12} className="term-ctrl-icon" />
                    </div>
                  </div>

                  <div className="terminal-body">
                    {currentFile.terminal.map((item, idx) => (
                      <div key={idx} className={`term-line term-${item.t}`}>
                        {item.v}
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* 3. Bottom Status Bar */}
            <div className="vscode-statusbar">
              <div className="statusbar-left">
                <div className="status-item git-item">
                  <GitBranch size={11} />
                  <span>main</span>
                </div>
                <div className="status-item status-issues">
                  <span>⊗ 0</span>
                  <span>⚠ 0</span>
                </div>
              </div>

              <div className="statusbar-right">
                <span className="status-item">{currentFile.lnCol}</span>
                <span className="status-item">Spaces: 2</span>
                <span className="status-item">UTF-8</span>
                <span className="status-item">LF</span>
                <span className="status-item lang-badge">&#123; &#125; {currentFile.lang}</span>
                <span className="status-item"><Bell size={11} /></span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
