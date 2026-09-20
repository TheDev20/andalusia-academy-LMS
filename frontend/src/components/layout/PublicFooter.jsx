import React from 'react';
import { ArrowUpRight, Phone, Mail, MapPin, ShieldCheck, Award, Code2 } from 'lucide-react';
import Brand from '../common/Brand';

export default function PublicFooter({ onNavigate }) {
  const handleNav = (route) => (e) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="public-footer" role="contentinfo">
      <div className="footer-top-trust">
        <div className="footer-container">
          <div className="trust-grid">
            <div className="trust-item">
              <ShieldCheck size={28} className="trust-icon" aria-hidden="true" />
              <div>
                <h4>Industry-Aligned Standards</h4>
                <p>Curricula built upon production-grade software engineering and enterprise cloud architecture.</p>
              </div>
            </div>
            <div className="trust-item">
              <Award size={28} className="trust-icon" aria-hidden="true" />
              <div>
                <h4>Verified Technical Credentials</h4>
                <p>Recognized professional diplomas, accredited lab hours, and public GitHub portfolio capstones.</p>
              </div>
            </div>
            <div className="trust-item">
              <MapPin size={28} className="trust-icon" aria-hidden="true" />
              <div>
                <h4>Physical Tech Hubs & Hybrid Labs</h4>
                <p>In-person classroom cohorts and coding studios across Cairo, Alexandria, and Jeddah.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-columns-grid">
            {/* Col 1: Brand & Heritage */}
            <div className="footer-col brand-col">
              <div className="footer-brand-wrap">
                <Brand href="#home" onClick={handleNav('home')} />
              </div>
              <p className="footer-desc">
                The premier technology and professional education academy. Dedicated to shaping the next generation of software engineers, AI developers, data scientists, and digital innovators.
              </p>
              <div className="footer-contact-items">
                <div className="contact-line">
                  <Phone size={14} aria-hidden="true" />
                  <span>Admissions Hotline: <strong>16781</strong></span>
                </div>
                <div className="contact-line">
                  <Mail size={14} aria-hidden="true" />
                  <span>admissions@andalusia-academy.com</span>
                </div>
                <div className="contact-line">
                  <MapPin size={14} aria-hidden="true" />
                  <span>Cairo Tech Hub · Alexandria · Jeddah</span>
                </div>
              </div>
            </div>

            {/* Col 2: Programs & Tracks */}
            <div className="footer-col">
              <h5 className="footer-heading">Technical Tracks</h5>
              <ul className="footer-links">
                <li><a href="#courses" onClick={handleNav('home')}>Full-Stack Software Engineering</a></li>
                <li><a href="#courses" onClick={handleNav('home')}>Applied Generative AI & LLMs</a></li>
                <li><a href="#courses" onClick={handleNav('home')}>Data Science & BigQuery</a></li>
                <li><a href="#courses" onClick={handleNav('home')}>Cloud Architecture & DevOps</a></li>
                <li><a href="#courses" onClick={handleNav('home')}>Cybersecurity & DevSecOps</a></li>
                <li><a href="#courses" onClick={handleNav('home')}>Mobile App Engineering</a></li>
              </ul>
            </div>

            {/* Col 3: Academy & Community */}
            <div className="footer-col">
              <h5 className="footer-heading">Academy</h5>
              <ul className="footer-links">
                <li><a href="#about" onClick={handleNav('about')}>About Andalusia Academy</a></li>
                <li><a href="#about" onClick={handleNav('about')}>Technical Vision & Pedagogy</a></li>
                <li><a href="#about" onClick={handleNav('about')}>Industry Faculty & Mentors</a></li>
                <li><a href="#about" onClick={handleNav('about')}>Computing Studios & Facilities</a></li>
                <li><a href="#corporate" onClick={handleNav('home')}>Corporate Enterprise Training</a></li>
                <li><a href="#contact" onClick={handleNav('contact')}>Contact & Campus Hubs</a></li>
              </ul>
            </div>

            {/* Col 4: Portals & Legal */}
            <div className="footer-col">
              <h5 className="footer-heading">Portals & Access</h5>
              <ul className="footer-links">
                <li><a href="#login" onClick={handleNav('login')}>Learner LMS Portal</a></li>
                <li><a href="#signup" onClick={handleNav('signup')}>New Applicant Enrollment</a></li>
                <li><a href="#login" onClick={handleNav('login')}>Instructor Workspace</a></li>
                <li><a href="#corporate" onClick={handleNav('home')}>Enterprise Corporate Portal</a></li>
                <li><a href="#contact" onClick={handleNav('contact')}>Certificate Verification</a></li>
                <li><a href="#contact" onClick={handleNav('contact')}>Technical Support Desk</a></li>
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
              <a href="#about" onClick={handleNav('about')}>Terms of Enrollment</a>
              <span>·</span>
              <a href="#about" onClick={handleNav('about')}>Academic Standards</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
