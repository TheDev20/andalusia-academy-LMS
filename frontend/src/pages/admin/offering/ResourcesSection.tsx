import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EmptyState, ErrorAlert, LoadingState } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminResourceDto } from "../../../types/operations";
import { adminKeys, useAdminMutation } from "../adminShared";
import ResourceFormModal from "../forms/ResourceFormModal";

export default function ResourcesSection({ offeringId }: { offeringId: string }) {
  const [editing, setEditing] = useState<AdminResourceDto | "new" | null>(null);

  const resources = useQuery({
    queryKey: adminKeys.resources(offeringId),
    queryFn: ({ signal }) => adminApi.listResources(offeringId, signal),
  });

  const remove = useAdminMutation((id: string) => adminApi.deleteResource(id), [adminKeys.resources(offeringId)]);
  const nextSequence = (resources.data ?? []).reduce((max, r) => Math.max(max, r.sequence), 0) + 1;

  return (
    <section aria-labelledby="offering-resources-title">
      <div className="portal-row-between">
        <h2 className="portal-section-title" id="offering-resources-title">
          Learning materials
        </h2>
        <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditing("new")}>
          <Plus size={14} aria-hidden="true" /> New material
        </button>
      </div>
      <ErrorAlert error={resources.error ?? remove.error} />
      {resources.isLoading ? (
        <LoadingState label="Loading materials…" />
      ) : !resources.data || resources.data.length === 0 ? (
        <EmptyState title="No learning materials yet" />
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Link</th>
                <th scope="col">Required</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {resources.data.map((r) => (
                <tr key={r.id}>
                  <td>{r.sequence}</td>
                  <td>{r.title}</td>
                  <td>
                    {r.url ? (
                      <a href={r.url} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{r.required ? "Yes" : "No"}</td>
                  <td>
                    <div className="portal-row" style={{ flexWrap: "nowrap" }}>
                      <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditing(r)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="portal-btn portal-btn-danger portal-btn-sm"
                        disabled={remove.isPending}
                        onClick={() => window.confirm(`Delete "${r.title}"?`) && remove.mutate(r.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && (
        <ResourceFormModal
          offeringId={offeringId}
          resource={editing === "new" ? undefined : editing}
          nextSequence={nextSequence}
          onClose={() => setEditing(null)}
        />
      )}
    </section>
  );
}
