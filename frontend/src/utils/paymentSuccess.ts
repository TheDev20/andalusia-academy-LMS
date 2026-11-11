import type { ApplicationDto } from "../types/admissions";

export const PAYMENT_SUCCESS_PATH = "/payment/success";

/** Where a learner lands once an order is paid; also the URL to set as Stripe's post-payment redirect. */
export function paymentSuccessPath(orderId?: string | null): string {
  return orderId ? `${PAYMENT_SUCCESS_PATH}?order=${encodeURIComponent(orderId)}` : PAYMENT_SUCCESS_PATH;
}

export function isPaid(application?: ApplicationDto | null): boolean {
  return application?.orderStatus === "Paid";
}

/**
 * Chooses the application the confirmation page is about. An explicit order id wins. Stripe's own
 * redirect cannot carry the order id, so without one the learner's most recent order is used,
 * preferring one that is still awaiting confirmation over older paid ones only when nothing is paid yet.
 */
export function pickOrderApplication(
  applications: readonly ApplicationDto[],
  orderId?: string | null,
): ApplicationDto | undefined {
  if (orderId) {
    return applications.find((a) => a.salesOrderId === orderId);
  }

  const withOrder = applications
    .filter((a) => a.salesOrderId)
    .sort((a, b) => (b.submittedAt ?? "").localeCompare(a.submittedAt ?? ""));
  return withOrder[0];
}
