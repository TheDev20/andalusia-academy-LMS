import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseDetail } from "../../../services/catalogService";
import {
  getProgramSyllabus,
  PROGRAM_SYLLABI,
} from "../home/sections/FeaturedCoursesSection/SyllabusModal/syllabusData";
import { SyllabusHeader } from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/SyllabusHeader";
import { SyllabusStatsStrip } from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/SyllabusStatsStrip";
import {
  SyllabusTabsNav,
  TabType,
} from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/SyllabusTabsNav";
import { CurriculumTab } from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/CurriculumTab";
import { LabsTab } from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/LabsTab";
import { TechStackTab } from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/TechStackTab";
import { CareerTab } from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/CareerTab";
import { SyllabusFooter } from "../home/sections/FeaturedCoursesSection/SyllabusModal/components/SyllabusFooter";
import { ArrowLeft, Loader2 } from "lucide-react";
import "./SyllabusPage.css";

export default function SyllabusPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>("curriculum");
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({});

  const isKnownSlug = !!(courseId && PROGRAM_SYLLABI[courseId]);

  // If courseId is a GUID or not a known slug, fetch its details from the catalog API
  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ["courseDetail", courseId],
    queryFn: ({ signal }) => fetchCourseDetail(courseId!, signal),
    enabled: !!courseId && !isKnownSlug,
    staleTime: 5 * 60 * 1000,
  });

  const syllabus = useMemo(() => {
    if (!courseId) return null;
    if (isKnownSlug) {
      return PROGRAM_SYLLABI[courseId];
    }
    if (courseDetail) {
      const primaryCategory =
        courseDetail.categories?.[0] || "Software Engineering";
      return getProgramSyllabus(
        courseDetail.slug || courseId,
        courseDetail.title,
        primaryCategory,
      );
    }
    return null;
  }, [courseId, isKnownSlug, courseDetail]);

  if (isLoading) {
    return (
      <div
        className="section-container"
        style={{ padding: "120px 20px", textAlign: "center" }}
      >
        <Loader2
          size={36}
          className="spin-icon"
          style={{
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
            color: "var(--color-gold, #c59b27)",
          }}
        />
        <h3>Loading program curriculum & syllabus...</h3>
      </div>
    );
  }

  if (!syllabus) {
    return (
      <div
        className="section-container"
        style={{ padding: "80px 20px", textAlign: "center" }}
      >
        <h2>Course syllabus not found</h2>
        <Link
          to="/courses"
          style={{ marginTop: "20px", display: "inline-block" }}
        >
          &larr; Back to Courses
        </Link>
      </div>
    );
  }

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isAllExpanded = Object.values(expandedModules).every(Boolean);
  const toggleAllModules = () => {
    const next: Record<string, boolean> = {};
    syllabus.modules.forEach((m) => {
      next[m.id] = !isAllExpanded;
    });
    setExpandedModules(next);
  };

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setDownloadSuccess(true);
    const blobContent = `ANDALUSIA ACADEMY - OFFICIAL SYLLABUS\n\nProgram: ${syllabus.title}\nCategory: ${syllabus.category}\nDuration: ${syllabus.duration}\nNext Intake: ${syllabus.intake}\nRating: ${syllabus.rating}/5.0\n\nOVERVIEW:\n${syllabus.overview}\n\nMODULES:\n${syllabus.modules
      .map(
        (m) =>
          `[${m.number}] ${m.title} (${m.duration})\nSummary: ${m.summary}\nTopics:\n${m.topics
            .map((t) => ` - ${t}`)
            .join("\n")}\nHands-on Lab: ${m.handsOnLab.title} - ${
            m.handsOnLab.description
          }\n`,
      )
      .join("\n")}`;

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
    <div className="syllabus-page-wrapper section-container">
      <Link to="/courses" className="back-to-courses-btn">
        <ArrowLeft size={16} /> Back to Programs
      </Link>

      <div className="syllabus-full-card">
        <SyllabusHeader syllabus={syllabus}>
          <SyllabusStatsStrip syllabus={syllabus} />
        </SyllabusHeader>

        <SyllabusTabsNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          modulesCount={syllabus.modules.length}
          technologiesCount={syllabus.technologies.length}
        />

        <div className="syllabus-tab-container">
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

        <SyllabusFooter
          syllabus={syllabus}
          onEnroll={() => {}}
          onDownload={handleDownloadPdf}
          downloadSuccess={downloadSuccess}
        />
      </div>
    </div>
  );
}
