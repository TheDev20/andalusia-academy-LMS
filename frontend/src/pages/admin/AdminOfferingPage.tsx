import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { ErrorAlert, LoadingState, PortalPage, StatusBadge } from "../../components/portal/Portal";
import { adminApi } from "../../services/api/adminApi";
import { formatDateTime, formatMoney } from "../../utils/format";
import { adminKeys } from "./adminShared";
import OfferingFormModal from "./forms/OfferingFormModal";
import InstructorsSection from "./offering/InstructorsSection";
import SessionsSection from "./offering/SessionsSection";
import ResourcesSection from "./offering/ResourcesSection";

export default function AdminOfferingPage() {
  const { offeringId = "" } = useParams<{ offeringId: string }>();
  const [editing, setEditing] = useState(false);

  const offering = useQuery({
    queryKey: adminKeys.offering(offeringId),
    queryFn: ({ signal }) => adminApi.getOffering(offeringId, signal),
    enabled: !!offeringId,
  });

  const o = offering.data;

  return (
    <PortalPage
      title={o ? o.courseTitle : "Offering"}
      subtitle={o ? `${formatDateTime(o.startsAt)} – ${formatDateTime(o.endsAt)} (${o.timeZoneId})` : undefined}
      backTo="/admin"
      backLabel="Back to administration"
      actions={
        o && (
          <button type="button" className="portal-btn" onClick={() => setEditing(true)}>
            <Pencil size={14} aria-hidden="true" /> Edit offering
          </button>
        )
      }
    >
      <ErrorAlert error={offering.error} />
      {offering.isLoading && <LoadingState label="Loading offering…" />}
      {o && (
        <>
          <div className="portal-card">
            <div className="portal-card-meta" style={{ fontSize: 14 }}>
              <span>
                Status: <StatusBadge status={o.status} />
              </span>
              <span>Price: {formatMoney(o.price, o.currency)}</span>
              <span>
                Seats: {o.seatsTaken} taken of {o.capacity}
              </span>
            </div>
          </div>
          <InstructorsSection offering={o} />
          <SessionsSection offeringId={o.id} />
          <ResourcesSection offeringId={o.id} />
          {editing && <OfferingFormModal offering={o} onClose={() => setEditing(false)} />}
        </>
      )}
    </PortalPage>
  );
}
