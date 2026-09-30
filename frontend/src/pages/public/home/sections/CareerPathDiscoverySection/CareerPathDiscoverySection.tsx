import "./CareerPathDiscoverySection.css";
import { useState } from "react";
import Alumni from "../../../../../components/common/Alumni-logos";
import {
  Code2,
  Brain,
  Database,
  Cloud,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import SectionHeading from "../../../../../components/ui/SectionHeading";
import Badge from "../../../../../components/common/Badge";

export interface CareerPathDiscoverySectionProps {
  onSelectTrack?: (track?: string) => void;
}

export default function CareerPathDiscoverySection({
  onSelectTrack,
}: CareerPathDiscoverySectionProps) {
  const [selectedPathIndex, setSelectedPathIndex] = useState(0);
  const paths = [
    {
      id: "software-engineering",
      title: "Full-Stack Software Engineering",
      icon: Code2,
      badge: "ASP.NET CORE & REACT",
      duration: "9 – 12 Months",
      targetRole: "Senior Full-Stack Engineer / Systems Architect",
      overview:
        "Master enterprise backend architectures with ASP.NET Core 10, EF Core, SQL Server, Clean Architecture, and modern frontend ecosystems in React and TypeScript.",
      milestones: [
        "Domain-Driven Design, Modular Monoliths & Microservices Architecture",
        "ASP.NET Core Web API, EF Core Migrations & SQL Server Optimization",
        "Modern React 19, TypeScript, State Management & Design Systems",
        "Containerization with Docker, CI/CD GitHub Actions & Production Deployments",
      ],
      keyCourses: [
        "ASP.NET Core & Enterprise Microservices",
        "React 19 & TypeScript Architecture",
        "SQL Server Advanced Optimization",
      ],
    },
    {
      id: "ai-engineering",
      title: "Artificial Intelligence & Machine Learning",
      icon: Brain,
      badge: "GENERATIVE AI & LLMs",
      duration: "8 – 12 Months",
      targetRole: "AI Engineer / Machine Learning Specialist",
      overview:
        "Develop and deploy production-ready AI models, Retrieval-Augmented Generation (RAG) pipelines, deep learning neural networks, and autonomous multi-agent systems.",
      milestones: [
        "Deep Learning Foundations with PyTorch & Hugging Face Transformers",
        "Generative AI, Large Language Models (LLMs) & Vector Embeddings",
        "Agentic Workflows, LangChain, Semantic Kernel & Tool-Calling Agents",
        "Model Evaluation, MLflow Tracking, Quantization & Edge Deployment",
      ],
      keyCourses: [
        "Applied Generative AI & Autonomous Agents",
        "Machine Learning & Deep Learning with PyTorch",
        "LLM Engineering & Vector DBs",
      ],
    },
    {
      id: "data-science",
      title: "Data Science & Big Data Engineering",
      icon: Database,
      badge: "PYTHON & BIGQUERY",
      duration: "8 – 10 Months",
      targetRole: "Lead Data Scientist / Data Engineer",
      overview:
        "Transform complex petabyte-scale data into predictive business intelligence with Python, Apache Spark, Google BigQuery, DBT, and automated ETL pipelines.",
      milestones: [
        "Statistical Inference, Advanced SQL & Exploratory Data Analysis",
        "Big Data Processing with Apache Spark & Distributed Streaming",
        "Cloud Data Warehousing with BigQuery, DBT Models & Lakehouse Catalogs",
        "Automated Machine Learning Pipelines & Predictive Analytics Dashboards",
      ],
      keyCourses: [
        "Data Science with Python & BigQuery",
        "Big Data Engineering with Apache Spark",
        "Predictive Modeling & Feature Engineering",
      ],
    },
    {
      id: "cloud-devops",
      title: "Cloud Architecture & DevOps Engineering",
      icon: Cloud,
      badge: "KUBERNETES & AWS/AZURE",
      duration: "6 – 9 Months",
      targetRole: "DevOps Architect / Site Reliability Engineer (SRE)",
      overview:
        "Architect fault-tolerant cloud infrastructures, orchestrate high-availability Kubernetes clusters, and automate zero-downtime CI/CD deployment pipelines.",
      milestones: [
        "Infrastructure as Code (IaC) with Terraform & CloudFormation",
        "Container Orchestration with Kubernetes, Helm & Service Meshes",
        "Observability, Prometheus, Grafana & Distributed OpenTelemetry Tracing",
        "Zero-Trust Security, GitOps Workflows & Cloud Cost Optimization",
      ],
      keyCourses: [
        "Kubernetes & Cloud-Native Architecture",
        "Terraform Infrastructure as Code",
        "Enterprise CI/CD & DevSecOps",
      ],
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity & Secure Systems",
      icon: ShieldCheck,
      badge: "DEFENSE & DEVSECOPS",
      duration: "6 – 9 Months",
      targetRole: "Security Engineer / Penetration Tester",
      overview:
        "Secure enterprise digital assets, conduct vulnerability assessments, implement OWASP Top 10 defenses, and master defensive SOC threat monitoring.",
      milestones: [
        "Network Defense, Penetration Testing & Threat Hunting",
        "Web Application Security & OWASP Top 10 Mitigation",
        "Identity & Access Management (OAuth2, OIDC, Zero-Trust Architecture)",
        "Cloud Security Posture & Compliance Audits",
      ],
      keyCourses: [
        "Applied Application Security & OWASP",
        "Network Penetration Testing",
        "Cloud Security & IAM Governance",
      ],
    },
  ];

  const activePath = paths[selectedPathIndex];

  return (
    <section
      id="career-paths"
      className="career-paths-section scroll-section"
      aria-label="Career Path Discovery"
    >
      <div className="section-container">
        <Alumni />
        <SectionHeading
          title={
            <>
              Tailored Career Paths for <em>Every Tech Discipline</em>
            </>
          }
          subtitle="Explore progressive learning frameworks designed in collaboration with senior tech architects and engineering leads."
        />
        {/* Real-World Production Outcomes Metric Bar */}
        <div className="hero-metrics-inline" aria-label="Academy Achievements">
          <div className="inline-metric-item">
            <span className="inline-metric-val">18,500+</span>
            <span className="inline-metric-lbl">Graduated Developers</span>
          </div>
          <div className="inline-metric-div" />
          <div className="inline-metric-item">
            <span className="inline-metric-val">96.8%</span>
            <span className="inline-metric-lbl">Career Placement</span>
          </div>
          <div className="inline-metric-div" />
          <div className="inline-metric-item">
            <span className="inline-metric-val">100%</span>
            <span className="inline-metric-lbl">Production Labs</span>
          </div>
        </div>
        {/* Path Selector Tabs */}
        <div
          className="path-tabs-scroll"
          role="tablist"
          aria-label="Career Paths"
        >
          {paths.map((path, idx) => {
            const Icon = path.icon;
            const isActive = idx === selectedPathIndex;
            return (
              <button
                key={path.id}
                role="tab"
                aria-selected={isActive}
                className={`path-tab-btn ${isActive ? "is-active" : ""}`}
                onClick={() => {
                  setSelectedPathIndex(idx);
                  if (onSelectTrack) onSelectTrack(path.title);
                }}
              >
                <Icon size={16} className="tab-icon" aria-hidden="true" />
                <span>{path.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Path Details Card */}
        <div className="path-details-card" role="tabpanel">
          <div className="path-details-header">
            <div>
              <div className="path-meta-badges">
                <Badge variant="bronze">{activePath.badge}</Badge>
                <span className="meta-time">
                  Duration: {activePath.duration}
                </span>
              </div>
              <h3 className="path-card-title">{activePath.title}</h3>
              <p className="path-target-role">
                Target Role: <strong>{activePath.targetRole}</strong>
              </p>
            </div>
            <a
              href="#courses"
              className="path-apply-btn"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("courses");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span>Explore Track</span>
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>

          <p className="path-overview-text">{activePath.overview}</p>

          <div className="path-columns-layout">
            <div className="path-milestones-col">
              <h4 className="milestone-col-heading">
                Curriculum Progression Milestones
              </h4>
              <ul className="milestone-list">
                {activePath.milestones.map((m, i) => (
                  <li key={i} className="milestone-item">
                    <span className="milestone-num">0{i + 1}</span>
                    <span className="milestone-text">{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="path-courses-col">
              <h4 className="milestone-col-heading">
                Featured Core Courses in Track
              </h4>
              <div className="path-course-chips">
                {activePath.keyCourses.map((c, i) => (
                  <div key={i} className="path-course-chip">
                    <span className="course-chip-dot" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>

              <div className="path-perk-box">
                <span className="perk-title">Career Advantage</span>
                <p className="perk-desc">
                  Graduating fellows receive direct capstone code reviews and
                  priority introductions across Andalusia's tech partner
                  network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
