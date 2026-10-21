import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EmptyState, ErrorAlert, LoadingState } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { AdminLocationDto } from "../../../types/operations";
import { adminKeys } from "../adminShared";
import LocationFormModal from "../forms/LocationFormModal";

export default function LocationsSection() {
  const [editing, setEditing] = useState<AdminLocationDto | "new" | null>(null);
  const locations = useQuery({
    queryKey: adminKeys.locations,
    queryFn: ({ signal }) => adminApi.listLocations(signal),
  });

  return (
    <section aria-labelledby="admin-locations-title">
      <div className="portal-row-between">
        <h2 className="portal-section-title" id="admin-locations-title">
          Locations
        </h2>
        <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditing("new")}>
          <Plus size={14} aria-hidden="true" /> New location
        </button>
      </div>
      <ErrorAlert error={locations.error} />
      {locations.isLoading ? (
        <LoadingState label="Loading locations…" />
      ) : !locations.data || locations.data.length === 0 ? (
        <EmptyState title="No locations yet" />
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Address</th>
                <th scope="col">Meeting URL</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.data.map((l) => (
                <tr key={l.id}>
                  <td>{l.name}</td>
                  <td>{l.address ?? "—"}</td>
                  <td>
                    {l.meetingUrl ? (
                      <a href={l.meetingUrl} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <button type="button" className="portal-btn portal-btn-secondary portal-btn-sm" onClick={() => setEditing(l)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editing && <LocationFormModal location={editing === "new" ? undefined : editing} onClose={() => setEditing(null)} />}
    </section>
  );
}
