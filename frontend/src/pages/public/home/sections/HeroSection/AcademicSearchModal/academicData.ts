export interface AcademicCurriculum {
  id: string;
  type: "program" | "course";
  code: string;
  title: string;
  category: string;
  badge: string;
  badgeType: "purple" | "emerald" | "blue" | "amber" | "rose";
  description: string;
  stats: {
    coursesCount: number;
    labHours: string;
    mentor: string;
  };
  coursePills: string[];
  targetFile: string;
}

export const ACADEMIC_CURRICULA: AcademicCurriculum[] = [
  {
    id: "prog-se",
    type: "program",
    code: "SE-PROG",
    title: "Full-Stack Software Engineering & Distributed Systems",
    category: "Software Engineering",
    badge: "FULL PROGRAM",
    badgeType: "purple",
    description:
      "Enterprise backend architectures with ASP.NET Core 10, Clean Architecture, EF Core code-first migrations, React 19, and cloud-native microservices.",
    stats: {
      coursesCount: 4,
      labHours: "180h",
      mentor: "Active AI Mentor",
    },
    coursePills: ["CC208", "CS315", "CS334", "CS301"],
    targetFile: "App.tsx",
  },
  {
    id: "prog-ai",
    type: "program",
    code: "AI-PROG",
    title: "Applied Generative AI & Autonomous Agentic Systems",
    category: "AI & Machine Learning",
    badge: "FULL PROGRAM",
    badgeType: "emerald",
    description:
      "Deep learning foundations with PyTorch, fine-tuning open-source LLMs, vector database RAG pipelines, and production autonomous multi-agent systems.",
    stats: {
      coursesCount: 4,
      labHours: "160h",
      mentor: "Active AI Mentor",
    },
    coursePills: ["AI101", "LLM204", "RAG302", "AGT405"],
    targetFile: "train_agent.py",
  },
  {
    id: "prog-ds",
    type: "program",
    code: "DS-PROG",
    title: "Data Science & Cloud Big Data Engineering",
    category: "Data Science",
    badge: "FULL PROGRAM",
    badgeType: "blue",
    description:
      "Transform petabyte-scale data into predictive business intelligence with Python, Apache Spark, Google BigQuery, DBT, and automated streaming ETL pipelines.",
    stats: {
      coursesCount: 3,
      labHours: "190h",
      mentor: "Active AI Mentor",
    },
    coursePills: ["DS201", "SPK305", "BQ410", "DBT501"],
    targetFile: "package.json",
  },
  {
    id: "prog-cloud",
    type: "program",
    code: "CLD-PROG",
    title: "Cloud Infrastructure, Kubernetes & DevOps Orchestration",
    category: "Cloud & DevOps",
    badge: "FULL PROGRAM",
    badgeType: "amber",
    description:
      "Architect fault-tolerant cloud infrastructures, orchestrate high-availability Kubernetes clusters, and automate zero-downtime CI/CD pipelines.",
    stats: {
      coursesCount: 3,
      labHours: "150h",
      mentor: "Active AI Mentor",
    },
    coursePills: ["K8S101", "TF202", "GHA303", "SEC404"],
    targetFile: "vite.config.ts",
  },
  {
    id: "prog-sec",
    type: "program",
    code: "SEC-PROG",
    title: "Cybersecurity, Penetration Testing & Secure Systems",
    category: "Cybersecurity",
    badge: "FULL PROGRAM",
    badgeType: "rose",
    description:
      "Secure enterprise digital assets, conduct vulnerability assessments, implement OWASP Top 10 defenses, and master defensive SOC threat monitoring.",
    stats: {
      coursesCount: 3,
      labHours: "140h",
      mentor: "Active AI Mentor",
    },
    coursePills: ["SEC101", "PEN205", "IAM310", "SOC401"],
    targetFile: "train_agent.py",
  },
  {
    id: "course-aspnet",
    type: "course",
    code: "CC208",
    title: "ASP.NET Core 10 & Clean Microservices Masterclass",
    category: "Software Engineering",
    badge: "SPECIALIZED COURSE",
    badgeType: "purple",
    description:
      "Hands-on implementation of modular monoliths, distributed microservices, CQRS, and high-throughput SQL Server databases.",
    stats: {
      coursesCount: 1,
      labHours: "60h",
      mentor: "1-on-1 Code Reviews",
    },
    coursePills: [".NET 10", "EF Core", "Clean Arch", "Redis"],
    targetFile: "App.tsx",
  },
  {
    id: "course-react",
    type: "course",
    code: "CS315",
    title: "Modern React 19 & TypeScript Systems Architecture",
    category: "Software Engineering",
    badge: "SPECIALIZED COURSE",
    badgeType: "blue",
    description:
      "Master Next.js App Router, React Server Components, state management, full-stack typed APIs, and scalable modular design systems.",
    stats: {
      coursesCount: 1,
      labHours: "45h",
      mentor: "Frontend Lead Mentors",
    },
    coursePills: ["React 19", "TypeScript", "Next.js", "Design Systems"],
    targetFile: "styles.css",
  },
  {
    id: "course-genai",
    type: "course",
    code: "AI204",
    title: "Applied Generative AI, LLMs & Autonomous Agents",
    category: "AI & Machine Learning",
    badge: "SPECIALIZED COURSE",
    badgeType: "emerald",
    description:
      "Build production-ready agentic AI systems using LangChain, vector databases (Chroma/Pinecone), RAG, and fine-tuned open-source LLMs.",
    stats: {
      coursesCount: 1,
      labHours: "50h",
      mentor: "GPU Cluster Access",
    },
    coursePills: ["Transformers", "LangChain", "Vector RAG", "Multi-Agent"],
    targetFile: "train_agent.py",
  },
];

/**
 * Normalizes strings by replacing punctuation/hyphens with spaces and collapsing whitespace
 */
export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[-_./\\+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Fuzzy token matching: matches words regardless of hyphen, space, or punctuation
 */
export function matchesSearchQuery(item: AcademicCurriculum, query: string): boolean {
  const normQuery = normalizeText(query);
  if (!normQuery) return true;

  const queryWords = normQuery.split(" ").filter(Boolean);

  const searchableText = normalizeText(
    `${item.title} ${item.description} ${item.category} ${item.code} ${item.coursePills.join(" ")}`
  );
  const compactSearchable = searchableText.replace(/\s+/g, "");
  const compactQuery = normQuery.replace(/\s+/g, "");

  if (compactSearchable.includes(compactQuery)) {
    return true;
  }

  return queryWords.every((word) => searchableText.includes(word));
}
