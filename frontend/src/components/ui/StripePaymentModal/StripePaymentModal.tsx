import { useEffect, useState } from "react";
import { admissionsApi } from "../../../services/api/admissionsApi";
import StripeBuyButton from "../StripeBuyButton/StripeBuyButton";

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

  useEffect(() => {
    if (!onPaid) return;

    let isActive = true;
    const checkPayment = async () => {
      try {
        const applications = await admissionsApi.getMyApplications();
        const application = applications.find((item) => item.salesOrderId === orderId);
        if (isActive && application?.orderStatus === "Paid") {
          onPaid();
        }
      } catch (error) {
        if (isActive) {
          setConfirmationError(
            error instanceof Error
              ? error.message
              : "Unable to confirm the Stripe payment.",
          );
        }
      }
    };

    const intervalId = window.setInterval(checkPayment, 2000);
    checkPayment();

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [onPaid, orderId]);

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
          Payment confirmation may take a few seconds after Stripe checkout completes.
        </p>
        {confirmationError && (
          <p role="alert" style={{ margin: "10px 0 0", color: "#b91c1c", fontSize: 12 }}>
            {confirmationError}
          </p>
        )}
        <p style={{ margin: "18px 0 0", color: "#7b6d5e", fontSize: 12 }}>
          This Stripe Buy Button uses the configured test payment link.
        </p>
      </div>
    </div>
  );
}
