import {
  ApplicationDto,
  CreatePaymentAttemptRequest,
  PaymentAttemptDto,
  EnrolledCourseDto,
} from "../../types/admissions";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_profile");
    window.location.href = "/login";
    throw new Error("Your session has expired. Please log in again.");
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.title || err.message || "Request failed");
  }
  return res.json();
}

export const admissionsApi = {
  submitApplication: async (offeringId: string): Promise<ApplicationDto> => {
    const res = await fetch("/api/v1/applications", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ offeringId }),
    });
    return handleResponse<ApplicationDto>(res);
  },

  getMyApplications: async (): Promise<ApplicationDto[]> => {
    const res = await fetch("/api/v1/applications/my", {
      headers: getAuthHeaders(),
    });
    return handleResponse<ApplicationDto[]>(res);
  },

  submitPaymentAttempt: async (
    data: CreatePaymentAttemptRequest,
  ): Promise<PaymentAttemptDto> => {
    const res = await fetch("/api/v1/payments/attempt", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<PaymentAttemptDto>(res);
  },

  getMyPayments: async (): Promise<PaymentAttemptDto[]> => {
    const res = await fetch("/api/v1/payments/my", {
      headers: getAuthHeaders(),
    });
    return handleResponse<PaymentAttemptDto[]>(res);
  },

  getMyLearning: async (): Promise<EnrolledCourseDto[]> => {
    const res = await fetch("/api/v1/enrollments/my-learning", {
      headers: getAuthHeaders(),
    });
    return handleResponse<EnrolledCourseDto[]>(res);
  },
};
