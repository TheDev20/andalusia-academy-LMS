import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { ProgramSyllabusDetails } from "../../types";
import { EnrollmentCard } from "./EnrollmentCard";
import "./SyllabusHero.css";

interface SyllabusHeroProps {
  syllabus: ProgramSyllabusDetails;
  onEnroll?: () => void;
}

export function SyllabusHero({ syllabus, onEnroll }: SyllabusHeroProps) {
  return (
    <section id="top" className="syllabus-hero-section">
      <div className="syllabus-hero-container">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="syllabus-breadcrumb">
          <Link to="/courses" className="breadcrumb-link">
            Courses &amp; Programs
          </Link>
          <span className="breadcrumb-sep" aria-hidden="true">
            /
          </span>
          <span className="breadcrumb-current">{syllabus.category}</span>
        </nav>

        <div className="syllabus-hero-split">
          {/* Main Hero Column */}
          <div className="syllabus-hero-main">
            <div className="hero-badge-row">
              {syllabus.badge && (
                <span className="hero-top-badge">{syllabus.badge}</span>
              )}
              <span className="hero-category-badge">{syllabus.category}</span>
              <span className="hero-rating-badge">
                <Star
                  size={15}
                  fill="#E3B58F"
                  stroke="#E3B58F"
                  aria-hidden="true"
                />
                <strong>{syllabus.rating.toFixed(2)}</strong>
                <span>({syllabus.reviewsCount} reviews)</span>
              </span>
            </div>

            <h1 className="hero-course-title">{syllabus.title}</h1>

            <p className="hero-course-desc">{syllabus.overview}</p>

            <div className="hero-actions-row">
              <a href="#curriculum" className="hero-primary-cta">
                Explore the curriculum
              </a>
            </div>
          </div>

          {/* Floating Sidebar Card */}
          <EnrollmentCard syllabus={syllabus} onEnroll={onEnroll} />
        </div>
      </div>
    </section>
  );
}
