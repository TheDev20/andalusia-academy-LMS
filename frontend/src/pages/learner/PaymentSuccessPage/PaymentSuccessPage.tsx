import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { admissionsApi } from "../../../services/api/admissionsApi";
import { ErrorAlert, LoadingState } from "../../../components/portal/Portal";
import { formatDate, formatDateTime, formatMoney } from "../../../utils/format";
import { isPaid, pickOrderApplication } from "../../../utils/paymentSuccess";
import "./PaymentSuccessPage.css";

const POLL_INTERVAL_MS = 2000;
/** Stripe normally settles within seconds; after this the page stops waiting and reassures instead. */
const MAX_WAIT_MS = 60_000;

/**
 * Landing page after Stripe Checkout. Settlement arrives through the webhook, so the order is polled
 * until it is paid, then the learner sees a receipt and the enrollment it created.
 */
export default function PaymentSuccessPage() {
  const orderId = useSearchParams()[0].get("order");
  const queryClient = useQueryClient();
  const [startedAt] = useState(() => Date.now());

  const applicationsQuery = useQuery({
    queryKey: ["paymentSuccess", "applications", orderId],
    queryFn: admissionsApi.getMyApplications,
    staleTime: 0,
    gcTime: 0,
    refetchInterval: (query) => {
      const application = query.state.data ? pickOrderApplication(query.state.data, orderId) : undefined;
      const waitedOut = query.state.dataUpdatedAt - startedAt >= MAX_WAIT_MS;
      return isPaid(application) || waitedOut ? false : POLL_INTERVAL_MS;
    },
  });

  const application = applicationsQuery.data ? pickOrderApplication(applicationsQuery.data, orderId) : undefined;
  const paid = isPaid(application);
  const gaveUp = !paid && applicationsQuery.dataUpdatedAt - startedAt >= MAX_WAIT_MS;

  const paymentsQuery = useQuery({
    queryKey: ["paymentSuccess", "payments", application?.salesOrderId],
    queryFn: admissionsApi.getMyPayments,
    enabled: paid,
    staleTime: 0,
    gcTime: 0,
  });
  const learningQuery = useQuery({
    queryKey: ["paymentSuccess", "learning", application?.salesOrderId],
    queryFn: admissionsApi.getMyLearning,
    enabled: paid,
    staleTime: 0,
    gcTime: 0,
  });

  // The dashboard caches these for minutes; make sure it shows the new enrollment and payment.
  useEffect(() => {
    if (!paid) return;
    queryClient.invalidateQueries({ queryKey: ["myLearning"] });
    queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    queryClient.invalidateQueries({ queryKey: ["myPayments"] });
  }, [paid, queryClient]);

  if (applicationsQuery.isLoading) {
    return (
      <div className="payment-success">
        <LoadingState label="Checking your payment…" />
      </div>
    );
  }

  if (applicationsQuery.isError && !applicationsQuery.data) {
    return (
      <div className="payment-success">
        <div className="payment-success-card">
          <ErrorAlert error={applicationsQuery.error} />
          <div className="payment-success-actions">
            <Link to="/dashboard" className="dash-btn">Go to my dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="payment-success">
        <div className="payment-success-card">
          <h1 className="payment-success-title">We couldn't find that order</h1>
          <p className="payment-success-lead">
            Check your dashboard for your applications and payments.
          </p>
          <div className="payment-success-actions">
            <Link to="/dashboard" className="dash-btn">Go to my dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  if (!paid) {
    return (
      <div className="payment-success">
        <div className="payment-success-card" role="status" aria-live="polite">
          <span className="payment-success-icon is-waiting">
            <Loader2 size={32} className={gaveUp ? undefined : "payment-success-spin"} aria-hidden="true" />
          </span>
          <h1 className="payment-success-title">
            {gaveUp ? "Your payment is still being confirmed" : "Confirming your payment…"}
          </h1>
          <p className="payment-success-lead">
            {gaveUp
              ? "Stripe is taking longer than usual to confirm. If you completed the payment you have not lost it: your enrollment will appear on your dashboard as soon as it is confirmed."
              : `We're waiting for Stripe to confirm your payment for ${application.title}. This usually takes a few seconds, so please keep this page open.`}
          </p>
          <div className="payment-success-actions">
            <Link to="/dashboard" className="dash-btn">Go to my dashboard</Link>
          </div>
        </div>
      </div>
    );
  }

  const attempt = paymentsQuery.data?.find(
    (a) => a.salesOrderId === application.salesOrderId && a.status === "Succeeded",
  );
  const course = learningQuery.data?.find((c) => c.courseOfferingId === application.offeringId);

  return (
    <div className="payment-success">
      <div className="payment-success-card">
        <span className="payment-success-icon is-done">
          <CheckCircle2 size={34} aria-hidden="true" />
        </span>
        <div className="payment-success-eyebrow">Payment confirmed</div>
        <h1 className="payment-success-title">Thank you, you're enrolled!</h1>
        <p className="payment-success-lead">
          We've received your payment for <strong>{application.title}</strong> and your place is secured.
        </p>

        <dl className="payment-receipt">
          <div className="payment-receipt-row">
            <dt>Program</dt>
            <dd>{application.title}</dd>
          </div>
          <div className="payment-receipt-row">
            <dt>Amount paid</dt>
            <dd>{formatMoney(application.amountDue, application.currency)}</dd>
          </div>
          <div className="payment-receipt-row">
            <dt>Date</dt>
            <dd>{formatDateTime(attempt?.settledAt ?? attempt?.createdAt)}</dd>
          </div>
          <div className="payment-receipt-row">
            <dt>Receipt ID</dt>
            <dd>{attempt?.providerPaymentId ?? "—"}</dd>
          </div>
          <div className="payment-receipt-row">
            <dt>Enrollment</dt>
            <dd>{application.enrollmentId ? "Active" : "Being set up"}</dd>
          </div>
          <div className="payment-receipt-row">
            <dt>Starts</dt>
            <dd>{formatDate(application.startsAt)}</dd>
          </div>
        </dl>

        <ErrorAlert error={paymentsQuery.error ?? learningQuery.error} />

        {/* Held back until the course lookup settles so the buttons do not jump. */}
        <div className="payment-success-actions" hidden={learningQuery.isLoading}>
          {course && (
            <Link to={`/learn/${course.courseOfferingId}`} className="dash-btn">
              Go to my course
            </Link>
          )}
          <Link
            to="/dashboard"
            className="dash-btn"
            style={course ? { background: "#fff", color: "#43392f", border: "1px solid #ded6c8" } : undefined}
          >
            Go to my dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
