import { Award, Calendar, Clock, GraduationCap } from "lucide-react";
import { ProgramSyllabusDetails } from "../../syllabusData";
import "./SyllabusStatsStrip.css";

export interface SyllabusStatsStripProps {
  syllabus: ProgramSyllabusDetails;
}

export const SyllabusStatsStrip: React.FC<SyllabusStatsStripProps> = ({
  syllabus,
}) => {
  return (
    <div className="syllabus-specs-strip">
      <div className="spec-item">
        <Clock size={14} className="spec-icon" aria-hidden="true" />
        <span className="spec-label">Duration:</span>
        <span className="spec-val">{syllabus.duration}</span>
      </div>
      <div className="spec-item">
        <Award size={14} className="spec-icon" aria-hidden="true" />
        <span className="spec-label">Level:</span>
        <span className="spec-val">{syllabus.level}</span>
      </div>
      <div className="spec-item">
        <Calendar size={14} className="spec-icon" aria-hidden="true" />
        <span className="spec-label">Next Intake:</span>
        <span className="spec-val">{syllabus.intake}</span>
      </div>
      <div className="spec-item">
        <GraduationCap size={14} className="spec-icon" aria-hidden="true" />
        <span className="spec-label">Format:</span>
        <span className="spec-val">{syllabus.format}</span>
      </div>
    </div>
  );
};
