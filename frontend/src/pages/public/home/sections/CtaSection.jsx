import React from 'react';
import { ArrowRight, PhoneCall, Sparkles } from 'lucide-react';

export default function CtaSection({ onNavigate }) {
  return (
    <section className="cta-banner-section" aria-label="Join Andalusia Academy Call to Action">
      <div className="section-container">
        <div className="cta-card">
          <div className="cta-glow-accent" aria-hidden="true" />

          <div className="cta-content">
            <h2 className="cta-heading">
              Ready to Accelerate Your <em>Engineering Journey?</em>
            </h2>

            <p className="cta-desc">
              Whether you are architecting enterprise microservices with ASP.NET Core, building production Generative AI agentic workflows, or orchestrating big data pipelines on BigQuery, Andalusia Academy provides the senior mentorship and verified credentials you need.
            </p>

            <div className="cta-perks-row">
              <div className="cta-perk">
                <span className="clean-dot-accent" />
                <span>Production-Grade Capstones</span>
              </div>
              <div className="cta-perk">
                <span className="clean-dot-accent" />
                <span>Physical Tech Labs & Offline Sessions</span>
              </div>
              <div className="cta-perk">
                <span className="clean-dot-accent" />
                <span>Flexible Installment Plans</span>
              </div>
            </div>

            <div className="cta-buttons-group">
              <a
                href="#signup"
                className="btn-cta-primary"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('signup');
                  }
                }}
              >
                <span>Apply for Fall 2026 Intake</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>

              <a
                href="#contact"
                className="btn-cta-secondary"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('contact');
                  }
                }}
              >
                <PhoneCall size={16} aria-hidden="true" />
                <span>Speak with an Admissions Advisor</span>
              </a>
            </div>

            <div className="cta-hotline-note">
              <span>Have immediate questions? Call our technical admissions hotline: <strong>16781</strong></span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
