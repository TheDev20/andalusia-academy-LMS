import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AccessDenied from "./AccessDenied";

interface ProtectedRouteProps {
  /** Any one of these roles grants access; omit to allow any signed-in user. */
  allowedRoles?: string[];
}

/**
 * UI-level guard only: it improves navigation, but the API enforces every permission independently.
 */
export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(...allowedRoles)) {
    return <AccessDenied />;
  }

  return <Outlet />;
}
