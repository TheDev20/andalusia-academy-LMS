import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Terminal, ChevronLeft, ChevronRight } from "lucide-react";
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


  // Level 2: UI Keystroke Debounce (300ms delay per RFC Option B)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Level 1: Client Query Cache (TanStack Query - 5 min staleTime per RFC Option B)
  const { data: catalogData, isFetching } = useCatalogCourses({
    searchTerm: debouncedSearchQuery,
    pageNumber: 1,
    pageSize: 24,
  });

  // Map backend DTOs to UI Course objects
  const serverCourses = useMemo(() => {
    if (!catalogData?.items) return [];

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
        imageUrl: dto.imageUrl,
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

  const { data: disciplines } = useQuery({
    queryKey: ["catalog", "disciplines"],
    queryFn: async () => {
      const res = await fetch("/api/catalog/disciplines");
      if (!res.ok) throw new Error("Failed to load disciplines");
      return res.json() as Promise<{ id: string; title: string; slug: string }[]>;
    },
    staleTime: 5 * 60 * 1000,
  });

  const legacyAliases: Record<string, string> = {
    dev: "software-engineering",
    ai: "ai-machine-learning",
    data: "data-science",
    cloud: "cloud-devops",
    cyber: "cybersecurity",
  };

  const normalizeSlug = (str: string) =>
    str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const PRIORITY_ORDER: Record<string, number> = {
    "software-engineering": 1,
    "ai-and-machine-learning": 2,
    "ai-machine-learning": 2,
    "data-science": 3,
    "cloud-devops": 4,
    "cybersecurity": 5,
    "game-development-and-xr": 6,
    "game-development-xr": 6,
    "mobile-app-development": 7,
  };

  const filterTabs = useMemo(() => {
    const allTab = { id: "all", label: "All Programs", slug: "all" };
    if (disciplines && disciplines.length > 0) {
      const sorted = [...disciplines].sort((a, b) => {
        const orderA = PRIORITY_ORDER[a.slug] ?? 99;
        const orderB = PRIORITY_ORDER[b.slug] ?? 99;
        return orderA - orderB;
      });
      return [
        allTab,
        ...sorted.map((d) => ({
          id: d.slug,
          label: d.title,
          slug: d.slug,
        })),
      ];
    }
    return [
      allTab,
      { id: "software-engineering", label: "Software Engineering", slug: "software-engineering" },
      { id: "ai-machine-learning", label: "AI & Machine Learning", slug: "ai-machine-learning" },
      { id: "data-science", label: "Data Science", slug: "data-science" },
      { id: "cloud-devops", label: "Cloud & DevOps", slug: "cloud-devops" },
      { id: "cybersecurity", label: "Cybersecurity", slug: "cybersecurity" },
      { id: "game-development-and-xr", label: "Game Development & XR", slug: "game-development-and-xr" },
    ];
  }, [disciplines]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -260, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 260, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector(".is-active") as HTMLElement | null;
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, [activeFilter, filterTabs]);

  const matchesCategoryFilter = (courseCategory: string, filterSlug: string) => {
    if (!filterSlug || filterSlug === "all") return true;

    const cat = courseCategory.toLowerCase();
    const filter = filterSlug.toLowerCase();

    // Check direct equality
    if (cat === filter) return true;

    // Direct slug representations
    const slugWithAnd = cat.replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    const slugNoAnd = cat.replace(/&/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    if (slugWithAnd === filter || slugNoAnd === filter) return true;

    // Cleaned alphanumeric comparison (ignores hyphens, & and 'and')
    const cleanCat = cat.replace(/&/g, "").replace(/\band\b/g, "").replace(/[^a-z0-9]/g, "");
    const cleanFilter = filter.replace(/&/g, "").replace(/\band\b/g, "").replace(/[^a-z0-9]/g, "");

    if (cleanCat && cleanFilter && (cleanCat === cleanFilter || cleanCat.includes(cleanFilter) || cleanFilter.includes(cleanCat))) {
      return true;
    }

    return false;
  };

  const displayCourses = useMemo(() => {
    const sourceList = serverCourses;
    const targetFilter = activeFilter.toLowerCase();
    const resolvedFilterSlug = legacyAliases[targetFilter] || targetFilter;

    return sourceList.filter((course) => {
      const matchesFilter = matchesCategoryFilter(course.category || "", resolvedFilterSlug);

      const matchesSearch =
        !searchQuery ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [serverCourses, activeFilter, searchQuery]);

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

          {/* Styled Pill Filter Bar with Scroll Arrows */}
          <div className="course-filters-bar-container">
            <button
              type="button"
              className="filter-scroll-arrow"
              onClick={scrollLeft}
              aria-label="Scroll filter tabs left"
              title="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>

            <div
              className="course-filters-bar"
              role="tablist"
              aria-label="Program Filter"
            >
              <div className="filter-buttons-scroll" ref={scrollContainerRef}>
                {filterTabs.map((tab) => {
                  const isActive =
                    activeFilter === tab.id ||
                    activeFilter === tab.slug ||
                    legacyAliases[activeFilter] === tab.slug;

                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={isActive}
                      className={`filter-btn ${isActive ? "is-active" : ""}`}
                      onClick={() => handleTabChange(tab.slug)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              className="filter-scroll-arrow"
              onClick={scrollRight}
              aria-label="Scroll filter tabs right"
              title="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
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
