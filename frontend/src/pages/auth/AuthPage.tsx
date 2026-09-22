import React, { useState, useRef, useEffect, type ChangeEvent, type FormEvent, type FocusEvent, type MouseEvent } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Mail, LockKeyhole, UserRound } from 'lucide-react';
import Brand from '../../components/common/Brand';
import Field from '../../components/forms/Field';
import { useAuth, type AuthContextType } from '../../context/AuthContext';


export interface AuthPageProps {
  page: 'login' | 'signup' | string;
  onNavigate?: (page: 'login' | 'signup' | string) => void;
}

export interface FormValues {
  name: string;
  email: string;
  password: string;
  rememberMe: boolean;
  [key: string]: string | boolean;
}

export interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  [key: string]: string | undefined;
}

export interface FormTouched {
  name?: boolean;
  email?: boolean;
  password?: boolean;
  [key: string]: boolean | undefined;
}



export const AuthPage: React.FC<AuthPageProps> = ({ page, onNavigate }) => {
  const isSignup = page === 'signup';
  const { login, signup, loading } = useAuth();

  const emailRef = useRef<HTMLInputElement>(null);

  const [values, setValues] = useState<FormValues>({
    name: '',
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    emailRef.current?.focus();
    setErrors({});
    setTouched({});
    setSubmitError('');
  }, [page]);

  const validate = (formValues: FormValues): FormErrors => {
    const newErrors: FormErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isSignup) {
      const trimmedName = formValues.name.trim();
      const nameParts = trimmedName.split(/\s+/).filter(Boolean);

      if (!trimmedName) {
        newErrors.name = 'Full name is required';
      } else if (nameParts.length < 2) {
        newErrors.name = 'Please enter both your first and last name';
      } else if (nameParts.some((part) => part.length < 2)) {
        newErrors.name = 'Each part of your name must be at least 2 characters';
      }
    }

    const trimmedEmail = formValues.email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(trimmedEmail)) {
      newErrors.email = 'Enter a valid email address (e.g., name@example.com)';
    }

    if (!formValues.password) {
      newErrors.password = 'Password is required';
    } else if (formValues.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (isSignup) {
      if (!/[A-Z]/.test(formValues.password)) {
        newErrors.password = 'Password must contain at least one uppercase letter (A-Z)';
      } else if (!/\d/.test(formValues.password)) {
        newErrors.password = 'Password must contain at least one number (0-9)';
      } else if (!/[^a-zA-Z0-9]/.test(formValues.password)) {
        newErrors.password = 'Password must contain at least one special character (@, #, $, !, etc.)';
      }
    }

    return newErrors;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValues: FormValues = {
      ...values,
      [name]: type === 'checkbox' ? checked : value
    };
    setValues(newValues);

    if (touched[name]) {
      setErrors(validate(newValues));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors(validate(values));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validate(values);
    setErrors(validationErrors);
    setTouched({
      name: true,
      email: true,
      password: true
    });

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    let result: { success: boolean; error?: string } | undefined;
    if (isSignup) {
      result = await signup(values.name, values.email, values.password);
    } else {
      result = await login(values.email, values.password);
    }

    if (result && !result.success) {
      setSubmitError(result.error || 'Authentication failed');
    }
  };

  return (
    <section className="form-panel" aria-label={isSignup ? 'Sign up' : 'Log in'}>
      <header>
        <div className="header-left">
          <a
            href="/"
            className="back-home-btn"
            aria-label="Go back to homepage"
            title="Go back to homepage"
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              if (onNavigate) {
                onNavigate('home');
              }
            }}
          >
            <ArrowLeft size={16} />
            <span>Home</span>
          </a>
          <Brand />
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
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (onNavigate) onNavigate('login');
            }}
          >
            Log in
          </a>
          <a
            className={isSignup ? 'active' : ''}
            href="#signup"
            aria-current={isSignup ? 'page' : undefined}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (onNavigate) onNavigate('signup');
            }}
          >
            Create an account
          </a>
        </div>

        {submitError && <p className="form-error">{submitError}</p>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <Field
              name="name"
              label="Full name"
              placeholder="Your full name"
              autoComplete="name"
              icon={UserRound}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
            />
          )}
          <Field
            name="email"
            label="Email address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            icon={Mail}
            inputRef={emailRef}
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
          />
          <Field
            name="password"
            label="Password"
            type="password"
            placeholder={isSignup ? 'Create a password' : 'Enter your password'}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            icon={LockKeyhole}
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            touched={touched.password}
          />
          {isSignup ? (
            <p className="password-hint">Use at least 8 characters, an uppercase letter, number, and symbol.</p>
          ) : (
            <div className="form-options">
              <label className="checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={values.rememberMe}
                  onChange={handleChange}
                /> Remember me
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
          <button className="submit" type="submit" disabled={loading}>
            {loading
              ? 'Processing...'
              : isSignup
                ? 'Create account'
                : 'Log in to your academy'}
            <ArrowRight size={18} />
          </button>
        </form>
        <p className="switch-copy">
          {isSignup ? 'Already part of the academy?' : 'New to Andalusia Academy?'}
          <a
            href={isSignup ? '#login' : '#signup'}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
              e.preventDefault();
              if (onNavigate) onNavigate(isSignup ? 'login' : 'signup');
            }}
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
};

export default AuthPage;
