import { Link, useNavigate } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import {
  AppRoute,
  NavigateFunction,
  ROUTE_PATHS,
} from "../../../types/navigation";
import Brand from "../../common/Brand";
import "./PublicFooter.css";

export interface PublicFooterProps {
  onNavigate?: NavigateFunction;
}

export default function PublicFooter({ onNavigate }: PublicFooterProps) {
  const navigate = useNavigate();
  const handleNav =
    (route: AppRoute) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      if (onNavigate) {
        onNavigate(route);
      } else {
        navigate(ROUTE_PATHS[route]);
      }
    };
  return (
    <footer className="public-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-columns-grid">
          <div className="footer-col brand-col">
            <div className="footer-brand-wrap">
              <Brand href="/" onClick={handleNav("home")} />
            </div>
            <p className="footer-desc">
              The premier technology institute empowering software developers,
              AI engineers, and data leaders.
            </p>
            <div className="footer-contact-items">
              <div className="contact-line">
                <Phone size={13} aria-hidden="true" />
                <span>
                  Admissions: <strong>16781</strong>
                </span>
              </div>
              <div className="contact-line">
                <Mail size={13} aria-hidden="true" />
                <span>admissions@andalusia-academy.com</span>
              </div>
            </div>
          </div>
          <div className="footer-col">
            <h2 className="footer-heading">Catalog &amp; Tracks</h2>
            <ul className="footer-links">
              <li>
                <Link to="/courses?filter=software-engineering">Software Engineering</Link>
              </li>
              <li>
                <Link to="/courses?filter=ai-machine-learning">Applied Generative AI</Link>
              </li>
              <li>
                <Link to="/courses?filter=data-science">Data Science &amp; BigQuery</Link>
              </li>
              <li>
                <Link to="/courses?filter=cloud-devops">Cloud &amp; DevOps</Link>
              </li>
              <li>
                <Link to="/programs">Multi-Course Programs</Link>
              </li>
              <li>
                <Link to="/career-paths">Career Path Roadmaps</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h2 className="footer-heading">Academy</h2>
            <ul className="footer-links">
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/about#faculty">Faculty &amp; Mentors</Link>
              </li>
              <li>
                <Link to="/#corporate">Corporate Training</Link>
              </li>
              <li>
                <Link to="/contact">Campus Hubs &amp; FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h2 className="footer-heading">Portals</h2>
            <ul className="footer-links">
              <li>
                <Link to="/login">Learner LMS Portal</Link>
              </li>
              <li>
                <Link to="/signup">New Application</Link>
              </li>
              <li>
                <Link to="/contact">Support Desk</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <div className="footer-copy">
            © {new Date().getFullYear()} Andalusia Academy. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <Link to="/about">Privacy Policy</Link>
            <span>·</span>
            <Link to="/about">Terms</Link>
            <span>·</span>
            <Link to="/about">Academic Standards</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
