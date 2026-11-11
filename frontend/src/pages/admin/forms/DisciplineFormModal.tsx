import { FormEvent, useMemo, useState } from "react";
import {
  Code2,
  Brain,
  Database,
  Cloud,
  ShieldCheck,
  Smartphone,
  Gamepad2,
  Atom,
  Cpu,
  Palette,
  Boxes,
  Network,
  Terminal,
  Globe,
  Dna,
  Bot,
  Radio,
  Server,
  Layers,
  Sparkles,
  Search,
  type LucideIcon,
} from "lucide-react";
import { ErrorAlert, Field, Modal } from "../../../components/portal/Portal";
import { adminApi } from "../../../services/api/adminApi";
import type { TechDisciplineDto, UpsertTechDisciplineRequest } from "../../../types/operations";
import { adminKeys, useAdminMutation } from "../adminShared";

interface IconDefinition {
  value: string;
  label: string;
  keywords: string;
  component: LucideIcon;
}

const AVAILABLE_ICONS: IconDefinition[] = [
  { value: "Code2", label: "Software Engineering", keywords: "code programming dev software web", component: Code2 },
  { value: "Brain", label: "AI & Machine Learning", keywords: "ai ml intelligence deep neural models", component: Brain },
  { value: "Database", label: "Data Science", keywords: "data analytics sql bi database", component: Database },
  { value: "Cloud", label: "Cloud & DevOps", keywords: "cloud aws azure devops infra serverless", component: Cloud },
  { value: "ShieldCheck", label: "Cybersecurity", keywords: "security hacking sec defense auth shield", component: ShieldCheck },
  { value: "Smartphone", label: "Mobile Dev", keywords: "mobile android ios flutter react native app", component: Smartphone },
  { value: "Gamepad2", label: "Game Dev & XR", keywords: "game unity unreal 3d vr ar xr simulation", component: Gamepad2 },
  { value: "Atom", label: "Quantum Computing", keywords: "quantum physics science simulation qiskit", component: Atom },
  { value: "Cpu", label: "Robotics & Hardware", keywords: "hardware robotics iot embedded sensors cpu", component: Cpu },
  { value: "Bot", label: "AI Agents", keywords: "bot automation rpa agent robotics workflow", component: Bot },
  { value: "Palette", label: "UI/UX Design", keywords: "design ui ux figma product creative", component: Palette },
  { value: "Boxes", label: "Blockchain & Web3", keywords: "blockchain web3 crypto smart contracts", component: Boxes },
  { value: "Terminal", label: "Systems & Linux", keywords: "linux bash shell sysadmin unix terminal cli", component: Terminal },
  { value: "Network", label: "Networking & Telecom", keywords: "network cisco protocol internet telecom", component: Network },
  { value: "Globe", label: "Web Technologies", keywords: "web html internet front api globe", component: Globe },
  { value: "Dna", label: "Bioinformatics", keywords: "bio bioinformatics genetics dna health pharma", component: Dna },
  { value: "Server", label: "Infrastructure", keywords: "backend server api sql microservices", component: Server },
  { value: "Layers", label: "Full-Stack Architecture", keywords: "architecture fullstack system layers", component: Layers },
  { value: "Radio", label: "IoT & Wireless", keywords: "iot wireless signals rf communication radio", component: Radio },
  { value: "Sparkles", label: "Emerging Tech", keywords: "emerging innovation tech future ai", component: Sparkles },
];

export default function DisciplineFormModal({
  discipline,
  onClose,
}: {
  discipline?: TechDisciplineDto;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UpsertTechDisciplineRequest>({
    title: discipline?.title ?? "",
    description: discipline?.description ?? "",
    icon: discipline?.icon ?? "Code2",
  });
  const [iconSearch, setIconSearch] = useState("");

  const filteredIcons = useMemo(() => {
    const term = iconSearch.toLowerCase().trim();
    if (!term) return AVAILABLE_ICONS;
    return AVAILABLE_ICONS.filter(
      (i) =>
        i.label.toLowerCase().includes(term) ||
        i.value.toLowerCase().includes(term) ||
        i.keywords.includes(term),
    );
  }, [iconSearch]);

  const save = useAdminMutation(
    async (request: UpsertTechDisciplineRequest) => {
      if (discipline) {
        await adminApi.updateDiscipline(discipline.id, request);
      } else {
        await adminApi.createDiscipline(request);
      }
    },
    [adminKeys.disciplines, ["catalog", "disciplines"]],
    onClose,
  );

  const submit = (e: FormEvent) => {
    e.preventDefault();
    save.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      icon: form.icon,
    });
  };

  return (
    <Modal title={discipline ? "Edit Tech Discipline" : "New Tech Discipline"} onClose={onClose}>
      <ErrorAlert error={save.error} />
      <form className="portal-form" onSubmit={submit}>
        <Field label="Discipline Title">
          {(id) => (
            <input
              id={id}
              className="portal-input"
              required
              maxLength={100}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Quantum Computing"
            />
          )}
        </Field>
        <Field label="Card Description">
          {(id) => (
            <textarea
              id={id}
              className="portal-textarea"
              required
              maxLength={1000}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="Brief overview of this discipline for the homepage card..."
            />
          )}
        </Field>
        <Field label="Discipline Icon">
          {() => (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <div style={{ position: "relative" }}>
                <Search
                  size={16}
                  style={{
                    position: "absolute",
                    left: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#8a7a68",
                    pointerEvents: "none",
                  }}
                />
                <input
                  type="text"
                  className="portal-input"
                  style={{ paddingLeft: "32px", fontSize: "0.85rem" }}
                  placeholder="Filter icons (e.g. quantum, game, design, robot)..."
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(135px, 1fr))",
                  gap: "0.45rem",
                  maxHeight: "185px",
                  overflowY: "auto",
                  padding: "4px",
                  border: "1px solid #e0d8cc",
                  borderRadius: "8px",
                  backgroundColor: "#fdfbf7",
                }}
              >
                {filteredIcons.map((item) => {
                  const Icon = item.component;
                  const isSelected = form.icon === item.value;
                  return (
                    <button
                      key={item.value}
                      type="button"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.45rem 0.6rem",
                        borderRadius: "6px",
                        border: isSelected ? "2px solid #b5833e" : "1px solid #e6decb",
                        backgroundColor: isSelected ? "#f5edd8" : "#ffffff",
                        color: isSelected ? "#70480e" : "#3d342c",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s ease",
                      }}
                      onClick={() => setForm((f) => ({ ...f, icon: item.value }))}
                    >
                      <Icon size={20} style={{ flexShrink: 0, color: isSelected ? "#9c6b23" : "#6e5d4e" }} />
                      <span
                        style={{
                          fontSize: "0.78rem",
                          fontWeight: isSelected ? 600 : 400,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.label}
                      </span>
                    </button>
                  );
                })}
                {filteredIcons.length === 0 && (
                  <div style={{ gridColumn: "1 / -1", padding: "1rem", textAlign: "center", color: "#8a7a68", fontSize: "0.82rem" }}>
                    No icons match "{iconSearch}".
                  </div>
                )}
              </div>
            </div>
          )}
        </Field>
        <div className="portal-row" style={{ justifyContent: "flex-end" }}>
          <button type="button" className="portal-btn portal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="portal-btn" disabled={save.isPending}>
            {save.isPending ? "Saving…" : "Save Discipline"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
