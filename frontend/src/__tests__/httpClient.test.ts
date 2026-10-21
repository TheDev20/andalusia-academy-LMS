import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, SESSION_EXPIRED_EVENT, apiRequest, toQuery } from "../services/api/httpClient";
import { tokenStore } from "../services/api/tokenStore";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}

describe("apiRequest", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.restoreAllMocks());

  it("sends the bearer token and JSON body", async () => {
    tokenStore.save("tok-123", { id: "u", email: "a@b.c", firstName: "A", lastName: "B", fullName: "A B", roles: [], permissions: [] });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(200, { ok: true }));

    await apiRequest("/api/x", { method: "POST", body: { a: 1 }, headers: { "Idempotency-Key": "k1" } });

    const [, init] = fetchMock.mock.calls[0];
    const headers = init?.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer tok-123");
    expect(headers["Idempotency-Key"]).toBe("k1");
    expect(init?.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("omits the token for anonymous calls", async () => {
    tokenStore.save("tok-123", { id: "u", email: "a@b.c", firstName: "A", lastName: "B", fullName: "A B", roles: [], permissions: [] });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(200, {}));

    await apiRequest("/api/auth/login", { method: "POST", body: {}, auth: false });

    expect((fetchMock.mock.calls[0][1]?.headers as Record<string, string>).Authorization).toBeUndefined();
  });

  it("maps problem details to ApiError with the detail message and field errors", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      jsonResponse(400, { title: "One or more validation errors occurred.", errors: { Email: ["The Email field is not a valid e-mail address."] } }),
    );

    const error = (await apiRequest("/api/auth/register", { method: "POST", body: {} }).catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(400);
    expect(error.message).toBe("The Email field is not a valid e-mail address.");
    expect(error.fieldErrors.Email).toHaveLength(1);
  });

  it("prefers the problem detail over the title", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(jsonResponse(409, { title: "Conflict", detail: "This offering is fully booked." }));
    await expect(apiRequest("/api/applications", { method: "POST", body: {} })).rejects.toThrow("This offering is fully booked.");
  });

  it("broadcasts session expiry on 401 for authenticated calls only", async () => {
    const listener = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, listener);
    vi.spyOn(globalThis, "fetch").mockImplementation(async () => jsonResponse(401, {}));

    await apiRequest("/api/me/profile").catch(() => undefined);
    expect(listener).not.toHaveBeenCalled();

    tokenStore.save("revoked", { id: "u", email: "a@b.c", firstName: "A", lastName: "B", fullName: "A B", roles: [], permissions: [] });
    await apiRequest("/api/me/profile").catch(() => undefined);
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener(SESSION_EXPIRED_EVENT, listener);
  });

  it("returns undefined for 204 responses", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 204 }));
    await expect(apiRequest("/api/auth/logout", { method: "POST" })).resolves.toBeUndefined();
  });
});

describe("toQuery", () => {
  it("skips empty values and encodes the rest", () => {
    expect(toQuery({ search: "a b", role: undefined, pageNumber: 2, status: "" })).toBe("?search=a+b&pageNumber=2");
    expect(toQuery({})).toBe("");
  });
});
