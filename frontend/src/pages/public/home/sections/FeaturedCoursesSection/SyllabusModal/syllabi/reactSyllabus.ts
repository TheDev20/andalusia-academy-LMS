import { ProgramSyllabusDetails } from "./types";

export const reactSyllabus: ProgramSyllabusDetails = {
  courseId: "react-fullstack-architecture",
  title: "Modern Full-Stack React 19 & TypeScript Systems Architecture",
  category: "Software Engineering",
  badge: "CAREER ACCELERATOR",
  duration: "4 Months · 120 Lab Hours",
  intake: "Oct 20, 2026",
  rating: 4.92,
  reviewsCount: 128,
  level: "Frontend & Full-Stack",
  format: "Live Interactive Studios & Code Labs",
  overview:
    "Master the bleeding-edge React 19 ecosystem, Next.js 15 App Router, React Server Components (RSC), full-stack TypeScript, custom design systems, and real-time streaming web architectures built for enterprise scale.",
  careerOutcomes: {
    targetRoles: [
      "Senior Frontend Engineer",
      "Full-Stack React Architect",
      "Design Systems Engineer",
      "UI Platform Lead",
    ],
    averageSalaryRange: "$80,000 – $130,000 / yr",
    hiringPartners: ["Tech Scaleups", "Modern SaaS Companies", "Digital Product Agencies", "Fintech Innovations"],
  },
  prerequisites: [
    "Comfortable with modern JavaScript (ES6+, async/await, closures)",
    "Foundational React knowledge (components, props, state, JSX)",
    "Basic HTML/CSS layouts including Flexbox and CSS Grid",
  ],
  technologies: [
    "React 19",
    "Next.js 15",
    "TypeScript 5",
    "Tailwind CSS 4",
    "Zustand",
    "TanStack Query",
    "tRPC",
    "Prisma / Drizzle",
    "PostgreSQL",
    "Vitest",
    "Playwright",
    "Docker",
  ],
  modules: [
    {
      id: "mod-1",
      number: 1,
      duration: "Weeks 1–3",
      title: "React 19 Internals & Strict TypeScript Engineering",
      summary:
        "Master React 19 primitives, the new React Compiler, Actions, and enterprise TypeScript typing patterns.",
      topics: [
        "React 19 Actions, useActionState, useOptimistic, and useFormStatus",
        "The React Compiler: How automatic memoization replaces useMemo and useCallback",
        "Advanced TypeScript: Discriminated unions, conditional types, template literals & inference",
        "Component API architecture: Polymorphic components, compound components & render props",
        "High-performance state: Micro-state managers (Zustand) vs immutable context",
      ],
      handsOnLab: {
        title: "Real-Time High-Frequency Trading Interface",
        description:
          "Build an interactive financial order book with 60 FPS update speeds, zero render bottlenecks, custom canvas charts, and strict type safety across all market feed events.",
      },
      technologies: ["React 19", "TypeScript 5", "Zustand", "Tailwind CSS", "Vitest"],
    },
    {
      id: "mod-2",
      number: 2,
      duration: "Weeks 4–8",
      title: "Next.js 15 App Router & React Server Components (RSC)",
      summary:
        "Architect full-stack web applications leveraging Server Components, streaming SSR, parallel routes, and edge runtime.",
      topics: [
        "React Server Components mental model: Serialization boundaries & Server/Client code splitting",
        "Next.js 15 App Router: Dynamic segments, parallel routes (`@slots`) & intercepting routes (`(..)`)",
        "Streaming SSR with React Suspense and custom skeleton fallbacks",
        "Server Actions: Mutation lifecycles, form validation, and revalidating tags/paths",
        "Multi-layered caching: Request memoization, data cache, full route cache, and router cache",
      ],
      handsOnLab: {
        title: "High-Performance Global E-Commerce Platform",
        description:
          "Develop a lightning-fast marketplace with sub-100ms LCP, instant product search with intercepting modal routes, optimistic cart updates, and multi-region edge caching.",
      },
      technologies: ["Next.js 15", "React Server Components", "Server Actions", "PostgreSQL", "Prisma"],
    },
    {
      id: "mod-3",
      number: 3,
      duration: "Weeks 9–12",
      title: "Enterprise Design Systems & Micro-Frontend Modularity",
      summary:
        "Build scalable, accessible component libraries powered by Radix UI, Storybook, and automated visual regression suites.",
      topics: [
        "Accessible component design: WAI-ARIA guidelines, keyboard navigation & focus traps",
        "Headless UI primitives with Radix UI and custom Tailwind CSS 4 plugin architecture",
        "Design tokens architecture: Multi-brand themes, dark mode, and dynamic runtime variables",
        "Storybook 8 documentation, interactive component stories, and Figma design synchronization",
        "Automated visual regression testing using Playwright and chromatic CI checks",
      ],
      handsOnLab: {
        title: "Multi-Brand Enterprise UI Design System Library",
        description:
          "Build an enterprise component library with 25+ fully accessible components, publishing it as an internal NPM package with comprehensive Storybook docs and 100% a11y compliance.",
      },
      technologies: ["Radix UI", "Tailwind CSS 4", "Storybook", "Playwright", "NPM Packaging"],
    },
    {
      id: "mod-4",
      number: 4,
      duration: "Weeks 13–16",
      title: "Full-Stack End-to-End Type Safety & Real-Time Sync",
      summary:
        "Unify frontend and backend with tRPC, WebSockets, optimistic UI updates, and automated production CI/CD.",
      topics: [
        "End-to-end type safety without code generation using tRPC and Zod validation",
        "Real-time bidirectional synchronization with WebSockets and Socket.io",
        "Optimistic UI updates, cache invalidation, and infinite pagination with TanStack Query v5",
        "End-to-end testing with Playwright: Multi-browser testing, network mocking & auth flows",
        "Docker containerization, standalone Next.js output, and automated Vercel / Kubernetes deployment",
      ],
      handsOnLab: {
        title: "Collaborative Real-Time Canvas & Document Workspace",
        description:
          "Create a collaborative whiteboard app with live multi-user cursors, real-time conflict-free synchronized notes, and offline-first persistence.",
      },
      technologies: ["tRPC", "Zod", "TanStack Query", "Socket.io", "Playwright", "Docker"],
    },
  ],
  capstoneProject: {
    title: "FlowCraft: Next-Generation Enterprise Product Management Workspace",
    description:
      "Fellows architect a complete production SaaS application (reminiscent of Linear + Notion) featuring real-time collaborative issue tracking, custom Kanban boards, keyboard-driven command palette, and sub-second full-text search.",
    deliverables: [
      "Production Next.js 15 App Router app with React Server Components",
      "End-to-end type safety via tRPC and PostgreSQL database",
      "Full keyboard accessibility and custom accessible design system",
      "Comprehensive automated test suite with Vitest and Playwright E2E",
    ],
  },
};
