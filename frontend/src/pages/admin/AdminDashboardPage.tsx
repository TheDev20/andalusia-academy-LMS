import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, GraduationCap, BookOpen, CalendarDays, CreditCard } from "lucide-react";
import { PortalPage, Tabs, type TabItem } from "../../components/portal/Portal";
import { useAuth } from "../../context/AuthContext";
import { adminApi } from "../../services/api/adminApi";
import { formatMoney } from "../../utils/format";
import { adminKeys } from "./adminShared";
import UsersTab from "./tabs/UsersTab";
import CoursesTab from "./tabs/CoursesTab";
import DisciplinesTab from "./tabs/DisciplinesTab";
import ScheduleTab from "./tabs/ScheduleTab";
import PaymentsTab from "./tabs/PaymentsTab";

type AdminTab = "students" | "instructors" | "courses" | "disciplines" | "schedule" | "payments";

/** Tabs are shown per permission (the API enforces the same permissions on every call). */
const TAB_PERMISSIONS: { tab: TabItem<AdminTab>; permission: string }[] = [
  { tab: { id: "students", label: "Students" }, permission: "users.manage" },
  { tab: { id: "instructors", label: "Instructors" }, permission: "users.manage" },
  { tab: { id: "courses", label: "Courses" }, permission: "courses.manage" },
  { tab: { id: "disciplines", label: "Disciplines" }, permission: "courses.manage" },
  { tab: { id: "schedule", label: "Schedule" }, permission: "schedules.manage" },
  { tab: { id: "payments", label: "Payments" }, permission: "payments.manage" },
];

