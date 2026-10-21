import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  AppRoute,
  NavigateFunction,
  ROUTE_PATHS,
  isPageRoute,
} from "../../../types/navigation";
import PublicNavbar from "../PublicNavbar";
import PublicFooter from "../PublicFooter";
import "./PublicLayout.css";

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

  const rootSegment = location.pathname.replace(/^\//, "").split("/")[0];
  const activeRoute: AppRoute =
    currentPath ?? (isPageRoute(rootSegment) ? rootSegment : "home");

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
          <Link to="/courses" className="announcement-link">
            Explore Tech Programs <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <PublicNavbar currentPath={activeRoute} onNavigate={handleNavigate} />

      <main className="public-main-content">{children ?? <Outlet />}</main>

      <PublicFooter onNavigate={handleNavigate} />
    </div>
  );
}
