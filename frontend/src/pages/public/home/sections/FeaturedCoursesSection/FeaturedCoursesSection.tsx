import { useState, useMemo } from "react";
import { Terminal } from "lucide-react";
import { Course } from "../../../../../types/course";
import { NavigateFunction } from "../../../../../types/navigation";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { useCatalogCourses } from "../../../../../hooks/useCatalogCourses";
import { CourseSummaryDto } from "../../../../../types/catalog";
import CourseCard from "../../../../../components/ui/CourseCard";
import SectionHeading from "../../../../../components/ui/SectionHeading";
import "./FeaturedCoursesSection.css";

export interface FeaturedCoursesSectionProps {
  searchQuery?: string;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  onClearSearch?: () => void;
  onSelectCourse?: (course: Course) => void;
  onNavigate?: NavigateFunction;
}

export default function FeaturedCoursesSection({
  searchQuery = "",
  activeFilter: controlledFilter,
  onFilterChange,
  onClearSearch,
  onSelectCourse,
  onNavigate,
}: FeaturedCoursesSectionProps) {
  const [internalFilter, setInternalFilter] = useState("all");
  const activeFilter =
    controlledFilter !== undefined ? controlledFilter : internalFilter;
  const handleTabChange = (filterId: string) => {
    if (onFilterChange) {
      onFilterChange(filterId);
    } else {
      setInternalFilter(filterId);
    }
  };


  const allCourses: Course[] = [
    {
      id: "aspnet-core-enterprise",
      title: "ASP.NET Core & Enterprise Microservices Masterclass",
      category: "Software Engineering",
      badge: "FLAGSHIP PROGRAM",
      badgeVariant: "bronze",
      duration: "6 Months · 180 Lab Hours",
      format: "Hybrid · Offline & Online",
      intake: "Oct 15, 2026",
      rating: 4.96,
      reviewsCount: 142,
      level: "Intermediate to Advanced",
      summary:
        "Architect high-performance distributed systems using .NET 10, EF Core code-first migrations, SQL Server, Clean Architecture, and Redis caching.",
    },
    {
      id: "applied-genai-llm",
      title: "Applied Generative AI, LLMs & Autonomous Agents Bootcamp",
      category: "AI & Machine Learning",
      badge: "TOP ENROLLED",
      badgeVariant: "bronze",
      duration: "5 Months · 160 Lab Hours",
      format: "Hybrid · Hands-on AI Studio",
      intake: "Nov 1, 2026",
      rating: 4.98,
      reviewsCount: 184,
      level: "All Developers",
      summary:
        "Build production-ready agentic AI systems using LangChain, vector databases (Chroma/Pinecone), RAG architectures, and fine-tuned open-source LLMs.",
    },
    {
      id: "react-fullstack-architecture",
      title: "Modern Full-Stack React 19 & TypeScript Systems Architecture",
      category: "Software Engineering",
      badge: "CAREER ACCELERATOR",
      badgeVariant: "bronze",
      duration: "4 Months · 120 Lab Hours",
      format: "Live Interactive & Offline Hubs",
      intake: "Oct 20, 2026",
      rating: 4.92,
      reviewsCount: 128,
      level: "Frontend & Full-Stack",
      summary:
        "Master Next.js App Router, React Server Components, state management, full-stack typed APIs, and scalable modular design systems.",
    },
    {
      id: "data-science-ml",
      title: "Data Science & Machine Learning Engineering Specialization",
      category: "Data Science",
      badge: "INDUSTRY CERTIFIED",
      badgeVariant: "bronze",
      duration: "6 Months · 190 Lab Hours",
      format: "In-Depth Labs & Capstone",
      intake: "Nov 10, 2026",
      rating: 4.94,
      reviewsCount: 96,
      level: "Data Professionals",
      summary:
        "Master statistical machine learning with Python, Pandas, Scikit-Learn, PyTorch neural networks, feature engineering, and production MLOps.",
    },
    {
      id: "bigdata-spark-bigquery",
      title: "Big Data Engineering with Apache Spark & Google BigQuery",
      category: "Data Science",
      badge: "HIGH DEMAND",
      badgeVariant: "bronze",
      duration: "5 Months · 150 Lab Hours",
      format: "Cloud Data Lab & Weekend Sessions",
      intake: "Oct 28, 2026",
      rating: 4.91,
      reviewsCount: 79,
      level: "Software & Data Engineers",
      summary:
        "Process massive streaming datasets using Apache Spark, build scalable cloud data warehouses on BigQuery, and automate enterprise DBT pipelines.",
    },
    {
      id: "kubernetes-devops-cloud",
      title: "Cloud-Native Kubernetes, Terraform & DevOps Orchestration",
      category: "Cloud & DevOps",
      badge: "ENTERPRISE ESSENTIAL",
      badgeVariant: "bronze",
      duration: "4 Months · 130 Lab Hours",
      format: "Hands-on Cloud Infrastructure",
      intake: "Nov 15, 2026",
      rating: 4.95,
      reviewsCount: 110,
      level: "DevOps & Backend Engineers",
      summary:
        "Provision cloud environments with Terraform, orchestrate containerized microservices in production Kubernetes, and automate GitHub Actions CI/CD.",
    },
    {
      id: "cybersecurity-devsecops",
      title: "Enterprise Cybersecurity, Penetration Testing & DevSecOps",
      category: "Cybersecurity",
      badge: "DEFENSE & DEVSECOPS",
      badgeVariant: "bronze",
      duration: "6 Months · 175 Lab Hours",
      format: "Hybrid · Offensive & Defensive Cyber Labs",
      intake: "Nov 5, 2026",
      rating: 4.97,
      reviewsCount: 118,
      level: "Intermediate to Advanced",
      summary:
        "Master hands-on penetration testing, OWASP Top 10 mitigation, Zero-Trust network architecture, SOC threat hunting, and automated DevSecOps pipelines.",
    },
  ];

  // Level 2: UI Keystroke Debounce (300ms delay per RFC Option B)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Level 1: Client Query Cache (TanStack Query - 5 min staleTime per RFC Option B)
  const { data: catalogData, isFetching } = useCatalogCourses({
    searchTerm: debouncedSearchQuery,
    pageNumber: 1,
    pageSize: 12,
  });

  // Map backend DTOs to UI Course objects
  const serverCourses = useMemo(() => {
    if (!catalogData?.items || catalogData.items.length === 0) return null;

    return catalogData.items.map((dto: CourseSummaryDto): Course => {
      const primaryCategory = dto.categories?.[0] || "Software Engineering";
      const formattedDate = dto.nextOfferingDate
        ? new Date(dto.nextOfferingDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Upcoming Intake";

      return {
        id: dto.slug || dto.id,
        title: dto.title,
        category: primaryCategory,
        badge: dto.startingPrice
          ? `$${dto.startingPrice.toLocaleString()}`
          : "ACCREDITED",
        badgeVariant: "bronze",
        duration: "Flexible Labs",
        format: "Hybrid · Live & Lab",
        intake: formattedDate,
        rating: 4.95,
        reviewsCount: 120,
        level: "All Developers",
        summary: dto.description || "",
      };
    });
  }, [catalogData]);

  const displayCourses = useMemo(() => {
    const sourceList = serverCourses ?? allCourses;
    return sourceList.filter((course) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "dev" &&
          course.category === "Software Engineering") ||
        (activeFilter === "ai" &&
          course.category === "AI & Machine Learning") ||
        (activeFilter === "data" && course.category === "Data Science") ||
        (activeFilter === "cloud" && course.category === "Cloud & DevOps") ||
        (activeFilter === "cyber" && course.category === "Cybersecurity");

      if (serverCourses) {
        return matchesFilter;
      }

      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [serverCourses, allCourses, activeFilter, searchQuery]);

  const filterTabs = [
    { id: "all", label: "All Programs" },
    { id: "dev", label: "Software Engineering" },
    { id: "ai", label: "AI & Machine Learning" },
    { id: "data", label: "Data Science" },
    { id: "cloud", label: "Cloud & DevOps" },
    { id: "cyber", label: "Cybersecurity" },
  ];

  return (
    <section
      id="courses"
      className="featured-courses-section scroll-section"
      aria-label="Featured Courses and Programs"
    >
      <div className="section-container">
        <div className="courses-header-center">
          <SectionHeading
            title={
              <>
                Featured & Trending <em>Programs</em>
              </>
            }
            subtitle="Explore rigorous technical curricula taught by senior software architects, AI researchers, and data leaders."
            align="center"
          />

          {/* Styled Pill Filter Bar */}
          <div
            className="course-filters-bar"
            role="tablist"
            aria-label="Program Filter"
          >
            <div className="filter-buttons-scroll">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={activeFilter === tab.id}
                  className={`filter-btn ${activeFilter === tab.id ? "is-active" : ""}`}
                  onClick={() => handleTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Clean, Uncrowded Courses Grid */}
        <div className="courses-grid">
          {displayCourses.length > 0 ? (
            displayCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={onSelectCourse}
              />
            ))
          ) : (
            <div className="courses-empty-state">
              <Terminal size={36} className="empty-icon" aria-hidden="true" />
              <h4>No courses found matching your criteria</h4>
              <p>
                {activeFilter !== "all" && (serverCourses?.length ?? 0) > 0 ? (
                  <>
                    No courses in <strong>{filterTabs.find((t) => t.id === activeFilter)?.label}</strong> match "<strong>{searchQuery}</strong>",
                    but <strong>{serverCourses?.length}</strong> programs were found in other technical disciplines.
                  </>
                ) : (
                  "Try clearing your search query or selecting another technical discipline."
                )}
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "14px" }}>
                <button
                  type="button"
                  className="btn-reset-filter"
                  onClick={() => handleTabChange("all")}
                >
                  {activeFilter !== "all" && (serverCourses?.length ?? 0) > 0
                    ? `View All ${serverCourses?.length} Matching Programs`
                    : "Reset Filters"}
                </button>
                {searchQuery && onClearSearch && (
                  <button
                    type="button"
                    className="btn-reset-filter"
                    onClick={onClearSearch}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </section>
  );
}
