import { Clock, GraduationCap, Monitor } from "lucide-react";
import { ProgramSyllabusDetails } from "../../types";

interface EnrollmentCardProps {
  syllabus: ProgramSyllabusDetails;
  onEnroll?: () => void;
  enrollLabel?: string;
}

export function EnrollmentCard({
  syllabus,
  onEnroll,
  enrollLabel = "Pay USD",
}: EnrollmentCardProps) {
  return (
    <aside
      id="enroll"
      aria-label="Enrollment summary"
      className="syllabus-enrollment-card"
    >
      <div className="enroll-header">
        <span className="enroll-tag">{syllabus.intake || "Nov 15, 2026"}</span>
        <div className="enroll-date">Enrol now</div>
      </div>

      <div className="enroll-divider" />

      <div className="enroll-details-list">
        <div className="enroll-detail-row">
          <span className="enroll-icon-box">
            <Clock size={19} aria-hidden="true" />
          </span>
          <div>
            <div className="detail-label">Duration</div>
            <div className="detail-val">{syllabus.duration}</div>
          </div>
        </div>

        <div className="enroll-detail-row">
          <span className="enroll-icon-box">
            <GraduationCap size={19} aria-hidden="true" />
          </span>
          <div>
            <div className="detail-label">Level</div>
            <div className="detail-val">{syllabus.level}</div>
          </div>
        </div>

        <div className="enroll-detail-row">
          <span className="enroll-icon-box">
            <Monitor size={19} aria-hidden="true" />
          </span>
          <div>
            <div className="detail-label">Format</div>
            <div className="detail-val">{syllabus.format}</div>
          </div>
        </div>
      </div>

      <button type="button" className="enroll-primary-btn" onClick={onEnroll}>
        {enrollLabel}
      </button>

      <a href="#outcomes" className="advisor-link">
        Talk to an advisor first
      </a>
    </aside>
  );
}
