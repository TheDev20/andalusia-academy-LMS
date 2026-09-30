import "./PublicLayout.css";
import React from "react";
import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import PublicNavbar from "../PublicNavbar";
import PublicFooter from "../PublicFooter";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  AppRoute,
  NavigateFunction,
  ROUTE_PATHS,
  isPageRoute,
} from "../../../types/navigation";

export interface PublicLayoutProps {
  currentPath?: AppRoute;
  onNavigate?: NavigateFunction;
  children?: React.ReactNode;
}

export default function PublicLayout({
  currentPath,
  onNavigate,
  children,
}: PublicLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathNameSegment = location.pathname.replace(/^\//, "");
  const activeRoute: AppRoute =
    currentPath ?? (isPageRoute(pathNameSegment) ? pathNameSegment : "home");

  const handleNavigate: NavigateFunction =
    onNavigate ??
    ((newRoute: AppRoute) => {
      const targetPath = ROUTE_PATHS[newRoute] || `/${newRoute}`;
      navigate(targetPath);
    });

  return (
    <div className="public-shell">
      {/* Top Admissions Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <Sparkles
            size={14}
            className="announcement-icon"
            aria-hidden="true"
          />
          <span className="announcement-text">
            <strong>Fall 2026 Admissions Now Open</strong> — Software
            Engineering, AI & Data Science Cohorts. Early Applications Close
            September 30.
          </span>
          <Link to="/#courses" className="announcement-link">
            Explore Tech Programs <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>

      {/* Main Glassmorphism Navbar */}
      <PublicNavbar currentPath={activeRoute} onNavigate={handleNavigate} />

      {/* Page Body */}
      <main className="public-main-content">{children ?? <Outlet />}</main>

      {/* Public Footer */}
      <PublicFooter onNavigate={handleNavigate} />
    </div>
  );
}
