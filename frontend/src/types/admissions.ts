/** View models used by the learner UI (mapped from the API in admissionsApi). */
export interface ApplicationDto {
  id: string;
  offeringId: string;
  offeringKind: string;
  title: string;
  status: string;
  submittedAt?: string | null;
  startsAt: string;
  seatHeldUntil?: string | null;
  salesOrderId?: string | null;
  amountDue: number;
  currency: string;
  orderStatus?: string | null;
  enrollmentId?: string | null;
}

export interface PaymentAttemptDto {
  id: string;
  salesOrderId: string;
  applicationId: string;
  title: string;
  amount: number;
  currency: string;
  provider: string;
  providerPaymentId?: string | null;
  status: string;
  createdAt: string;
  settledAt?: string | null;
}

export interface ProgressDto {
  requiredResources: number;
  completedResources: number;
  sessionsHeld: number;
  sessionsAttended: number;
  assignments: number;
  assignmentsSubmitted: number;
  resourceCompletionPercent: number;
  attendancePercent: number;
  assignmentCompletionPercent: number;
  overallPercent: number;
}

/** A course the learner is enrolled in (GET /api/learning/courses). */
export interface EnrolledCourseDto {
  learningEnrollmentId: string;
  courseOfferingId: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  imageUrl?: string | null;
  category?: string | null;
  startsAt: string;
  endsAt: string;
  status: string;
  nextSessionAt?: string | null;
  progress: ProgressDto;
}

export type PaymentOutcome = "Succeeded" | "Failed";

export interface PaymentResult {
  orderId: string;
  orderStatus: string;
  attempt: PaymentAttemptDto;
  enrollmentId?: string | null;
}

/* ---- Raw API contracts ---- */

export interface ApiApplicationDto {
  id: string;
  offeringId: string;
  offeringKind: string;
  title: string;
  startsAt: string;
  endsAt: string;
  price: number;
  currency: string;
  status: string;
  submittedAt?: string | null;
  seatHeldUntil?: string | null;
  orderId?: string | null;
  orderStatus?: string | null;
  enrollmentId?: string | null;
}

export interface ApiPaymentAttemptDto {
  id: string;
  amount: number;
  currency: string;
  provider: string;
  providerPaymentId?: string | null;
  status: string;
  createdAt: string;
  settledAt?: string | null;
}

export interface ApiOrderDto {
  id: string;
  applicationId: string;
  title: string;
  amountDue: number;
  currency: string;
  status: string;
  createdAt: string;
  attempts: ApiPaymentAttemptDto[];
}

export interface ApiPaymentResultDto {
  orderId: string;
  orderStatus: string;
  attempt: ApiPaymentAttemptDto;
  enrollmentId?: string | null;
}

export interface OpenOfferingDto {
  id: string;
  startsAt: string;
  endsAt: string;
  timeZoneId: string;
  price: number;
  currency: string;
  seatsRemaining: number;
}
