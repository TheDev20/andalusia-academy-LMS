import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/** React-query keys owned by the admin dashboard. */
export const adminKeys = {
  all: ["admin"] as const,
  users: (role: string) => ["admin", "users", role] as const,
  courses: ["admin", "courses"] as const,
  offerings: ["admin", "offerings"] as const,
  offering: (id: string) => ["admin", "offerings", id] as const,
  locations: ["admin", "locations"] as const,
  sessions: (offeringId: string) => ["admin", "sessions", offeringId] as const,
  resources: (offeringId: string) => ["admin", "resources", offeringId] as const,
  orders: ["admin", "orders"] as const,
};

/**
 * Mutation that invalidates the given query keys on success and exposes the last error for ErrorAlert.
 */
export function useAdminMutation<TVariables, TResult>(
  fn: (variables: TVariables) => Promise<TResult>,
  invalidate: readonly (readonly unknown[])[],
  onSuccess?: (result: TResult) => void,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async (result) => {
      await Promise.all(invalidate.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
      onSuccess?.(result);
    },
  });
}

export function Pagination({
  pageNumber,
  totalPages,
  onChange,
}: {
  pageNumber: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav className="portal-row" aria-label="Pagination" style={{ justifyContent: "flex-end", marginTop: 12 }}>
      <button
        type="button"
        className="portal-btn portal-btn-secondary portal-btn-sm"
        disabled={pageNumber <= 1}
        onClick={() => onChange(pageNumber - 1)}
      >
        Previous
      </button>
      <span style={{ fontSize: 13, color: "#7a6e60" }}>
        Page {pageNumber} of {totalPages}
      </span>
      <button
        type="button"
        className="portal-btn portal-btn-secondary portal-btn-sm"
        disabled={pageNumber >= totalPages}
        onClick={() => onChange(pageNumber + 1)}
      >
        Next
      </button>
    </nav>
  );
}

/** Search box that applies on submit (avoids a request per keystroke). */
export function SearchBar({ label, onSearch }: { label: string; onSearch: (term: string) => void }) {
  const [term, setTerm] = useState("");
  return (
    <form
      className="portal-row"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(term.trim());
      }}
    >
      <input
        className="portal-input"
        type="search"
        aria-label={label}
        placeholder={label}
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        style={{ minWidth: 220 }}
      />
      <button type="submit" className="portal-btn portal-btn-secondary portal-btn-sm">
        Search
      </button>
    </form>
  );
}

/** Lowercase kebab-case slug matching the API rule ^[a-z0-9]+(?:-[a-z0-9]+)*$. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 160);
}
