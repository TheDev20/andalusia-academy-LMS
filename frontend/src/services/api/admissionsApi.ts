import { apiRequest } from "./httpClient";
import type {
  ApiApplicationDto,
  ApiOrderDto,
  ApiPaymentResultDto,
  ApplicationDto,
  EnrolledCourseDto,
  OpenOfferingDto,
  PaymentAttemptDto,
  PaymentOutcome,
  PaymentResult,
} from "../../types/admissions";

export function toApplication(a: ApiApplicationDto): ApplicationDto {
  return {
    id: a.id,
    offeringId: a.offeringId,
    offeringKind: a.offeringKind,
    title: a.title,
    status: a.status,
    submittedAt: a.submittedAt,
    startsAt: a.startsAt,
    seatHeldUntil: a.seatHeldUntil,
    salesOrderId: a.orderId,
    amountDue: a.price,
    currency: a.currency.trim(),
    orderStatus: a.orderStatus,
    enrollmentId: a.enrollmentId,
  };
}

export function toPaymentAttempts(orders: ApiOrderDto[]): PaymentAttemptDto[] {
  return orders
    .flatMap((order) =>
      order.attempts.map((attempt) => ({
        ...attempt,
        currency: attempt.currency.trim(),
        salesOrderId: order.id,
        applicationId: order.applicationId,
        title: order.title,
      })),
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/** One key per user action: retries of the same click are deduplicated by the API. */
export function newIdempotencyKey(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const admissionsApi = {
  getOpenOfferings(courseSlug: string, signal?: AbortSignal): Promise<OpenOfferingDto[]> {
    return apiRequest<OpenOfferingDto[]>(`/api/catalog/courses/${encodeURIComponent(courseSlug)}/offerings`, {
      signal,
      auth: false,
    });
  },

  /** Ensures a sales order exists for a submitted application and returns the refreshed application. */
  async checkout(applicationId: string): Promise<ApplicationDto> {
    await apiRequest<ApiOrderDto>("/api/payments/orders", { method: "POST", body: { applicationId } });
    return toApplication(await apiRequest<ApiApplicationDto>(`/api/applications/${applicationId}`));
  },

  /** Apply for an offering (holds a seat) and open its sales order, ready for payment. */
  async submitApplication(offeringId: string): Promise<ApplicationDto> {
    const application = await apiRequest<ApiApplicationDto>("/api/applications", {
      method: "POST",
      body: { offeringId },
    });
    return admissionsApi.checkout(application.id);
  },

  async getMyApplications(): Promise<ApplicationDto[]> {
    return (await apiRequest<ApiApplicationDto[]>("/api/applications/mine")).map(toApplication);
  },

  async cancelApplication(applicationId: string): Promise<ApplicationDto> {
    return toApplication(await apiRequest<ApiApplicationDto>(`/api/applications/${applicationId}/cancel`, { method: "POST" }));
  },

  async simulatePayment(orderId: string, outcome: PaymentOutcome, idempotencyKey: string): Promise<PaymentResult> {
    const result = await apiRequest<ApiPaymentResultDto>(`/api/payments/orders/${orderId}/simulate`, {
      method: "POST",
      body: { outcome },
      headers: { "Idempotency-Key": idempotencyKey },
    });
    return {
      orderId: result.orderId,
      orderStatus: result.orderStatus,
      enrollmentId: result.enrollmentId,
      attempt: { ...result.attempt, salesOrderId: result.orderId, applicationId: "", title: "" },
    };
  },

  async getMyPayments(): Promise<PaymentAttemptDto[]> {
    return toPaymentAttempts(await apiRequest<ApiOrderDto[]>("/api/payments/mine"));
  },

  getMyLearning(): Promise<EnrolledCourseDto[]> {
    return apiRequest<EnrolledCourseDto[]>("/api/learning/courses");
  },
};
