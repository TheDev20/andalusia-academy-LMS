import './AuthPage.css';
import React from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Mail, LockKeyhole, UserRound } from 'lucide-react';
import Brand from '../../../components/common/Brand';
import Field from '../../../components/forms/Field';
import { AppRoute, NavigateFunction } from '../../../types/navigation';

export interface AuthPageProps {
  page: AppRoute | string;
  onNavigate?: NavigateFunction;
}

export default function AuthPage({ page, onNavigate }: AuthPageProps) {
  const isSignup = page === 'signup';

  return (
    <section className="form-panel" aria-label={isSignup ? 'Sign up' : 'Log in'}>
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Brand href="#home" onClick={() => onNavigate && onNavigate('home')} />
          <a
            href="#home"
            className="back-to-site-btn"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('home');
              else window.location.hash = '#home';
            }}
            title="Return to Andalusia Academy public website"
          >
            <ArrowLeft size={13} aria-hidden="true" />
            <span>Website</span>
          </a>
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
          <a
            className={!isSignup ? 'active' : ''}
            href="#login"
            aria-current={!isSignup ? 'page' : undefined}
            onClick={() => onNavigate && onNavigate('login')}
          >
            Log in
          </a>
          <a
            className={isSignup ? 'active' : ''}
            href="#signup"
            aria-current={isSignup ? 'page' : undefined}
            onClick={() => onNavigate && onNavigate('signup')}
          >
            Create an account
          </a>
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
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={Mail}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            placeholder={isSignup ? 'Create a password' : 'Enter your password'}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            icon={LockKeyhole}
          />
          {isSignup ? (
            <p className="password-hint">Use at least 8 characters for your password.</p>
          ) : (
            <div className="form-options">
              <label className="checkbox">
                <input type="checkbox" /> Remember me
              </label>
              <button
                type="button"
                className="text-button"
                disabled
                title="Available when authentication is connected"
              >
                Forgot password?
              </button>
            </div>
          )}
          <button className="submit" type="submit">
            {isSignup ? 'Create account' : 'Log in to your academy'}
            <ArrowRight size={18} />
          </button>
          <p className="demo-note">
            Design preview · {isSignup ? 'Account creation' : 'Sign-in'} is not connected yet.
          </p>
        </form>
        <p className="switch-copy">
          {isSignup ? 'Already part of the academy?' : 'New to Andalusia Academy?'}
          <a
            href={isSignup ? '#login' : '#signup'}
            onClick={() => onNavigate && onNavigate(isSignup ? 'login' : 'signup')}
          >
            {isSignup ? 'Log in' : 'Join us'}
            <ArrowUpRight size={13} />
          </a>
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
