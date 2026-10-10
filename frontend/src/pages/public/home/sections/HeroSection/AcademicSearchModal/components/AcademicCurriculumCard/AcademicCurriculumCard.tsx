import { ArrowRight, BookOpen, Code2, Layers } from "lucide-react";
import { AcademicCurriculum } from "../../academicData";
import { NavigateFunction } from "../../../../../../../../types/navigation";
import "./AcademicCurriculumCard.css";

export interface AcademicCurriculumCardProps {
  item: AcademicCurriculum;
  onQueryChange: (query: string) => void;
  onSelectFile: (fileName: string) => void;
  onClose: () => void;
  onNavigate?: NavigateFunction;
}

export const AcademicCurriculumCard: React.FC<AcademicCurriculumCardProps> = ({
  item,
  onQueryChange,
  onSelectFile,
  onClose,
  onNavigate,
}) => {
  return (
    <div className="academic-curriculum-card">
      {/* Card Header */}
      <div className="academic-card-header">
        <div className={`academic-badge-icon badge-${item.badgeType}`}>
          {item.type === "program" ? (
            <Layers size={16} />
          ) : (
            <BookOpen size={16} />
          )}
        </div>
        <div className="academic-card-title-group">
          <h4 className="academic-card-title">{item.title}</h4>
          <span className={`academic-status-text status-${item.badgeType}`}>
            {item.badge}
          </span>
        </div>
      </div>

      <p className="academic-card-desc">{item.description}</p>

      {/* 3-Column Stats Strip */}
      <div className="academic-stats-strip">
        <div className="academic-stat-box">
          <span className="stat-number">{item.stats.coursesCount}</span>
          <span className="stat-label">
            {item.type === "program" ? "Courses" : "Module"}
          </span>
        </div>
        <div className="academic-stat-box">
          <span className="stat-number">{item.stats.labHours}</span>
          <span className="stat-label">Lab Hours</span>
        </div>
        <div className="academic-stat-box">
          <span className="stat-number stat-active">Active</span>
          <span className="stat-label">{item.stats.mentor}</span>
        </div>
      </div>

      {/* Course Code Pills */}
      <div className="academic-pills-row">
        {item.coursePills.map((pill, pIdx) => (
          <button
            key={pIdx}
            type="button"
            className="academic-course-pill"
            onClick={(e) => {
              e.stopPropagation();
              onQueryChange(pill);
            }}
            title={`Filter by ${pill}`}
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Card Actions */}
      <div className="academic-card-footer">
        <button
          type="button"
          className="btn-studio-inspect"
          onClick={() => {
            onSelectFile(item.targetFile);
            onClose();
          }}
          title="Inspect curriculum source code in VS Code Studio"
        >
          <Code2 size={12} />
          <span>Inspect in Studio</span>
        </button>
        <button
          type="button"
          className="btn-academic-enroll"
          onClick={() => {
            if (onNavigate) {
              onNavigate("signup");
            }
          }}
        >
          <span>Enroll</span>
          <ArrowRight size={12} />
        </button>
      </div>
    </div>
  );
};
