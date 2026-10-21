import { useState } from "react";
import { X, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { admissionsApi } from "../../../services/api/admissionsApi";
import "./PaymentSimulationModal.css";

interface PaymentSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  salesOrderId: string;
  courseTitle: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
}

export default function PaymentSimulationModal({
  isOpen,
  onClose,
  salesOrderId,
  courseTitle,
  amount,
  currency,
  onSuccess,
}: PaymentSimulationModalProps) {
  const [cardHolder, setCardHolder] = useState("Andalusia Student");
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await admissionsApi.submitPaymentAttempt({
        salesOrderId,
        provider: "SimulatedCard",
        idempotencyKey: `sim-${salesOrderId}`,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment simulation failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pay-modal-backdrop" role="dialog" aria-modal="true">
      <div className="pay-modal-card">
        <div className="pay-modal-header">
          <div>
            <span className="pay-modal-badge">Sandbox Gateway</span>
            <h3 className="pay-modal-title">Tuition Payment Simulation</h3>
          </div>
          <button
            type="button"
            className="pay-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="pay-order-summary">
          <div className="pay-order-label">Selected Cohort</div>
          <div className="pay-order-course">{courseTitle}</div>
          <div className="pay-order-total">
            <span>Total Due</span>
            <span className="pay-amount-highlight">
              {currency} {amount.toLocaleString()}
            </span>
          </div>
        </div>

        {error && <div className="pay-error-box">{error}</div>}

        <form onSubmit={handleSimulatePayment}>
          <div className="pay-sim-fields">
            <div className="pay-field-group">
              <label>Cardholder Name</label>
              <input
                type="text"
                className="pay-field-input"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                required
              />
            </div>

            <div className="pay-field-group">
              <label>Simulated Card Number</label>
              <input
                type="text"
                className="pay-field-input"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                required
              />
            </div>

            <div className="pay-field-row">
              <div className="pay-field-group">
                <label>Expiry</label>
                <input
                  type="text"
                  className="pay-field-input"
                  defaultValue="12/28"
                  readOnly
                />
              </div>
              <div className="pay-field-group">
                <label>CVC</label>
                <input
                  type="text"
                  className="pay-field-input"
                  defaultValue="888"
                  readOnly
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="pay-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="syllabus-spin-icon" />
                <span>Verifying Payment...</span>
              </>
            ) : (
              <>
                <CreditCard size={16} />
                <span>
                  Verify &amp; Pay {currency} {amount.toLocaleString()}
                </span>
              </>
            )}
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginTop: "14px",
            fontSize: "12px",
            color: "#7b6d5e",
          }}
        >
          <ShieldCheck size={14} />
          <span>Simulated instant verification — unlocks course immediately</span>
        </div>
      </div>
    </div>
  );
}
