import { useNavigate } from "react-router-dom";
import { NavigateFunction } from "../../../../types/navigation";
import Alumni from "../../../../components/common/Alumni-logos";
import HeroSection from "../sections/HeroSection";
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

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/courses?filter=${encodeURIComponent(categoryId)}`);
  };

  return (
    <div className="homepage-wrapper">
      <HeroSection onNavigate={onNavigate} />
      <section className="alumni-section" aria-label="Where our alumni work">
        <div className="section-container">
          <Alumni />
        </div>
      </section>
      <PopularCategoriesSection onSelectCategory={handleCategorySelect} />
      <ComingSoonSection />
      <CorporateTrainingSection onNavigate={onNavigate} />
      <PartnersTrustSection />
      <TestimonialsSection />
      <CtaSection onNavigate={onNavigate} />
    </div>
  );
}
