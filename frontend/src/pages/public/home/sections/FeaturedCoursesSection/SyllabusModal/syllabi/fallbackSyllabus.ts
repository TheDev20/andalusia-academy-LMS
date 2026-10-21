import { ProgramSyllabusDetails } from "./types";

/**
 * Generates a dynamic syllabus for courses without a hardcoded syllabus
 */
export function generateFallbackSyllabus(
  courseId: string,
  fallbackCourseTitle?: string,
  fallbackCategory?: string
): ProgramSyllabusDetails {
  const title = fallbackCourseTitle || "Specialized Engineering Program";
  const category = fallbackCategory || "Software Engineering";

  return {
    courseId,
    title,
    category,
    badge: "ACADEMY CERTIFIED",
    duration: "4 Months · 120 Lab Hours",
    intake: "Oct 25, 2026",
    rating: 4.93,
    reviewsCount: 88,
    level: "Intermediate to Advanced",
    format: "Hybrid · Live Sessions & Hands-on Labs",
    overview: `An intensive, project-driven syllabus designed to build production mastery in ${title}. Through deep-dive code labs, real-world system architecture, and 1-on-1 mentorship, fellows develop enterprise-ready skills.`,
    careerOutcomes: {
      targetRoles: [`Senior ${category} Engineer`, "Systems Architect", "Lead Developer"],
      averageSalaryRange: "$80,000 – $130,000 / yr",
      hiringPartners: ["Andalusia Tech Network", "Global Enterprise Partners", "Regional Scaleups"],
    },
    prerequisites: [
      "Solid software development fundamentals",
      "Familiarity with version control (Git) and command line interfaces",
      "Prior exposure to relevant domain technologies",
    ],
    technologies: ["TypeScript", "Python", "Cloud Architecture", "Docker", "CI/CD"],
    modules: [
      {
        id: "gen-mod-1",
        number: 1,
        duration: "Weeks 1–4",
        title: "Architectural Foundations & Core Standards",
        summary: "Establish professional engineering patterns, tooling, and design principles.",
        topics: [
          "Clean Code standards and architectural boundary design",
          "Domain model design and data contracts",
          "Automated unit testing and test-driven development (TDD)",
        ],
        handsOnLab: {
          title: "Foundations Architecture Project",
          description: "Scaffold an enterprise-grade core engine with automated tests and CI verification.",
        },
        technologies: ["Architecture", "Testing", "Code Quality"],
      },
      {
        id: "gen-mod-2",
        number: 2,
        duration: "Weeks 5–8",
        title: "Advanced System Design & Scalability",
        summary: "Build scalable services capable of handling enterprise throughput.",
        topics: [
          "Concurrency patterns and memory efficiency",
          "Caching strategies and database query optimization",
          "Resilience patterns: Retries, circuit breakers, and rate limiters",
        ],
        handsOnLab: {
          title: "High-Throughput Optimization Project",
          description: "Benchmark and optimize critical paths under synthetic production loads.",
        },
        technologies: ["Performance", "Caching", "Databases"],
      },
      {
        id: "gen-mod-3",
        number: 3,
        duration: "Weeks 9–12",
        title: "Production Deployment, Security & Observability",
        summary: "Harden and deploy systems to production cloud environments.",
        topics: [
          "Containerization with Docker and container security",
          "Observability: Structured logging, distributed tracing & metrics",
          "Zero-downtime deployment strategies and rollbacks",
        ],
        handsOnLab: {
          title: "Production Release & Monitoring Lab",
          description: "Deploy to a cloud staging environment with live metrics and automated health probes.",
        },
        technologies: ["Docker", "Monitoring", "CI/CD"],
      },
    ],
    capstoneProject: {
      title: `${title} Production Capstone`,
      description:
        "Fellows build and deploy an end-to-end production application demonstrating all techniques learned throughout the curriculum.",
      deliverables: [
        "Fully architected and deployed production system",
        "Comprehensive automated test coverage and CI/CD pipelines",
        "Technical architecture design document and demo video",
      ],
    },
  };
}
