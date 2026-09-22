import React, { useState } from 'react';
import HeroSection from './sections/HeroSection';
import CareerPathDiscoverySection from './sections/CareerPathDiscoverySection';
import PopularCategoriesSection from './sections/PopularCategoriesSection';
import FeaturedCoursesSection from './sections/FeaturedCoursesSection';
import ComingSoonSection from './sections/ComingSoonSection';
import CorporateTrainingSection from './sections/CorporateTrainingSection';
import PartnersTrustSection from './sections/PartnersTrustSection';
import TestimonialsSection from './sections/TestimonialsSection';
import CtaSection from './sections/CtaSection';

import { NavigateFunction } from '../../../types/navigation';
import { Course } from '../../../types/course';

export interface HomePageProps {
  onNavigate?: NavigateFunction;
}

export default function HomePage({ onNavigate }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategorySelect = (categoryName: string) => {
    setSearchQuery(categoryName);
    const el = document.getElementById('courses');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTrackSelect = (track?: any) => {
    if (onNavigate) {
      onNavigate('signup');
    }
  };

  const handleCourseSelect = (course?: Course) => {
    if (onNavigate) {
      onNavigate('signup');
    }
  };

  return (
    <div className="homepage-wrapper">
      {/* 1. Hero Section */}
      <HeroSection
        onNavigate={onNavigate}
        onSearch={(query) => setSearchQuery(query)}
      />

      {/* 2. Career Path Discovery */}
      <CareerPathDiscoverySection
        onSelectTrack={handleTrackSelect}
      />

      {/* 3. Popular Categories */}
      <PopularCategoriesSection
        onSelectCategory={handleCategorySelect}
      />

      {/* 4. Featured / Trending Courses & Programs */}
      <FeaturedCoursesSection
        searchQuery={searchQuery}
        onSelectCourse={handleCourseSelect}
      />

      {/* 5. Coming Soon */}
      <ComingSoonSection />

      {/* 6. Corporate / For Business */}
      <CorporateTrainingSection
        onNavigate={onNavigate}
      />

      {/* 7. Partners / Trust */}
      <PartnersTrustSection />

      {/* 8. Testimonials */}
      <TestimonialsSection />

      {/* 9. CTAs */}
      <CtaSection
        onNavigate={onNavigate}
      />
    </div>
  );
}
