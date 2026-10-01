import { useState, useMemo } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';
import { Course } from '../../../../../types/course';
import CourseCard from '../../../../../components/ui/CourseCard';
import SectionHeading from '../../../../../components/ui/SectionHeading';
import './FeaturedCoursesSection.css';

export interface FeaturedCoursesSectionProps {
  searchQuery?: string;
  onSelectCourse?: (course: Course) => void;
}

export default function FeaturedCoursesSection({ searchQuery = '', onSelectCourse }: FeaturedCoursesSectionProps) {
  const [activeFilter, setActiveFilter] = useState('all');

  const allCourses: Course[] = [
    {
      id: 'aspnet-core-enterprise',
      title: 'ASP.NET Core & Enterprise Microservices Masterclass',
      category: 'Software Engineering',
      badge: 'FLAGSHIP PROGRAM',
      badgeVariant: 'bronze',
      duration: '6 Months · 180 Lab Hours',
      format: 'Hybrid · Offline & Online',
      intake: 'Oct 15, 2026',
      rating: 4.96,
      reviewsCount: 142,
      level: 'Intermediate to Advanced',
      summary: 'Architect high-performance distributed systems using .NET 10, EF Core code-first migrations, SQL Server, Clean Architecture, and Redis caching.'
    },
    {
      id: 'applied-genai-llm',
      title: 'Applied Generative AI, LLMs & Autonomous Agents Bootcamp',
      category: 'AI & Machine Learning',
      badge: 'TOP ENROLLED',
      badgeVariant: 'bronze',
      duration: '5 Months · 160 Lab Hours',
      format: 'Hybrid · Hands-on AI Studio',
      intake: 'Nov 1, 2026',
      rating: 4.98,
      reviewsCount: 184,
      level: 'All Developers',
      summary: 'Build production-ready agentic AI systems using LangChain, vector databases (Chroma/Pinecone), RAG architectures, and fine-tuned open-source LLMs.'
    },
    {
      id: 'react-fullstack-architecture',
      title: 'Modern Full-Stack React 19 & TypeScript Systems Architecture',
      category: 'Software Engineering',
      badge: 'CAREER ACCELERATOR',
      badgeVariant: 'bronze',
      duration: '4 Months · 120 Lab Hours',
      format: 'Live Interactive & Offline Hubs',
      intake: 'Oct 20, 2026',
      rating: 4.92,
      reviewsCount: 128,
      level: 'Frontend & Full-Stack',
      summary: 'Master Next.js App Router, React Server Components, state management, full-stack typed APIs, and scalable modular design systems.'
    },
    {
      id: 'data-science-ml',
      title: 'Data Science & Machine Learning Engineering Specialization',
      category: 'Data Science',
      badge: 'INDUSTRY CERTIFIED',
      badgeVariant: 'bronze',
      duration: '6 Months · 190 Lab Hours',
      format: 'In-Depth Labs & Capstone',
      intake: 'Nov 10, 2026',
      rating: 4.94,
      reviewsCount: 96,
      level: 'Data Professionals',
      summary: 'Master statistical machine learning with Python, Pandas, Scikit-Learn, PyTorch neural networks, feature engineering, and production MLOps.'
    },
    {
      id: 'bigdata-spark-bigquery',
      title: 'Big Data Engineering with Apache Spark & Google BigQuery',
      category: 'Data Science',
      badge: 'HIGH DEMAND',
      badgeVariant: 'bronze',
      duration: '5 Months · 150 Lab Hours',
      format: 'Cloud Data Lab & Weekend Sessions',
      intake: 'Oct 28, 2026',
      rating: 4.91,
      reviewsCount: 79,
      level: 'Software & Data Engineers',
      summary: 'Process massive streaming datasets using Apache Spark, build scalable cloud data warehouses on BigQuery, and automate enterprise DBT pipelines.'
    },
    {
      id: 'kubernetes-devops-cloud',
      title: 'Cloud-Native Kubernetes, Terraform & DevOps Orchestration',
      category: 'Cloud & DevOps',
      badge: 'ENTERPRISE ESSENTIAL',
      badgeVariant: 'bronze',
      duration: '4 Months · 130 Lab Hours',
      format: 'Hands-on Cloud Infrastructure',
      intake: 'Nov 15, 2026',
      rating: 4.95,
      reviewsCount: 110,
      level: 'DevOps & Backend Engineers',
      summary: 'Provision cloud environments with Terraform, orchestrate containerized microservices in production Kubernetes, and automate GitHub Actions CI/CD.'
    }
  ];

  const filteredCourses = useMemo(() => {
    return allCourses.filter((course) => {
      const matchesFilter =
        activeFilter === 'all' ||
        (activeFilter === 'dev' && course.category === 'Software Engineering') ||
        (activeFilter === 'ai' && course.category === 'AI & Machine Learning') ||
        (activeFilter === 'data' && course.category === 'Data Science') ||
        (activeFilter === 'cloud' && course.category === 'Cloud & DevOps');

      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [allCourses, activeFilter, searchQuery]);

  const filterTabs = [
    { id: 'all', label: 'All Programs' },
    { id: 'dev', label: 'Software Engineering' },
    { id: 'ai', label: 'AI & Machine Learning' },
    { id: 'data', label: 'Data Science' },
    { id: 'cloud', label: 'Cloud & DevOps' }
  ];

  return (
    <section id="courses" className="featured-courses-section scroll-section" aria-label="Featured Courses and Programs">
      <div className="section-container">
        <div className="courses-header-center">
          <SectionHeading
            title={<>Featured & Trending <em>Programs</em></>}
            subtitle="Explore rigorous technical curricula taught by senior software architects, AI researchers, and data leaders."
            align="center"
          />

          {/* Styled Pill Filter Bar */}
          <div className="course-filters-bar" role="tablist" aria-label="Program Filter">
            <div className="filter-buttons-scroll">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeFilter === tab.id}
                  className={`filter-btn ${activeFilter === tab.id ? 'is-active' : ''}`}
                  onClick={() => setActiveFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Counter if searching */}
        {searchQuery && (
          <div className="search-active-notice">
            <span>Showing results matching "<strong>{searchQuery}</strong>" ({filteredCourses.length} programs found)</span>
          </div>
        )}

        {/* Clean, Uncrowded Courses Grid */}
        <div className="courses-grid">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={(c) => onSelectCourse && onSelectCourse(c)}
              />
            ))
          ) : (
            <div className="courses-empty-state">
              <Terminal size={36} className="empty-icon" aria-hidden="true" />
              <h4>No courses found matching your criteria</h4>
              <p>Try clearing your search query or selecting another technical discipline.</p>
              <button
                type="button"
                className="btn-reset-filter"
                onClick={() => setActiveFilter('all')}
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Catalog CTA Footer */}
        <div className="courses-catalog-cta">
          <div className="catalog-cta-info">
            <h4>Ready to accelerate your technical career?</h4>
            <p>View all 64+ specialized software engineering, AI, and data science courses and certificate programs.</p>
          </div>
          <a
            href="#courses"
            className="btn-full-catalog"
            onClick={(e) => {
              e.preventDefault();
              setActiveFilter('all');
            }}
          >
            <span>Explore Complete Catalog</span>
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
