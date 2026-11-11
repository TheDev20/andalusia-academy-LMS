import { useId, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, Layers, Search, X } from "lucide-react";
import { useDebounce } from "../../../../../hooks/useDebounce";
import {
  fetchCatalogCourses,
  fetchCatalogPrograms,
} from "../../../../../services/catalogService";
import "./HeroSearch.css";

const MIN_QUERY_LENGTH = 2;
const RESULTS_PER_KIND = 5;

interface SearchOption {
  key: string;
  kind: "course" | "program" | "all";
  label: string;
  detail?: string;
  to: string;
}

/**
 * Hero search with a typeahead under the input. Matching courses and programs
 * are listed as you type; picking one opens its page, and submitting the form
 * opens the full catalogue filtered by the query.
 */
export default function HeroSearch() {
  const navigate = useNavigate();
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmed = query.trim();
  const term = useDebounce(trimmed, 250);
  const enabled = term.length >= MIN_QUERY_LENGTH;

  const courses = useQuery({
    queryKey: ["heroSearch", "courses", term],
    queryFn: ({ signal }) =>
      fetchCatalogCourses({ searchTerm: term, pageNumber: 1, pageSize: RESULTS_PER_KIND }, signal),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
  const programs = useQuery({
    queryKey: ["heroSearch", "programs", term],
    queryFn: ({ signal }) =>
      fetchCatalogPrograms({ searchTerm: term, pageNumber: 1, pageSize: RESULTS_PER_KIND }, signal),
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const catalogUrl = trimmed
    ? `/courses?q=${encodeURIComponent(trimmed)}`
    : "/courses";

  const options = useMemo<SearchOption[]>(() => {
    if (!enabled) return [];
    const items: SearchOption[] = [];
    for (const c of courses.data?.items ?? []) {
      items.push({
        key: `course-${c.id}`,
        kind: "course",
        label: c.title,
        detail: c.categories?.[0] ?? "Course",
        to: `/courses/${c.slug || c.id}/syllabus`,
      });
    }
    for (const p of programs.data?.items ?? []) {
      items.push({
        key: `program-${p.id}`,
        kind: "program",
        label: p.title,
        detail: `Program · ${p.coursesCount} ${p.coursesCount === 1 ? "course" : "courses"}`,
        to: `/programs/${p.slug || p.id}`,
      });
    }
    items.push({
      key: "all",
      kind: "all",
      label: `See all results for "${trimmed}"`,
      to: catalogUrl,
    });
    return items;
  }, [enabled, courses.data, programs.data, trimmed, catalogUrl]);

  const isSearching =
    enabled && (term !== trimmed || courses.isFetching || programs.isFetching);
  const failed = enabled && courses.isError && programs.isError;
  const hasMatches = options.length > 1;
  const showPanel = isOpen && trimmed.length >= MIN_QUERY_LENGTH;

  const close = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const go = (to: string) => {
    close();
    navigate(to);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const active = options[activeIndex];
    go(active ? active.to : catalogUrl);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      close();
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!showPanel || options.length === 0) return;
      e.preventDefault();
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((i) => (i + step + options.length) % options.length);
    }
  };

  const optionId = (index: number) => `${listboxId}-opt-${index}`;

  return (
    <div
      className="hero-search"
      ref={rootRef}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) close();
      }}
    >
      <form className="hero-search-bar" onSubmit={handleSubmit} role="search">
        <div className="search-input-wrap">
          <Search size={20} className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search courses, tracks, or skills (e.g. AI, Python)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
              setActiveIndex(-1);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded={showPanel}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? optionId(activeIndex) : undefined}
            aria-label="Search academy courses and programs"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              className="hero-search-clear-btn"
              onClick={() => {
                setQuery("");
                close();
              }}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>
        <button type="submit" className="hero-search-btn">
          <span>Find Course</span>
          <ArrowRight size={16} aria-hidden="true" />
        </button>
      </form>

      {showPanel && (
        <div className="hero-search-panel">
          <ul id={listboxId} role="listbox" aria-label="Search suggestions" className="hero-search-list">
            {options.map((opt, index) => (
              <li
                key={opt.key}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                className={`hero-search-option is-${opt.kind}${index === activeIndex ? " is-active" : ""}`}
                // Keep input focus so the blur handler doesn't close the panel mid-click.
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => go(opt.to)}
              >
                {opt.kind === "course" && <BookOpen size={16} aria-hidden="true" />}
                {opt.kind === "program" && <Layers size={16} aria-hidden="true" />}
                {opt.kind === "all" && <ArrowRight size={16} aria-hidden="true" />}
                <span className="hero-search-option-text">
                  <span className="hero-search-option-label">{opt.label}</span>
                  {opt.detail && <span className="hero-search-option-detail">{opt.detail}</span>}
                </span>
              </li>
            ))}
          </ul>
          <p className="hero-search-status" role="status" aria-live="polite">
            {failed
              ? "Search is unavailable right now. Try again, or browse the full catalogue."
              : isSearching
                ? "Searching…"
                : !hasMatches
                  ? `No courses or programs match "${trimmed}".`
                  : ""}
          </p>
        </div>
      )}
    </div>
  );
}
