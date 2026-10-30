import StripeBuyButton from "../StripeBuyButton/StripeBuyButton";

interface StripePaymentModalProps {
  title: string;
  amount: number;
  currency: string;
  onClose: () => void;
}

export default function StripePaymentModal({
  title,
  amount,
  currency,
  onClose,
}: StripePaymentModalProps) {
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
        <StripeBuyButton />
        <p style={{ margin: "18px 0 0", color: "#7b6d5e", fontSize: 12 }}>
          This Stripe Buy Button uses the configured test payment link.
        </p>
      </div>
    </div>
  );
}
