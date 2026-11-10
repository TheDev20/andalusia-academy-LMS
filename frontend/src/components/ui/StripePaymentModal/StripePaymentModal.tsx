import { useEffect, useRef, useState } from "react";
import { admissionsApi } from "../../../services/api/admissionsApi";
import StripeBuyButton from "../StripeBuyButton/StripeBuyButton";

const POLL_INTERVAL_MS = 2000;

interface StripePaymentModalProps {
  orderId: string;
  title: string;
  amount: number;
  currency: string;
  onClose: () => void;
  onPaid?: () => void;
}

export default function StripePaymentModal({
  orderId,
  title,
  amount,
  currency,
  onClose,
  onPaid,
}: StripePaymentModalProps) {
  const [confirmationError, setConfirmationError] = useState<string | null>(null);

  // Parents pass inline callbacks; keeping the latest one in a ref stops every parent render
  // from tearing down and restarting the polling loop.
  const onPaidRef = useRef(onPaid);
  useEffect(() => {
    onPaidRef.current = onPaid;
  }, [onPaid]);
  const shouldConfirm = Boolean(onPaid);

  // Stripe Checkout opens in a new tab and settlement arrives through the webhook, so the order is
  // polled until the backend reports it paid.
  useEffect(() => {
    if (!shouldConfirm) return;

    let isActive = true;
    let timeoutId: number | undefined;

    const checkPayment = async () => {
      try {
        const applications = await admissionsApi.getMyApplications();
        if (!isActive) return;
        setConfirmationError(null);
        const application = applications.find((item) => item.salesOrderId === orderId);
        if (application?.orderStatus === "Paid") {
          onPaidRef.current?.();
          return;
        }
      } catch (error) {
        if (!isActive) return;
        setConfirmationError(
          error instanceof Error ? error.message : "Unable to confirm the Stripe payment.",
        );
      }
      // Schedule only after the previous check finished so slow responses never overlap.
      timeoutId = window.setTimeout(checkPayment, POLL_INTERVAL_MS);
    };

    checkPayment();

    return () => {
      isActive = false;
      window.clearTimeout(timeoutId);
    };
  }, [shouldConfirm, orderId]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="stripe-payment-title"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(35, 29, 24, 0.62)",
      }}
    >
      <div
        style={{
          width: "min(100%, 520px)",
          padding: 28,
          borderRadius: 16,
          background: "#fffdf9",
          boxShadow: "0 20px 60px rgba(35, 29, 24, 0.24)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "start" }}>
          <div>
            <span style={{ color: "#7b6d5e", fontSize: 12, fontWeight: 700 }}>
              Secure Stripe Checkout
            </span>
            <h2 id="stripe-payment-title" style={{ margin: "6px 0 0", fontSize: 24 }}>
              Pay Tuition
            </h2>
          </div>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
        <p style={{ margin: "16px 0 6px", fontWeight: 700 }}>{title}</p>
        <p style={{ margin: "0 0 20px" }}>
          Amount due: {currency} {amount.toLocaleString()}
        </p>
        <StripeBuyButton clientReferenceId={orderId} />
        <p style={{ margin: "14px 0 0", color: "#7b6d5e", fontSize: 12 }}>
          Checkout opens in a new tab. Keep this window open: your enrollment is confirmed here a
          few seconds after Stripe completes the payment.
        </p>
        {confirmationError && (
          <p role="alert" style={{ margin: "10px 0 0", color: "#b91c1c", fontSize: 12 }}>
            {confirmationError}
          </p>
        )}
      </div>
    </div>
  );
}
