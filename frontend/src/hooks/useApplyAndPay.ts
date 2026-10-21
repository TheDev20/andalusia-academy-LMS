import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { admissionsApi } from "../services/api/admissionsApi";
import { ApiError } from "../services/api/httpClient";
import type { ApplicationDto } from "../types/admissions";

/**
 * Apply → checkout flow shared by course and program pages. Signs visitors in first, and resumes an
 * existing unpaid application instead of failing when the learner already applied.
 */
export function useApplyAndPay() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, hasRole } = useAuth();
  const [pendingOrder, setPendingOrder] = useState<ApplicationDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const apply = async (offeringId: string) => {
    setError(null);
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (!hasRole("Learner")) {
      setError("Only learner accounts can apply. Sign in with a learner account to enroll.");
      return;
    }

    setIsApplying(true);
    try {
      setPendingOrder(await admissionsApi.submitApplication(offeringId));
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        const existing = (await admissionsApi.getMyApplications().catch(() => [])).find(
          (a) => a.offeringId === offeringId && (a.status === "Submitted" || a.status === "Accepted"),
        );
        if (existing?.status === "Submitted") {
          setPendingOrder(await admissionsApi.checkout(existing.id).catch(() => existing));
          return;
        }
        if (existing?.status === "Accepted") {
          navigate("/dashboard");
          return;
        }
      }
      setError(err instanceof Error ? err.message : "Failed to submit your application.");
    } finally {
      setIsApplying(false);
    }
  };

  return {
    apply,
    isApplying,
    error,
    pendingOrder,
    closePayment: () => setPendingOrder(null),
    onPaid: () => {
      setPendingOrder(null);
      navigate("/dashboard");
    },
  };
}
