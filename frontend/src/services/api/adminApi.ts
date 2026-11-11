import { apiRequest, toQuery } from "./httpClient";
import type {
  AdminCourseDto,
  AdminLocationDto,
  AdminOfferingDto,
  AdminOrderDto,
  AdminResourceDto,
  AdminSessionDto,
  AdminUserDto,
  CreateInstructorRequest,
  PagedResult,
  TechDisciplineDto,
  UpsertCourseRequest,
  UpsertLocationRequest,
  UpsertOfferingRequest,
  UpsertResourceRequest,
  UpsertSessionRequest,
  UpsertTechDisciplineRequest,
} from "../../types/operations";

interface ListQuery {
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

export const adminApi = {
  /* Users */
  listUsers(query: ListQuery & { role?: string }, signal?: AbortSignal): Promise<PagedResult<AdminUserDto>> {
    return apiRequest(`/api/admin/users${toQuery({ ...query })}`, { signal });
  },
  createInstructor(request: CreateInstructorRequest): Promise<AdminUserDto> {
    return apiRequest("/api/admin/users/instructors", { method: "POST", body: request });
  },
  setUserStatus(userId: string, isActive: boolean): Promise<AdminUserDto> {
    return apiRequest(`/api/admin/users/${userId}/status`, { method: "PUT", body: { isActive } });
  },
  setUserRoles(userId: string, roles: string[]): Promise<AdminUserDto> {
    return apiRequest(`/api/admin/users/${userId}/roles`, { method: "PUT", body: { roles } });
  },

  /* Courses */
  listCourses(query: ListQuery, signal?: AbortSignal): Promise<PagedResult<AdminCourseDto>> {
    return apiRequest(`/api/admin/courses${toQuery({ ...query })}`, { signal });
  },
  createCourse(request: UpsertCourseRequest): Promise<AdminCourseDto> {
    return apiRequest("/api/admin/courses", { method: "POST", body: request });
  },
  updateCourse(courseId: string, request: UpsertCourseRequest): Promise<AdminCourseDto> {
    return apiRequest(`/api/admin/courses/${courseId}`, { method: "PUT", body: request });
  },
  deleteCourse(courseId: string): Promise<void> {
    return apiRequest(`/api/admin/courses/${courseId}`, { method: "DELETE" });
  },
  uploadCourseImage(file: File): Promise<{ url: string }> {
    const data = new FormData();
    data.append("file", file);
    return apiRequest("/api/admin/courses/upload-image", { method: "POST", body: data });
  },

  /* Offerings */
  listOfferings(courseId?: string, signal?: AbortSignal): Promise<AdminOfferingDto[]> {
    return apiRequest(`/api/admin/offerings${toQuery({ courseId })}`, { signal });
  },
  getOffering(offeringId: string, signal?: AbortSignal): Promise<AdminOfferingDto> {
    return apiRequest(`/api/admin/offerings/${offeringId}`, { signal });
  },
  createOffering(request: UpsertOfferingRequest): Promise<AdminOfferingDto> {
    return apiRequest("/api/admin/offerings", { method: "POST", body: request });
  },
  updateOffering(offeringId: string, request: UpsertOfferingRequest): Promise<AdminOfferingDto> {
    return apiRequest(`/api/admin/offerings/${offeringId}`, { method: "PUT", body: request });
  },
  assignInstructor(offeringId: string, instructorId: string): Promise<AdminOfferingDto> {
    return apiRequest(`/api/admin/offerings/${offeringId}/instructors`, { method: "POST", body: { instructorId } });
  },
  unassignInstructor(offeringId: string, instructorId: string): Promise<AdminOfferingDto> {
    return apiRequest(`/api/admin/offerings/${offeringId}/instructors/${instructorId}`, { method: "DELETE" });
  },

  /* Materials */
  listResources(offeringId: string, signal?: AbortSignal): Promise<AdminResourceDto[]> {
    return apiRequest(`/api/admin/offerings/${offeringId}/resources`, { signal });
  },
  createResource(offeringId: string, request: UpsertResourceRequest): Promise<AdminResourceDto> {
    return apiRequest(`/api/admin/offerings/${offeringId}/resources`, { method: "POST", body: request });
  },
  updateResource(resourceId: string, request: UpsertResourceRequest): Promise<AdminResourceDto> {
    return apiRequest(`/api/admin/offerings/resources/${resourceId}`, { method: "PUT", body: request });
  },
  deleteResource(resourceId: string): Promise<void> {
    return apiRequest(`/api/admin/offerings/resources/${resourceId}`, { method: "DELETE" });
  },
  uploadResourceFiles(resourceId: string, files: File[]): Promise<AdminResourceDto> {
    const form = new FormData();
    files.forEach((file) => form.append("Files", file, file.name));
    return apiRequest(`/api/admin/offerings/resources/${resourceId}/files`, { method: "POST", body: form });
  },
  deleteResourceFile(resourceId: string, fileId: string): Promise<AdminResourceDto> {
    return apiRequest(`/api/admin/offerings/resources/${resourceId}/files/${fileId}`, { method: "DELETE" });
  },

  /* Locations & sessions */
  listLocations(signal?: AbortSignal): Promise<AdminLocationDto[]> {
    return apiRequest("/api/admin/locations", { signal });
  },
  createLocation(request: UpsertLocationRequest): Promise<AdminLocationDto> {
    return apiRequest("/api/admin/locations", { method: "POST", body: request });
  },
  updateLocation(locationId: string, request: UpsertLocationRequest): Promise<AdminLocationDto> {
    return apiRequest(`/api/admin/locations/${locationId}`, { method: "PUT", body: request });
  },
  listSessions(offeringId: string, signal?: AbortSignal): Promise<AdminSessionDto[]> {
    return apiRequest(`/api/admin/offerings/${offeringId}/sessions`, { signal });
  },
  createSession(offeringId: string, request: UpsertSessionRequest): Promise<AdminSessionDto> {
    return apiRequest(`/api/admin/offerings/${offeringId}/sessions`, { method: "POST", body: request });
  },
  updateSession(sessionId: string, request: UpsertSessionRequest): Promise<AdminSessionDto> {
    return apiRequest(`/api/admin/sessions/${sessionId}`, { method: "PUT", body: request });
  },
  deleteSession(sessionId: string): Promise<void> {
    return apiRequest(`/api/admin/sessions/${sessionId}`, { method: "DELETE" });
  },

  /* Payments */
  listOrders(query: ListQuery & { status?: string }, signal?: AbortSignal): Promise<PagedResult<AdminOrderDto>> {
    return apiRequest(`/api/admin/payments/orders${toQuery({ ...query })}`, { signal });
  },

  /* Disciplines / Categories */
  listDisciplines(signal?: AbortSignal): Promise<TechDisciplineDto[]> {
    return apiRequest("/api/catalog/disciplines", { signal, auth: false });
  },
  createDiscipline(request: UpsertTechDisciplineRequest): Promise<TechDisciplineDto> {
    return apiRequest("/api/catalog/disciplines", { method: "POST", body: request });
  },
  updateDiscipline(id: string, request: UpsertTechDisciplineRequest): Promise<void> {
    return apiRequest(`/api/catalog/disciplines/${id}`, { method: "PUT", body: request });
  },
};
