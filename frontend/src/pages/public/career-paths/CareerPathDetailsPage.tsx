import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCareerPathDetail } from "../../../services/catalogService";
import { EmptyState, ErrorAlert, LoadingState, PortalPage } from "../../../components/portal/Portal";
import { formatDate } from "../../../utils/format";

export default function CareerPathDetailsPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { data: path, isLoading, error } = useQuery({
    queryKey: ["careerPathDetail", slug],
    queryFn: ({ signal }) => fetchCareerPathDetail(slug, signal),
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <PortalPage title="Loading career path…" backTo="/courses?tab=career-paths" backLabel="Back to Career Paths">
        <LoadingState />
      </PortalPage>
    );
  }

  if (error || !path) {
    return (
      <PortalPage title="Career path not found" backTo="/courses?tab=career-paths" backLabel="Back to Career Paths">
        <ErrorAlert error={error ?? new Error("This career path does not exist.")} />
      </PortalPage>
    );
  }

  return (
    <PortalPage title={path.title} subtitle={path.description} backTo="/courses?tab=career-paths" backLabel="Back to Career Paths">
      <h2 className="portal-section-title">Recommended programs</h2>
      {path.recommendedPrograms.length === 0 ? (
        <EmptyState title="No programs linked yet" />
      ) : (
        <div className="portal-grid">
          {path.recommendedPrograms.map((p) => (
            <article key={p.id} className="portal-card">
              <h3 className="portal-card-title">
                <Link to={`/programs/${p.slug}`} style={{ color: "inherit" }}>{p.title}</Link>
              </h3>
              <p style={{ margin: "0 0 8px", color: "#43392f", fontSize: 14 }}>{p.description}</p>
              <div className="portal-card-meta">
                <span>{p.coursesCount} courses</span>
                {p.nextOfferingDate && <span>Next intake {formatDate(p.nextOfferingDate)}</span>}
              </div>
            </article>
          ))}
        </div>
      )}

      <h2 className="portal-section-title">Recommended courses</h2>
      {path.recommendedCourses.length === 0 ? (
        <EmptyState title="No courses linked yet" />
      ) : (
        <div className="portal-grid">
          {path.recommendedCourses.map((c) => (
            <article key={c.id} className="portal-card">
              <div className="portal-card-meta">{c.categories.join(" · ")}</div>
              <h3 className="portal-card-title">
                <Link to={`/courses/${c.slug}/syllabus`} style={{ color: "inherit" }}>{c.title}</Link>
              </h3>
              <p style={{ margin: 0, color: "#43392f", fontSize: 14 }}>{c.description}</p>
            </article>
          ))}
        </div>
      )}
    </PortalPage>
  );
}
