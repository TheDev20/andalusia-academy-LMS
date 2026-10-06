import React from "react";
import { BookOpen } from "lucide-react";
import "./AcademicEmptyState.css";

export interface AcademicEmptyStateProps {
  query: string;
  onReset: () => void;
}

export const AcademicEmptyState: React.FC<AcademicEmptyStateProps> = ({ query, onReset }) => {
  return (
    <div className="academic-empty-state">
      <BookOpen size={36} className="empty-icon" />
      <h4>No matching offerings found</h4>
      <p>
        No programs or courses match "{query}". Try searching for "full stack", "ai", "asp net", or "data".
      </p>
      <button
        type="button"
        className="btn-reset-academic-filter"
        onClick={onReset}
      >
        Reset Search
      </button>
    </div>
  );
};
