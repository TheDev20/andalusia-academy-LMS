import { describe, expect, it } from "vitest";
import { isPaid, paymentSuccessPath, pickOrderApplication } from "../utils/paymentSuccess";
import type { ApplicationDto } from "../types/admissions";

function app(overrides: Partial<ApplicationDto>): ApplicationDto {
  return {
    id: "a",
    offeringId: "o",
    offeringKind: "Course",
    title: "Course",
    status: "Submitted",
    startsAt: "2026-12-01T00:00:00Z",
    amountDue: 150,
    currency: "USD",
    ...overrides,
  };
}

describe("paymentSuccessPath", () => {
  it("carries the order id, encoded", () => {
    expect(paymentSuccessPath("order 1")).toBe("/payment/success?order=order%201");
  });

  it("falls back to the bare page when there is no order id", () => {
    expect(paymentSuccessPath(null)).toBe("/payment/success");
    expect(paymentSuccessPath(undefined)).toBe("/payment/success");
  });
});

describe("pickOrderApplication", () => {
  const older = app({ id: "old", salesOrderId: "order-old", orderStatus: "Paid", submittedAt: "2026-10-01T00:00:00Z" });
  const newer = app({ id: "new", salesOrderId: "order-new", orderStatus: "PendingPayment", submittedAt: "2026-11-01T00:00:00Z" });
  const noOrder = app({ id: "none", submittedAt: "2026-11-05T00:00:00Z" });

  it("returns the application for the requested order", () => {
    expect(pickOrderApplication([older, newer], "order-old")?.id).toBe("old");
  });

  it("does not fall back to another order when the requested one is unknown", () => {
    expect(pickOrderApplication([older, newer], "order-missing")).toBeUndefined();
  });

  it("without an order id uses the most recent application that has an order", () => {
    expect(pickOrderApplication([older, noOrder, newer])?.id).toBe("new");
  });

  it("returns undefined when nothing has an order", () => {
    expect(pickOrderApplication([noOrder])).toBeUndefined();
    expect(pickOrderApplication([])).toBeUndefined();
  });
});

describe("isPaid", () => {
  it("is true only for a paid order", () => {
    expect(isPaid(app({ orderStatus: "Paid" }))).toBe(true);
    expect(isPaid(app({ orderStatus: "PendingPayment" }))).toBe(false);
    expect(isPaid(undefined)).toBe(false);
  });
});
