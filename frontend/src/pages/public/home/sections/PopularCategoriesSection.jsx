import React from 'react';
import {
  Code2,
  Brain,
  Database,
  Cloud,
  ShieldCheck,
  Smartphone,
  Server,
  Layers,
  ArrowRight
} from 'lucide-react';
import SectionHeading from '../../../../components/ui/SectionHeading';

export default function PopularCategoriesSection({ onSelectCategory }) {
  const categories = [
    {
      id: 'software-engineering',
      title: 'Software Development & Web Systems',
      count: '18 Programs',
      icon: Code2,
      description: 'ASP.NET Core, React, Node.js, Clean Architecture, enterprise microservices, and modern frontend frameworks.'
    },
    {
      id: 'ai-ml',
      title: 'Artificial Intelligence & Generative AI',
      icon: Brain,
      count: '14 Programs',
      description: 'Large Language Models (LLMs), LangChain, autonomous agentic workflows, PyTorch, and deep learning architectures.'
    },
    {
      id: 'data-science',
      title: 'Data Science & Advanced Analytics',
      icon: Database,
      count: '15 Programs',
      description: 'Python for data analysis, statistical modeling, machine learning algorithms, and predictive business intelligence.'
    },
    {
      id: 'big-data-engineering',
      title: 'Big Data & Cloud Data Warehousing',
      icon: Server,
      count: '10 Programs',
      description: 'Google BigQuery, Apache Spark, distributed streaming pipelines, DBT data modeling, and lakehouse catalogs.'
    },
    {
      id: 'cloud-devops',
      title: 'Cloud Computing & DevOps Orchestration',
      icon: Cloud,
      count: '12 Programs',
      description: 'Kubernetes container management, Docker, Terraform Infrastructure as Code, AWS, Azure, and automated CI/CD.'
    },
    {
      id: 'cybersecurity',
      title: 'Cybersecurity & Secure Systems',
      icon: ShieldCheck,
      count: '9 Programs',
      description: 'Application security, penetration testing, threat hunting, zero-trust architectures, and DevSecOps compliance.'
    },
    {
      id: 'mobile-development',
      title: 'Mobile Application Engineering',
      icon: Smartphone,
      count: '8 Programs',
      description: 'Cross-platform mobile apps with Flutter and React Native, native iOS Swift, Android Kotlin, and offline-first data sync.'
    },
    {
      id: 'tech-leadership',
      title: 'System Architecture & Tech Leadership',
      icon: Layers,
      count: '7 Programs',
      description: 'High-scale distributed systems design, engineering team leadership, technical product management, and agile delivery.'
    }
  ];

  return (
    <section className="categories-section" aria-label="Popular Categories">
      <div className="section-container">
        <SectionHeading
          badgeText="TECHNICAL DISCIPLINES"
          title={<>Explore Programs by <em>Tech Discipline</em></>}
          subtitle="From enterprise software development to state-of-the-art artificial intelligence and big data, select your area of technical focus."
        />

        <div className="categories-grid">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="category-card"
                onClick={() => onSelectCategory && onSelectCategory(cat.title)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectCategory && onSelectCategory(cat.title);
                  }
                }}
              >
                <div className="category-header-row">
                  <div className="category-icon-box">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <span className="category-count">{cat.count}</span>
                </div>
                <h3 className="category-title">{cat.title}</h3>
                <p className="category-desc">{cat.description}</p>
                <div className="category-explore-link">
                  <span>Browse Tracks</span>
                  <ArrowRight size={13} aria-hidden="true" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
