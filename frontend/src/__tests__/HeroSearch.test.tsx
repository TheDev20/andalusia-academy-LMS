import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HeroSearch from "../pages/public/home/sections/HeroSection/HeroSearch";

const page = (items: unknown[]) => ({ items, totalCount: items.length, pageNumber: 1, pageSize: 5 });

function mockCatalog(courses: unknown[], programs: unknown[]) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => ({
      ok: true,
      json: async () => (String(url).includes("/programs") ? page(programs) : page(courses)),
    })),
  );
}

function Where() {
  const loc = useLocation();
  return <div data-testid="where">{loc.pathname + loc.search}</div>;
}

function renderSearch() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="*" element={<><HeroSearch /><Where /></>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const input = () => screen.getByRole("combobox");

describe("HeroSearch", () => {
  beforeEach(() => vi.unstubAllGlobals());
  afterEach(() => cleanup());

  it("lists matching courses and programs and opens the chosen page", async () => {
    mockCatalog(
      [{ id: "c1", slug: "python-ai", title: "Python for AI", categories: ["AI"] }],
      [{ id: "p1", slug: "ai-engineer", title: "AI Engineer Program", coursesCount: 4, categories: [] }],
    );
    renderSearch();
    fireEvent.change(input(), { target: { value: "ai" } });

    expect(await screen.findByRole("option", { name: /python for ai/i })).toBeTruthy();
    fireEvent.click(screen.getByRole("option", { name: /ai engineer program/i }));

    expect(screen.getByTestId("where").textContent).toBe("/programs/ai-engineer");
  });

  it("opens a course syllabus by slug", async () => {
    mockCatalog([{ id: "c1", slug: "python-ai", title: "Python for AI", categories: [] }], []);
    renderSearch();
    fireEvent.change(input(), { target: { value: "python" } });
    fireEvent.click(await screen.findByRole("option", { name: /python for ai/i }));

    expect(screen.getByTestId("where").textContent).toBe("/courses/python-ai/syllabus");
  });

  it("submitting without picking a suggestion opens the catalogue filtered by the query", async () => {
    mockCatalog([], []);
    renderSearch();
    fireEvent.change(input(), { target: { value: "rust lang" } });
    fireEvent.submit(input().closest("form")!);

    expect(screen.getByTestId("where").textContent).toBe("/courses?q=rust%20lang");
  });

  it("says so when nothing matches, and does not query for very short input", async () => {
    mockCatalog([], []);
    renderSearch();
    fireEvent.change(input(), { target: { value: "a" } });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(fetch).not.toHaveBeenCalled();

    fireEvent.change(input(), { target: { value: "zzzz" } });
    await waitFor(() => expect(screen.getByRole("status").textContent).toMatch(/no courses or programs match/i));
  });

  it("closes on Escape", async () => {
    mockCatalog([{ id: "c1", slug: "s", title: "Some Course", categories: [] }], []);
    renderSearch();
    fireEvent.change(input(), { target: { value: "some" } });
    await screen.findByRole("option", { name: /some course/i });
    fireEvent.keyDown(input(), { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
