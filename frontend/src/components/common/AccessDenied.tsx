import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { homePathFor, useAuth } from "../../context/AuthContext";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/Empty";
import "../portal/portal.css";

export default function AccessDenied() {
  const { user } = useAuth();
  return (
    <div className="portal-page">
      <div className="portal-container">
        <Empty role="alert">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ShieldAlert size={20} aria-hidden="true" />
            </EmptyMedia>
            <EmptyTitle as="h1">You don't have access to this page</EmptyTitle>
            <EmptyDescription>Your account role does not include this area of the academy.</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link to={homePathFor(user)} className="portal-btn">
              Go to my home
            </Link>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
