import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import {
  AppRoute,
  NavigateFunction,
  ROUTE_PATHS,
} from "../../../types/navigation";
import { useScroll } from "../../../hooks/useScroll";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import Brand from "../../common/Brand";
import "./PublicNavbar.css";

export interface PublicNavbarProps {
  currentPath: AppRoute;
  onNavigate: NavigateFunction;
}

interface NavItem {
  label: string;
  href: string;
  key: AppRoute;
}

const HOME_SECTION_IDS = [
  "home",
  "career-paths",
  "courses",
  "corporate",
] as const;

export default function PublicNavbar({
  currentPath,
  onNavigate,
}: PublicNavbarProps) {
  const navigate = useNavigate();
  const scrolled = useScroll(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const spySection = useScrollSpy(
    HOME_SECTION_IDS,
    160,
    currentPath === "home",
  );

  const navItems: NavItem[] = useMemo(
    () => [
      { label: "Home", href: "/", key: "home" },
      { label: "Career Paths", href: "/#career-paths", key: "career-paths" },
      { label: "Courses & Programs", href: "/#courses", key: "courses" },
      { label: "Corporate Training", href: "/#corporate", key: "corporate" },
      { label: "About Us", href: "/about", key: "about" },
      { label: "Contact", href: "/contact", key: "contact" },
    ],
    [],
  );

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: NavItem,
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const route = item.key;
    if (onNavigate) {
      onNavigate(route);
    } else {
      navigate(ROUTE_PATHS[route] || item.href);
    }
  };

  const handleAuthNavigate = (route: "login" | "signup") => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const isItemActive = (key: string) => {
    const isSection = (HOME_SECTION_IDS as readonly string[]).includes(key);
    return currentPath === "home" && isSection
      ? spySection === key
      : currentPath === key;
  };

  return (
    <header className={`public-navbar ${scrolled ? "is-scrolled" : ""}`}>
      <div className="navbar-container">
        <div className="navbar-brand-wrap">
          <Brand
            href="/"
            onClick={(e) =>
              handleLinkClick(e, { label: "Home", href: "/", key: "home" })
            }
          />
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
                    className={`nav-link ${isActive ? "is-active" : ""}`}
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
            onClick={() => handleAuthNavigate("login")}
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="navbar-cta-btn"
            onClick={() => handleAuthNavigate("signup")}
          >
            <span>Join Academy</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>

          {/* Mobile menu trigger */}
          <button
            type="button"
            className="mobile-menu-btn"
            aria-label={mobileMenuOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="mobile-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
        >
          <nav className="mobile-nav">
            <ul>
              {navItems.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    className={`mobile-nav-link ${isItemActive(item.key) ? "is-active" : ""}`}
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
                onClick={() => handleAuthNavigate("login")}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="mobile-signup-btn"
                onClick={() => handleAuthNavigate("signup")}
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
