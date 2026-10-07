import { useMemo, useEffect, useState } from "react";
import { NavigateFunction } from "@/types/navigation";
import {
  AcademicCurriculum,
  ACADEMIC_CURRICULA,
  matchesSearchQuery,
} from "./academicData";
import { AcademicSearchHeader } from "./components/AcademicSearchHeader";
import { AcademicFilterBar, FilterType } from "./components/AcademicFilterBar";
import { AcademicCurriculumCard } from "./components/AcademicCurriculumCard";
import { AcademicEmptyState } from "./components/AcademicEmptyState";
import { useCatalogSearch } from "@/hooks/useCatalogSearch";
import { CourseSummaryDto, ProgramSummaryDto } from "@/types/catalog";
import "./AcademicSearchModal.css";

export type { AcademicCurriculum };
export { ACADEMIC_CURRICULA };

export interface AcademicSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  query: string;
  onQueryChange: (q: string) => void;
  onSelectFile: (fileName: string) => void;
  onNavigate?: NavigateFunction;
}

function mapProgramToCurriculum(p: ProgramSummaryDto): AcademicCurriculum {
  return {
    id: p.id,
    type: "program",
    code: p.slug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 7).toUpperCase(),
    title: p.title,
    category: p.categories[0] || "Software Engineering",
    badge: p.startingPrice ? `$${p.startingPrice}` : "FULL PROGRAM",
    badgeType: "purple",
    description: p.description,
    stats: {
      coursesCount: p.coursesCount || 4,
      labHours: `${(p.coursesCount || 4) * 40}h`,
      mentor: "Active AI Mentor",
    },
    coursePills: p.courseTitles.length > 0 ? p.courseTitles : ["CORE", "LABS", "CAPSTONE"],
    targetFile: "App.tsx",
  };
}

function mapCourseToCurriculum(c: CourseSummaryDto): AcademicCurriculum {
  return {
    id: c.id,
    type: "course",
    code: c.slug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toUpperCase(),
    title: c.title,
    category: c.categories[0] || "Technology",
    badge: c.startingPrice ? `$${c.startingPrice}` : "COURSE",
    badgeType: "blue",
    description: c.description,
    stats: {
      coursesCount: 1,
      labHours: "40h",
      mentor: "Active AI Mentor",
    },
    coursePills: c.categories.length > 0 ? c.categories : ["HANDS-ON", "CODE-FIRST"],
    targetFile: "train_agent.py",
  };
}

export default function AcademicSearchModal({
  isOpen,
  onClose,
  query,
  onQueryChange,
  onSelectFile,
  onNavigate,
}: AcademicSearchModalProps) {
  const [filterType, setFilterType] = useState<FilterType>("all");

  // Tiered Caching Search Hook (Level 1 client cache + Level 2 300ms debounce)
  const { courses, programs, isLoading } = useCatalogSearch(query, {
    debounceMs: 300,
    pageSize: 20,
  });

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Combine backend live data with fallback static data
  const liveCurricula = useMemo<AcademicCurriculum[]>(() => {
    if (courses?.items || programs?.items) {
      const progItems = (programs?.items || []).map(mapProgramToCurriculum);
      const courseItems = (courses?.items || []).map(mapCourseToCurriculum);
      const combined = [...progItems, ...courseItems];
      if (combined.length > 0) return combined;
    }
    return ACADEMIC_CURRICULA;
  }, [courses, programs]);

  // Filter items by search query and type pill
  const { filteredItems, programCount, courseCount } = useMemo(() => {
    const queryMatched = liveCurricula.filter((item) =>
      matchesSearchQuery(item, query),
    );

    const progCount = queryMatched.filter((item) => item.type === "program").length;
    const crsCount = queryMatched.filter((item) => item.type === "course").length;

    const filtered = queryMatched.filter((item) => {
      if (filterType === "all") return true;
      return item.type === filterType;
    });

    return {
      filteredItems: filtered,
      programCount: progCount,
      courseCount: crsCount,
    };
  }, [liveCurricula, query, filterType]);

  if (!isOpen) return null;

  return (
    <div
      className="academic-search-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Curriculum Search Discovery"
    >
      {/* Top Header */}
      <AcademicSearchHeader onClose={onClose} />

      {/* Discovery Meta & Smart Filter Pills */}
      <AcademicFilterBar
        query={query}
        totalCount={filteredItems.length}
        programCount={programCount}
        courseCount={courseCount}
        filterType={filterType}
        onFilterChange={setFilterType}
      />

      {/* Cards Scrollable Body */}
      <div className="academic-modal-body">
        {isLoading && filteredItems.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--color-gold)" }}>
            Searching catalog offerings...
          </div>
        ) : filteredItems.length === 0 ? (
          <AcademicEmptyState
            query={query}
            onReset={() => {
              onQueryChange("");
              setFilterType("all");
            }}
          />
        ) : (
          <div className="academic-card-grid">
            {filteredItems.map((item) => (
              <AcademicCurriculumCard
                key={item.id}
                item={item}
                onQueryChange={onQueryChange}
                onSelectFile={onSelectFile}
                onClose={onClose}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
