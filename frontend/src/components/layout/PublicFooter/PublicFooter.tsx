import './PublicFooter.css';
import React from 'react';
import { Phone, Mail } from 'lucide-react';
import Brand from '../../common/Brand';
import { AppRoute, NavigateFunction } from '../../../types/navigation';

export interface PublicFooterProps {
  onNavigate?: NavigateFunction;
}

export default function PublicFooter({ onNavigate }: PublicFooterProps) {
  const handleNav = (route: AppRoute | string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="public-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-columns-grid">
          {/* Col 1: Brand & Contact */}
          <div className="footer-col brand-col">
            <div className="footer-brand-wrap">
              <Brand href="#home" onClick={handleNav('home')} />
            </div>
            <p className="footer-desc">
              The premier technology institute empowering software developers, AI engineers, and data leaders.
            </p>
            <div className="footer-contact-items">
              <div className="contact-line">
                <Phone size={13} aria-hidden="true" />
                <span>Admissions: <strong>16781</strong></span>
              </div>
              <div className="contact-line">
                <Mail size={13} aria-hidden="true" />
                <span>admissions@andalusia-academy.com</span>
              </div>
            </div>
          </div>

          {/* Col 2: Programs */}
          <div className="footer-col">
            <h5 className="footer-heading">Programs</h5>
            <ul className="footer-links">
              <li><a href="#courses" onClick={handleNav('home')}>Software Engineering</a></li>
              <li><a href="#courses" onClick={handleNav('home')}>Applied Generative AI</a></li>
              <li><a href="#courses" onClick={handleNav('home')}>Data Science & BigQuery</a></li>
              <li><a href="#courses" onClick={handleNav('home')}>Cloud & DevOps</a></li>
            </ul>
          </div>

          {/* Col 3: Academy */}
          <div className="footer-col">
            <h5 className="footer-heading">Academy</h5>
            <ul className="footer-links">
              <li><a href="#about" onClick={handleNav('about')}>About Us</a></li>
              <li><a href="#about" onClick={handleNav('about')}>Faculty & Mentors</a></li>
              <li><a href="#corporate" onClick={handleNav('home')}>Corporate Training</a></li>
              <li><a href="#contact" onClick={handleNav('contact')}>Campus Hubs</a></li>
            </ul>
          </div>

          {/* Col 4: Portals */}
          <div className="footer-col">
            <h5 className="footer-heading">Portals</h5>
            <ul className="footer-links">
              <li><a href="#login" onClick={handleNav('login')}>Learner LMS Portal</a></li>
              <li><a href="#signup" onClick={handleNav('signup')}>New Application</a></li>
              <li><a href="#contact" onClick={handleNav('contact')}>Support Desk</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-copy">
            © {new Date().getFullYear()} Andalusia Academy. All rights reserved.
          </div>
          <div className="footer-legal-links">
            <a href="#about" onClick={handleNav('about')}>Privacy Policy</a>
            <span>·</span>
            <a href="#about" onClick={handleNav('about')}>Terms</a>
            <span>·</span>
            <a href="#about" onClick={handleNav('about')}>Academic Standards</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
