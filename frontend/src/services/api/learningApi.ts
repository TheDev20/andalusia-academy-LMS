import { apiRequest } from "./httpClient";
import type { CourseLearningDto, LearnerResourceDto, SubmissionDto } from "../../types/learning";

export const learningApi = {
  getCourse(courseOfferingId: string, signal?: AbortSignal): Promise<CourseLearningDto> {
    return apiRequest<CourseLearningDto>(`/api/learning/courses/${courseOfferingId}`, { signal });
  },

  completeResource(resourceId: string): Promise<LearnerResourceDto> {
    return apiRequest<LearnerResourceDto>(`/api/learning/resources/${resourceId}/complete`, { method: "POST" });
  },

  submitAssignment(assignmentId: string, body: string): Promise<SubmissionDto> {
    return apiRequest<SubmissionDto>(`/api/learning/assignments/${assignmentId}/submissions`, {
      method: "POST",
      body: { body },
    });
  },
};
