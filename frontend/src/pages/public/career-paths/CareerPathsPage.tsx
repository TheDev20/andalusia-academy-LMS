import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCareerPaths } from "../../../services/catalogService";
import { EmptyState, ErrorAlert, LoadingState, PortalPage } from "../../../components/portal/Portal";

export default function CareerPathsPage() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["careerPaths"],
    queryFn: ({ signal }) => fetchCareerPaths(signal),
  });

  return (
    <PortalPage
      eyebrow="Catalog"
      title="Career paths"
      subtitle="Pick the role you want; each path recommends the programs and courses that get you there."
      actions={
        <div className="portal-row">
          <Link to="/courses" className="portal-btn portal-btn-secondary">Browse single courses</Link>
          <Link to="/programs" className="portal-btn portal-btn-secondary">Browse programs</Link>
        </div>
      }
    >
      <ErrorAlert error={error} />
      {isLoading ? (
        <LoadingState label="Loading career paths…" />
      ) : data.length === 0 ? (
        <EmptyState title="Career paths are coming soon" />
      ) : (
        <div className="portal-grid">
          {data.map((path) => (
            <article key={path.id} className="portal-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <h2 className="portal-card-title">
                <Link to={`/career-paths/${path.slug}`} style={{ color: "inherit" }}>{path.title}</Link>
              </h2>
              <p style={{ margin: 0, color: "#43392f", fontSize: 14 }}>{path.description}</p>
              {path.recommendedSkillTags.length > 0 && (
                <ul className="portal-row" style={{ listStyle: "none", margin: 0, padding: 0 }} aria-label="Skills">
                  {path.recommendedSkillTags.map((skill) => (
                    <li key={skill} className="portal-badge">{skill}</li>
                  ))}
                </ul>
              )}
              <div className="portal-card-meta">
                <span>{path.programsCount} programs</span>
                <span>{path.coursesCount} courses</span>
              </div>
              <div style={{ marginTop: "auto" }}>
                <Link to={`/career-paths/${path.slug}`} className="portal-btn portal-btn-sm">Explore path</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </PortalPage>
  );
}
