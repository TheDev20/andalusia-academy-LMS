import { useState, useEffect, useMemo } from "react";
import type { Course } from "../../../../../../types/course";
import { getProgramSyllabus, ProgramSyllabusDetails } from "./syllabusData";
import { SyllabusHeader } from "./components/SyllabusHeader";
import { SyllabusStatsStrip } from "./components/SyllabusStatsStrip";
import { SyllabusTabsNav, TabType } from "./components/SyllabusTabsNav";
import { CurriculumTab } from "./components/CurriculumTab";
import { LabsTab } from "./components/LabsTab";
import { TechStackTab } from "./components/TechStackTab";
import { CareerTab } from "./components/CareerTab";
import { SyllabusFooter } from "./components/SyllabusFooter";
import "./SyllabusModal.css";

export interface SyllabusModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll?: (course: Course) => void;
}

export default function SyllabusModal({
  course,
  isOpen,
  onClose,
  onEnroll,
}: SyllabusModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("curriculum");
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Retrieve rich syllabus details
  const syllabus: ProgramSyllabusDetails | null = useMemo(() => {
    if (!course) return null;
    return getProgramSyllabus(course.id, course.title, course.category);
  }, [course]);

  // Expand all modules by default when a new course is selected
  useEffect(() => {
    if (syllabus) {
      const initialExpanded: Record<string, boolean> = {};
      syllabus.modules.forEach((mod) => {
        initialExpanded[mod.id] = true;
      });
      setExpandedModules(initialExpanded);
      setActiveTab("curriculum");
      setDownloadSuccess(false);
    }
  }, [syllabus]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !course || !syllabus) return null;

  const toggleModule = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const isAllExpanded = Object.values(expandedModules).every(Boolean);

  const toggleAllModules = () => {
    const next: Record<string, boolean> = {};
    syllabus.modules.forEach((m) => {
      next[m.id] = !isAllExpanded;
    });
    setExpandedModules(next);
  };

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    const blobContent = `ANDALUSIA ACADEMY - OFFICIAL SYLLABUS\n\nProgram: ${syllabus.title}\nCategory: ${syllabus.category}\nDuration: ${syllabus.duration}\nNext Intake: ${syllabus.intake}\nRating: ${syllabus.rating}/5.0\n\nOVERVIEW:\n${syllabus.overview}\n\nMODULES:\n${syllabus.modules
      .map(
        (m) =>
          `[${m.number}] ${m.title} (${m.duration})\nSummary: ${m.summary}\nTopics:\n${m.topics
            .map((t) => ` - ${t}`)
            .join("\n")}\nHands-on Lab: ${m.handsOnLab.title} - ${
            m.handsOnLab.description
          }\n`
      )
      .join("\n")}\n\nCAPSTONE:\n${syllabus.capstoneProject.title}\n${syllabus.capstoneProject.description}\n`;

    const blob = new Blob([blobContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${syllabus.courseId}-official-syllabus.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => {
      setDownloadSuccess(false);
    }, 3500);
  };

  return (
    <div
      className="syllabus-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="syllabus-modal-title"
    >
      <div
        className="syllabus-modal-window"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header Bar */}
        <SyllabusHeader syllabus={syllabus} onClose={onClose}>
          <SyllabusStatsStrip syllabus={syllabus} />
        </SyllabusHeader>

        {/* Navigation Tabs Bar */}
        <SyllabusTabsNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          modulesCount={syllabus.modules.length}
          technologiesCount={syllabus.technologies.length}
        />

        {/* Scrollable Body Content */}
        <div className="syllabus-modal-body">
          {activeTab === "curriculum" && (
            <CurriculumTab
              syllabus={syllabus}
              expandedModules={expandedModules}
              onToggleModule={toggleModule}
              onToggleAllModules={toggleAllModules}
              isAllExpanded={isAllExpanded}
            />
          )}

          {activeTab === "labs" && <LabsTab syllabus={syllabus} />}

          {activeTab === "tech" && <TechStackTab syllabus={syllabus} />}

          {activeTab === "career" && <CareerTab syllabus={syllabus} />}
        </div>

        {/* Modal Sticky Bottom Action Bar */}
        <SyllabusFooter
          syllabus={syllabus}
          downloadSuccess={downloadSuccess}
          onDownload={handleDownloadPdf}
          onEnroll={() => {
            onClose();
            if (onEnroll) {
              onEnroll(course);
            }
          }}
        />
      </div>
    </div>
  );
}
