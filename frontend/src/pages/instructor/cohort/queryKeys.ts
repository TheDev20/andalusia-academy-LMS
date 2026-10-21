/** React-query keys for the instructor cohort area, so mutations invalidate consistently. */
export const cohortKeys = {
  all: ["instructor"] as const,
  cohorts: ["instructor", "cohorts"] as const,
  detail: (offeringId: string) => ["instructor", "cohort", offeringId] as const,
  progress: (offeringId: string) => ["instructor", "cohort", offeringId, "progress"] as const,
  attendance: (sessionId: string) => ["instructor", "attendance", sessionId] as const,
  submissions: (assignmentId: string) => ["instructor", "submissions", assignmentId] as const,
};
