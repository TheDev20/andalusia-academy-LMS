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
import { admissionsApi } from "../../../services/api/admissionsApi";
import { ApplicationDto } from "../../../types/admissions";
import PaymentSimulationModal from "../../../components/ui/PaymentSimulationModal/PaymentSimulationModal";
import "./DashboardPage.css";

type DashboardTab = "learning" | "applications" | "payments";

export default function DashboardPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<DashboardTab>("learning");
  const [selectedOrder, setSelectedOrder] = useState<ApplicationDto | null>(null);

  const { data: myLearning = [], isLoading: loadingLearning } = useQuery({
    queryKey: ["myLearning"],
    queryFn: admissionsApi.getMyLearning,
  });

  const { data: myApplications = [], isLoading: loadingApps } = useQuery({
    queryKey: ["myApplications"],
    queryFn: admissionsApi.getMyApplications,
  });

  const { data: myPayments = [], isLoading: loadingPayments } = useQuery({
    queryKey: ["myPayments"],
    queryFn: admissionsApi.getMyPayments,
  });

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
            <div className="dashboard-eyebrow">Learner Portal</div>
            <h1 className="dashboard-title">
              Welcome back, {user?.fullName || "Scholar"}
            </h1>
          </div>
          <Link to="/courses" className="dash-btn">
            <span>Browse Catalog</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        <div className="dashboard-tabs" role="tablist">
          <button
            type="button"
            className={`dashboard-tab-btn ${activeTab === "learning" ? "is-active" : ""}`}
            onClick={() => setActiveTab("learning")}
          >
            <BookOpen size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            My Learning ({myLearning.length})
          </button>
          <button
            type="button"
            className={`dashboard-tab-btn ${activeTab === "applications" ? "is-active" : ""}`}
            onClick={() => setActiveTab("applications")}
          >
            <FileText size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Applications ({myApplications.length})
          </button>
          <button
            type="button"
            className={`dashboard-tab-btn ${activeTab === "payments" ? "is-active" : ""}`}
            onClick={() => setActiveTab("payments")}
          >
            <CreditCard size={14} style={{ marginRight: 6, verticalAlign: "middle" }} />
            Payments ({myPayments.length})
          </button>
        </div>

        {activeTab === "learning" && (
          <div>
            {loadingLearning ? (
              <p>Loading your enrolled courses...</p>
            ) : myLearning.length === 0 ? (
              <div className="dash-empty">
                <h3>No active enrollments yet</h3>
                <p>Apply to a course and verify tuition payment to unlock your learning track.</p>
              </div>
            ) : (
              <div className="dashboard-grid">
                {myLearning.map((item) => (
                  <div key={item.learningEnrollmentId} className="dash-card">
                    <div>
                      <span className="dash-badge active">
                        <CheckCircle2 size={12} /> {item.status}
                      </span>
                      <h3 className="dash-card-title">{item.title}</h3>
                      <div className="dash-meta">
                        <span>Discipline: {item.category}</span>
                        <span>
                          Cohort Starts:{" "}
                          {new Date(item.startsAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/courses/${item.courseId}/syllabus`}
                      className="dash-btn"
                    >
                      <span>Open Course Syllabus</span>
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
            {loadingApps ? (
              <p>Loading your applications...</p>
            ) : myApplications.length === 0 ? (
              <div className="dash-empty">
                <h3>No applications submitted</h3>
                <p>Select any course from the catalog to submit an admission application.</p>
              </div>
            ) : (
              <div className="dashboard-grid">
                {myApplications.map((app) => {
                  const isPaid = app.orderStatus === "Paid";
                  return (
                    <div key={app.id} className="dash-card">
                      <div>
                        <span
                          className={`dash-badge ${isPaid ? "approved" : "pending"}`}
                        >
                          {isPaid ? (
                            <>
                              <CheckCircle2 size={12} /> Approved &amp; Enrolled
                            </>
                          ) : (
                            <>
                              <Clock size={12} /> Pending Tuition Payment
                            </>
                          )}
                        </span>
                        <h3 className="dash-card-title">{app.title}</h3>
                        <div className="dash-meta">
                          <span>
                            Submitted:{" "}
                            {new Date(app.submittedAt).toLocaleDateString()}
                          </span>
                          <span>
                            Tuition: {app.currency} {app.amountDue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                      {!isPaid && app.salesOrderId && (
                        <button
                          type="button"
                          className="dash-btn"
                          onClick={() => setSelectedOrder(app)}
                        >
                          <CreditCard size={14} />
                          <span>Pay Tuition Now</span>
                        </button>
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
            {loadingPayments ? (
              <p>Loading payment history...</p>
            ) : myPayments.length === 0 ? (
              <div className="dash-empty">
                <h3>No payment records</h3>
                <p>Completed tuition receipts will appear here.</p>
              </div>
            ) : (
              <div className="dashboard-grid">
                {myPayments.map((pay) => (
                  <div key={pay.id} className="dash-card">
                    <div>
                      <span className="dash-badge settled">
                        <CheckCircle2 size={12} /> {pay.status}
                      </span>
                      <h3 className="dash-card-title">{pay.title}</h3>
                      <div className="dash-meta">
                        <span>
                          Amount: {pay.currency} {pay.amount.toLocaleString()}
                        </span>
                        <span>Receipt ID: {pay.providerPaymentId}</span>
                        <span>
                          Date:{" "}
                          {new Date(
                            pay.settledAt || pay.createdAt,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedOrder && selectedOrder.salesOrderId && (
        <PaymentSimulationModal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          salesOrderId={selectedOrder.salesOrderId}
          courseTitle={selectedOrder.title}
          amount={selectedOrder.amountDue}
          currency={selectedOrder.currency}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
