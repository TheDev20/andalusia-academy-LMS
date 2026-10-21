import { apiRequest } from "./httpClient";
import type {
  AttendanceEntry,
  CohortDetailDto,
  CohortDto,
  InstructorAssignmentDto,
  LearnerProgressDto,
  SessionAttendanceDto,
  SubmissionForGradingDto,
  UpsertAssignmentRequest,
} from "../../types/learning";

export const instructorApi = {
  getCohorts(signal?: AbortSignal): Promise<CohortDto[]> {
    return apiRequest<CohortDto[]>("/api/instructor/cohorts", { signal });
  },

  getCohort(offeringId: string, signal?: AbortSignal): Promise<CohortDetailDto> {
    return apiRequest<CohortDetailDto>(`/api/instructor/cohorts/${offeringId}`, { signal });
  },

  getProgress(offeringId: string, signal?: AbortSignal): Promise<LearnerProgressDto[]> {
    return apiRequest<LearnerProgressDto[]>(`/api/instructor/cohorts/${offeringId}/progress`, { signal });
  },

  getAttendance(sessionId: string, signal?: AbortSignal): Promise<SessionAttendanceDto> {
    return apiRequest<SessionAttendanceDto>(`/api/instructor/sessions/${sessionId}/attendance`, { signal });
  },

  recordAttendance(sessionId: string, records: AttendanceEntry[]): Promise<SessionAttendanceDto> {
    return apiRequest<SessionAttendanceDto>(`/api/instructor/sessions/${sessionId}/attendance`, {
      method: "PUT",
      body: { records },
    });
  },

  createAssignment(offeringId: string, request: UpsertAssignmentRequest): Promise<InstructorAssignmentDto> {
    return apiRequest<InstructorAssignmentDto>(`/api/instructor/cohorts/${offeringId}/assignments`, {
      method: "POST",
      body: request,
    });
  },

  updateAssignment(assignmentId: string, request: UpsertAssignmentRequest): Promise<InstructorAssignmentDto> {
    return apiRequest<InstructorAssignmentDto>(`/api/instructor/assignments/${assignmentId}`, {
      method: "PUT",
      body: request,
    });
  },

  getSubmissions(assignmentId: string, signal?: AbortSignal): Promise<SubmissionForGradingDto[]> {
    return apiRequest<SubmissionForGradingDto[]>(`/api/instructor/assignments/${assignmentId}/submissions`, { signal });
  },

  grade(submissionId: string, score: number): Promise<SubmissionForGradingDto> {
    return apiRequest<SubmissionForGradingDto>(`/api/instructor/submissions/${submissionId}/grade`, {
      method: "POST",
      body: { score },
    });
  },
};
