import React from "react";
import { ArrowRight, Briefcase, CheckCircle2, GraduationCap } from "lucide-react";
import { ProgramSyllabusDetails } from "../../syllabusData";
import "./CareerTab.css";

export interface CareerTabProps {
  syllabus: ProgramSyllabusDetails;
}

export const CareerTab: React.FC<CareerTabProps> = ({ syllabus }) => {
  return (
    <div className="tab-content-career">
      <div className="career-grid-two-col">
        {/* Target Roles & Salary */}
        <div className="career-card">
          <div className="career-card-header">
            <Briefcase size={18} className="career-icon" />
            <h4>Target Career Roles</h4>
          </div>
          <ul className="career-roles-list">
            {syllabus.careerOutcomes.targetRoles.map((role, idx) => (
              <li key={idx} className="role-item">
                <ArrowRight size={13} className="role-arrow" />
                <span>{role}</span>
              </li>
            ))}
          </ul>

          <div className="salary-benchmark-box">
            <span className="salary-label">Typical Market Salary Benchmark:</span>
            <span className="salary-value">{syllabus.careerOutcomes.averageSalaryRange}</span>
            <span className="salary-footnote">Based on tech placement reports across hiring partner network</span>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="career-card">
          <div className="career-card-header">
            <GraduationCap size={18} className="career-icon" />
            <h4>Recommended Prerequisites</h4>
          </div>
          <ul className="prereqs-list">
            {syllabus.prerequisites.map((req, idx) => (
              <li key={idx} className="prereq-item">
                <CheckCircle2 size={14} className="prereq-check" />
                <span>{req}</span>
              </li>
            ))}
          </ul>

          <div className="hiring-partners-strip">
            <span className="partners-label">Representative Hiring Network:</span>
            <div className="partners-tags">
              {syllabus.careerOutcomes.hiringPartners.map((partner, idx) => (
                <span key={idx} className="partner-tag">{partner}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
