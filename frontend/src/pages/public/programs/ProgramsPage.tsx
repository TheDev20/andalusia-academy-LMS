import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { fetchCatalogPrograms } from "../../../services/catalogService";
import { useDebounce } from "../../../hooks/useDebounce";
import { EmptyState, ErrorAlert, LoadingState, PortalPage } from "../../../components/portal/Portal";
import { formatDate, formatMoney } from "../../../utils/format";

const PAGE_SIZE = 9;

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ["catalogPrograms", debounced, page],
    queryFn: ({ signal }) => fetchCatalogPrograms({ searchTerm: debounced, pageNumber: page, pageSize: PAGE_SIZE }, signal),
  });

  return (
    <PortalPage
      eyebrow="Catalog"
      title="Programs"
      subtitle="Multi-course programs that take you from fundamentals to job-ready, with a cohort and a schedule."
      actions={
        <div className="portal-row">
          <Link to="/courses" className="portal-btn portal-btn-secondary">Browse single courses</Link>
          <Link to="/career-paths" className="portal-btn portal-btn-secondary">Explore career paths</Link>
        </div>
      }
    >
      <div className="portal-field" style={{ maxWidth: 420, marginBottom: 20 }}>
        <label className="portal-label" htmlFor="program-search">Search programs</label>
        <div style={{ position: "relative" }}>
          <Search size={16} aria-hidden="true" style={{ position: "absolute", left: 11, top: 11, color: "#6f6456" }} />
          <input
            id="program-search"
            className="portal-input"
            style={{ paddingLeft: 34, width: "100%" }}
            value={search}
            placeholder="e.g. data, cloud, full-stack"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
      </div>

      <ErrorAlert error={error} />
      {isLoading ? (
        <LoadingState label="Loading programs…" />
      ) : !data || data.items.length === 0 ? (
        <EmptyState title="No programs match your search" />
      ) : (
        <>
          <div className="portal-grid">
            {data.items.map((p) => (
              <article key={p.id} className="portal-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <div className="portal-card-meta">{p.categories.join(" · ")}</div>
                <h2 className="portal-card-title">
                  <Link to={`/programs/${p.slug}`} style={{ color: "inherit" }}>{p.title}</Link>
                </h2>
                <p style={{ margin: 0, color: "#43392f", fontSize: 14 }}>{p.description}</p>
                <div className="portal-card-meta">
                  <span>{p.coursesCount} courses</span>
                  {p.startingPrice != null && <span>Tuition from {formatMoney(p.startingPrice, "USD")}</span>}
                  {p.nextOfferingDate && <span>Next intake {formatDate(p.nextOfferingDate)}</span>}
                </div>
                <div style={{ marginTop: "auto" }}>
                  <Link to={`/programs/${p.slug}`} className="portal-btn portal-btn-sm">View program</Link>
                </div>
              </article>
            ))}
          </div>
          {data.totalPages > 1 && (
            <nav className="portal-row" aria-label="Pagination" style={{ marginTop: 20, justifyContent: "center" }}>
              <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" disabled={!data.hasPreviousPage}
                onClick={() => setPage((p) => p - 1)}>Previous</button>
              <span style={{ fontSize: 14 }}>Page {data.pageNumber} of {data.totalPages}</span>
              <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" disabled={!data.hasNextPage}
                onClick={() => setPage((p) => p + 1)}>Next</button>
            </nav>
          )}
        </>
      )}
    </PortalPage>
  );
}
