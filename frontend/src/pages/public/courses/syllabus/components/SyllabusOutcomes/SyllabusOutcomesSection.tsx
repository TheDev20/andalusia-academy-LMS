import { Briefcase, CheckCircle2, TrendingUp, Building2, HelpCircle } from "lucide-react";
import { ProgramSyllabusDetails } from "../../types";
import "./SyllabusOutcomes.css";

interface SyllabusOutcomesSectionProps {
  syllabus: ProgramSyllabusDetails;
}

export function SyllabusOutcomesSection({
  syllabus,
}: SyllabusOutcomesSectionProps) {
  const { careerOutcomes, prerequisites } = syllabus;

  return (
    <section
      id="outcomes"
      aria-labelledby="outcomes-heading"
      className="syllabus-outcomes-section"
    >
      <div className="outcomes-header">
        <h2 id="outcomes-heading" className="outcomes-heading">
          Outcomes and prerequisites
        </h2>
        <p className="outcomes-subtitle">
          Transparent career pathways, compensation benchmarks, and baseline competencies needed to excel in this cohort.
        </p>
      </div>

      <div className="outcomes-grid">
        {/* Career Outcomes Card */}
        <div className="outcomes-card">
          <div className="outcomes-card-header">
            <span className="outcomes-card-icon">
              <Briefcase size={20} aria-hidden="true" />
            </span>
            <h3 className="outcomes-card-title">Career Outcomes</h3>
          </div>

          <div className="outcomes-roles-wrap">
            <span className="outcomes-sublabel">Target Roles:</span>
            <div className="roles-pill-cloud">
              {careerOutcomes?.targetRoles?.map((role: string, idx: number) => (
                <span key={idx} className="role-pill">
                  {role}
                </span>
              ))}
            </div>
          </div>

          {careerOutcomes?.averageSalaryRange && (
            <div className="outcomes-stat-box">
              <TrendingUp size={20} className="salary-icon" aria-hidden="true" />
              <div>
                <span className="outcomes-sublabel">Industry Salary Benchmark</span>
                <div className="salary-val">{careerOutcomes.averageSalaryRange}</div>
              </div>
            </div>
          )}

          {careerOutcomes?.hiringPartners && careerOutcomes.hiringPartners.length > 0 && (
            <div className="partners-wrap">
              <div className="partners-label">
                <Building2 size={16} aria-hidden="true" />
                <span>Representative Hiring Partners:</span>
              </div>
              <p className="partners-text">
                {careerOutcomes.hiringPartners.join(" · ")}
              </p>
            </div>
          )}
        </div>

        {/* Prerequisites Card */}
        <div className="outcomes-card">
          <div className="outcomes-card-header">
            <span className="outcomes-card-icon">
              <HelpCircle size={20} aria-hidden="true" />
            </span>
            <h3 className="outcomes-card-title">Prerequisites</h3>
          </div>

          <p className="prereq-intro">
            Designed for engineers and practitioners ready to accelerate their applied technical capabilities:
          </p>

          <ul className="prereq-list">
            {prerequisites?.map((req: string, idx: number) => (
              <li key={idx} className="prereq-item">
                <CheckCircle2 size={20} className="prereq-check" aria-hidden="true" />
                <span>{req}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
