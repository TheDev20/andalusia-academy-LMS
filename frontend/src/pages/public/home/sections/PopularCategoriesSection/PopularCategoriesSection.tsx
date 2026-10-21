import { useState, useEffect } from "react";
import {
  Code2,
  Brain,
  Database,
  Cloud,
  ShieldCheck,
  Smartphone,
  Server,
  Layers,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import SectionHeading from "../../../../../components/ui/SectionHeading";
import "./PopularCategoriesSection.css";
import { MagicCard } from "@/components/ui/magic-card";

// Map icon names from the database to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  Code2,
  Brain,
  Database,
  Cloud,
  ShieldCheck,
  Smartphone,
  Server,
  Layers,
};

interface TechDiscipline {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  countDisplay: string;
}

export interface PopularCategoriesSectionProps {
  onSelectCategory?: (categoryName: string) => void;
}

export default function PopularCategoriesSection({
  onSelectCategory,
}: PopularCategoriesSectionProps) {
  const [categories, setCategories] = useState<TechDiscipline[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch live disciplines from the backend API
  useEffect(() => {
    fetch("/api/catalog/disciplines")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load disciplines");
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="text-center py-12">Loading programs...</div>;
  }

  return (
    <section className="categories-section" aria-label="Popular Categories">
      <div className="section-container">
        <SectionHeading
          title={
            <>
              Explore Programs by <em>Tech Discipline</em>
            </>
          }
          subtitle="From enterprise software development to state-of-the-art artificial intelligence and big data, select your area of technical focus."
        />

        <div className="categories-grid">
          {categories.map((cat) => {
            // Resolve icon dynamically or fallback to Code2
            const Icon = ICON_MAP[cat.icon] || Code2;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectCategory && onSelectCategory(cat.slug);
                  }
                }}
              >
                <MagicCard
                  mode="gradient"
                  gradientColor="#E8C9A0"
                  className="category-card"
                  gradientSize={100}
                >
                  <div className="category-header-row">
                    <div className="cat-icon-frame">
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="cat-count-badge">{cat.countDisplay}</span>
                  </div>
                  <h2 className="cat-card-title">{cat.title}</h2>
                  <p className="cat-card-desc">
                    {cat.description ||
                      "Explore specialized curriculum, hands-on enterprise labs, and degree-caliber programs."}
                  </p>
                  <div className="cat-explore-link">
                    <span>Browse Tracks</span>
                    <ArrowRight size={13} aria-hidden="true" />
                  </div>
                </MagicCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
