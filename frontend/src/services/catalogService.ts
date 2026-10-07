import {
  CatalogQueryParameters,
  CourseSummaryDto,
  PagedResult,
} from "../types/catalog";

export async function fetchCatalogCourses(
  params: CatalogQueryParameters = {},
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
  const endpoint = `/api/catalog/courses${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Catalog API responded with status ${response.status}: ${response.statusText}`,
    );
  }

  return response.json();
}
