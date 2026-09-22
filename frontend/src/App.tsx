import React, { useState, useEffect } from 'react';
import AuthPage from './pages/auth/AuthPage';
import StoryPanel from './components/layout/StoryPanel';
import { AuthProvider } from './context/AuthContext';
import './styles.css';

export default function App() {
  const [page, setPage] = useState<string>(
    typeof window !== 'undefined' && window.location.hash === '#signup' ? 'signup' : 'login'
  );
  const [motion, setMotion] = useState<boolean>(true);

  useEffect(() => {
    const sync = () => {
      setPage(window.location.hash === '#signup' ? 'signup' : 'login');
    };
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  return (
    <AuthProvider>
      <main className={`shell ${motion ? '' : 'motion-paused'}`}>
        <AuthPage page={page} onNavigate={setPage} />
        <StoryPanel motion={motion} setMotion={setMotion} />
      </main>
    </AuthProvider>
  );
}
