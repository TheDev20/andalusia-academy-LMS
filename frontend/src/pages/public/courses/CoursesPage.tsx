import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  BookOpen,
  Layers,
  Compass,
  X,
  Calendar,
  ArrowUpRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import FeaturedCoursesSection from "../home/sections/FeaturedCoursesSection";
import SectionHeading from "../../../components/ui/SectionHeading";
import { fetchCatalogPrograms, fetchCareerPaths } from "../../../services/catalogService";
import { useDebounce } from "../../../hooks/useDebounce";
import { ErrorAlert, LoadingState } from "../../../components/portal/Portal";
import { formatDate, formatMoney } from "../../../utils/format";
import "../../../components/portal/portal.css";

type CatalogTab = "courses" | "programs" | "career-paths";

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeTab: CatalogTab =
    rawTab === "programs" || rawTab === "career-paths" ? rawTab : "courses";

  const currentFilter = searchParams.get("filter") || "all";
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(searchQuery, 250);

  const handleTabSwitch = (nextTab: CatalogTab) => {
    const next: Record<string, string> = {};
    if (nextTab !== "courses") next.tab = nextTab;
    if (nextTab === "courses" && currentFilter !== "all") next.filter = currentFilter;
    if (searchQuery.trim()) next.q = searchQuery.trim();
    setSearchParams(next, { replace: true });
  };

  const handleFilterChange = (filterId: string) => {
    const next: Record<string, string> = {};
    if (filterId !== "all") next.filter = filterId;
    if (searchQuery.trim()) next.q = searchQuery.trim();
    setSearchParams(next, { replace: true });
  };

  // Multi-Course Programs query (loaded when tab === "programs")
  const {
    data: programsData,
    isLoading: loadingPrograms,
    error: programsError,
  } = useQuery({
    queryKey: ["catalogPrograms", debouncedQuery, 1],
    queryFn: ({ signal }) =>
      fetchCatalogPrograms(
        { searchTerm: debouncedQuery, pageNumber: 1, pageSize: 24 },
        signal,
      ),
    enabled: activeTab === "programs",
  });

  // Career Paths query (loaded when tab === "career-paths")
  const {
    data: careerPathsData = [],
    isLoading: loadingPaths,
    error: pathsError,
  } = useQuery({
    queryKey: ["careerPaths"],
    queryFn: ({ signal }) => fetchCareerPaths(signal),
    enabled: activeTab === "career-paths",
  });

  const filteredCareerPaths = useMemo(() => {
    if (!debouncedQuery.trim()) return careerPathsData;
    const q = debouncedQuery.toLowerCase();
    return careerPathsData.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description ?? "").toLowerCase().includes(q) ||
        p.recommendedSkillTags.some((t) => t.toLowerCase().includes(q)),
    );
  }, [careerPathsData, debouncedQuery]);

  const searchPlaceholder =
    activeTab === "programs"
      ? "Search multi-course programs by title or track…"
      : activeTab === "career-paths"
        ? "Search career roadmaps or target roles…"
        : "Search single courses by title, topic, or skill…";

  return (
    <main style={{ background: "#eae4d9", minHeight: "calc(100vh - 80px)" }}>
      <style>{`
        @keyframes catalogTabFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .catalog-tab-panel {
          animation: catalogTabFadeIn 0.22s ease-out;
        }
        .catalog-rich-card {
          background: #f6f5f2;
          border: 1px solid #ded6c8;
          border-radius: 20px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
          box-shadow: 0 6px 20px rgba(39, 30, 22, 0.04);
        }
        .catalog-rich-card:hover {
          transform: translateY(-4px);
          border-color: #c2ae95;
          box-shadow: 0 16px 36px rgba(39, 30, 22, 0.09);
        }
      `}</style>

      {/* Unified Catalog Header & In-Page Tab Switcher */}
      <div
        className="section-container"
        style={{ paddingTop: "clamp(44px, 6vh, 68px)" }}
      >
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ marginTop: 12 }}>
            <SectionHeading
              as="h1"
              title={
                activeTab === "programs" ? (
                  <>
                    Multi-Course <em>Degree-Caliber Programs</em>
                  </>
                ) : activeTab === "career-paths" ? (
                  <>
                    Structured <em>Career Roadmaps</em>
                  </>
                ) : (
                  <>
                    Featured &amp; Trending <em>Courses</em>
                  </>
                )
              }
              subtitle={
                activeTab === "programs"
                  ? "Comprehensive multi-course sequences with a unified cohort schedule that take you from core architecture to production deployment."
                  : activeTab === "career-paths"
                    ? "Select the engineering role you want to achieve — each roadmap sequences the exact programs and courses that get you there."
                    : "Explore rigorous technical curricula taught by senior software architects, AI researchers, and data engineering leads."
              }
              align="center"
            />
          </div>
        </div>

        {/* Segmented Tab Bar + Search Input */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "14px 18px",
            background: "#f6f5f2",
            borderRadius: 20,
            border: "1px solid #ded6c8",
            boxShadow: "0 6px 22px rgba(39, 30, 22, 0.04)",
          }}
        >
          <div
            role="tablist"
            aria-label="Catalog view tabs"
            style={{
              display: "inline-flex",
              flexWrap: "wrap",
              gap: 6,
              background: "#ede7dc",
              padding: 5,
              borderRadius: 999,
              border: "1px solid #dfd6c7",
            }}
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "courses"}
              onClick={() => handleTabSwitch("courses")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 999,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                background: activeTab === "courses" ? "#8b6648" : "transparent",
                color: activeTab === "courses" ? "#ffffff" : "#43392f",
                boxShadow:
                  activeTab === "courses"
                    ? "0 4px 12px rgba(139, 102, 72, 0.25)"
                    : "none",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <BookOpen size={16} aria-hidden="true" />
              <span>Single Courses</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "programs"}
              onClick={() => handleTabSwitch("programs")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 999,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                background: activeTab === "programs" ? "#8b6648" : "transparent",
                color: activeTab === "programs" ? "#ffffff" : "#43392f",
                boxShadow:
                  activeTab === "programs"
                    ? "0 4px 12px rgba(139, 102, 72, 0.25)"
                    : "none",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <Layers size={16} aria-hidden="true" />
              <span>Multi-Course Programs</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "career-paths"}
              onClick={() => handleTabSwitch("career-paths")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                borderRadius: 999,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                background:
                  activeTab === "career-paths" ? "#8b6648" : "transparent",
                color: activeTab === "career-paths" ? "#ffffff" : "#43392f",
                boxShadow:
                  activeTab === "career-paths"
                    ? "0 4px 12px rgba(139, 102, 72, 0.25)"
                    : "none",
                cursor: "pointer",
                transition: "all 0.18s ease",
              }}
            >
              <Compass size={16} aria-hidden="true" />
              <span>Career Paths</span>
            </button>
          </div>

          <div style={{ position: "relative", minWidth: 280, flex: "1 1 320px", maxWidth: 420 }}>
            <Search
              size={16}
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#6f6456",
              }}
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              style={{
                width: "100%",
                padding: "10px 34px 10px 38px",
                borderRadius: 999,
                border: "1px solid #ded6c8",
                background: "#ffffff",
                fontSize: 14,
                color: "#271e16",
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  border: "none",
                  background: "transparent",
                  color: "#6f6456",
                  cursor: "pointer",
                  padding: 4,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic Tab Content Container */}
      <div key={activeTab} className="catalog-tab-panel">
        {activeTab === "courses" && (
          <FeaturedCoursesSection
            hideHeader
            searchQuery={searchQuery}
            activeFilter={currentFilter}
            onFilterChange={handleFilterChange}
            onClearSearch={() => setSearchQuery("")}
          />
        )}

        {activeTab === "programs" && (
          <section
            className="section-container"
            style={{ paddingTop: 32, paddingBottom: 88 }}
            aria-label="Multi-Course Programs"
          >
            <ErrorAlert error={programsError} />
            {loadingPrograms ? (
              <LoadingState label="Loading multi-course programs…" />
            ) : !programsData || programsData.items.length === 0 ? (
              <div
                style={{
                  background: "#f6f5f2",
                  border: "1px solid #ded6c8",
                  borderRadius: 20,
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: "0 0 8px", color: "#271e16" }}>
                  No multi-course programs match your search
                </h3>
                <p style={{ margin: "0 0 16px", color: "#6f6456", fontSize: 14 }}>
                  Try clearing your search filter or switch to Single Courses.
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    className="portal-btn portal-btn-secondary"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                  gap: 28,
                }}
              >
                {programsData.items.map((p) => (
                  <article key={p.id} className="catalog-rich-card">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "#8b6648",
                          background: "#ede6da",
                          padding: "5px 12px",
                          borderRadius: 999,
                        }}
                      >
                        {p.categories.join(" · ") || "Engineering Program"}
                      </span>
                      {p.startingPrice != null && (
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#271e16",
                            background: "#e8dfd1",
                            padding: "5px 12px",
                            borderRadius: 999,
                          }}
                        >
                          {formatMoney(p.startingPrice, "USD")}
                        </span>
                      )}
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        lineHeight: 1.3,
                        fontWeight: 700,
                        color: "#271e16",
                      }}
                    >
                      <Link
                        to={`/programs/${p.slug}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {p.title}
                      </Link>
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        color: "#524434",
                        fontSize: 15,
                        lineHeight: 1.6,
                        flexGrow: 1,
                      }}
                    >
                      {p.description}
                    </p>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 14,
                        paddingTop: 14,
                        borderTop: "1px solid #e6ded2",
                        fontSize: 13,
                        color: "#6b5d4d",
                        fontWeight: 500,
                      }}
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                        <Layers size={14} color="#8b6648" aria-hidden="true" />
                        {p.coursesCount} Included Courses
                      </span>
                      {p.nextOfferingDate && (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Calendar size={14} color="#8b6648" aria-hidden="true" />
                          Starts {formatDate(p.nextOfferingDate)}
                        </span>
                      )}
                    </div>

                    <div style={{ paddingTop: 6 }}>
                      <Link
                        to={`/programs/${p.slug}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          width: "100%",
                          padding: "12px 18px",
                          borderRadius: 12,
                          background: "#271e16",
                          color: "#f6f5f2",
                          fontSize: 14,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <span>Explore Program &amp; Curriculum</span>
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {activeTab === "career-paths" && (
          <section
            className="section-container"
            style={{ paddingTop: 32, paddingBottom: 88 }}
            aria-label="Career Paths"
          >
            <ErrorAlert error={pathsError} />
            {loadingPaths ? (
              <LoadingState label="Loading career roadmaps…" />
            ) : filteredCareerPaths.length === 0 ? (
              <div
                style={{
                  background: "#f6f5f2",
                  border: "1px solid #ded6c8",
                  borderRadius: 20,
                  padding: "48px 24px",
                  textAlign: "center",
                }}
              >
                <h3 style={{ margin: "0 0 8px", color: "#271e16" }}>
                  No career paths match your search
                </h3>
                <p style={{ margin: "0 0 16px", color: "#6f6456", fontSize: 14 }}>
                  Try clearing your search query or explore all available tracks.
                </p>
                {searchQuery && (
                  <button
                    type="button"
                    className="portal-btn portal-btn-secondary"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
                  gap: 28,
                }}
              >
                {filteredCareerPaths.map((path) => (
                  <article key={path.id} className="catalog-rich-card">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "#8b6648",
                          background: "#ede6da",
                          padding: "5px 12px",
                          borderRadius: 999,
                        }}
                      >
                        <Sparkles size={14} aria-hidden="true" />
                        Career Roadmap
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#6b5d4d",
                        }}
                      >
                        {path.programsCount} Programs · {path.coursesCount} Courses
                      </span>
                    </div>

                    <h2
                      style={{
                        margin: 0,
                        fontSize: 22,
                        lineHeight: 1.3,
                        fontWeight: 700,
                        color: "#271e16",
                      }}
                    >
                      <Link
                        to={`/career-paths/${path.slug}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {path.title}
                      </Link>
                    </h2>

                    <p
                      style={{
                        margin: 0,
                        color: "#524434",
                        fontSize: 15,
                        lineHeight: 1.6,
                        flexGrow: 1,
                      }}
                    >
                      {path.description}
                    </p>

                    {path.recommendedSkillTags.length > 0 && (
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 6,
                          paddingTop: 10,
                          borderTop: "1px solid #e6ded2",
                        }}
                      >
                        {path.recommendedSkillTags.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              padding: "4px 10px",
                              borderRadius: 999,
                              background: "#ebe4d8",
                              color: "#43392f",
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    <div style={{ paddingTop: 6 }}>
                      <Link
                        to={`/career-paths/${path.slug}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 8,
                          width: "100%",
                          padding: "12px 18px",
                          borderRadius: 12,
                          background: "#8b6648",
                          color: "#ffffff",
                          fontSize: 14,
                          fontWeight: 600,
                          textDecoration: "none",
                        }}
                      >
                        <GraduationCap size={16} aria-hidden="true" />
                        <span>View Full Career Roadmap</span>
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
