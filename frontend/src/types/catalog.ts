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

export interface CatalogOfferingDto {
  id: string;
  kind: string;
  startsAt: string;
  endsAt: string;
  timeZoneId: string;
  price: number;
  currency: string;
  capacity: number;
  status: string;
}

export interface CourseDetailDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  publicationStatus: string;
  categories: string[];
  offerings: CatalogOfferingDto[];
  includedInPrograms: string[];
}

export interface ProgramSummaryDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  categories: string[];
  coursesCount: number;
  courseTitles: string[];
  startingPrice?: number | null;
  nextOfferingDate?: string | null;
}

export interface ProgramCourseDto {
  courseId: string;
  title: string;
  slug: string;
  description: string;
  sequence: number;
  isRequired: boolean;
}

export interface ProgramDetailDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  publicationStatus: string;
  categories: string[];
  includedCourses: ProgramCourseDto[];
  offerings: CatalogOfferingDto[];
}

export interface CareerPathSummaryDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  programsCount: number;
  coursesCount: number;
  recommendedSkillTags: string[];
}

export interface CareerPathDetailDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  recommendedPrograms: ProgramSummaryDto[];
  recommendedCourses: CourseSummaryDto[];
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
