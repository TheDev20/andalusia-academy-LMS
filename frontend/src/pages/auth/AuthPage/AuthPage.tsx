import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, ArrowLeft, Mail, LockKeyhole, UserRound, Check } from 'lucide-react';
import { AppRoute, NavigateFunction } from '../../../types/navigation';
import Brand from '../../../components/common/Brand';
import Field from '../../../components/forms/Field';
import { useAuth } from '../../../context/AuthContext';
import { authApi } from '../../../services/api/authApi';
import './AuthPage.css';

export interface AuthPageProps {
  page: AppRoute;
  onNavigate?: NavigateFunction;
}

export default function AuthPage({ page, onNavigate }: AuthPageProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSignup = page === 'signup';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Live Password Criteria Check
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber;

  const handleNav = (target: AppRoute) => {
    if (onNavigate) {
      onNavigate(target);
    } else {
      navigate(target === 'home' ? '/' : `/${target}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignup && !isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    setLoading(true);

    try {
      if (isSignup) {
        const parts = name.trim().split(' ');
        const firstName = parts[0] || 'Learner';
        const lastName = parts.slice(1).join(' ') || 'Academy';

        const res = await authApi.register({ firstName, lastName, email, password });
        login(res.token, {
          id: res.userId,
          email: res.email,
          fullName: res.fullName,
          roles: res.roles,
        });
      } else {
        const res = await authApi.login({ email, password });
        login(res.token, {
          id: res.userId,
          email: res.email,
          fullName: res.fullName,
          roles: res.roles,
        });
      }

      navigate('/courses');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
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

        {error && (
          <div style={{ color: '#E05D52', background: '#FDF2F1', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <Field
              name="name"
              label="Full name"
              placeholder="Your full name"
              autoComplete="name"
              icon={UserRound}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Field
            name="email"
            label="Work or personal email"
            placeholder="you@andalusiagroup.net"
            type="email"
            autoComplete="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Field
            name="password"
            label="Password"
            placeholder="••••••••••••"
            type="password"
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            icon={LockKeyhole}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {isSignup && (
            <div className="password-requirements" aria-label="Password requirements">
              <span className="password-requirements-title">Password must contain:</span>
              <div className={`requirement-item ${hasMinLength ? 'valid' : ''}`}>
                <span className="requirement-icon">
                  {hasMinLength ? <Check size={13} strokeWidth={2.5} /> : <span className="requirement-dot" />}
                </span>
                <span>At least 8 characters</span>
              </div>
              <div className={`requirement-item ${hasUpper ? 'valid' : ''}`}>
                <span className="requirement-icon">
                  {hasUpper ? <Check size={13} strokeWidth={2.5} /> : <span className="requirement-dot" />}
                </span>
                <span>One uppercase letter (A-Z)</span>
              </div>
              <div className={`requirement-item ${hasLower ? 'valid' : ''}`}>
                <span className="requirement-icon">
                  {hasLower ? <Check size={13} strokeWidth={2.5} /> : <span className="requirement-dot" />}
                </span>
                <span>One lowercase letter (a-z)</span>
              </div>
              <div className={`requirement-item ${hasNumber ? 'valid' : ''}`}>
                <span className="requirement-icon">
                  {hasNumber ? <Check size={13} strokeWidth={2.5} /> : <span className="requirement-dot" />}
                </span>
                <span>One number (0-9)</span>
              </div>
              <div className={`requirement-item ${hasSpecial ? 'valid' : ''}`}>
                <span className="requirement-icon">
                  {hasSpecial ? <Check size={13} strokeWidth={2.5} /> : <span className="requirement-dot" />}
                </span>
                <span>One special symbol (e.g. !@#$%^&*)</span>
              </div>
            </div>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            <span>{loading ? 'Processing...' : isSignup ? 'Begin your journey' : 'Sign in to portal'}</span>
            <ArrowRight size={18} />
          </button>
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
