import {
  Building2,
  Users2,
  ShieldCheck,
  BarChart3,
  ArrowRight,
  Code2,
  Brain,
  Cloud,
} from "lucide-react";
import { NavigateFunction } from "../../../../../types/navigation";
import "./CorporateTrainingSection.css";

export interface CorporateTrainingSectionProps {
  onNavigate?: NavigateFunction;
}

export default function CorporateTrainingSection({
  onNavigate,
}: CorporateTrainingSectionProps) {
  const corporatePillars = [
    {
      icon: Code2,
      title: "Custom Engineering Bootcamps & Upskilling",
    },
    {
      icon: Brain,
      title: "Enterprise AI & LLM Transformation",
    },
    {
      icon: Cloud,
      title: "Cloud Migration & DevOps Enablement",
    },
    {
      icon: BarChart3,
      title: "Skill Benchmarking & Progress Tracking",
    },
  ];

  return (
    <section
      id="corporate"
      className="corporate-section scroll-section"
      aria-label="Corporate Training for Tech Organizations"
    >
      <div className="section-container">
        <div className="corporate-card-wrap">
          <div className="corporate-left">
            <h2 className="corporate-title">
              Upskill Your Entire <em>Engineering Workforce</em> with
              World-Class Tech Training.
            </h2>
            <p className="corporate-subtitle">
              Partner with Andalusia Academy to elevate development teams,
              accelerate AI adoption, and modernize enterprise architectures. We
              deliver customized corporate bootcamps led by senior engineering
              architects.
            </p>

            <div className="corporate-checklist">
              <div className="check-item">
                <span className="clean-dot-accent" />
                <span>
                  Sponsored team cohorts & corporate volume seat discounts
                </span>
              </div>
              <div className="check-item">
                <span className="clean-dot-accent" />
                <span>Dedicated technical lead and custom capstone design</span>
              </div>
              <div className="check-item">
                <span className="clean-dot-accent" />
                <span>
                  Executive competency reports & verified project portfolios
                </span>
              </div>
            </div>

            <div className="corporate-actions">
              <a
                href="#contact"
                className="btn-corporate-primary"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate("contact");
                  }
                }}
              >
                <span>Request Corporate Proposal</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="#about"
                className="btn-corporate-secondary"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate("about");
                  }
                }}
              >
                <span>Download Tech Syllabus</span>
              </a>
            </div>
          </div>

          <div className="corporate-right">
            <div className="corporate-pillars-grid">
              {corporatePillars.map((pillar, pIdx) => {
                const Icon = pillar.icon;
                return (
                  <div key={pIdx} className="corporate-pillar-card">
                    <div className="pillar-icon-wrap">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <h3 className="pillar-title">{pillar.title}</h3>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
