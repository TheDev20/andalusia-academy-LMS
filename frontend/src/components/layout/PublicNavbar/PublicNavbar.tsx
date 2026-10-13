import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { AppRoute, NavigateFunction } from "../../../types/navigation";
import { useScroll } from "../../../hooks/useScroll";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import Brand from "../../common/Brand";
import { useAuth } from "../../../context/AuthContext";
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
  "corporate",
] as const;

export default function PublicNavbar({
  currentPath,
  onNavigate,
}: PublicNavbarProps) {
  const navigate = useNavigate();
  const scrolled = useScroll(20);
  const { user, isAuthenticated, logout } = useAuth();
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
      { label: "Courses & Programs", href: "/courses", key: "courses" },
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
    if (item.key === "courses") {
      navigate("/courses");
      return;
    }
    onNavigate(item.key);
  };

  const handleAuthNavigate = (route: "login" | "signup") => {
    setMobileMenuOpen(false);
    onNavigate(route);
  };

  const isItemActive = (key: string): boolean => {
    const isSection = (HOME_SECTION_IDS as readonly string[]).includes(key);
    if (currentPath === "home" && isSection) {
      return spySection === key;
    }
    return currentPath === key;
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
          {isAuthenticated && user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--color-navy-dark, #0B2545)",
                }}
              >
                {user.fullName}
              </span>
              <button
                type="button"
                onClick={logout}
                className="navbar-login-btn"
                style={{ cursor: "pointer", background: "transparent" }}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}

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
              {isAuthenticated && user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "8px 0" }}>
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--color-navy-dark, #0B2545)",
                    }}
                  >
                    {user.fullName}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="mobile-login-btn"
                    style={{ cursor: "pointer", textAlign: "center" }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
