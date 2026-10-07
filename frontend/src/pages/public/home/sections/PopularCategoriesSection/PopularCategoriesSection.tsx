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
} from "lucide-react";
import SectionHeading from "../../../../../components/ui/SectionHeading";
import "./PopularCategoriesSection.css";
import { MagicCard } from "@/components/ui/magic-card";
export interface PopularCategoriesSectionProps {
  onSelectCategory?: (categoryName: string) => void;
}

export default function PopularCategoriesSection({
  onSelectCategory,
}: PopularCategoriesSectionProps) {
  const categories = [
    {
      id: "software-engineering",
      title: "Software Development & Web Systems",
      count: "18 Programs",
      icon: Code2,
      description:
        "Full-stack web development, modern JavaScript frameworks, RESTful APIs, and scalable cloud-based architectures.",
    },
    {
      id: "ai-ml",
      title: "Artificial Intelligence & Generative AI",
      icon: Brain,
      count: "14 Programs",
      description:
        "Large Language Models (LLMs), LangChain, autonomous agentic workflows, PyTorch, and deep learning architectures.",
    },
    {
      id: "data-science",
      title: "Data Science & Advanced Analytics",
      icon: Database,
      count: "15 Programs",
      description:
        "Python for data analysis, statistical modeling, machine learning algorithms, and predictive business intelligence.",
    },
    {
      id: "big-data-engineering",
      title: "Big Data & Cloud Data Warehousing",
      icon: Server,
      count: "10 Programs",
      description:
        "Google BigQuery, Apache Spark, distributed streaming pipelines, DBT data modeling, and lakehouse catalogs.",
    },
    {
      id: "cloud-devops",
      title: "Cloud Computing & DevOps Orchestration",
      icon: Cloud,
      count: "12 Programs",
      description:
        "Kubernetes container management, Docker, Terraform Infrastructure as Code, AWS, Azure, and automated CI/CD.",
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity & Secure Systems",
      icon: ShieldCheck,
      count: "9 Programs",
      description:
        "Application security, penetration testing, threat hunting, zero-trust architectures, and DevSecOps compliance.",
    },
    {
      id: "mobile-development",
      title: "Mobile Application Engineering",
      icon: Smartphone,
      count: "8 Programs",
      description:
        "Cross-platform mobile apps with Flutter and React Native, native iOS Swift, Android Kotlin, and offline-first data sync.",
    },
    {
      id: "tech-leadership",
      title: "System Architecture & Tech Leadership",
      icon: Layers,
      count: "7 Programs",
      description:
        "High-scale distributed systems design, engineering team leadership, technical product management, and agile delivery.",
    },
  ];

  return (
    <section
      className="categories-section"
      aria-label="Popular Categories"
    >
      <div className="section-container">
        <SectionHeading
          title={
            <>
              Explore Programs by <em>Tech Discipline</em>
            </>
          }
          subtitle="From enterprise software development to state-of-the-art artificial intelligence and big data, select your area of technical focus."
        />

        <div className="categories-grid ">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory && onSelectCategory(cat.title)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    onSelectCategory && onSelectCategory(cat.title);
                  }
                }}
              >
                <MagicCard
                  mode="gradient"
                  gradientColor="#E8C9A0"
                  // glowFrom="#E8C9A0"
                  // glowTo="#F6EBDD"
                  className="category-card"
                  gradientSize={100}
                >
                  {/* <div className= category-card> */}
                  <div className="category-header-row">
                    <div className="cat-icon-frame">
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="cat-count-badge">{cat.count}</span>
                  </div>
                  <h2 className="cat-card-title">{cat.title}</h2>
                  <p className="cat-card-desc">{cat.description}</p>
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
