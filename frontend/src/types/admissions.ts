export interface ApplicationDto {
  id: string;
  offeringId: string;
  offeringKind: string;
  itemId: string;
  title: string;
  slug: string;
  status: string;
  submittedAt: string;
  salesOrderId?: string;
  amountDue: number;
  currency: string;
  orderStatus: string;
}

export interface CreatePaymentAttemptRequest {
  salesOrderId: string;
  provider: string;
  idempotencyKey: string;
}

export interface PaymentAttemptDto {
  id: string;
  salesOrderId: string;
  applicationId: string;
  title: string;
  amount: number;
  currency: string;
  provider: string;
  providerPaymentId?: string;
  status: string;
  createdAt: string;
  settledAt?: string;
}

export interface EnrolledCourseDto {
  learningEnrollmentId: string;
  enrollmentId: string;
  courseId: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  category: string;
  status: string;
  startsAt: string;
  endsAt: string;
  enrolledAt: string;
}
