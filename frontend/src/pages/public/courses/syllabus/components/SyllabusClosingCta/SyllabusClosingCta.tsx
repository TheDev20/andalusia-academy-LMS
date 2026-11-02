import { FileDown, Check } from "lucide-react";
import { ProgramSyllabusDetails } from "../../types";
import "./SyllabusClosingCta.css";

interface SyllabusClosingCtaProps {
  syllabus: ProgramSyllabusDetails;
  onEnroll?: () => void;
  enrollLabel?: string;
  onDownload?: () => void;
  downloadSuccess?: boolean;
}

export function SyllabusClosingCta({
  syllabus,
  onEnroll,
  enrollLabel = "Enroll in Upcoming Cohort",
  onDownload,
  downloadSuccess,
}: SyllabusClosingCtaProps) {
  return (
    <section className="syllabus-closing-section">
      <div className="closing-cta-card">
        <div className="closing-cta-info">
          <h2 className="closing-cta-title">
            Enroll now · {syllabus.intake || "Nov 15, 2026"}
          </h2>
          <p className="closing-cta-desc">
            {syllabus.format} · {syllabus.duration}. Secure your seat in this
            upcoming cohort or consult directly with an academic advisor.
          </p>
        </div>

        <div className="closing-cta-actions">
          <button
            type="button"
            className="closing-enroll-btn"
            onClick={onEnroll}
          >
            {enrollLabel}
          </button>

          {onDownload && (
            <button
              type="button"
              className="closing-download-btn"
              onClick={onDownload}
            >
              {downloadSuccess ? (
                <>
                  <Check size={16} aria-hidden="true" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <FileDown size={16} aria-hidden="true" />
                  <span>Download Syllabus</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
