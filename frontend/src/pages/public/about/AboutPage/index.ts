import { Code2, Sparkles, Users2, Award, LucideIcon } from "lucide-react";
export { default } from "./AboutPage";
export * from "./AboutPage";
export interface Pillar {
  icon: LucideIcon;
  title: string;
  desc: string;
}
export interface FacultyMember {
  name: string;
  role: string;
  creds: string;
  bio: string;
  img: string;
}

export interface Milestone {
  year: string;
  title: string;
  desc: string;
}

export const pillars: Pillar[] = [
  {
    icon: Code2,
    title: "Production-Grade Engineering Rigor",
    desc: "Our curricula are built strictly upon production software standards, Domain-Driven Design (DDD), Clean Architecture, and enterprise code quality.",
  },
  {
    icon: Sparkles,
    title: "Project-First & Applied Labs",
    desc: "Theory without practice is forgotten. Trainees build deployed web apps, microservices, AI agents, and data pipelines with continuous code reviews.",
  },
  {
    icon: Users2,
    title: "Senior Practitioner Mentorship",
    desc: "Learn directly from principal engineers, AI researchers, and technical directors actively designing high-scale distributed systems in industry.",
  },
  {
    icon: Award,
    title: "Verified Technical Diplomas",
    desc: "Every cohort and course delivers verifiable technical credentials, accredited lab hours, and comprehensive public GitHub portfolio capstones.",
  },
];

export const faculty: FacultyMember[] = [
  {
    name: "Eng. Kareem Hegazy",
    role: "Dean of Technology & Principal Systems Architect",
    creds: "M.Sc. Computer Science, Ex-BigTech Principal Engineer",
    bio: "Over 18 years leading distributed backend systems, enterprise .NET microservices, and high-concurrency cloud architectures.",
    img: "/images/tech-lab.jpg",
  },
  {
    name: "Dr. Mona El-Shinnawy",
    role: "Director of AI & Machine Learning Research",
    creds: "Ph.D. in Neural Networks & Computational Intelligence",
    bio: "Pioneer in applied Generative AI, transformer architectures, and autonomous agent systems across North Africa and the Gulf.",
    img: "/images/tech-hero.jpg",
  },
  {
    name: "Eng. Tarek Mansour",
    role: "Lead Cloud Architecture & DevOps Director",
    creds:
      "Certified Kubernetes Administrator (CKA), AWS Solutions Architect Pro",
    bio: "Guided enterprise cloud migrations and zero-downtime CI/CD automation across prominent regional financial institutions.",
    img: "/images/tech-lab.jpg",
  },
  {
    name: "Eng. Sarah Abdelrahman",
    role: "Head of Big Data & Analytics Engineering",
    creds: "Google Cloud Certified Professional Data Engineer",
    bio: "Specialist in petabyte-scale data lakes, Apache Spark streaming, and automated modern data stack pipelines.",
    img: "/images/tech-hero.jpg",
  },
];

export const milestones: Milestone[] = [
  {
    year: "2004",
    title: "Academic Center Inception",
    desc: "Founded to deliver specialized professional technical and workforce education.",
  },
  {
    year: "2014",
    title: "Software Engineering Expansion",
    desc: "Introduced enterprise software engineering, full-stack, and database architecture bootcamps.",
  },
  {
    year: "2020",
    title: "AI & Cloud Computing Labs",
    desc: "Unveiled regional computing studios dedicated to machine learning, big data, and cloud infrastructure.",
  },
  {
    year: "2026",
    title: "Phase 1 Modular LMS Launch",
    desc: "Deployed state-of-the-art hybrid LMS platform with physical cohort sessions across Cairo, Alexandria, and Jeddah.",
  },
];
