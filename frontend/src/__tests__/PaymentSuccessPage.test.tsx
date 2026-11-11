import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaymentSuccessPage from "../pages/learner/PaymentSuccessPage/PaymentSuccessPage";
import { admissionsApi } from "../services/api/admissionsApi";
import type { ApplicationDto, EnrolledCourseDto, PaymentAttemptDto } from "../types/admissions";

const ORDER_ID = "order-1";

function application(orderStatus: string): ApplicationDto {
  return {
    id: "app-1",
    offeringId: "offering-1",
    offeringKind: "Course",
    title: "Applied GenAI Bootcamp",
    status: orderStatus === "Paid" ? "Accepted" : "Submitted",
    startsAt: "2026-12-01T00:00:00Z",
    salesOrderId: ORDER_ID,
    amountDue: 150,
    currency: "USD",
    orderStatus,
    enrollmentId: orderStatus === "Paid" ? "enrollment-1" : null,
    submittedAt: "2026-11-10T00:00:00Z",
  };
}

const attempt: PaymentAttemptDto = {
  id: "attempt-1",
  salesOrderId: ORDER_ID,
  applicationId: "app-1",
  title: "Applied GenAI Bootcamp",
  amount: 150,
  currency: "USD",
  provider: "Stripe",
  providerPaymentId: "pi_test_123",
  status: "Succeeded",
  createdAt: "2026-11-10T10:00:00Z",
  settledAt: "2026-11-10T10:00:05Z",
};

const course = { courseOfferingId: "offering-1", courseTitle: "Applied GenAI Bootcamp" } as EnrolledCourseDto;

function renderPage(path = `/payment/success?order=${ORDER_ID}`) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

async function flush(ms = 0) {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
}

describe("PaymentSuccessPage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(admissionsApi, "getMyPayments").mockResolvedValue([attempt]);
    vi.spyOn(admissionsApi, "getMyLearning").mockResolvedValue([course]);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("thanks the learner and shows the receipt and a link into the course once paid", async () => {
    vi.spyOn(admissionsApi, "getMyApplications").mockResolvedValue([application("Paid")]);
    renderPage();
    await flush(50);

    expect(screen.getByRole("heading", { name: /you're enrolled/i })).toBeTruthy();
    await flush(50); // receipt and course load after the paid state is known
    expect(screen.getByText("pi_test_123")).toBeTruthy();
    expect(screen.getByText("Active")).toBeTruthy();
    expect(screen.getByRole("link", { name: /go to my course/i }).getAttribute("href")).toBe("/learn/offering-1");
    expect(screen.getByRole("link", { name: /go to my dashboard/i }).getAttribute("href")).toBe("/dashboard");
  });

  it("waits for the webhook, then switches to the confirmation", async () => {
    const getMyApplications = vi
      .spyOn(admissionsApi, "getMyApplications")
      .mockResolvedValueOnce([application("PendingPayment")])
      .mockResolvedValue([application("Paid")]);
    renderPage();
    await flush();

    expect(screen.getByRole("heading", { name: /confirming your payment/i })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: /you're enrolled/i })).toBeNull();

    await flush(2100);

    expect(screen.getByRole("heading", { name: /you're enrolled/i })).toBeTruthy();
    const callsAfterPaid = getMyApplications.mock.calls.length;
    await flush(10_000);
    expect(getMyApplications).toHaveBeenCalledTimes(callsAfterPaid);
  });

  it("stops waiting after a minute and reassures the learner", async () => {
    vi.spyOn(admissionsApi, "getMyApplications").mockResolvedValue([application("PendingPayment")]);
    renderPage();

    await flush(70_000);

    expect(screen.getByRole("heading", { name: /still being confirmed/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /go to my dashboard/i })).toBeTruthy();
  });

  it("uses the most recent order when Stripe redirects without an order id", async () => {
    vi.spyOn(admissionsApi, "getMyApplications").mockResolvedValue([application("Paid")]);
    renderPage("/payment/success");
    await flush();

    expect(screen.getByRole("heading", { name: /you're enrolled/i })).toBeTruthy();
  });

  it("says so when the order does not belong to the learner", async () => {
    vi.spyOn(admissionsApi, "getMyApplications").mockResolvedValue([application("Paid")]);
    renderPage("/payment/success?order=someone-elses-order");
    await flush();

    expect(screen.getByRole("heading", { name: /couldn't find that order/i })).toBeTruthy();
  });
});
