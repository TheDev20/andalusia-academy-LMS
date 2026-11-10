import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import StripePaymentModal from "../components/ui/StripePaymentModal/StripePaymentModal";
import { admissionsApi } from "../services/api/admissionsApi";
import type { ApplicationDto } from "../types/admissions";

const ORDER_ID = "order-1";

function application(orderStatus: string): ApplicationDto {
  return { id: "app-1", salesOrderId: ORDER_ID, orderStatus } as ApplicationDto;
}

function renderModal(onPaid?: () => void) {
  return render(
    <StripePaymentModal
      orderId={ORDER_ID}
      title="Course"
      amount={150}
      currency="USD"
      onClose={() => {}}
      onPaid={onPaid}
    />,
  );
}

/** Lets the pending API promise settle, then advances to the next scheduled poll. */
async function nextPoll() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(2000);
  });
}

describe("StripePaymentModal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("passes the order id to Stripe as the client reference", () => {
    vi.spyOn(admissionsApi, "getMyApplications").mockResolvedValue([]);
    const { container } = renderModal();

    expect(container.querySelector("stripe-buy-button")?.getAttribute("client-reference-id")).toBe(ORDER_ID);
  });

  it("keeps polling until the webhook marks the order paid, then notifies once", async () => {
    const getMyApplications = vi
      .spyOn(admissionsApi, "getMyApplications")
      .mockResolvedValueOnce([application("PendingPayment")])
      .mockResolvedValueOnce([application("PendingPayment")])
      .mockResolvedValue([application("Paid")]);
    const onPaid = vi.fn();
    renderModal(onPaid);

    await nextPoll();
    expect(onPaid).not.toHaveBeenCalled();
    await nextPoll();
    expect(onPaid).toHaveBeenCalledTimes(1);

    await nextPoll();
    expect(onPaid).toHaveBeenCalledTimes(1);
    expect(getMyApplications).toHaveBeenCalledTimes(3);
  });

  it("does not restart polling when the parent re-renders with a new callback", async () => {
    const getMyApplications = vi
      .spyOn(admissionsApi, "getMyApplications")
      .mockResolvedValue([application("PendingPayment")]);
    const { rerender } = renderModal(() => {});
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    for (let i = 0; i < 5; i += 1) {
      rerender(
        <StripePaymentModal orderId={ORDER_ID} title="Course" amount={150} currency="USD" onClose={() => {}} onPaid={() => {}} />,
      );
    }
    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });

    expect(getMyApplications).toHaveBeenCalledTimes(1);
  });

  it("surfaces a failed check, recovers on the next poll and stops when closed", async () => {
    const getMyApplications = vi
      .spyOn(admissionsApi, "getMyApplications")
      .mockRejectedValueOnce(new Error("Network down"))
      .mockResolvedValue([application("PendingPayment")]);
    const { unmount } = renderModal(() => {});

    await act(async () => {
      await vi.advanceTimersByTimeAsync(0);
    });
    expect(screen.getByRole("alert").textContent).toContain("Network down");

    await nextPoll();
    expect(screen.queryByRole("alert")).toBeNull();

    unmount();
    const callsWhenClosed = getMyApplications.mock.calls.length;
    await vi.advanceTimersByTimeAsync(10000);
    expect(getMyApplications).toHaveBeenCalledTimes(callsWhenClosed);
  });

  it("does not poll when nobody listens for the payment", async () => {
    const getMyApplications = vi.spyOn(admissionsApi, "getMyApplications").mockResolvedValue([]);
    renderModal();

    await vi.advanceTimersByTimeAsync(10000);

    expect(getMyApplications).not.toHaveBeenCalled();
  });
});
