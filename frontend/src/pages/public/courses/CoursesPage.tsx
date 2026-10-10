import { useSearchParams } from "react-router-dom";
import FeaturedCoursesSection from "../home/sections/FeaturedCoursesSection";

export default function CoursesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "all";

  const handleFilterChange = (filterId: string) => {
    setSearchParams(filterId === "all" ? {} : { filter: filterId });
  };

  return (
    <main>
      <FeaturedCoursesSection
        activeFilter={currentFilter}
        onFilterChange={handleFilterChange}
      />
    </main>
  );
}
