import './AuthPage.css';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowLeft, Mail, LockKeyhole, UserRound } from 'lucide-react';
import Brand from '../../../components/common/Brand';
import Field from '../../../components/forms/Field';
import { AppRoute, NavigateFunction } from '../../../types/navigation';

export interface AuthPageProps {
  page: AppRoute;
  onNavigate?: NavigateFunction;
}

export default function AuthPage({ page, onNavigate }: AuthPageProps) {
  const navigate = useNavigate();
  const isSignup = page === 'signup';

  const handleNav = (target: AppRoute) => {
    if (onNavigate) {
      onNavigate(target);
    } else {
      navigate(target === 'home' ? '/' : `/${target}`);
    }
  };

  return (
    <section className="form-panel" aria-label={isSignup ? 'Sign up' : 'Log in'}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Brand href="/" onClick={() => handleNav('home')} />
          <Link
            to="/"
            className="back-to-site-btn"
            title="Return to Andalusia Academy public website"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            <span>Website</span>
          </Link>
        </div>
        <span className="portal-label">LEARNING PORTAL</span>
      </header>
      <div className="form-content" key={page}>
        <div className="section-label">
          <span /> YOUR NEXT CHAPTER STARTS HERE
        </div>
        <h1>
          {isSignup ? (
            <>
              Make room<br />for <em>possibility.</em>
            </>
          ) : (
            <>
              Welcome<br /><em>back.</em>
            </>
          )}
        </h1>
        <p className="intro">
          {isSignup
            ? 'Join a community where learning becomes better care.'
            : 'Continue your journey of learning, growth, and care.'}
        </p>
        <div className="tabs" aria-label="Account pages">
          <Link
            className={!isSignup ? 'active' : ''}
            to="/login"
            aria-current={!isSignup ? 'page' : undefined}
          >
            Log in
          </Link>
          <Link
            className={isSignup ? 'active' : ''}
            to="/signup"
            aria-current={isSignup ? 'page' : undefined}
          >
            Create an account
          </Link>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          {isSignup && (
            <Field
              name="name"
              label="Full name"
              placeholder="Your full name"
              autoComplete="name"
              icon={UserRound}
            />
          )}
          <Field
            name="email"
            label="Work or personal email"
            placeholder="you@andalusiagroup.net"
            type="email"
            autoComplete="email"
            icon={Mail}
          />
          <Field
            name="password"
            label="Password"
            placeholder="••••••••••••"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            icon={LockKeyhole}
          />
          <button type="submit" className="submit-btn">
            <span>{isSignup ? 'Begin your journey' : 'Sign in to portal'}</span>
            <ArrowRight size={18} />
          </button>
          <p className="demo-note">
            Design preview · {isSignup ? 'Account creation' : 'Sign-in'} is not connected yet.
          </p>
        </form>
        <p className="switch-copy">
          {isSignup ? 'Already part of the academy?' : 'New to Andalusia Academy?'}
          <Link to={isSignup ? '/login' : '/signup'}>
            {isSignup ? 'Log in' : 'Join us'}
            <ArrowUpRight size={13} />
          </Link>
        </p>
      </div>
      <footer>
        <span>© {new Date().getFullYear()} Andalusia Academy</span>
        <a href="https://andalusiaegypt.com/en" target="_blank" rel="noreferrer">
          Visit Andalusia <ArrowUpRight size={13} />
        </a>
      </footer>
    </section>
  );
}
