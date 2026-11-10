import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCourseDetail } from "../../../services/catalogService";
import { useAuth } from "../../../context/AuthContext";
import { admissionsApi } from "../../../services/api/admissionsApi";
import { ApiError } from "../../../services/api/httpClient";
import { ApplicationDto } from "../../../types/admissions";
import StripePaymentModal from "../../../components/ui/StripePaymentModal/StripePaymentModal";
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
import { formatMoney } from "../../../utils/format";
import "./SyllabusPage.css";

export default function SyllabusPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeOrder, setActiveOrder] = useState<ApplicationDto | null>(null);
  const [enrollError, setEnrollError] = useState<string | null>(null);

  const isKnownSlug = !!(courseId && PROGRAM_SYLLABI[courseId]);

  const { data: courseDetail, isLoading } = useQuery({
    queryKey: ["courseDetail", courseId],
    queryFn: ({ signal }) => fetchCourseDetail(courseId!, signal),
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });

  const { data: openOfferings = [] } = useQuery({
    queryKey: ["openOfferings", courseId],
    queryFn: () => admissionsApi.getOpenOfferings(courseId!),
    enabled: !!courseId,
    staleTime: 60 * 1000,
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

  const courseOffering = openOfferings.find(
    (offering) => offering.seatsRemaining > 0,
  );
  const enrollLabel = courseOffering
    ? `Enroll & Pay ${formatMoney(courseOffering.price, courseOffering.currency)}`
    : "Enroll in Upcoming Cohort";

  const handleDownloadPdf = () => {
    if (!syllabus) return;
    setDownloadSuccess(true);
    const blobContent = `ANDALUSIA ACADEMY - OFFICIAL SYLLABUS\n\nProgram: ${syllabus.title}\nCategory: ${syllabus.category}\nDuration: ${syllabus.duration}\nNext Intake: ${syllabus.intake}\nRating: ${syllabus.rating}/5.0\n\nOVERVIEW:\n${syllabus.overview}\n\nMODULES:\n${syllabus.modules
      .map(
        (m) =>
          `[${m.number}] ${m.title} (${m.duration})\nSummary: ${m.summary}\nTopics:\n${m.topics
            .map((t) => ` - ${t}`)
            .join(
              "\n",
            )}\nHands-on Lab: ${m.handsOnLab?.title || "Comprehensive Lab"} - ${
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

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }

    const slug = courseDetail?.slug ?? courseId;
    if (!slug) return;

    try {
      setEnrollError(null);
      // Only intakes that are published, not yet started and with seats left can be applied for.
      const offerings = await admissionsApi.getOpenOfferings(slug);
      const offering = offerings.find((o) => o.seatsRemaining > 0);
      if (!offering) {
        setEnrollError(
          offerings.length > 0
            ? "All upcoming cohorts for this course are fully booked."
            : "There is no upcoming cohort open for applications yet.",
        );
        return;
      }

      try {
        setActiveOrder(await admissionsApi.submitApplication(offering.id));
      } catch (err) {
        if (!(err instanceof ApiError) || err.status !== 409) throw err;
        // Already applied: resume the existing application instead of failing.
        const existing = (await admissionsApi.getMyApplications()).find(
          (a) =>
            offerings.some((o) => o.id === a.offeringId) &&
            (a.status === "Submitted" || a.status === "Accepted"),
        );
        if (existing?.status === "Submitted") {
          setActiveOrder(await admissionsApi.checkout(existing.id));
        } else if (existing?.status === "Accepted") {
          navigate("/dashboard");
        } else {
          throw err;
        }
      }
    } catch (err) {
      setEnrollError(
        err instanceof Error ? err.message : "Failed to submit application.",
      );
    }
  };

  if (isLoading && !isKnownSlug) {
    return (
      <div className="syllabus-state-container">
        <Loader2 size={32} className="syllabus-spin-icon" />
        <h3 className="syllabus-state-title">
          Loading program curriculum &amp; syllabus...
        </h3>
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
      {enrollError && (
        <div
          style={{
            background: "#fef2f2",
            borderBottom: "1px solid #fecaca",
            color: "#b91c1c",
            textAlign: "center",
            padding: "12px 20px",
            fontWeight: 600,
          }}
        >
          {enrollError}
        </div>
      )}

      {/* 1. Hero Section with Breadcrumbs & Floating Aside Card */}
      <SyllabusHero
        syllabus={syllabus}
        onEnroll={handleEnroll}
        enrollLabel={enrollLabel}
      />

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
        enrollLabel={enrollLabel}
        onDownload={handleDownloadPdf}
        downloadSuccess={downloadSuccess}
      />

      {enrollError && (
        <div style={{ textAlign: "center", color: "#b91c1c", padding: "12px" }}>
          {enrollError}
        </div>
      )}

      {activeOrder && activeOrder.salesOrderId && (
        <StripePaymentModal
          orderId={activeOrder.salesOrderId}
          title={activeOrder.title}
          amount={activeOrder.amountDue}
          currency={activeOrder.currency}
          onClose={() => setActiveOrder(null)}
          onPaid={() => navigate("/dashboard")}
        />
      )}
    </div>
  );
}
