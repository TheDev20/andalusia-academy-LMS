import { Outlet, useLocation, useNavigate, Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";
import {
  AppRoute,
  NavigateFunction,
  ROUTE_PATHS,
  isPageRoute,
} from "../../../types/navigation";
import { useAuth } from "../../../context/AuthContext";
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
  const { isAuthenticated } = useAuth();

  const rootSegment = location.pathname.replace(/^\//, "").split("/")[0];
  const resolvedSegment: AppRoute =
    rootSegment === "programs" || rootSegment === "career-paths"
      ? "courses"
      : isPageRoute(rootSegment)
        ? rootSegment
        : "home";
  const activeRoute: AppRoute = currentPath ?? resolvedSegment;

  const handleNavigate: NavigateFunction =
    onNavigate ??
    ((newRoute: AppRoute) => {
      const targetPath = ROUTE_PATHS[newRoute] || `/${newRoute}`;
      navigate(targetPath);
    });

  return (
    <div className="public-shell">
      {/* Top Admissions Announcement Bar — only shown on public marketing site when logged out */}
      {!isAuthenticated && (
        <div className="announcement-bar">
          <div className="announcement-content">
            <Sparkles
              size={14}
              className="announcement-icon"
              aria-hidden="true"
            />
            <span className="announcement-text">
              <strong>Upcoming 2026 / 2027 Admissions Now Open</strong> — Software
              Engineering, AI &amp; Data Science Cohorts. Priority Seat Reservations Available.
            </span>
            <Link to="/courses" className="announcement-link">
              Explore Tech Programs <ArrowRight size={12} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}

      <PublicNavbar currentPath={activeRoute} onNavigate={handleNavigate} />

      <main className="public-main-content">{children ?? <Outlet />}</main>

      {isAuthenticated ? (
        <footer
          style={{
            borderTop: "1px solid #dfd7c9",
            background: "#f3efe6",
            padding: "18px 24px",
            textAlign: "center",
            fontSize: "13px",
            color: "#6f6456",
          }}
        >
          © {new Date().getFullYear()} Andalusia Academy LMS · Authenticated Workspace
        </footer>
      ) : (
        <PublicFooter onNavigate={handleNavigate} />
      )}
    </div>
  );
}
