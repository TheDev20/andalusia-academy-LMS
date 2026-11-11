import { apiRequest } from "./httpClient";
import type { CourseLearningDto, LearnerResourceDto, SubmissionDto } from "../../types/learning";

export const learningApi = {
  getCourse(courseOfferingId: string, signal?: AbortSignal): Promise<CourseLearningDto> {
    return apiRequest<CourseLearningDto>(`/api/learning/courses/${courseOfferingId}`, { signal });
  },

  completeResource(resourceId: string): Promise<LearnerResourceDto> {
    return apiRequest<LearnerResourceDto>(`/api/learning/resources/${resourceId}/complete`, { method: "POST" });
  },

  /** Text-only attempts use the JSON endpoint; attempts with files are sent as multipart form data. */
  submitAssignment(assignmentId: string, body: string, files: File[] = []): Promise<SubmissionDto> {
    if (files.length === 0) {
      return apiRequest<SubmissionDto>(`/api/learning/assignments/${assignmentId}/submissions`, {
        method: "POST",
        body: { body },
      });
    }

    const form = new FormData();
    if (body) form.append("Body", body);
    files.forEach((file) => form.append("Files", file, file.name));
    return apiRequest<SubmissionDto>(`/api/learning/assignments/${assignmentId}/submissions/upload`, {
      method: "POST",
      body: form,
    });
  },
};
