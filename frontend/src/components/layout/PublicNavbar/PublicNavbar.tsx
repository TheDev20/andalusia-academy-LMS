import { useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ArrowUpRight,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  UserCircle2,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { AppRoute, NavigateFunction } from "../../../types/navigation";
import { useScroll } from "../../../hooks/useScroll";
import { useScrollSpy } from "../../../hooks/useScrollSpy";
import Brand from "../../common/Brand";
import { homePathFor, useAuth } from "../../../context/AuthContext";
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

interface PortalNavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  isActive: (pathname: string) => boolean;
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
  const location = useLocation();
  const scrolled = useScroll(20);
  const { user, isAuthenticated, logout, hasRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const isCatalogPath = (pathname: string) =>
    pathname.startsWith("/courses") ||
    pathname.startsWith("/programs") ||
    pathname.startsWith("/career-paths");

  /** Role workspace badge & dedicated navigation tabs when signed in (no landing-page tabs). */
  const workspaceMeta = useMemo(() => {
    if (!isAuthenticated || !user) return null;

    if (hasRole("Admin")) {
      return {
        badge: "Admin Workspace",
        homeTo: "/admin",
        tabs: [
          {
            label: "Admin Console",
            to: "/admin",
            icon: <ShieldCheck size={15} aria-hidden="true" />,
            isActive: (p: string) => p.startsWith("/admin"),
          },
          {
            label: "Instructor Cohorts",
            to: "/instructor",
            icon: <GraduationCap size={15} aria-hidden="true" />,
            isActive: (p: string) => p.startsWith("/instructor"),
          },
          {
            label: "Course Catalog",
            to: "/courses",
            icon: <BookOpen size={15} aria-hidden="true" />,
            isActive: isCatalogPath,
          },
          {
            label: "Account Settings",
            to: "/profile",
            icon: <UserCircle2 size={15} aria-hidden="true" />,
            isActive: (p: string) => p.startsWith("/profile"),
          },
        ] satisfies PortalNavItem[],
      };
    }

    if (hasRole("ContentManager")) {
      return {
        badge: "Content Studio",
        homeTo: "/admin",
        tabs: [
          {
            label: "Curriculum Manager",
            to: "/admin",
            icon: <LayoutDashboard size={15} aria-hidden="true" />,
            isActive: (p: string) => p.startsWith("/admin"),
          },
          {
            label: "Course Catalog",
            to: "/courses",
            icon: <BookOpen size={15} aria-hidden="true" />,
            isActive: isCatalogPath,
          },
          {
            label: "Account Settings",
            to: "/profile",
            icon: <UserCircle2 size={15} aria-hidden="true" />,
            isActive: (p: string) => p.startsWith("/profile"),
          },
        ] satisfies PortalNavItem[],
      };
    }

    if (hasRole("Instructor")) {
      return {
        badge: "Instructor Portal",
        homeTo: "/instructor",
        tabs: [
          {
            label: "My Cohorts",
            to: "/instructor",
            icon: <GraduationCap size={15} aria-hidden="true" />,
            isActive: (p: string) => p.startsWith("/instructor"),
          },
          {
            label: "Course Catalog",
            to: "/courses",
            icon: <BookOpen size={15} aria-hidden="true" />,
            isActive: isCatalogPath,
          },
          {
            label: "Account Settings",
            to: "/profile",
            icon: <UserCircle2 size={15} aria-hidden="true" />,
            isActive: (p: string) => p.startsWith("/profile"),
          },
        ] satisfies PortalNavItem[],
      };
    }

    return {
      badge: "Learner Portal",
      homeTo: "/dashboard",
      tabs: [
        {
          label: "My Learning",
          to: "/dashboard",
          icon: <LayoutDashboard size={15} aria-hidden="true" />,
          isActive: (p: string) => p.startsWith("/dashboard") || p.startsWith("/learn"),
        },
        {
          label: "Browse Catalog",
          to: "/courses",
          icon: <BookOpen size={15} aria-hidden="true" />,
          isActive: isCatalogPath,
        },
        {
          label: "Account Settings",
          to: "/profile",
          icon: <UserCircle2 size={15} aria-hidden="true" />,
          isActive: (p: string) => p.startsWith("/profile"),
        },
      ] satisfies PortalNavItem[],
    };
  }, [isAuthenticated, user, hasRole]);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
    await logout();
  };

  const spySection = useScrollSpy(
    HOME_SECTION_IDS,
    160,
    !isAuthenticated && currentPath === "home",
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
    if (item.key === "home") {
      if (location.pathname === "/") {
        if (location.hash) {
          navigate("/", { replace: true });
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
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

  const userInitials = useMemo(() => {
    if (!user?.fullName) return "AA";
    return user.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [user]);

  // Dedicated Account / Portal Header when logged in
  if (isAuthenticated && user && workspaceMeta) {
    const brandTarget = homePathFor(user);
    return (
      <header className={`public-navbar is-portal-navbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="navbar-container">
          <div className="navbar-brand-wrap">
            <Brand
              href={brandTarget}
              onClick={(e) => {
                e.preventDefault();
                setMobileMenuOpen(false);
                navigate(brandTarget);
              }}
            />
            <span className="portal-workspace-badge">{workspaceMeta.badge}</span>
          </div>

          <nav className="desktop-nav" aria-label="Account Workspace Navigation">
            <ul className="portal-nav-pills">
              {workspaceMeta.tabs.map((tab) => {
                const active = tab.isActive(location.pathname);
                return (
                  <li key={tab.to}>
                    <Link
                      to={tab.to}
                      className={`portal-nav-pill ${active ? "is-active" : ""}`}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="navbar-actions">
            <div className="navbar-account">
              <Link
                to="/profile"
                className="portal-user-chip"
                title="Account Settings & Profile"
              >
                <span className="portal-user-avatar" aria-hidden="true">
                  {userInitials}
                </span>
                <span className="portal-user-name">{user.fullName}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="portal-logout-btn"
                title="Sign out of your account"
              >
                <LogOut size={14} aria-hidden="true" />
                <span>Log Out</span>
              </button>
            </div>

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

        {mobileMenuOpen && (
          <div
            className="mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Account Navigation"
          >
            <nav className="mobile-nav">
              <ul>
                {workspaceMeta.tabs.map((tab) => {
                  const active = tab.isActive(location.pathname);
                  return (
                    <li key={tab.to}>
                      <Link
                        to={tab.to}
                        className={`mobile-nav-link ${active ? "is-active" : ""}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {tab.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="mobile-drawer-auth">
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "6px 0",
                    }}
                  >
                    <span className="portal-user-avatar" aria-hidden="true">
                      {userInitials}
                    </span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#271e16" }}>
                        {user.fullName}
                      </div>
                      <div style={{ fontSize: 12, color: "#7a6e60" }}>
                        {workspaceMeta.badge}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mobile-login-btn"
                    style={{ cursor: "pointer" }}
                  >
                    Log Out
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    );
  }

  // Public Website Header when logged out
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
