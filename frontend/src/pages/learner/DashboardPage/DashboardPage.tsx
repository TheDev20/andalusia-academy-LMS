import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  FileText,
  CreditCard,
  ArrowUpRight,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../../../components/ui/Empty";
import { admissionsApi } from "../../../services/api/admissionsApi";
import { ErrorAlert, ProgressBar } from "../../../components/portal/Portal";
import { formatDate, formatDateTime, formatMoney } from "../../../utils/format";
import { ApplicationDto } from "../../../types/admissions";
import StripePaymentModal from "../../../components/ui/StripePaymentModal/StripePaymentModal";
import "./DashboardPage.css";

type DashboardTab = "learning" | "applications" | "payments";

export default function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DashboardTab>("learning");
  const [selectedOrder, setSelectedOrder] = useState<ApplicationDto | null>(null);
  const [actionError, setActionError] = useState<unknown>(null);
  const [busyApplicationId, setBusyApplicationId] = useState<string | null>(null);

  const { data: myLearning = [], isLoading: loadingLearning, error: learningError } = useQuery({
    queryKey: ["myLearning"],
    queryFn: admissionsApi.getMyLearning,
  });

  const { data: myApplications = [], isLoading: loadingApps, error: appsError } = useQuery({
    queryKey: ["myApplications"],
    queryFn: admissionsApi.getMyApplications,
  });

  const { data: myPayments = [], isLoading: loadingPayments, error: paymentsError } = useQuery({
    queryKey: ["myPayments"],
    queryFn: admissionsApi.getMyPayments,
  });

  const refreshApplications = () => {
    queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    queryClient.invalidateQueries({ queryKey: ["myPayments"] });
  };

  /** Opens the payment modal, creating the sales order first if the application has none yet. */
  const handlePay = async (app: ApplicationDto) => {
    setActionError(null);
    if (app.salesOrderId) {
      setSelectedOrder(app);
      return;
    }
    setBusyApplicationId(app.id);
    try {
      setSelectedOrder(await admissionsApi.checkout(app.id));
      refreshApplications();
    } catch (err) {
      setActionError(err);
      refreshApplications();
    } finally {
      setBusyApplicationId(null);
    }
  };

  const handleCancel = async (app: ApplicationDto) => {
    if (!window.confirm(`Withdraw your application for "${app.title}"? Your held seat will be released.`)) return;
    setActionError(null);
    setBusyApplicationId(app.id);
    try {
      await admissionsApi.cancelApplication(app.id);
    } catch (err) {
      setActionError(err);
    } finally {
      setBusyApplicationId(null);
      refreshApplications();
    }
  };

  const handlePaymentClosed = () => {
    setSelectedOrder(null);
    refreshApplications();
  };

  const handlePaymentSuccess = () => {
    setSelectedOrder(null);
    queryClient.invalidateQueries({ queryKey: ["myLearning"] });
    queryClient.invalidateQueries({ queryKey: ["myApplications"] });
    queryClient.invalidateQueries({ queryKey: ["myPayments"] });
    setActiveTab("learning");
  };

  return (
    <div className="learner-dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              Welcome back, {user?.fullName || "Scholar"}
            </h1>
          </div>
          <Link to="/courses" className="dash-btn">
            <span>Browse Catalog</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="dashboard-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "learning"}
            className={`dashboard-tab-btn ${activeTab === "learning" ? "is-active" : ""}`}
            onClick={() => setActiveTab("learning")}
          >
            <BookOpen size={14} />
            My Learning ({myLearning.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "applications"}
            className={`dashboard-tab-btn ${activeTab === "applications" ? "is-active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            <FileText size={14} />
            Applications ({myApplications.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "payments"}
            className={`dashboard-tab-btn ${activeTab === "payments" ? "is-active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <CreditCard size={14} />
            Payments ({myPayments.length})
          </button>
        </div>

        <ErrorAlert error={actionError} />

        {activeTab === "learning" && (
          <div>
            <ErrorAlert error={learningError} />
            {loadingLearning ? (
              <p>Loading your enrolled courses...</p>
            ) : myLearning.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <BookOpen size={20} aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No active enrollments yet</EmptyTitle>
                  <EmptyDescription>Apply to a course and verify tuition payment to unlock your learning track.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="dashboard-grid">
                {myLearning.map((item) => (
                  <div key={item.learningEnrollmentId} className="dash-card">
                    <div>
                      <span className="dash-badge active">
                        <CheckCircle2 size={14} /> {item.status}
                      </span>
                      <h2 className="dash-card-title">{item.courseTitle}</h2>
                      <div className="dash-meta">
                        {item.category && <span>Discipline: {item.category}</span>}
                        <span>Cohort starts: {formatDate(item.startsAt)}</span>
                        <span>Next session: {formatDateTime(item.nextSessionAt)}</span>
                      </div>
                      <div style={{ marginTop: 12 }}>
                        <ProgressBar percent={item.progress.overallPercent} label="Course progress" />
                      </div>
                    </div>
                    <Link to={`/learn/${item.courseOfferingId}`} className="dash-btn">
                      <span>Open Course</span>
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "applications" && (
          <div>
            <ErrorAlert error={appsError} />
            {loadingApps ? (
              <p>Loading your applications...</p>
            ) : myApplications.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FileText size={20} aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No applications submitted</EmptyTitle>
                  <EmptyDescription>Select any course from the catalog to submit an admission application.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="dashboard-grid">
                {myApplications.map((app) => {
                  const isAccepted = app.status === "Accepted";
                  const isOpen = app.status === "Submitted";
                  const busy = busyApplicationId === app.id;
                  return (
                    <div key={app.id} className="dash-card">
                      <div>
                        <span className={`dash-badge ${isAccepted ? "approved" : "pending"}`}>
                          {isAccepted ? (
                            <>
                              <CheckCircle2 size={14} /> Accepted &amp; Enrolled
                            </>
                          ) : isOpen ? (
                            <>
                              <Clock size={14} /> Awaiting Tuition Payment
                            </>
                          ) : (
                            <>{app.status}</>
                          )}
                        </span>
                        <h2 className="dash-card-title">{app.title}</h2>
                        <div className="dash-meta">
                          <span>Submitted: {formatDate(app.submittedAt)}</span>
                          <span>Tuition: {formatMoney(app.amountDue, app.currency)}</span>
                          {isOpen && app.seatHeldUntil && (
                            <span>Seat held until: {formatDateTime(app.seatHeldUntil)}</span>
                          )}
                        </div>
                      </div>
                      {isOpen && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button type="button" className="dash-btn" disabled={busy} onClick={() => handlePay(app)}>
                            <CreditCard size={14} />
                            <span>Pay Tuition Now</span>
                          </button>
                          <button
                            type="button"
                            className="dash-btn"
                            style={{ background: "#fff", color: "#43392f", border: "1px solid #ded6c8" }}
                            disabled={busy}
                            onClick={() => handleCancel(app)}
                          >
                            Withdraw
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div>
            <ErrorAlert error={paymentsError} />
            {loadingPayments ? (
              <p>Loading payment history...</p>
            ) : myPayments.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <CreditCard size={20} aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>No payment records</EmptyTitle>
                  <EmptyDescription>Completed tuition receipts will appear here.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <div className="dashboard-grid">
                {myPayments.map((pay) => (
                  <div key={pay.id} className="dash-card">
                    <div>
                      <span className={`dash-badge ${pay.status === "Succeeded" ? "settled" : "pending"}`}>
                        {pay.status === "Succeeded" && <CheckCircle2 size={14} />} {pay.status}
                      </span>
                      <h2 className="dash-card-title">{pay.title}</h2>
                      <div className="dash-meta">
                        <span>Amount: {formatMoney(pay.amount, pay.currency)}</span>
                        <span>Receipt ID: {pay.providerPaymentId ?? "—"}</span>
                        <span>Date: {formatDateTime(pay.settledAt || pay.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedOrder?.salesOrderId && (
        <StripePaymentModal
          orderId={selectedOrder.salesOrderId}
          title={selectedOrder.title}
          amount={selectedOrder.amountDue}
          currency={selectedOrder.currency}
          onClose={handlePaymentClosed}
          onPaid={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
