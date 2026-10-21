import {
  CatalogQueryParameters,
  CourseSummaryDto,
  CourseDetailDto,
  ProgramSummaryDto,
  ProgramDetailDto,
  CareerPathSummaryDto,
  CareerPathDetailDto,
  PagedResult,
} from "../types/catalog";

const API_BASE = ""; // Uses Vite dev proxy '/api' or relative path

/**
 * Fetches paginated courses matching search/category filters.
 */
export async function fetchCatalogCourses(
  params: CatalogQueryParameters = {},
  signal?: AbortSignal,
): Promise<PagedResult<CourseSummaryDto>> {
  const query = new URLSearchParams();

  if (params.searchTerm && params.searchTerm.trim().length > 0) {
    query.append("searchTerm", params.searchTerm.trim());
  }

  if (params.categoryId) {
    query.append("categoryId", params.categoryId);
  }

  if (params.pageNumber !== undefined) {
    query.append("pageNumber", params.pageNumber.toString());
  }

  if (params.pageSize !== undefined) {
    query.append("pageSize", params.pageSize.toString());
  }

  const queryString = query.toString();
  const endpoint = `${API_BASE}/api/catalog/courses${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Catalog API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches course details by ID or slug.
 */
export async function fetchCourseDetail(
  idOrSlug: string,
  signal?: AbortSignal,
): Promise<CourseDetailDto> {
  const response = await fetch(`${API_BASE}/api/catalog/courses/${encodeURIComponent(idOrSlug)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Course detail API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches paginated academic programs.
 */
export async function fetchCatalogPrograms(
  params: CatalogQueryParameters = {},
  signal?: AbortSignal,
): Promise<PagedResult<ProgramSummaryDto>> {
  const query = new URLSearchParams();

  if (params.searchTerm && params.searchTerm.trim().length > 0) {
    query.append("searchTerm", params.searchTerm.trim());
  }

  if (params.categoryId) {
    query.append("categoryId", params.categoryId);
  }

  if (params.pageNumber !== undefined) {
    query.append("pageNumber", params.pageNumber.toString());
  }

  if (params.pageSize !== undefined) {
    query.append("pageSize", params.pageSize.toString());
  }

  const queryString = query.toString();
  const endpoint = `${API_BASE}/api/catalog/programs${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Programs API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches program details including its included courses and cohort offerings.
 */
export async function fetchProgramDetail(
  idOrSlug: string,
  signal?: AbortSignal,
): Promise<ProgramDetailDto> {
  const response = await fetch(`${API_BASE}/api/catalog/programs/${encodeURIComponent(idOrSlug)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Program detail API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches all career paths.
 */
export async function fetchCareerPaths(signal?: AbortSignal): Promise<CareerPathSummaryDto[]> {
  const response = await fetch(`${API_BASE}/api/catalog/career-paths`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Career paths API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Fetches career path details with recommended programs and courses.
 */
export async function fetchCareerPathDetail(
  idOrSlug: string,
  signal?: AbortSignal,
): Promise<CareerPathDetailDto> {
  const response = await fetch(`${API_BASE}/api/catalog/career-paths/${encodeURIComponent(idOrSlug)}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Career path detail API error ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
