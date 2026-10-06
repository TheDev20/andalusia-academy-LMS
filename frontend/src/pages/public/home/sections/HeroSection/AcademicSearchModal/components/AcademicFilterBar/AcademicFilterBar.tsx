import React from "react";
import { BookOpen, Layers } from "lucide-react";
import "./AcademicFilterBar.css";

export type FilterType = "all" | "program" | "course";

export interface AcademicFilterBarProps {
  query: string;
  totalCount: number;
  programCount: number;
  courseCount: number;
  filterType: FilterType;
  onFilterChange: (type: FilterType) => void;
}

export const AcademicFilterBar: React.FC<AcademicFilterBarProps> = ({
  query,
  totalCount,
  programCount,
  courseCount,
  filterType,
  onFilterChange,
}) => {
  return (
    <div className="academic-discovery-bar">
      <div className="discovery-query-status">
        {query.trim() ? (
          <span className="query-results-label">
            Results for <strong>"{query}"</strong> · {totalCount} found
          </span>
        ) : (
          <span className="query-results-label">
            All Curricula & Offerings · {totalCount} available
          </span>
        )}
      </div>

      {/* Minimalist Quick Type Pills */}
      <div className="discovery-filter-pills">
        <button
          type="button"
          className={`pill-btn ${filterType === "all" ? "is-active" : ""}`}
          onClick={() => onFilterChange("all")}
        >
          All ({programCount + courseCount})
        </button>
        <button
          type="button"
          className={`pill-btn ${filterType === "program" ? "is-active" : ""}`}
          onClick={() => onFilterChange("program")}
        >
          <Layers size={11} className="pill-icon" />
          Full Programs ({programCount})
        </button>
        <button
          type="button"
          className={`pill-btn ${filterType === "course" ? "is-active" : ""}`}
          onClick={() => onFilterChange("course")}
        >
          <BookOpen size={11} className="pill-icon" />
          Single Courses ({courseCount})
        </button>
      </div>
    </div>
  );
};
