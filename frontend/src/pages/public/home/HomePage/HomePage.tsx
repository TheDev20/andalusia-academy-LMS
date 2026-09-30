import { useState } from "react";
import {
  NavigateFunction,
  ROUTES,
  SECTION_IDS,
} from "../../../../types/navigation";
import HeroSection from "../sections/HeroSection";
import CareerPathDiscoverySection from "../sections/CareerPathDiscoverySection";
import PopularCategoriesSection from "../sections/PopularCategoriesSection";
import FeaturedCoursesSection from "../sections/FeaturedCoursesSection";
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
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (categoryName: string) => {
    setSearchQuery(categoryName);
    const el = document.getElementById(SECTION_IDS.COURSES);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };


  const handleTrackSelect = () => {
    if (onNavigate) {
      onNavigate(ROUTES.SIGNUP);
    }
  };

  const handleCourseSelect = () => {
    if (onNavigate) {
      onNavigate(ROUTES.SIGNUP);
    }
  };

  return (
    <div className="homepage-wrapper">
      <HeroSection onNavigate={onNavigate} onSearch={setSearchQuery} />
      <CareerPathDiscoverySection onSelectTrack={handleTrackSelect} />
      <PopularCategoriesSection onSelectCategory={handleCategorySelect} />
      <FeaturedCoursesSection
        searchQuery={searchQuery}
        onSelectCourse={handleCourseSelect}
      />
      <ComingSoonSection />
      <CorporateTrainingSection onNavigate={onNavigate} />
      <PartnersTrustSection />
      <TestimonialsSection />
      <CtaSection onNavigate={onNavigate} />
    </div>
  );
}
