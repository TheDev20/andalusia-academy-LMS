import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isPageRoute, isSectionRoute } from '../../types/navigation';

export default function ScrollToTopOrHash() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();

  // Backward compatibility: redirect legacy hash page routes (e.g. #about -> /about)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rawHash = window.location.hash.replace('#', '');
    if (isPageRoute(rawHash) && rawHash !== 'home') {
      navigate(`/${rawHash}`, { replace: true });
    }
  }, [navigate]);

  // Handle section scrolling and scroll restoration
  useEffect(() => {
    if (hash) {
      const targetId = hash.replace('#', '');
      const frameId = requestAnimationFrame(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      });
      return () => cancelAnimationFrame(frameId);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
}
