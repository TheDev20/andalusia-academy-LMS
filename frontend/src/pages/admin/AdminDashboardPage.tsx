import { useMemo, useState } from "react";
import { PortalPage, Tabs, type TabItem } from "../../components/portal/Portal";
import { useAuth } from "../../context/AuthContext";
import UsersTab from "./tabs/UsersTab";
import CoursesTab from "./tabs/CoursesTab";
import ScheduleTab from "./tabs/ScheduleTab";
import PaymentsTab from "./tabs/PaymentsTab";

type AdminTab = "students" | "instructors" | "courses" | "schedule" | "payments";

/** Tabs are shown per permission (the API enforces the same permissions on every call). */
const TAB_PERMISSIONS: { tab: TabItem<AdminTab>; permission: string }[] = [
  { tab: { id: "students", label: "Students" }, permission: "users.manage" },
  { tab: { id: "instructors", label: "Instructors" }, permission: "users.manage" },
  { tab: { id: "courses", label: "Courses" }, permission: "courses.manage" },
  { tab: { id: "schedule", label: "Schedule" }, permission: "schedules.manage" },
  { tab: { id: "payments", label: "Payments" }, permission: "payments.manage" },
];

export default function AdminDashboardPage() {
  const { user, hasPermission } = useAuth();
  const tabs = useMemo(
    () => TAB_PERMISSIONS.filter((t) => hasPermission(t.permission)).map((t) => t.tab),
    [hasPermission],
  );
  const [selected, setSelected] = useState<AdminTab | null>(null);
  const active = selected && tabs.some((t) => t.id === selected) ? selected : tabs[0]?.id;

  return (
    <PortalPage
      eyebrow="Management Portal"
      title="Academy administration"
      subtitle={`Signed in as ${user?.fullName ?? ""} — manage students, instructors, courses, schedules and payments.`}
    >
      {tabs.length === 0 || !active ? (
        <div className="portal-alert portal-alert-info">Your role has no management permissions.</div>
      ) : (
        <>
          <Tabs label="Administration areas" tabs={tabs} active={active} onChange={setSelected} />
          <div role="tabpanel" aria-label={tabs.find((t) => t.id === active)?.label}>
            {active === "students" && <UsersTab key="Learner" role="Learner" />}
            {active === "instructors" && <UsersTab key="Instructor" role="Instructor" />}
            {active === "courses" && <CoursesTab />}
            {active === "schedule" && <ScheduleTab />}
            {active === "payments" && <PaymentsTab />}
          </div>
        </>
      )}
    </PortalPage>
  );
}
