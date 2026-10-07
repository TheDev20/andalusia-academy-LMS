import { Code2, Cpu } from "lucide-react";
import { ProgramSyllabusDetails } from "../../syllabusData";
import "./TechStackTab.css";

export interface TechStackTabProps {
  syllabus: ProgramSyllabusDetails;
}

export const TechStackTab: React.FC<TechStackTabProps> = ({ syllabus }) => {
  return (
    <div className="tab-content-tech">
      <div className="tech-intro-banner">
        <Cpu size={22} className="tech-banner-icon" />
        <div>
          <h4>Enterprise Toolchains & Bleeding-Edge Standards</h4>
          <p>
            Curated to match modern enterprise production stacks. Fellows build
            direct muscle memory in these industry tools and frameworks.
          </p>
        </div>
      </div>

      <div className="tech-chips-wall">
        {syllabus.technologies.map((tech, idx) => (
          <div key={idx} className="tech-wall-card">
            <div className="tech-card-icon-dot" />
            <span className="tech-card-name">{tech}</span>
          </div>
        ))}
      </div>

      <div className="studio-ide-perk-box">
        <div className="perk-box-left">
          <Code2 size={24} className="perk-icon" />
          <div>
            <h5>Integrated Cloud Development Environment</h5>
            <p>
              Each fellow receives dedicated cloud GPU/compute instances,
              pre-configured DevContainers, and 24/7 access to Andalusia's
              proprietary AI Code Mentorship Engine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
