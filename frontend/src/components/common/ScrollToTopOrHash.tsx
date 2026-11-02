import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isPageRoute } from "../../types/navigation";

export default function ScrollToTopOrHash() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const prevPathnameRef = useRef(pathname);

  // Disable browser automatic scroll restoration so SPA transitions start cleanly at top
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  // Backward compatibility: redirect legacy hash page routes (e.g. #about -> /about)
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const rawHash = window.location.hash.replace("#", "");
    if (isPageRoute(rawHash) && rawHash !== "home") {
      navigate(`/${rawHash}`, { replace: true });
    }
  }, [navigate]);

  // Synchronously reset scroll position to top before paint on route changes
  useLayoutEffect(() => {
    const pathnameChanged = prevPathnameRef.current !== pathname;
    prevPathnameRef.current = pathname;

    if (!hash) {
      // Jump immediately to top before paint so pages never flash lower sections first
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }

    // If navigating from another page to a hash section, reset to top first
    if (pathnameChanged) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }

    const targetId = hash.replace("#", "");
    const frameId = requestAnimationFrame(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    });
    return () => cancelAnimationFrame(frameId);
  }, [pathname, hash]);

  return null;
}
