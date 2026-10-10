import {
  Award,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FlaskConical,
} from "lucide-react";
import { ProgramSyllabusDetails } from "../../syllabusData";
import "./CurriculumTab.css";

export interface CurriculumTabProps {
  syllabus: ProgramSyllabusDetails;
  expandedModules: Record<string, boolean>;
  onToggleModule: (modId: string) => void;
  onToggleAllModules: () => void;
  isAllExpanded: boolean;
}

export const CurriculumTab: React.FC<CurriculumTabProps> = ({
  syllabus,
  expandedModules,
  onToggleModule,
  onToggleAllModules,
  isAllExpanded,
}) => {
  return (
    <div className="tab-content-curriculum">
      <div className="curriculum-intro-row">
        <span className="curriculum-intro-text">
          Progressive modular framework designed in collaboration with senior
          software architects.
        </span>
        <button
          type="button"
          className="btn-toggle-all-modules"
          onClick={onToggleAllModules}
        >
          {isAllExpanded ? "Collapse All Modules" : "Expand All Modules"}
        </button>
      </div>

      <div className="modules-timeline">
        {syllabus.modules.map((mod) => {
          const isExpanded = !!expandedModules[mod.id];
          return (
            <div
              key={mod.id}
              className={`module-card ${isExpanded ? "is-expanded" : ""}`}
            >
              <button
                type="button"
                className="module-card-header"
                onClick={() => onToggleModule(mod.id)}
                aria-expanded={isExpanded}
              >
                <div className="module-header-left">
                  <span className="module-index-badge">0{mod.number}</span>
                  <div className="module-title-group">
                    <div className="module-timing-row">
                      <span className="module-duration-pill">
                        {mod.duration}
                      </span>
                    </div>
                    <h4 className="module-title">{mod.title}</h4>
                  </div>
                </div>

                <div className="module-header-right">
                  <span className="module-topic-count">
                    {mod.topics.length} Key Topics
                  </span>
                  <span className="module-chevron">
                    {isExpanded ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="module-card-body">
                  <p className="module-summary">{mod.summary}</p>

                  <div className="module-topics-section">
                    <span className="section-mini-heading">
                      Core Learning Topics:
                    </span>
                    <ul className="module-topics-list">
                      {mod.topics.map((topic, tIdx) => (
                        <li key={tIdx} className="module-topic-item">
                          <CheckCircle2
                            size={13}
                            className="topic-check-icon"
                          />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Highlighted Hands-on Lab Project */}
                  <div className="module-lab-highlight">
                    <div className="lab-badge-row">
                      <FlaskConical size={14} className="lab-icon" />
                      <span className="lab-badge-label">
                        Hands-on Production Lab
                      </span>
                    </div>
                    <h5 className="lab-title">{mod.handsOnLab.title}</h5>
                    <p className="lab-description">
                      {mod.handsOnLab.description}
                    </p>
                  </div>

                  {/* Technology Badges */}
                  <div className="module-tech-chips">
                    {mod.technologies.map((tech, tIdx) => (
                      <span key={tIdx} className="module-tech-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Final Capstone Project Banner */}
        <div className="capstone-banner">
          <div className="capstone-icon-col">
            <Award size={28} />
          </div>
          <div className="capstone-info-col">
            <span className="capstone-badge">FINAL CAPSTONE DEFENSE</span>
            <h4 className="capstone-title">{syllabus.capstoneProject.title}</h4>
            <p className="capstone-desc">
              {syllabus.capstoneProject.description}
            </p>
            <div className="capstone-deliverables">
              <span className="deliverables-heading">Deliverables:</span>
              <ul>
                {syllabus.capstoneProject.deliverables.map((del, dIdx) => (
                  <li key={dIdx}>{del}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
