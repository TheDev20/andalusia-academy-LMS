import { useQuery } from "@tanstack/react-query";
import { fetchCatalogCourses } from "../services/catalogService";
import { CatalogQueryParameters, CourseSummaryDto, PagedResult } from "../types/catalog";

/**
 * Level 1: Client Query Cache (TanStack Query)
 * Uses 5-minute staleTime matching the backend IMemoryCache TTL (RFC Option B).
 */
export function useCatalogCourses(params: CatalogQueryParameters = {}) {
  const normalizedSearch = params.searchTerm?.trim() || "";
  const categoryId = params.categoryId || "";
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 12;

  return useQuery<PagedResult<CourseSummaryDto>, Error>({
    queryKey: ["catalog", "courses", normalizedSearch, categoryId, pageNumber, pageSize],
    queryFn: () =>
      fetchCatalogCourses({
        searchTerm: normalizedSearch,
        categoryId: categoryId || undefined,
        pageNumber,
        pageSize,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes matching backend IMemoryCache TTL
    gcTime: 10 * 60 * 1000,    // 10 minutes cache garbage collection
    refetchOnWindowFocus: false,
    retry: 1,
  });
}
