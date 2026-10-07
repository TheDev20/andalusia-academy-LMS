import { useQuery } from "@tanstack/react-query";
import { fetchCareerPaths, fetchCareerPathDetail } from "../services/catalogService";
import { CareerPathSummaryDto, CareerPathDetailDto } from "../types/catalog";

/**
 * Level 1: Client Query Cache for Career Paths (TanStack Query)
 * Uses 5-minute staleTime matching backend IMemoryCache TTL.
 */
export function useCareerPaths() {
  return useQuery<CareerPathSummaryDto[], Error>({
    queryKey: ["catalog", "career-paths"],
    queryFn: () => fetchCareerPaths(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

export function useCareerPathDetail(idOrSlug: string | null) {
  return useQuery<CareerPathDetailDto, Error>({
    queryKey: ["catalog", "career-path-detail", idOrSlug],
    queryFn: () => fetchCareerPathDetail(idOrSlug!),
    enabled: !!idOrSlug,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}
