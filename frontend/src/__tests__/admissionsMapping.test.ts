import { describe, expect, it } from "vitest";
import { toApplication, toPaymentAttempts } from "../services/api/admissionsApi";
import type { ApiApplicationDto, ApiOrderDto } from "../types/admissions";

describe("admissions mapping", () => {
  it("maps an API application to the learner view model", () => {
    const api: ApiApplicationDto = {
      id: "app-1", offeringId: "off-1", offeringKind: "Course", title: "React", startsAt: "2026-11-01T00:00:00Z",
      endsAt: "2027-01-01T00:00:00Z", price: 680, currency: "USD", status: "Submitted", submittedAt: "2026-10-21T00:00:00Z",
      seatHeldUntil: "2026-10-21T00:30:00Z", orderId: "order-1", orderStatus: "PendingPayment", enrollmentId: null,
    };

    expect(toApplication(api)).toMatchObject({ salesOrderId: "order-1", amountDue: 680, currency: "USD", orderStatus: "PendingPayment" });
  });

  it("flattens orders into payment attempts, newest first, carrying order context", () => {
    const orders: ApiOrderDto[] = [
      {
        id: "o1", applicationId: "a1", title: "React", amountDue: 680, currency: "USD", status: "Paid", createdAt: "2026-10-01T00:00:00Z",
        attempts: [
          { id: "p1", amount: 680, currency: "USD", provider: "Simulated", status: "Failed", createdAt: "2026-10-01T10:00:00Z" },
          { id: "p2", amount: 680, currency: "USD", provider: "Simulated", status: "Succeeded", createdAt: "2026-10-01T11:00:00Z" },
        ],
      },
      { id: "o2", applicationId: "a2", title: "Data", amountDue: 820, currency: "USD", status: "PendingPayment", createdAt: "2026-10-02T00:00:00Z", attempts: [] },
    ];

    const attempts = toPaymentAttempts(orders);

    expect(attempts.map((a) => a.id)).toEqual(["p2", "p1"]);
    expect(attempts[0]).toMatchObject({ salesOrderId: "o1", applicationId: "a1", title: "React" });
  });
});
