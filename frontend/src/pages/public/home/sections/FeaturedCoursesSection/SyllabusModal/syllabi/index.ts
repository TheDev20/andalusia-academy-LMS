import { ProgramSyllabusDetails } from "./types";
import { aspnetSyllabus } from "./aspnetSyllabus";
import { genAiSyllabus } from "./genAiSyllabus";
import { reactSyllabus } from "./reactSyllabus";
import { dataScienceSyllabus } from "./dataScienceSyllabus";
import { bigDataSyllabus } from "./bigDataSyllabus";
import { devopsSyllabus } from "./devopsSyllabus";
import { cybersecuritySyllabus } from "./cybersecuritySyllabus";
import { generateFallbackSyllabus } from "./fallbackSyllabus";

export * from "./types";
export { generateFallbackSyllabus };

export const PROGRAM_SYLLABI: Record<string, ProgramSyllabusDetails> = {
  "aspnet-core-enterprise": aspnetSyllabus,
  "applied-genai-llm": genAiSyllabus,
  "react-fullstack-architecture": reactSyllabus,
  "data-science-ml": dataScienceSyllabus,
  "bigdata-spark-bigquery": bigDataSyllabus,
  "kubernetes-devops-cloud": devopsSyllabus,
  "cybersecurity-devsecops": cybersecuritySyllabus,
};

/**
 * Helper function to retrieve syllabus or generate a dynamic fallback for custom courses
 */
export function getProgramSyllabus(
  courseId: string,
  fallbackCourseTitle?: string,
  fallbackCategory?: string
): ProgramSyllabusDetails {
  if (PROGRAM_SYLLABI[courseId]) {
    return PROGRAM_SYLLABI[courseId];
  }

  return generateFallbackSyllabus(courseId, fallbackCourseTitle, fallbackCategory);
}
