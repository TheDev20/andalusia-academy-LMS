import { Clock, Award, ArrowUpRight, Star } from "lucide-react";
import type { Course } from "../../../types/course";
import { Link } from "react-router-dom";
import Badge from "../../common/Badge";
import "./CourseCard.css";

export interface CourseCardProps {
  course: Course;
  onSelect?: (course: Course) => void;
}
function getCourseCover(imageUrl?: string | null, category?: string | null): string {
  if (imageUrl) return imageUrl;
  const cat = (category || "").toLowerCase();
  if (cat.includes("game") || cat.includes("xr")) return "/images/GameDevelopment.jpg";
  if (cat.includes("cloud") || cat.includes("devops")) return "/images/CloudComputing.jpg";
  if (cat.includes("cyber") || cat.includes("security")) return "/images/Cybersecurity.jpg";
  if (cat.includes("data") || cat.includes("analyt")) return "/images/DataScience.jpg";
  if (cat.includes("ai") || cat.includes("intelligence") || cat.includes("machine")) return "/images/GenerativeAi.jpg";
  return "/images/SoftwareEngineering.jpg";
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
  const {
    id,
    title,
    category,
    badge = "FLAGSHIP",
    badgeVariant = "bronze",
    duration,
    intake,
    rating = 4.9,
    reviewsCount = 48,
    level = "Intermediate to Advanced",
    summary,
  } = course;

  return (
    <article className="course-card" aria-labelledby={`course-title-${id}`}>
      <div className="course-card-image">
        <img
          src={getCourseCover(course.imageUrl, category)}
          alt={course.title}
        />
      </div>

      <div className="course-card-body">
        <div className="course-card-meta-top">
          <Badge variant={badgeVariant}>{badge}</Badge>
          <div
            className="course-rating"
            aria-label={`Rated ${rating} out of 5 stars`}
          >
            <Star
              size={13}
              fill="#d4a359"
              stroke="#d4a359"
              aria-hidden="true"
            />
            <span className="rating-score">{rating}</span>
            <span className="rating-count">({reviewsCount})</span>
          </div>
        </div>

        <span className="course-category-tag">{category}</span>

        <h3 id={`course-title-${id}`} className="course-card-title">
          <Link
            to={`/courses/${course.id}/syllabus`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {title}
          </Link>
        </h3>

        <p className="course-card-summary">{summary}</p>

        <div className="course-card-specs">
          <div className="spec-item">
            <Clock size={13} aria-hidden="true" />
            <span>{duration}</span>
          </div>
          <div className="spec-item">
            <Award size={13} aria-hidden="true" />
            <span>{level}</span>
          </div>
        </div>

        <div className="course-card-footer">
          <div className="course-intake-wrap">
            <span className="intake-label">Next Intake:</span>
            <span className="intake-date">{intake}</span>
          </div>
          <Link
            to={`/courses/${course.id}/syllabus`}
            target="_blank"
            rel="noopener noreferrer"
            className="course-action-btn"
          >
            <span>View Syllabus</span>
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
