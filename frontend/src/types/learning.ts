import type { ProgressDto } from "./admissions";
import type { FileDto } from "./files";

export interface LocationDto {
  id: string;
  name: string;
  address?: string | null;
  meetingUrl?: string | null;
}

export interface LearnerSessionDto {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: string;
  location?: LocationDto | null;
  myAttendance?: string | null;
}

export interface LearnerResourceDto {
  id: string;
  title: string;
  url?: string | null;
  required: boolean;
  sequence: number;
  completedAt?: string | null;
}

export interface SubmissionDto {
  id: string;
  assignmentId: string;
  attemptNumber: number;
  body?: string | null;
  score?: number | null;
  submittedAt: string;
  gradedAt?: string | null;
  files: FileDto[];
}

export interface LearnerAssignmentDto {
  id: string;
  title: string;
  instructions: string;
  maxScore: number;
  dueAt?: string | null;
  status: string;
  latestSubmission?: SubmissionDto | null;
}

export interface CourseLearningDto {
  learningEnrollmentId: string;
  courseOfferingId: string;
  courseTitle: string;
  courseDescription: string;
  startsAt: string;
  endsAt: string;
  timeZoneId: string;
  instructors: string[];
  sessions: LearnerSessionDto[];
  resources: LearnerResourceDto[];
  assignments: LearnerAssignmentDto[];
  progress: ProgressDto;
}

/* ---- Instructor ---- */

export type AttendanceStatus = "Present" | "Absent" | "Late" | "Excused";
export const ATTENDANCE_STATUSES: AttendanceStatus[] = ["Present", "Absent", "Late", "Excused"];

export type AssignmentStatus = "Draft" | "Published" | "Closed";
export const ASSIGNMENT_STATUSES: AssignmentStatus[] = ["Draft", "Published", "Closed"];

export interface CohortDto {
  offeringId: string;
  courseId: string;
  courseTitle: string;
  startsAt: string;
  endsAt: string;
  status: string;
  learnerCount: number;
  sessionCount: number;
  assignmentCount: number;
}

export interface InstructorSessionDto {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  status: string;
  locationName?: string | null;
  attendanceRecorded: number;
}

export interface InstructorAssignmentDto {
  id: string;
  title: string;
  instructions: string;
  maxScore: number;
  dueAt?: string | null;
  status: AssignmentStatus;
  submissionCount: number;
  ungradedCount: number;
}

export interface RosterEntryDto {
  learningEnrollmentId: string;
  learnerId: string;
  learnerName: string;
  email: string;
  status: string;
}

export interface CohortDetailDto {
  cohort: CohortDto;
  sessions: InstructorSessionDto[];
  assignments: InstructorAssignmentDto[];
  roster: RosterEntryDto[];
}

export interface AttendanceRecordDto {
  learningEnrollmentId: string;
  learnerId: string;
  learnerName: string;
  status?: AttendanceStatus | null;
  recordedAt?: string | null;
}

export interface SessionAttendanceDto {
  sessionId: string;
  courseOfferingId: string;
  title: string;
  startsAt: string;
  records: AttendanceRecordDto[];
}

export interface AttendanceEntry {
  learningEnrollmentId: string;
  status: AttendanceStatus;
  correctionReason?: string | null;
}

export interface UpsertAssignmentRequest {
  title: string;
  instructions: string;
  maxScore: number;
  dueAt?: string | null;
  status: AssignmentStatus;
}

export interface SubmissionForGradingDto {
  id: string;
  learningEnrollmentId: string;
  learnerName: string;
  attemptNumber: number;
  body?: string | null;
  submittedAt: string;
  score?: number | null;
  gradedAt?: string | null;
  files: FileDto[];
}

export interface LearnerProgressDto {
  learningEnrollmentId: string;
  learnerId: string;
  learnerName: string;
  email: string;
  progress: ProgressDto;
}
