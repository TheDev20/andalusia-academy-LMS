import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EmptyState, ErrorAlert, LoadingState } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { TechDisciplineDto } from "../../../types/operations";
import { adminKeys, SearchBar } from "../adminShared";
import DisciplineFormModal from "../forms/DisciplineFormModal";

export default function DisciplinesTab() {
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TechDisciplineDto | "new" | null>(null);

  const disciplines = useQuery({
    queryKey: adminKeys.disciplines,
    queryFn: ({ signal }) => adminApi.listDisciplines(signal),
  });

  const filtered = useMemo(() => {
    if (!disciplines.data) return [];
    if (!search.trim()) return disciplines.data;
    const term = search.toLowerCase();
    return disciplines.data.filter(
      (d) => d.title.toLowerCase().includes(term) || d.slug.toLowerCase().includes(term),
    );
  }, [disciplines.data, search]);

  return (
    <section aria-label="Tech Disciplines">
      <div className="portal-row-between" style={{ marginBottom: 14 }}>
        <SearchBar
          label="Search disciplines by title or slug"
          onSearch={(term) => setSearch(term)}
        />
        <button type="button" className="portal-btn" onClick={() => setEditing("new")}>
          <Plus size={15} aria-hidden="true" /> New discipline
        </button>
      </div>

      <ErrorAlert error={disciplines.error} />

      {disciplines.isLoading ? (
        <LoadingState label="Loading disciplines…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No disciplines found" />
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Slug</th>
                <th scope="col">Icon</th>
                <th scope="col">Description</th>
                <th scope="col">Programs</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id}>
                  <td>
                    <strong>{d.title}</strong>
                  </td>
                  <td>
                    <code>{d.slug}</code>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, background: "#f0ebe1", padding: "2px 8px", borderRadius: 4 }}>
                      {d.icon}
                    </span>
                  </td>
                  <td style={{ maxWidth: 300, whiteSpace: "normal", fontSize: 13, color: "#5c4f3d" }}>
                    {d.description}
                  </td>
                  <td>{d.countDisplay || `${d.programsCount ?? 0} Programs`}</td>
                  <td>
                    <button
                      type="button"
                      className="portal-btn portal-btn-secondary portal-btn-sm"
                      onClick={() => setEditing(d)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <DisciplineFormModal
          discipline={editing === "new" ? undefined : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}
