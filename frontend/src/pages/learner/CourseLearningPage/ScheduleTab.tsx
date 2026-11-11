import { MapPin, Video } from "lucide-react";
import type { LearnerSessionDto } from "../../../types/learning";
import { EmptyState, StatusBadge } from "../../../components/portal/Portal";
import { formatDateTime } from "../../../utils/format";

export default function ScheduleTab({ sessions, timeZoneId }: { sessions: LearnerSessionDto[]; timeZoneId: string }) {
  if (sessions.length === 0) {
    return <EmptyState title="No sessions scheduled yet">Your instructor will publish the timetable soon.</EmptyState>;
  }

  return (
    <div className="portal-table-wrap" tabIndex={0}>
      <table className="portal-table">
        <caption className="sr-only" style={{ position: "absolute", left: -9999 }}>
          Session schedule (times shown in your local time; cohort time zone {timeZoneId})
        </caption>
        <thead>
          <tr>
            <th scope="col">Session</th>
            <th scope="col">When</th>
            <th scope="col">Where</th>
            <th scope="col">Status</th>
            <th scope="col">My attendance</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id}>
              <td>{s.title}</td>
              <td>
                {formatDateTime(s.startsAt)}
                <div style={{ fontSize: 12, color: "#6f6456" }}>until {formatDateTime(s.endsAt)}</div>
              </td>
              <td>
                {s.location ? (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <MapPin size={14} aria-hidden="true" /> {s.location.name}
                    </div>
                    {s.location.address && <div style={{ fontSize: 12, color: "#6f6456" }}>{s.location.address}</div>}
                    {s.location.meetingUrl && (
                      <a href={s.location.meetingUrl} target="_blank" rel="noreferrer" style={{ display: "inline-flex", gap: 4, alignItems: "center", fontSize: 13 }}>
                        <Video size={14} aria-hidden="true" /> Join online
                      </a>
                    )}
                  </div>
                ) : (
                  "To be announced"
                )}
              </td>
              <td><StatusBadge status={s.status} /></td>
              <td>{s.myAttendance ? <StatusBadge status={s.myAttendance} /> : <span style={{ color: "#6f6456" }}>Not recorded</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
