import { useQuery } from "@tanstack/react-query";
import { fetchCatalogPrograms, fetchProgramDetail } from "../services/catalogService";
import { CatalogQueryParameters, ProgramSummaryDto, ProgramDetailDto, PagedResult } from "../types/catalog";

/**
 * Level 1: Client Query Cache for Academic Programs (TanStack Query)
 * Uses 5-minute staleTime matching backend IMemoryCache TTL.
 */
export function useCatalogPrograms(params: CatalogQueryParameters = {}) {
  const normalizedSearch = params.searchTerm?.trim() || "";
  const categoryId = params.categoryId || "";
  const pageNumber = params.pageNumber ?? 1;
  const pageSize = params.pageSize ?? 12;

  return useQuery<PagedResult<ProgramSummaryDto>, Error>({
    queryKey: ["catalog", "programs", normalizedSearch, categoryId, pageNumber, pageSize],
    queryFn: () =>
      fetchCatalogPrograms({
        searchTerm: normalizedSearch,
        categoryId: categoryId || undefined,
        pageNumber,
        pageSize,
      }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useProgramDetail(idOrSlug: string | null) {
  return useQuery<ProgramDetailDto, Error>({
    queryKey: ["catalog", "program-detail", idOrSlug],
    queryFn: () => fetchProgramDetail(idOrSlug!),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
