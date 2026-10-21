import { useState } from "react";
import { ProgramSyllabusDetails, SyllabusModule } from "../../types";
import { SyllabusModuleAccordion } from "./SyllabusModuleAccordion";
import "./SyllabusCurriculum.css";

interface SyllabusCurriculumSectionProps {
  syllabus: ProgramSyllabusDetails;
}

export function SyllabusCurriculumSection({
  syllabus,
}: SyllabusCurriculumSectionProps) {
  // Default first module open
  const [expandedState, setExpandedState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    if (syllabus.modules.length > 0) {
      initial[syllabus.modules[0].id] = true;
    }
    return initial;
  });

  const allOpen = syllabus.modules.every((m: SyllabusModule) => !!expandedState[m.id]);

  const toggleAll = () => {
    const nextState: Record<string, boolean> = {};
    syllabus.modules.forEach((m: SyllabusModule) => {
      nextState[m.id] = !allOpen;
    });
    setExpandedState(nextState);
  };

  const toggleModule = (id: string) => {
    setExpandedState((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section
      id="curriculum"
      aria-labelledby="curr-heading"
      className="syllabus-curriculum-section"
    >
      <div className="curriculum-header-row">
        <div className="curriculum-titles">
          <h2 id="curr-heading" className="curriculum-heading">
            {syllabus.modules.length} modules, structured progression
          </h2>
          <p className="curriculum-subtitle">
            A progressive framework designed with senior software architects. Each module
            builds on the last, taking you from core foundations to production-grade deployment.
          </p>
        </div>

        <button
          type="button"
          className="curriculum-toggle-all-btn"
          onClick={toggleAll}
        >
          {allOpen ? "Collapse all modules" : "Expand all modules"}
        </button>
      </div>

      <ol className="curriculum-modules-list">
        {syllabus.modules.map((mod: SyllabusModule) => (
          <SyllabusModuleAccordion
            key={mod.id}
            module={mod}
            isOpen={!!expandedState[mod.id]}
            onToggle={() => toggleModule(mod.id)}
          />
        ))}
      </ol>
    </section>
  );
}
