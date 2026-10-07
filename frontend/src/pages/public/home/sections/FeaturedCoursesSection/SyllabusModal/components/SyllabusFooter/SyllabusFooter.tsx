import React from "react";
import { ArrowRight, Download } from "lucide-react";
import { ProgramSyllabusDetails } from "../../syllabusData";
import "./SyllabusFooter.css";

export interface SyllabusFooterProps {
  syllabus: ProgramSyllabusDetails;
  downloadSuccess: boolean;
  onDownload: () => void;
  onEnroll: () => void;
}

export const SyllabusFooter: React.FC<SyllabusFooterProps> = ({
  syllabus,
  downloadSuccess,
  onDownload,
  onEnroll,
}) => {
  return (
    <div className="syllabus-modal-footer">
      <div className="footer-left-info">
        <span className="footer-cohort-text">
          Next Cohort: <strong>{syllabus.intake}</strong> · Limited to 25 fellows
        </span>
        <span className="footer-sub-text">
          1-on-1 Code Review · Certificate of Mastery
        </span>
      </div>

      <div className="footer-actions-group">
        <button
          type="button"
          className="btn-download-syllabus"
          onClick={onDownload}
          title="Download official syllabus document"
        >
          <Download size={14} />
          <span>{downloadSuccess ? "Downloaded! ✓" : "Download Syllabus"}</span>
        </button>

        <button
          type="button"
          className="btn-enroll-syllabus"
          onClick={onEnroll}
        >
          <span>Enroll in Program</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};
