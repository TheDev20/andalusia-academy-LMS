import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { homePathFor, useAuth } from "../../context/AuthContext";
import "../portal/portal.css";

export default function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="portal-page">
      <div className="portal-container">
        <div className="portal-empty" role="alert">
          <ShieldAlert size={36} aria-hidden="true" />
          <h1 className="portal-empty-title">You don't have access to this page</h1>
          <p>Your account role does not include this area of the academy.</p>
          <Link to={homePathFor(user)} className="portal-btn">
            Go to my home
          </Link>
        </div>
      </div>
    </div>
  );
}
