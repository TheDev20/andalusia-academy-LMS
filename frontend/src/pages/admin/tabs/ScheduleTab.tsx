import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { EmptyState, ErrorAlert, Field, LoadingState, StatusBadge } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import { formatDate, formatMoney } from "../../../utils/format";
import { adminKeys } from "../adminShared";
import OfferingFormModal from "../forms/OfferingFormModal";
import LocationsSection from "./LocationsSection";

export default function ScheduleTab() {
  const [courseId, setCourseId] = useState("");
  const [creating, setCreating] = useState(false);

  const courses = useQuery({
    queryKey: [...adminKeys.courses, "all-for-select"],
    queryFn: ({ signal }) => adminApi.listCourses({ pageSize: 100 }, signal),
  });

  const offerings = useQuery({
    queryKey: [...adminKeys.offerings, courseId],
    queryFn: ({ signal }) => adminApi.listOfferings(courseId || undefined, signal),
  });

  return (
    <section aria-label="Schedule">
      <div className="portal-row-between" style={{ marginBottom: 14, alignItems: "flex-end" }}>
        <Field label="Filter by course">
          {(id) => (
            <select id={id} className="portal-select" value={courseId} onChange={(e) => setCourseId(e.target.value)} style={{ minWidth: 240 }}>
              <option value="">All courses</option>
              {courses.data?.items.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          )}
        </Field>
        <button type="button" className="portal-btn" onClick={() => setCreating(true)}>
          <Plus size={16} aria-hidden="true" /> New offering
        </button>
      </div>

      <ErrorAlert error={offerings.error ?? courses.error} />

      {offerings.isLoading ? (
        <LoadingState label="Loading offerings…" />
      ) : !offerings.data || offerings.data.length === 0 ? (
        <EmptyState title="No offerings scheduled" />
      ) : (
        <div className="portal-table-wrap">
          <table className="portal-table">
            <thead>
              <tr>
                <th scope="col">Course</th>
                <th scope="col">Dates</th>
                <th scope="col">Price</th>
                <th scope="col">Seats</th>
                <th scope="col">Status</th>
                <th scope="col">Instructors</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {offerings.data.map((o) => (
                <tr key={o.id}>
                  <td>{o.courseTitle}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatDate(o.startsAt)} – {formatDate(o.endsAt)}
                  </td>
                  <td>{formatMoney(o.price, o.currency)}</td>
                  <td>
                    {o.seatsTaken} / {o.capacity}
                  </td>
                  <td>
                    <StatusBadge status={o.status} />
                  </td>
                  <td>{o.instructors.length ? o.instructors.map((i) => i.name).join(", ") : "—"}</td>
                  <td>
                    <Link to={`/admin/offerings/${o.id}`} className="portal-btn portal-btn-secondary portal-btn-sm">
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <LocationsSection />

      {creating && <OfferingFormModal defaultCourseId={courseId || undefined} onClose={() => setCreating(false)} />}
    </section>
  );
}
