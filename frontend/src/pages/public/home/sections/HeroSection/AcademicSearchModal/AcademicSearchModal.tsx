import { useMemo, useEffect, useState } from "react";
import { NavigateFunction } from "../../../../../../types/navigation";
import {
  AcademicCurriculum,
  ACADEMIC_CURRICULA,
  matchesSearchQuery,
} from "./academicData";
import { AcademicSearchHeader } from "./components/AcademicSearchHeader";
import { AcademicFilterBar, FilterType } from "./components/AcademicFilterBar";
import { AcademicCurriculumCard } from "./components/AcademicCurriculumCard";
import { AcademicEmptyState } from "./components/AcademicEmptyState";
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

export default function AcademicSearchModal({
  isOpen,
  onClose,
  query,
  onQueryChange,
  onSelectFile,
  onNavigate,
}: AcademicSearchModalProps) {
  const [filterType, setFilterType] = useState<FilterType>("all");

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

  // Filter items by search query and type pill
  const { filteredItems, programCount, courseCount } = useMemo(() => {
    const queryMatched = ACADEMIC_CURRICULA.filter((item) =>
      matchesSearchQuery(item, query),
    );

    const programs = queryMatched.filter(
      (item) => item.type === "program",
    ).length;
    const courses = queryMatched.filter(
      (item) => item.type === "course",
    ).length;

    const filtered = queryMatched.filter((item) => {
      if (filterType === "all") return true;
      return item.type === filterType;
    });

    return {
      filteredItems: filtered,
      programCount: programs,
      courseCount: courses,
    };
  }, [query, filterType]);

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
        {filteredItems.length === 0 ? (
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
