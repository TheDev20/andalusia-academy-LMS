import React, { useState, useEffect } from 'react';
import PublicLayout from './components/layout/PublicLayout';
import HomePage from './pages/public/home/HomePage';
import AboutPage from './pages/public/about/AboutPage';
import ContactPage from './pages/public/contact/ContactPage';
import AuthPage from './pages/auth/AuthPage';
import StoryPanel from './components/layout/StoryPanel';
import { AppRoute, NavigateFunction } from './types/navigation';
import './styles.css';

export default function App() {
  const getInitialRoute = (): AppRoute => {
    if (typeof window === 'undefined') return 'home';
    const hash = window.location.hash.replace('#', '') as AppRoute;
    if (['login', 'signup', 'about', 'contact', 'home'].includes(hash)) {
      return hash;
    }
    if (['courses', 'career-paths', 'corporate'].includes(hash)) {
      return 'home';
    }
    return 'home';
  };

  const [route, setRoute] = useState<AppRoute>(getInitialRoute);
  const [motion, setMotion] = useState<boolean>(true);

  // Sync route on hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as AppRoute;
      if (['login', 'signup', 'about', 'contact', 'home'].includes(hash)) {
        setRoute(hash);
      } else if (['courses', 'career-paths', 'corporate'].includes(hash)) {
        setRoute('home');
        setTimeout(() => {
          const el = document.getElementById(hash);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else if (!hash) {
        setRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update body class for auth view locked viewport vs scrollable public view
  useEffect(() => {
    const isAuth = route === 'login' || route === 'signup';
    if (isAuth) {
      document.documentElement.classList.add('auth-mode');
      document.body.classList.add('auth-mode');
    } else {
      document.documentElement.classList.remove('auth-mode');
      document.body.classList.remove('auth-mode');
    }
  }, [route]);

  const navigateTo: NavigateFunction = (newRoute) => {
    setRoute(newRoute as AppRoute);
    window.location.hash = `#${newRoute}`;
    if (newRoute !== 'login' && newRoute !== 'signup') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Render Login & Sign up Split Shell View
  if (route === 'login' || route === 'signup') {
    return (
      <main className={`shell ${motion ? '' : 'motion-paused'}`}>
        <AuthPage page={route} onNavigate={navigateTo} />
        <StoryPanel motion={motion} setMotion={setMotion} />
      </main>
    );
  }

  // Render Public Website with Layout Header & Footer
  return (
    <PublicLayout currentPath={route} onNavigate={navigateTo}>
      {route === 'about' && <AboutPage onNavigate={navigateTo} />}
      {route === 'contact' && <ContactPage />}
      {route === 'home' && <HomePage onNavigate={navigateTo} />}
    </PublicLayout>
  );
}
