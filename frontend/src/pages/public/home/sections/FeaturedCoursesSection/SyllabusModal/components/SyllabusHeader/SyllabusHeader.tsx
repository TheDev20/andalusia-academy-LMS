import { Star } from "lucide-react";
import { ProgramSyllabusDetails } from "../../syllabusData";
import "./SyllabusHeader.css";

export interface SyllabusHeaderProps {
  syllabus: ProgramSyllabusDetails;
  children?: React.ReactNode;
}

export const SyllabusHeader: React.FC<SyllabusHeaderProps> = ({
  syllabus,
  children,
}) => {
  return (
    <div className="syllabus-modal-header">
      <div className="syllabus-header-main">
        <div className="syllabus-meta-pills">
          <span className="syllabus-badge-pill">{syllabus.badge}</span>
          <span className="syllabus-category-pill">{syllabus.category}</span>
          <div className="syllabus-rating-pill">
            <Star
              size={12}
              fill="#d4a359"
              stroke="#d4a359"
              aria-hidden="true"
            />
            <span>{syllabus.rating}</span>
            <span className="rating-count">
              ({syllabus.reviewsCount} reviews)
            </span>
          </div>
        </div>

        <h2 id="syllabus-modal-title" className="syllabus-modal-title">
          {syllabus.title}
        </h2>

        <p className="syllabus-modal-overview">{syllabus.overview}</p>

        {children}
      </div>
    </div>
  );
};
