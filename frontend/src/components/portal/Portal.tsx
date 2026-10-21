import { ReactNode, useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, X } from "lucide-react";
import "./portal.css";

export function PortalPage({
  eyebrow,
  title,
  subtitle,
  actions,
  backTo,
  backLabel,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  actions?: ReactNode;
  backTo?: string;
  backLabel?: string;
  children: ReactNode;
}) {
  return (
    <div className="portal-page">
      <div className="portal-container">
        {backTo && (
          <Link to={backTo} className="portal-back">
            <ArrowLeft size={15} aria-hidden="true" /> {backLabel ?? "Back"}
          </Link>
        )}
        <div className="portal-header">
          <div>
            {eyebrow && <div className="portal-eyebrow">{eyebrow}</div>}
            <h1 className="portal-title">{title}</h1>
            {subtitle && <p className="portal-subtitle">{subtitle}</p>}
          </div>
          {actions && <div className="portal-row">{actions}</div>}
        </div>
        {children}
      </div>
    </div>
  );
}

export interface TabItem<T extends string> {
  id: T;
  label: string;
}

export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
  label,
}: {
  tabs: TabItem<T>[];
  active: T;
  onChange: (id: T) => void;
  label: string;
}) {
  return (
    <div className="portal-tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === active}
          className="portal-tab"
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="portal-loading" role="status">
      <Loader2 size={18} className="portal-spin" aria-hidden="true" /> {label}
    </div>
  );
}

export function ErrorAlert({ error }: { error: unknown }) {
  if (!error) return null;
  const message = error instanceof Error ? error.message : String(error);
  return (
    <div className="portal-alert portal-alert-error" role="alert">
      {message}
    </div>
  );
}

export function SuccessAlert({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <div className="portal-alert portal-alert-success" role="status">
      {message}
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="portal-empty">
      <h2 className="portal-empty-title">{title}</h2>
      {children}
    </div>
  );
}

const BADGE_TONES: Record<string, string> = {
  Accepted: "success", Active: "success", Paid: "success", Published: "success", Succeeded: "success",
  Present: "success", Completed: "success",
  Submitted: "warning", PendingPayment: "warning", Planned: "warning", Draft: "warning", Late: "warning",
  Scheduled: "info", Excused: "info", Initiated: "info",
  Cancelled: "danger", Expired: "danger", Rejected: "danger", Failed: "danger", Absent: "danger",
  Closed: "danger", Archived: "danger", Inactive: "danger",
};

const STATUS_LABELS: Record<string, string> = { PendingPayment: "Pending payment" };

export function StatusBadge({ status }: { status?: string | null }) {
  if (!status) return <span className="portal-badge">—</span>;
  const tone = BADGE_TONES[status];
  return <span className={`portal-badge${tone ? ` portal-badge-${tone}` : ""}`}>{STATUS_LABELS[status] ?? status}</span>;
}

export function ProgressBar({ percent, label }: { percent: number; label: string }) {
  const value = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="portal-row-between" style={{ fontSize: 13, color: "#7a6e60", marginBottom: 5 }}>
        <span>{label}</span>
        <strong style={{ color: "#271e16" }}>{value}%</strong>
      </div>
      <div className="portal-progress" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <span style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLElement>("input, select, textarea, button")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="portal-modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="portal-modal" role="dialog" aria-modal="true" aria-labelledby={titleId} ref={dialogRef}>
        <div className="portal-modal-header">
          <h2 className="portal-modal-title" id={titleId}>
            {title}
          </h2>
          <button type="button" className="portal-icon-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string | null;
  children: (id: string) => ReactNode;
}) {
  const id = useId();
  return (
    <div className="portal-field">
      <label className="portal-label" htmlFor={id}>
        {label}
      </label>
      {children(id)}
      {error && <span className="portal-field-error">{error}</span>}
    </div>
  );
}
