import { CheckCircle2, Code2, FlaskConical } from "lucide-react";
import { ProgramSyllabusDetails } from "../../syllabusData";
import "./LabsTab.css";

export interface LabsTabProps {
  syllabus: ProgramSyllabusDetails;
}

export const LabsTab: React.FC<LabsTabProps> = ({ syllabus }) => {
  return (
    <div className="tab-content-labs">
      <div className="labs-overview-banner">
        <Code2 size={24} className="labs-banner-icon" />
        <div>
          <h4>100% Code-First Production Lab Methodology</h4>
          <p>
            Every module concludes with an engineering lab where you build,
            test, and deploy production software. No toy examples — you write
            production-grade systems from Day 1.
          </p>
        </div>
      </div>

      <div className="labs-grid">
        {syllabus.modules.map((mod) => (
          <div key={mod.id} className="lab-card">
            <div className="lab-card-header">
              <span className="lab-module-tag">
                Module 0{mod.number} · {mod.duration}
              </span>
              <FlaskConical size={16} className="lab-card-icon" />
            </div>
            <h4 className="lab-card-title">{mod.handsOnLab.title}</h4>
            <p className="lab-card-desc">{mod.handsOnLab.description}</p>
            <div className="lab-card-footer">
              <span className="lab-tech-label">Stack:</span>
              <div className="lab-tech-pills">
                {mod.technologies.map((t, idx) => (
                  <span key={idx} className="lab-tech-pill">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Capstone Card */}
      <div className="capstone-card-extended">
        <div className="capstone-header-row">
          <span className="capstone-label">Comprehensive Capstone Project</span>
          <span className="capstone-points">Industry Portfolio Standard</span>
        </div>
        <h3 className="capstone-main-title">
          {syllabus.capstoneProject.title}
        </h3>
        <p className="capstone-main-desc">
          {syllabus.capstoneProject.description}
        </p>
        <div className="capstone-requirements-grid">
          {syllabus.capstoneProject.deliverables.map((d, idx) => (
            <div key={idx} className="requirement-item">
              <CheckCircle2 size={15} className="req-check" />
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
