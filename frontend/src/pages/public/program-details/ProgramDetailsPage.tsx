import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProgramDetail } from "../../../services/catalogService";
import { useApplyAndPay } from "../../../hooks/useApplyAndPay";
import StripePaymentModal from "../../../components/ui/StripePaymentModal/StripePaymentModal";
import {
  EmptyState,
  ErrorAlert,
  LoadingState,
  PortalPage,
} from "../../../components/portal/Portal";
import { formatDate, formatMoney } from "../../../utils/format";

export default function ProgramDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const {
    data: program,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["programDetail", slug],
    queryFn: ({ signal }) => fetchProgramDetail(slug, signal),
    enabled: !!slug,
  });
  const applyFlow = useApplyAndPay();

  if (isLoading) {
    return (
      <PortalPage
        title="Loading program…"
        backTo="/courses?tab=programs"
        backLabel="Back to Multi-Course Programs"
      >
        <LoadingState />
      </PortalPage>
    );
  }

  if (error || !program) {
    return (
      <PortalPage
        title="Program not found"
        backTo="/courses?tab=programs"
        backLabel="Back to Multi-Course Programs"
      >
        <ErrorAlert
          error={
            error ??
            new Error("This program does not exist or is no longer published.")
          }
        />
      </PortalPage>
    );
  }

  const now = Date.now();
  const openOfferings = program.offerings.filter(
    (o) => o.status === "Published" && new Date(o.startsAt).getTime() > now,
  );

  return (
    <PortalPage
      eyebrow={program.categories.join(" · ") || "Program"}
      title={program.title}
      subtitle={program.description}
      backTo="/courses?tab=programs"
      backLabel="Back to Multi-Course Programs"
    >
      <ErrorAlert error={applyFlow.error} />

      <h2 className="portal-section-title">Program structure</h2>
      {program.includedCourses.length === 0 ? (
        <EmptyState title="Curriculum coming soon" />
      ) : (
        <ol
          style={{ listStyle: "none", margin: 0, padding: 0 }}
          className="portal-stack"
        >
          {[...program.includedCourses]
            .sort((a, b) => a.sequence - b.sequence)
            .map((c) => (
              <li key={c.courseId} className="portal-card">
                <div className="portal-row-between">
                  <h3 className="portal-card-title">
                    {c.sequence}.{" "}
                    <Link
                      to={`/courses/${c.slug}/syllabus`}
                      style={{ color: "inherit" }}
                    >
                      {c.title}
                    </Link>
                  </h3>
                  <span
                    className={`portal-badge ${c.isRequired ? "portal-badge-info" : ""}`}
                  >
                    {c.isRequired ? "Core" : "Elective"}
                  </span>
                </div>
                <p
                  style={{ margin: "6px 0 0", color: "#43392f", fontSize: 14 }}
                >
                  {c.description}
                </p>
              </li>
            ))}
        </ol>
      )}

      <h2 className="portal-section-title">Upcoming cohorts</h2>
      {openOfferings.length === 0 ? (
        <EmptyState title="No cohort is open for applications right now">
          Check back soon — new intakes are announced regularly.
        </EmptyState>
      ) : (
        <div className="portal-grid">
          {openOfferings.map((o) => (
            <div key={o.id} className="portal-card">
              <h3 className="portal-card-title">
                Starts {formatDate(o.startsAt)}
              </h3>
              <div className="portal-card-meta" style={{ marginBottom: 12 }}>
                <span>Ends {formatDate(o.endsAt)}</span>
                <span>{formatMoney(o.price, o.currency)}</span>
                <span>{o.capacity} seats</span>
              </div>
              <button
                type="button"
                className="portal-btn"
                disabled={applyFlow.isApplying}
                onClick={() => applyFlow.apply(o.id)}
              >
                {applyFlow.isApplying
                  ? "Preparing payment…"
                  : `Enroll & Pay ${formatMoney(o.price, o.currency)}`}
              </button>
            </div>
          ))}
        </div>
      )}

      {applyFlow.pendingOrder?.salesOrderId && (
        <StripePaymentModal
          orderId={applyFlow.pendingOrder.salesOrderId}
          title={applyFlow.pendingOrder.title}
          amount={applyFlow.pendingOrder.amountDue}
          currency={applyFlow.pendingOrder.currency}
          onClose={applyFlow.closePayment}
          onPaid={applyFlow.onPaid}
        />
      )}
    </PortalPage>
  );
}
