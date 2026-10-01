import './TestimonialsSection.css';
import { useState } from 'react';
import SectionHeading from '../../../../../components/ui/SectionHeading';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from '../../../../../components/common/Badge';

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The ASP.NET Core & Microservices bootcamp took my engineering skills to another level. Building real production systems with Clean Architecture, EF Core, Redis caching, and Docker gave me the exact confidence needed to land my Senior Backend Engineer role.",
    author: "Ahmed Mansour",
    title: "Senior Full-Stack Engineer",
    institution: "Global Fintech & Cloud Solutions",
    track: "ASP.NET Core & Microservices",
    rating: 5,
    avatarInitials: "AM"
  },
  {
    id: 2,
    quote: "The Generative AI and LLM bootcamp isn't just about calling APIs—it teaches you vector embeddings, retrieval pipelines (RAG), agent orchestration, and evaluation metrics. The hands-on labs with senior AI researchers were exceptional.",
    author: "Sarah El-Kady",
    title: "Lead AI Engineer",
    institution: "Enterprise Cognitive Systems",
    track: "Applied Generative AI & Autonomous Agents",
    rating: 5,
    avatarInitials: "SK"
  },
  {
    id: 3,
    quote: "We partnered with Andalusia Academy to upskill 40+ corporate developers in cloud-native technologies. Within months, our deployment cycle was cut in half, and our teams successfully modernized our legacy monoliths into scalable services.",
    author: "Eng. Hesham Farouk",
    title: "VP of Engineering & Technology Director",
    institution: "Leading Digital Logistics Enterprise",
    track: "Corporate Cloud & DevOps",
    rating: 5,
    avatarInitials: "HF"
  },
  {
    id: 4,
    quote: "Transitioning into big data engineering seemed daunting until I took the Apache Spark & BigQuery track. The cohort sessions in the Cairo tech hub combined with deep architectural reviews made all the difference in my career.",
    author: "Nouran Youssef",
    title: "Lead Data Engineer",
    institution: "Regional Analytics Group",
    track: "Big Data & Google BigQuery",
    rating: 5,
    avatarInitials: "NY"
  }
];

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentTestimonial = TESTIMONIALS[currentIndex];
  const { quote, author, title, institution, track, rating, avatarInitials } = currentTestimonial;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? TESTIMONIALS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === TESTIMONIALS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="testimonials-section" aria-label="Learner and Engineer Testimonials">
      <div className="section-container">
        <SectionHeading
          title={<>Real Stories of <em>Engineering Mastery & Impact</em></>}
          subtitle="Discover how software engineers, AI developers, and data specialists transformed their technical careers through Andalusia Academy."
        />

        <div className="testimonials-carousel">
          <div className="testimonial-card-featured">
            <div className="quote-icon-wrap" aria-hidden="true">
              <Quote size={32} />
            </div>

            <div className="testimonial-rating">
              {[...Array(rating)].map((_, i) => (
                <Star key={i} size={15} fill="#d4a359" stroke="#d4a359" aria-hidden="true" />
              ))}
              <Badge variant="bronze" dot className="testimonial-track-badge">
                {track}
              </Badge>
            </div>

            <p className="testimonial-quote">
              "{quote}"
            </p>

            <div className="testimonial-author-block">
              <div className="author-avatar" aria-hidden="true">
                {avatarInitials}
              </div>
              <div className="author-details">
                <h4 className="author-name">{author}</h4>
                <p className="author-title">{title}</p>
                <p className="author-hospital">{institution}</p>
              </div>
            </div>
          </div>

          {/* Clean, horizontally-aligned carousel controls */}
          <div className="testimonials-nav-row">
            <div className="carousel-indicators">
              {TESTIMONIALS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  aria-label={`Go to testimonial ${dotIdx + 1}`}
                  className={`indicator-dot ${dotIdx === currentIndex ? 'is-active' : ''}`}
                  onClick={() => setCurrentIndex(dotIdx)}
                />
              ))}
            </div>

            <div className="carousel-nav-arrows">
              <button
                type="button"
                className="carousel-btn"
                onClick={handlePrev}
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                className="carousel-btn"
                onClick={handleNext}
                aria-label="Next testimonial"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
