import React from 'react';
import { Clock, Award, Users, ArrowUpRight, Star } from 'lucide-react';
import Badge from '../common/Badge';

export default function CourseCard({ course, onSelect }) {
  const {
    id,
    title,
    category,
    badge = 'INDUSTRY ACCREDITED',
    badgeVariant = 'bronze',
    duration,
    format,
    intake,
    rating = 4.9,
    reviewsCount = 48,
    level = 'Advanced',
    summary,
    image = '/images/tech-lab.jpg'
  } = course;

  return (
    <article className="course-card" aria-labelledby={`course-title-${id}`}>
      <div className="course-card-image-wrap">
        <img src={image} alt={title} loading="lazy" />
        <div className="course-card-badge-overlay">
          <Badge variant={badgeVariant} dot>{badge}</Badge>
        </div>
        <div className="course-format-chip">{format}</div>
      </div>

      <div className="course-card-body">
        <div className="course-card-meta-top">
          <span className="course-category">{category}</span>
          <div className="course-rating" aria-label={`Rated ${rating} out of 5 stars`}>
            <Star size={13} fill="#d4a359" stroke="#d4a359" aria-hidden="true" />
            <span className="rating-score">{rating}</span>
            <span className="rating-count">({reviewsCount})</span>
          </div>
        </div>

        <h3 id={`course-title-${id}`} className="course-card-title">
          {title}
        </h3>

        <p className="course-card-summary">{summary}</p>

        <div className="course-card-specs">
          <div className="spec-item">
            <Clock size={14} aria-hidden="true" />
            <span>{duration}</span>
          </div>
          <div className="spec-item">
            <Award size={14} aria-hidden="true" />
            <span>{level}</span>
          </div>
        </div>

        <div className="course-card-footer">
          <div className="course-intake-wrap">
            <span className="intake-label">Next Cohort:</span>
            <span className="intake-date">{intake}</span>
          </div>
          <a
            href="#signup"
            className="course-action-btn"
            onClick={(e) => {
              if (onSelect) {
                e.preventDefault();
                onSelect(course);
              }
            }}
          >
            <span>Details</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  );
}
