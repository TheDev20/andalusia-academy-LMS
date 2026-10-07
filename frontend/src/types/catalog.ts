/**
 * Catalog contracts matching AndalusiaAcademy.API DTOs
 * Reference: RFC Option B (Tiered Caching & Optimized Queries)
 */

export interface CourseSummaryDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  categories: string[];
  startingPrice?: number | null;
  nextOfferingDate?: string | null;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CatalogQueryParameters {
  searchTerm?: string;
  categoryId?: string;
  pageNumber?: number;
  pageSize?: number;
}
