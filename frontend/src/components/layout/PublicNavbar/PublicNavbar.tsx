import './PublicNavbar.css';
import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import Brand from '../../common/Brand';
import { AppRoute, NavigateFunction } from '../../../types/navigation';

export interface PublicNavbarProps {
  currentPath?: AppRoute | string;
  onNavigate?: NavigateFunction;
}

interface NavItem {
  label: string;
  href: string;
  key: string;
}

export default function PublicNavbar({ currentPath = 'home', onNavigate }: PublicNavbarProps) {
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
    { label: 'Home', href: '#home', key: 'home' },
    { label: 'Career Paths', href: '#career-paths', key: 'career-paths' },
    { label: 'Courses & Programs', href: '#courses', key: 'courses' },
    { label: 'Corporate Training', href: '#corporate', key: 'corporate' },
    { label: 'About Us', href: '#about', key: 'about' },
    { label: 'Contact', href: '#contact', key: 'contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    setMobileMenuOpen(false);
    if (item.href.startsWith('#')) {
      const route = item.href.slice(1);
      if (['career-paths', 'courses', 'corporate', 'home'].includes(route)) {
        setActiveSection(route);
        if (currentPath !== 'home') {
          if (onNavigate) onNavigate('home');
          setTimeout(() => {
            const el = document.getElementById(route);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          const el = document.getElementById(route);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (['about', 'contact'].includes(route)) {
        if (onNavigate) onNavigate(route);
      }
    }
  };

  const isItemActive = (key: string) => {
    const isSectionRoute = ['home', 'career-paths', 'courses', 'corporate'].includes(key);
    return currentPath === 'home' && isSectionRoute
      ? activeSection === key
      : currentPath === key;
  };

  return (
    <header className={`public-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand-wrap">
          <Brand href="#home" onClick={(e) => handleLinkClick(e, { label: 'Home', href: '#home', key: 'home' })} />
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
          <a
            href="#login"
            className="navbar-login-btn"
            onClick={() => onNavigate && onNavigate('login')}
          >
            Log in
          </a>
          <a
            href="#signup"
            className="navbar-cta-btn"
            onClick={() => onNavigate && onNavigate('signup')}
          >
            <span>Join Academy</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>

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
              <a
                href="#login"
                className="mobile-login-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('login');
                }}
              >
                Log in
              </a>
              <a
                href="#signup"
                className="mobile-signup-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onNavigate) onNavigate('signup');
                }}
              >
                Join Andalusia Academy
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
