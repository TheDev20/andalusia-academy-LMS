import React from "react";
import { BookOpen, Briefcase, Cpu, FlaskConical } from "lucide-react";
import "./SyllabusTabsNav.css";

export type TabType = "curriculum" | "labs" | "tech" | "career";

export interface SyllabusTabsNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  modulesCount: number;
  technologiesCount: number;
}

export const SyllabusTabsNav: React.FC<SyllabusTabsNavProps> = ({
  activeTab,
  onTabChange,
  modulesCount,
  technologiesCount,
}) => {
  return (
    <div className="syllabus-nav-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "curriculum"}
        className={`syllabus-tab-btn ${activeTab === "curriculum" ? "is-active" : ""}`}
        onClick={() => onTabChange("curriculum")}
      >
        <BookOpen size={14} className="tab-icon" />
        <span>Curriculum & Modules ({modulesCount})</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "labs"}
        className={`syllabus-tab-btn ${activeTab === "labs" ? "is-active" : ""}`}
        onClick={() => onTabChange("labs")}
      >
        <FlaskConical size={14} className="tab-icon" />
        <span>Hands-on Labs & Capstone</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "tech"}
        className={`syllabus-tab-btn ${activeTab === "tech" ? "is-active" : ""}`}
        onClick={() => onTabChange("tech")}
      >
        <Cpu size={14} className="tab-icon" />
        <span>Technologies Mastered ({technologiesCount})</span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeTab === "career"}
        className={`syllabus-tab-btn ${activeTab === "career" ? "is-active" : ""}`}
        onClick={() => onTabChange("career")}
      >
        <Briefcase size={14} className="tab-icon" />
        <span>Career Outcomes & Prerequisites</span>
      </button>
    </div>
  );
};
