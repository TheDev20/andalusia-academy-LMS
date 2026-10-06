import React from "react";
import { GraduationCap, X } from "lucide-react";
import "./AcademicSearchHeader.css";

export interface AcademicSearchHeaderProps {
  onClose: () => void;
}

export const AcademicSearchHeader: React.FC<AcademicSearchHeaderProps> = ({ onClose }) => {
  return (
    <div className="academic-modal-header">
      <div className="academic-modal-header-left">
        <div className="academic-modal-icon-badge">
          <GraduationCap size={20} />
        </div>
        <div className="academic-modal-title-group">
          <h2 className="academic-modal-title">
            Curriculum Search Discovery
          </h2>
          <p className="academic-modal-subtitle">
            Explore university degree programs, specialized courses, and hands-on lab syllabi
          </p>
        </div>
      </div>

      <button
        type="button"
        className="academic-modal-close-btn"
        onClick={onClose}
        aria-label="Close search discovery"
        title="Close (Esc)"
      >
        <X size={16} />
      </button>
    </div>
  );
};
