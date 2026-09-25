import './PublicNavbar.css';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Brand from '../../common/Brand';
import { AppRoute, NavigateFunction, ROUTE_PATHS, isSectionRoute } from '../../../types/navigation';

export interface PublicNavbarProps {
  currentPath?: AppRoute;
  onNavigate?: NavigateFunction;
}

interface NavItem {
  label: string;
  href: string;
  key: AppRoute;
}

export default function PublicNavbar({ currentPath = 'home', onNavigate }: PublicNavbarProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>(currentPath);

  useEffect(() => {
    setActiveSection(currentPath);
  }, [currentPath]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ScrollSpy to highlight the active section when on the home page
  useEffect(() => {
    if (currentPath !== 'home') return;

    const sectionIds = ['home', 'career-paths', 'courses', 'corporate'];

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 160;
      let current = 'home';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener('scroll', handleScrollSpy);
  }, [currentPath]);

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', key: 'home' },
    { label: 'Career Paths', href: '/#career-paths', key: 'career-paths' },
    { label: 'Courses & Programs', href: '/#courses', key: 'courses' },
    { label: 'Corporate Training', href: '/#corporate', key: 'corporate' },
    { label: 'About Us', href: '/about', key: 'about' },
    { label: 'Contact', href: '/contact', key: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const route = item.key;
    if (isSectionRoute(route) || route === 'home') {
      setActiveSection(route);
    }
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigate(ROUTE_PATHS[route] || item.href);
    }
  };

  const isItemActive = (key: string) => {
    const isSection = ['home', 'career-paths', 'courses', 'corporate'].includes(key);
    return currentPath === 'home' && isSection
      ? activeSection === key
      : currentPath === key;
  };

  return (
    <header className={`public-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand-wrap">
          <Brand href="/" onClick={(e) => handleLinkClick(e, { label: 'Home', href: '/', key: 'home' })} />
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <ul className="nav-links-list">
            {navItems.map((item) => {
              const isActive = isItemActive(item.key);
              return (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className={`nav-link ${isActive ? 'is-active' : ''}`}
                    onClick={(e) => handleLinkClick(e, item)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Auth CTA Actions */}
        <div className="navbar-actions">
          <Link
            to="/login"
            className="navbar-login-btn"
            onClick={() => onNavigate && onNavigate('login')}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="navbar-cta-btn"
            onClick={() => onNavigate && onNavigate('signup')}
          >
            <span>Join Academy</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile Navigation">
          <nav className="mobile-nav">
            <ul>
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className={`mobile-nav-link ${isItemActive(item.key) ? 'is-active' : ''}`}
                    onClick={(e) => handleLinkClick(e, item)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mobile-drawer-auth">
              <Link
                to="/login"
                className="mobile-login-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('login');
                }}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="mobile-signup-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('signup');
                }}
              >
                Join Andalusia Academy
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
