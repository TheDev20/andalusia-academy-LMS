import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, SESSION_EXPIRED_EVENT } from "../services/api/httpClient";
import { filesApi } from "../services/api/filesApi";
import { learningApi } from "../services/api/learningApi";
import { tokenStore } from "../services/api/tokenStore";

const user = { id: "u", email: "a@b.c", firstName: "A", lastName: "B", fullName: "A B", roles: [], permissions: [] };

describe("filesApi.download", () => {
  beforeEach(() => {
    localStorage.clear();
    tokenStore.save("tok-9", user);
    URL.createObjectURL = vi.fn(() => "blob:fake");
    URL.revokeObjectURL = vi.fn();
  });
  afterEach(() => vi.restoreAllMocks());

  it("fetches with the bearer token and saves under the original file name", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("pdf-bytes", { status: 200 }));
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe("my report.pdf");
      expect(this.href).toContain("blob:fake");
    });

    await filesApi.download({ id: "f-1", fileName: "my report.pdf" });

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/files/f-1");
    expect((init?.headers as Record<string, string>).Authorization).toBe("Bearer tok-9");
    expect(click).toHaveBeenCalledOnce();
    expect(document.querySelector("a[download]")).toBeNull();
  });

  it("surfaces a 403 as an ApiError and saves nothing", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "You do not have access to this file." }), { status: 403, headers: { "Content-Type": "application/json" } }),
    );
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click");

    const error = (await filesApi.download({ id: "f-1", fileName: "x.pdf" }).catch((e: unknown) => e)) as ApiError;

    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(403);
    expect(error.message).toBe("You do not have access to this file.");
    expect(click).not.toHaveBeenCalled();
  });

  it("signals an expired session on 401", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}", { status: 401, headers: { "Content-Type": "application/json" } }));
    const handler = vi.fn();
    window.addEventListener(SESSION_EXPIRED_EVENT, handler);

    await filesApi.download({ id: "f-1", fileName: "x.pdf" }).catch(() => undefined);

    expect(handler).toHaveBeenCalledOnce();
    window.removeEventListener(SESSION_EXPIRED_EVENT, handler);
  });
});

describe("learningApi.submitAssignment", () => {
  beforeEach(() => {
    localStorage.clear();
    tokenStore.save("tok-9", user);
  });
  afterEach(() => vi.restoreAllMocks());

  const ok = () => new Response(JSON.stringify({ id: "s" }), { status: 201, headers: { "Content-Type": "application/json" } });

  it("sends text-only attempts as JSON to the original endpoint", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok());

    await learningApi.submitAssignment("a-1", "my answer");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/learning/assignments/a-1/submissions");
    expect(init?.body).toBe(JSON.stringify({ body: "my answer" }));
  });

  it("sends attempts with files as multipart form data without forcing a content type", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok());
    const pdf = new File(["%PDF-1.4"], "work.pdf", { type: "application/pdf" });

    await learningApi.submitAssignment("a-1", "see file", [pdf]);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/learning/assignments/a-1/submissions/upload");
    const form = init?.body as FormData;
    expect(form).toBeInstanceOf(FormData);
    expect(form.get("Body")).toBe("see file");
    expect((form.getAll("Files")[0] as File).name).toBe("work.pdf");
    // The browser must add the multipart boundary itself.
    expect((init?.headers as Record<string, string>)["Content-Type"]).toBeUndefined();
  });

  it("omits the body field when only files are sent", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(ok());

    await learningApi.submitAssignment("a-1", "", [new File(["x"], "a.txt")]);

    expect((fetchMock.mock.calls[0][1]?.body as FormData).has("Body")).toBe(false);
  });
});
