import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseDetail } from "../../../services/catalogService";
import {
  getProgramSyllabus,
  PROGRAM_SYLLABI,
} from "../home/sections/FeaturedCoursesSection/SyllabusModal/syllabusData";
import { SyllabusHero } from "./syllabus/components/SyllabusHero/SyllabusHero";
import { SyllabusSectionNav } from "./syllabus/components/SyllabusSectionNav/SyllabusSectionNav";
import { SyllabusCurriculumSection } from "./syllabus/components/SyllabusCurriculum/SyllabusCurriculumSection";
import { SyllabusLabsSection } from "./syllabus/components/SyllabusLabs/SyllabusLabsSection";
import { SyllabusTechSection } from "./syllabus/components/SyllabusTech/SyllabusTechSection";
import { SyllabusOutcomesSection } from "./syllabus/components/SyllabusOutcomes/SyllabusOutcomesSection";
import { SyllabusClosingCta } from "./syllabus/components/SyllabusClosingCta/SyllabusClosingCta";
import { Loader2 } from "lucide-react";
import "./SyllabusPage.css";

export default function SyllabusPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [downloadSuccess, setDownloadSuccess] = useState(false);

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

  const handleDownloadPdf = () => {
    if (!syllabus) return;
    setDownloadSuccess(true);
    const blobContent = `ANDALUSIA ACADEMY - OFFICIAL SYLLABUS\n\nProgram: ${syllabus.title}\nCategory: ${syllabus.category}\nDuration: ${syllabus.duration}\nNext Intake: ${syllabus.intake}\nRating: ${syllabus.rating}/5.0\n\nOVERVIEW:\n${syllabus.overview}\n\nMODULES:\n${syllabus.modules
      .map(
        (m) =>
          `[${m.number}] ${m.title} (${m.duration})\nSummary: ${m.summary}\nTopics:\n${m.topics
            .map((t) => ` - ${t}`)
            .join("\n")}\nHands-on Lab: ${m.handsOnLab?.title || "Comprehensive Lab"} - ${
            m.handsOnLab?.description || "Applied exercises"
          }\n`,
      )
      .join("\n")}\n\nTECHNOLOGIES MASTERED:\n${syllabus.technologies.join(
      ", ",
    )}\n\nCAREER OUTCOMES:\nRoles: ${syllabus.careerOutcomes?.targetRoles.join(
      ", ",
    )}\nSalary Benchmark: ${syllabus.careerOutcomes?.averageSalaryRange}\n`;

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

  const handleEnroll = () => {
    // Scroll smoothly to the enroll card or advisor info
    const el = document.getElementById("enroll");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="syllabus-state-container">
        <Loader2 size={36} className="syllabus-spin-icon" />
        <h3 className="syllabus-state-title">Loading program curriculum &amp; syllabus...</h3>
      </div>
    );
  }

  if (!syllabus) {
    return (
      <div className="syllabus-state-container">
        <h2 className="syllabus-state-title">Course syllabus not found</h2>
        <p className="syllabus-state-subtitle">
          We couldn't locate the curriculum details for this program.
        </p>
        <Link to="/courses" className="syllabus-back-btn">
          &larr; Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="syllabus-page-viewport">
      {/* 1. Hero Section with Breadcrumbs & Floating Aside Card */}
      <SyllabusHero syllabus={syllabus} onEnroll={handleEnroll} />

      {/* 2. Sticky Tab Bar */}
      <SyllabusSectionNav
        modulesCount={syllabus.modules.length}
        technologiesCount={syllabus.technologies.length}
      />

      {/* 3. Main Content Grid Sections */}
      <main className="syllabus-main-body">
        <SyllabusCurriculumSection syllabus={syllabus} />
        <SyllabusLabsSection syllabus={syllabus} />
        <SyllabusTechSection syllabus={syllabus} />
        <SyllabusOutcomesSection syllabus={syllabus} />
      </main>

      {/* 4. Closing Enrollment CTA Card */}
      <SyllabusClosingCta
        syllabus={syllabus}
        onEnroll={handleEnroll}
        onDownload={handleDownloadPdf}
        downloadSuccess={downloadSuccess}
      />
    </div>
  );
}
