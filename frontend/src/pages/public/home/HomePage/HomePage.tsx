import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavigateFunction,
  ROUTES,
  SECTION_IDS,
} from "../../../../types/navigation";
import HeroSection from "../sections/HeroSection";
import CareerPathDiscoverySection from "../sections/CareerPathDiscoverySection";
import PopularCategoriesSection from "../sections/PopularCategoriesSection";
import ComingSoonSection from "../sections/ComingSoonSection";
import CorporateTrainingSection from "../sections/CorporateTrainingSection";
import PartnersTrustSection from "../sections/PartnersTrustSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import CtaSection from "../sections/CtaSection";
import "./HomePage.css";
export interface HomePageProps {
  onNavigate?: NavigateFunction;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (categoryId: string) => {
    const filterMap: Record<string, string> = {
      "software-engineering": "dev",
      "ai-ml": "ai",
      "data-science": "data",
      "big-data-engineering": "data",
      "cloud-devops": "cloud",
      cybersecurity: "cyber",
    };

    const targetFilter = filterMap[categoryId] || "all";
    navigate(`/courses?filter=${targetFilter}`);
  };

  const [courseFilter, setCourseFilter] = useState("all");

  const handleTrackSelect = (_filterId: string) => {
    if (onNavigate) {
      onNavigate(ROUTES.COURSES);
    }
  };

  const handleHeroSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setCourseFilter("all");
    }
  };

  const handleCourseSelect = () => {
    if (onNavigate) {
      onNavigate(ROUTES.SIGNUP);
    }
  };

  return (
    <div className="homepage-wrapper">
      <HeroSection onNavigate={onNavigate} onSearch={handleHeroSearch} />
      <CareerPathDiscoverySection onExploreTrack={handleTrackSelect} />
      <PopularCategoriesSection onSelectCategory={handleCategorySelect} />
      <ComingSoonSection />
      <CorporateTrainingSection onNavigate={onNavigate} />
      <PartnersTrustSection />
      <TestimonialsSection />
      <CtaSection onNavigate={onNavigate} />
    </div>
  );
}
