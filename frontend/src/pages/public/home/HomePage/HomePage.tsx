import "./HomePage.css";
import { useState } from "react";
import { NavigateFunction } from "../../../../types/navigation";
import { Course } from "../../../../types/course";
import HeroSection from "../sections/HeroSection";
import CareerPathDiscoverySection from "../sections/CareerPathDiscoverySection";
import PopularCategoriesSection from "../sections/PopularCategoriesSection";
import FeaturedCoursesSection from "../sections/FeaturedCoursesSection";
import ComingSoonSection from "../sections/ComingSoonSection";
import CorporateTrainingSection from "../sections/CorporateTrainingSection";
import PartnersTrustSection from "../sections/PartnersTrustSection";
import TestimonialsSection from "../sections/TestimonialsSection";
import CtaSection from "../sections/CtaSection";
export interface HomePageProps {
  onNavigate?: NavigateFunction;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (categoryName: string) => {
    setSearchQuery(categoryName);
    const el = document.getElementById("courses");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleTrackSelect = (track?: any) => {
    if (onNavigate) {
      onNavigate("signup");
    }
  };

  const handleCourseSelect = (course?: Course) => {
    if (onNavigate) {
      onNavigate("signup");
    }
  };

  return (
    <div className="homepage-wrapper">
      <HeroSection
        onNavigate={onNavigate}
        onSearch={(query) => setSearchQuery(query)}
      />
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
