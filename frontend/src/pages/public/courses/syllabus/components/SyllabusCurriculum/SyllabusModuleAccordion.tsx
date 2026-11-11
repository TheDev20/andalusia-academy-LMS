import { ChevronDown, CheckCircle2, Beaker } from "lucide-react";
import { SyllabusModule } from "../../types";

interface SyllabusModuleAccordionProps {
  module: SyllabusModule;
  isOpen: boolean;
  onToggle: () => void;
}

export function SyllabusModuleAccordion({
  module,
  isOpen,
  onToggle,
}: SyllabusModuleAccordionProps) {
  const formattedNum = String(module.number).padStart(2, "0");

  return (
    <li className="module-accordion-item">
      <button
        type="button"
        className="module-accordion-btn"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span className="module-num-badge">{formattedNum}</span>

        <span className="module-title-wrap">
          <span className="module-weeks-tag">{module.duration}</span>
          <h3 className="module-title-text">{module.title}</h3>
        </span>

        <span className="module-toggle-indicator">
          <span>{module.topics.length} key topics</span>
          <ChevronDown
            size={20}
            className={`module-chevron-icon ${isOpen ? "is-expanded" : ""}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {isOpen && (
        <div className="module-expanded-body">
          <div className="module-body-divider" />

          {module.summary && (
            <p className="module-summary-text">{module.summary}</p>
          )}

          <ul className="module-topics-list">
            {module.topics.map((topic: string, idx: number) => (
              <li key={idx} className="module-topic-item">
                <CheckCircle2
                  size={20}
                  className="topic-check-icon"
                  aria-hidden="true"
                />
                <span>{topic}</span>
              </li>
            ))}
          </ul>

          {module.handsOnLab?.title && (
            <div className="module-lab-box">
              <div className="lab-box-header">
                <Beaker size={16} aria-hidden="true" />
                <strong>Hands-on Lab: {module.handsOnLab.title}</strong>
              </div>
              <p className="lab-box-desc">{module.handsOnLab.description}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}
