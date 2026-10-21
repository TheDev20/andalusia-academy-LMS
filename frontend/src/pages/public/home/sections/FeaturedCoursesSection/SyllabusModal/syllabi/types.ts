export interface SyllabusModule {
  id: string;
  number: number;
  duration: string; // e.g. "Weeks 1–4"
  title: string;
  summary: string;
  topics: string[];
  handsOnLab: {
    title: string;
    description: string;
  };
  technologies: string[];
}

export interface ProgramSyllabusDetails {
  courseId: string;
  title: string;
  category: string;
  badge: string;
  duration: string;
  intake: string;
  rating: number;
  reviewsCount: number;
  level: string;
  format: string;
  overview: string;
  careerOutcomes: {
    targetRoles: string[];
    averageSalaryRange: string;
    hiringPartners: string[];
  };
  prerequisites: string[];
  technologies: string[];
  modules: SyllabusModule[];
  capstoneProject: {
    title: string;
    description: string;
    deliverables: string[];
  };
}
