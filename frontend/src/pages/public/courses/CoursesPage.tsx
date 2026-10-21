import { Link, useSearchParams } from "react-router-dom";
import FeaturedCoursesSection from "../home/sections/FeaturedCoursesSection";
import "../../../components/portal/portal.css";

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  const handleFilterChange = (filterId: string) => {
    setSearchParams(filterId === "all" ? {} : { filter: filterId });
  };

  return (
    <main>
      <nav
        aria-label="Catalog sections"
        style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", padding: "96px 16px 0" }}
      >
        <Link to="/programs" className="portal-btn portal-btn-secondary">Browse programs</Link>
        <Link to="/career-paths" className="portal-btn portal-btn-secondary">Explore career paths</Link>
      </nav>
      <FeaturedCoursesSection
        activeFilter={currentFilter}
        onFilterChange={handleFilterChange}
      />
    </main>
  );
}
