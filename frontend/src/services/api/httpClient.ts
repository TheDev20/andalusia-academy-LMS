import { tokenStore } from "./tokenStore";

export const API_BASE = ""; // Relative: Vite dev proxy forwards /api to the backend.

export const SESSION_EXPIRED_EVENT = "auth:session-expired";

export class ApiError extends Error {
  readonly status: number;
  readonly fieldErrors: Record<string, string[]>;

  constructor(
    status: number,
    message: string,
    fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

interface ProblemDetails {
  title?: string;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
  /** Defaults to true: send the bearer token if one is stored. */
  auth?: boolean;
}

const FALLBACK_MESSAGES: Record<number, string> = {
  401: "Please sign in to continue.",
  403: "You do not have permission to perform this action.",
  404: "The requested item was not found.",
  429: "Too many attempts. Please wait a minute and try again.",
  503: "This service is temporarily unavailable.",
};

async function toApiError(response: Response): Promise<ApiError> {
  const problem = (await response.json().catch(() => ({}))) as ProblemDetails;
  const fieldErrors = problem.errors ?? {};
  const firstFieldError = Object.values(fieldErrors)[0]?.[0];
  const message =
    problem.detail ||
    firstFieldError ||
    problem.message ||
    FALLBACK_MESSAGES[response.status] ||
    problem.title ||
    "Something went wrong. Please try again.";
  return new ApiError(response.status, message, fieldErrors);
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers = {}, signal, auth = true } = options;
  const token = auth ? tokenStore.getToken() : null;

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    signal,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      body !== undefined
        ? isFormData
          ? (body as BodyInit)
          : JSON.stringify(body)
        : undefined,
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw await toApiError(response);
  }

  if (
    response.status === 204 ||
    response.headers.get("content-length") === "0"
  ) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

/** Authenticated GET that returns the response body as a Blob (file downloads). */
export async function apiBlob(path: string, signal?: AbortSignal): Promise<Blob> {
  const token = tokenStore.getToken();
  const response = await fetch(`${API_BASE}${path}`, {
    method: "GET",
    signal,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    if (response.status === 401 && token) {
      window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
    }
    throw await toApiError(response);
  }

  return response.blob();
}

/** Builds a query string, skipping empty values. */
export function toQuery(
  params: Record<string, string | number | boolean | undefined | null>,
): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  }
  const text = search.toString();
  return text ? `?${text}` : "";
}
