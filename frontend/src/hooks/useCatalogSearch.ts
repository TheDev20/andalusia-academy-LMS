import { useState, useEffect, useRef } from "react";
import {
  CourseSummaryDto,
  ProgramSummaryDto,
  PagedResult,
} from "../types/catalog";
import {
  fetchCatalogCourses,
  fetchCatalogPrograms,
} from "../services/catalogService";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

// Level 1: Client In-Memory RAM Cache (5-minute TTL)
const clientCache = new Map<string, CacheEntry<unknown>>();
const CLIENT_CACHE_TTL_MS = 5 * 60 * 1000;

function getCached<T>(key: string): T | null {
  const entry = clientCache.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CLIENT_CACHE_TTL_MS) {
    clientCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCached<T>(key: string, data: T): void {
  clientCache.set(key, { data, timestamp: Date.now() });
}

export interface UseCatalogSearchOptions {
  debounceMs?: number;
  pageSize?: number;
}

export interface UseCatalogSearchResult {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  courses: PagedResult<CourseSummaryDto> | null;
  programs: PagedResult<ProgramSummaryDto> | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useCatalogSearch(
  initialQuery = "",
  options: UseCatalogSearchOptions = {},
): UseCatalogSearchResult {
  const { debounceMs = 300, pageSize = 20 } = options;

  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [courses, setCourses] = useState<PagedResult<CourseSummaryDto> | null>(null);
  const [programs, setPrograms] = useState<PagedResult<ProgramSummaryDto> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fetchTrigger, setFetchTrigger] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Level 2: UI Keystroke Debounce (300ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [query, debounceMs]);

  // Fetch Catalog Data with Level 1 Client Caching
  useEffect(() => {
    const normalized = debouncedQuery.trim().toLowerCase();
    const coursesCacheKey = `client:courses:q=${normalized}:s=${pageSize}`;
    const programsCacheKey = `client:programs:q=${normalized}:s=${pageSize}`;

    const cachedCourses = getCached<PagedResult<CourseSummaryDto>>(coursesCacheKey);
    const cachedPrograms = getCached<PagedResult<ProgramSummaryDto>>(programsCacheKey);

    if (cachedCourses && cachedPrograms) {
      setCourses(cachedCourses);
      setPrograms(cachedPrograms);
      setIsLoading(false);
      setIsError(false);
      setError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    setIsError(false);
    setError(null);

    Promise.all([
      fetchCatalogCourses({ searchTerm: normalized, pageSize }, controller.signal),
      fetchCatalogPrograms({ searchTerm: normalized, pageSize }, controller.signal),
    ])
      .then(([coursesResult, programsResult]) => {
        setCached(coursesCacheKey, coursesResult);
        setCached(programsCacheKey, programsResult);
        setCourses(coursesResult);
        setPrograms(programsResult);
        setIsLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        console.warn("Catalog API fetch fallback:", err);
        setIsError(true);
        setError(err instanceof Error ? err : new Error(String(err)));
        setIsLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, pageSize, fetchTrigger]);

  const refetch = () => setFetchTrigger((prev) => prev + 1);

  return {
    query,
    setQuery,
    debouncedQuery,
    courses,
    programs,
    isLoading,
    isError,
    error,
    refetch,
  };
}