export default function AdminDashboardPage() {
  const { user, hasPermission } = useAuth();
  const canUsers = hasPermission("users.manage");
  const canCourses = hasPermission("courses.manage");
  const canSchedules = hasPermission("schedules.manage");
  const canPayments = hasPermission("payments.manage");

  const tabs = useMemo(
    () => TAB_PERMISSIONS.filter((t) => hasPermission(t.permission)).map((t) => t.tab),
    [hasPermission],
  );
  const [selected, setSelected] = useState<AdminTab | null>(null);
  const active = selected && tabs.some((t) => t.id === selected) ? selected : tabs[0]?.id;

  const learnersKpi = useQuery({
    queryKey: [...adminKeys.users("Learner"), "", 1],
    queryFn: ({ signal }) => adminApi.listUsers({ role: "Learner", pageNumber: 1, pageSize: 20 }, signal),
    enabled: canUsers,
  });

  const instructorsKpi = useQuery({
    queryKey: [...adminKeys.users("Instructor"), "", 1],
    queryFn: ({ signal }) => adminApi.listUsers({ role: "Instructor", pageNumber: 1, pageSize: 20 }, signal),
    enabled: canUsers,
  });

  const coursesKpi = useQuery({
    queryKey: [...adminKeys.courses, "", 1],
    queryFn: ({ signal }) => adminApi.listCourses({ pageNumber: 1, pageSize: 20 }, signal),
    enabled: canCourses,
  });

  const offeringsKpi = useQuery({
    queryKey: [...adminKeys.offerings, ""],
    queryFn: ({ signal }) => adminApi.listOfferings(undefined, signal),
    enabled: canSchedules,
  });

  const paidOrdersKpi = useQuery({
    queryKey: [...adminKeys.orders, "Paid", "", 1],
    queryFn: ({ signal }) => adminApi.listOrders({ status: "Paid", pageNumber: 1, pageSize: 100 }, signal),
    enabled: canPayments,
  });

  const verifiedRevenueUsd = useMemo(() => {
    const items = paidOrdersKpi.data?.items ?? [];
    return items
      .filter((o) => o.currency.toUpperCase() === "USD")
      .reduce((sum, o) => sum + o.amountDue, 0);
  }, [paidOrdersKpi.data]);

  const totalSeatsTaken = useMemo(() => {
    return (offeringsKpi.data ?? []).reduce((sum, o) => sum + o.seatsTaken, 0);
  }, [offeringsKpi.data]);

  return (
    <PortalPage
      title={canUsers ? "Academy administration" : "Catalog & content management"}
      subtitle={`Signed in as ${user?.fullName ?? ""} — manage ${
        canUsers ? "students, instructors, courses, disciplines, schedules and payments." : "courses, cover media and technical disciplines."
      }`}
    >
      {tabs.length === 0 || !active ? (
        <div className="portal-alert portal-alert-info">Your role has no management permissions.</div>
      ) : (
        <>
          {/* Operational KPI Strip */}
          <div
            aria-label="Operational KPIs"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
              gap: 14,
              marginBottom: 24,
            }}
          >
            {canUsers && (
              <button
                type="button"
                onClick={() => setSelected("students")}
                className="portal-card"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  margin: 0,
                  borderColor: active === "students" ? "#8b6648" : "#ded6c8",
                }}
              >
                <div className="portal-row-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6f6456" }}>
                    Enrolled Students
                  </span>
                  <Users size={16} color="#8b6648" aria-hidden="true" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#271e16", fontFamily: "Libre Caslon Display, Georgia, serif" }}>
                  {learnersKpi.data?.totalCount ?? "—"}
                </div>
                <div style={{ fontSize: 12, color: "#6f6456", marginTop: 2 }}>Active learner accounts</div>
              </button>
            )}

            {canUsers && (
              <button
                type="button"
                onClick={() => setSelected("instructors")}
                className="portal-card"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  margin: 0,
                  borderColor: active === "instructors" ? "#8b6648" : "#ded6c8",
                }}
              >
                <div className="portal-row-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6f6456" }}>
                    Faculty &amp; Mentors
                  </span>
                  <GraduationCap size={16} color="#8b6648" aria-hidden="true" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#271e16", fontFamily: "Libre Caslon Display, Georgia, serif" }}>
                  {instructorsKpi.data?.totalCount ?? "—"}
                </div>
                <div style={{ fontSize: 12, color: "#6f6456", marginTop: 2 }}>Assigned instructors</div>
              </button>
            )}

            {canCourses && (
              <button
                type="button"
                onClick={() => setSelected("courses")}
                className="portal-card"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  margin: 0,
                  borderColor: active === "courses" ? "#8b6648" : "#ded6c8",
                }}
              >
                <div className="portal-row-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6f6456" }}>
                    Catalog Courses
                  </span>
                  <BookOpen size={16} color="#8b6648" aria-hidden="true" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#271e16", fontFamily: "Libre Caslon Display, Georgia, serif" }}>
                  {coursesKpi.data?.totalCount ?? "—"}
                </div>
                <div style={{ fontSize: 12, color: "#6f6456", marginTop: 2 }}>Published &amp; draft curricula</div>
              </button>
            )}

            {canSchedules && (
              <button
                type="button"
                onClick={() => setSelected("schedule")}
                className="portal-card"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  margin: 0,
                  borderColor: active === "schedule" ? "#8b6648" : "#ded6c8",
                }}
              >
                <div className="portal-row-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6f6456" }}>
                    Scheduled Cohorts
                  </span>
                  <CalendarDays size={16} color="#8b6648" aria-hidden="true" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#271e16", fontFamily: "Libre Caslon Display, Georgia, serif" }}>
                  {offeringsKpi.data?.length ?? "—"}
                </div>
                <div style={{ fontSize: 12, color: "#6f6456", marginTop: 2 }}>
                  {totalSeatsTaken} seats reserved / active
                </div>
              </button>
            )}

            {canPayments && (
              <button
                type="button"
                onClick={() => setSelected("payments")}
                className="portal-card"
                style={{
                  textAlign: "left",
                  cursor: "pointer",
                  margin: 0,
                  borderColor: active === "payments" ? "#8b6648" : "#ded6c8",
                }}
              >
                <div className="portal-row-between" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#6f6456" }}>
                    Verified Revenue
                  </span>
                  <CreditCard size={16} color="#8b6648" aria-hidden="true" />
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#271e16", fontFamily: "Libre Caslon Display, Georgia, serif" }}>
                  {paidOrdersKpi.data ? formatMoney(verifiedRevenueUsd, "USD") : "—"}
                </div>
                <div style={{ fontSize: 12, color: "#6f6456", marginTop: 2 }}>
                  {paidOrdersKpi.data?.totalCount ?? 0} settled orders
                </div>
              </button>
            )}
          </div>

          <Tabs label="Administration areas" tabs={tabs} active={active} onChange={setSelected} />
          <div role="tabpanel" aria-label={tabs.find((t) => t.id === active)?.label}>
            {active === "students" && <UsersTab key="Learner" role="Learner" />}
            {active === "instructors" && <UsersTab key="Instructor" role="Instructor" />}
            {active === "courses" && <CoursesTab />}
            {active === "disciplines" && <DisciplinesTab />}
            {active === "schedule" && <ScheduleTab />}
            {active === "payments" && <PaymentsTab />}
          </div>
        </>
      )}
    </PortalPage>
  );
}
