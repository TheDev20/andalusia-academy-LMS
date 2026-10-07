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

export const PROGRAM_SYLLABI: Record<string, ProgramSyllabusDetails> = {
  "aspnet-core-enterprise": {
    courseId: "aspnet-core-enterprise",
    title: "ASP.NET Core & Enterprise Microservices Masterclass",
    category: "Software Engineering",
    badge: "FLAGSHIP PROGRAM",
    duration: "6 Months · 180 Lab Hours",
    intake: "Oct 15, 2026",
    rating: 4.96,
    reviewsCount: 142,
    level: "Intermediate to Advanced",
    format: "Hybrid · In-Person Studios & Virtual Labs",
    overview:
      "A comprehensive, production-grade masterclass designed to elevate software engineers into Enterprise Systems Architects. Master Domain-Driven Design (DDD), high-throughput ASP.NET Core 10 Web APIs, EF Core performance tuning, asynchronous event-driven messaging with RabbitMQ, and cloud containerization.",
    careerOutcomes: {
      targetRoles: [
        "Senior .NET Backend Architect",
        "Enterprise Microservices Engineer",
        "Systems Solutions Architect",
        "Staff Software Engineer",
      ],
      averageSalaryRange: "$85,000 – $135,000 / yr",
      hiringPartners: ["Microsoft Partner Network", "FinTech Hubs", "Enterprise Cloud Labs", "Vodafone Systems"],
    },
    prerequisites: [
      "Solid understanding of C# or equivalent OOP language (Java, C++)",
      "Basic understanding of relational databases and SQL queries",
      "Familiarity with HTTP, REST APIs, and version control with Git",
    ],
    technologies: [
      ".NET 10",
      "C# 13",
      "EF Core 10",
      "SQL Server",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "Kubernetes",
      "MediatR",
      "OpenTelemetry",
      "xUnit & Moq",
    ],
    modules: [
      {
        id: "mod-1",
        number: 1,
        duration: "Weeks 1–4",
        title: "Clean Architecture, DDD & Advanced C# 13",
        summary:
          "Master enterprise separation of concerns, domain encapsulation, and modern C# 13 features for bulletproof software foundations.",
        topics: [
          "Domain-Driven Design (DDD): Entities, Value Objects, Aggregates & Domain Events",
          "Clean Architecture folder structures & boundary enforcement",
          "Command Query Responsibility Segregation (CQRS) using MediatR",
          "Advanced C# 13 patterns: Pattern matching, primary constructors, ref structs & memory efficiency",
          "Cross-cutting concerns: Pipeline behaviors, centralized error handling & FluentValidation",
        ],
        handsOnLab: {
          title: "Enterprise Banking Core Domain Engine",
          description:
            "Design and scaffold an enterprise banking domain model with transactional invariants, immutable currency value objects, and domain event dispatching with 100% unit test coverage.",
        },
        technologies: [".NET 10", "C# 13", "MediatR", "FluentValidation", "xUnit"],
      },
      {
        id: "mod-2",
        number: 2,
        duration: "Weeks 5–9",
        title: "High-Performance Data Access & EF Core 10 Tuning",
        summary:
          "Optimize database interactions, eliminate N+1 issues, write compiled queries, and master code-first database migrations.",
        topics: [
          "Entity Framework Core 10 deep internals, change tracker tuning & AsNoTracking",
          "Split queries, compiled queries, and index optimization for SQL Server & PostgreSQL",
          "Zero-downtime database schema migrations and idempotent SQL scripts",
          "High-throughput multi-tier caching with Redis and memory cache decorators",
          "Concurrency tokens, optimistic concurrency, and distributed locking",
        ],
        handsOnLab: {
          title: "High-Throughput Analytics & Ledger Query Optimization",
          description:
            "Optimize complex analytical queries across a 10-million row database, reducing latency from 2,400ms to 42ms with compiled queries, indexes, and Redis caching.",
        },
        technologies: ["EF Core 10", "SQL Server", "Redis", "Dapper", "BenchmarkDotNet"],
      },
      {
        id: "mod-3",
        number: 3,
        duration: "Weeks 10–16",
        title: "Distributed Microservices & Event-Driven Systems",
        summary:
          "Break modular monoliths into fault-tolerant distributed microservices connected through asynchronous message brokers.",
        topics: [
          "Microservices decomposition strategies & bounded context mapping",
          "Message queues with RabbitMQ and Apache Kafka: Topics, Exchanges & Dead-Letter Exchanges",
          "The Transactional Outbox Pattern with Quartz.NET background workers",
          "Saga Orchestration vs Choreography for distributed ACID compliance",
          "API Gateway routing, rate limiting (YARP), and resilient HTTP clients with Polly",
        ],
        handsOnLab: {
          title: "Distributed E-Commerce Order Fulfillment & Payment Cluster",
          description:
            "Build a resilient microservice mesh with 3 independent services communicating via RabbitMQ, handling payment retries, transactional outbox publishing, and compensating transactions.",
        },
        technologies: ["RabbitMQ", "Kafka", "YARP", "Polly", "Quartz.NET", "MassTransit"],
      },
      {
        id: "mod-4",
        number: 4,
        duration: "Weeks 17–24",
        title: "Cloud Containerization, Security & Observability",
        summary:
          "Harden microservices with enterprise OAuth2, instrument with OpenTelemetry, and automate CI/CD deployments into Kubernetes.",
        topics: [
          "Token-based identity with OAuth2 / OpenID Connect and Duende IdentityServer",
          "Distributed tracing, metric collectors & logs with OpenTelemetry, Jaeger & Grafana",
          "Multi-stage Dockerfiles and container image minimization",
          "Kubernetes manifests, ConfigMaps, Secrets, Ingress, and horizontal pod autoscaling",
          "Automated GitHub Actions CI/CD pipelines with security linting and automated smoke tests",
        ],
        handsOnLab: {
          title: "Production Kubernetes Deployment with Full Distributed Tracing",
          description:
            "Package all microservices into secure Docker containers, deploy to a local Kubernetes cluster with Helm, and configure Jaeger dashboards to trace requests across all service boundaries.",
        },
        technologies: ["Docker", "Kubernetes", "Helm", "OpenTelemetry", "Jaeger", "GitHub Actions"],
      },
    ],
    capstoneProject: {
      title: "FinTech Ultra: High-Frequency Core Banking & Payment Settlement Engine",
      description:
        "Fellows build a complete multi-tenant, cloud-native banking microservices platform featuring event-driven ledgers, idempotent payment webhooks, sub-25ms API response times, and automated Kubernetes failovers.",
      deliverables: [
        "4 decoupled microservices with Clean Architecture & Domain-Driven Design",
        "Transactional Outbox pattern implementation with RabbitMQ message broker",
        "Automated CI/CD pipeline on GitHub Actions deploying to Kubernetes",
        "Complete distributed tracing telemetry in Jaeger and Grafana metrics",
      ],
    },
  },

  "applied-genai-llm": {
    courseId: "applied-genai-llm",
    title: "Applied Generative AI, LLMs & Autonomous Agents Bootcamp",
    category: "AI & Machine Learning",
    badge: "TOP ENROLLED",
    duration: "5 Months · 160 Lab Hours",
    intake: "Nov 1, 2026",
    rating: 4.98,
    reviewsCount: 184,
    level: "All Developers",
    format: "Hybrid · Hands-on AI Studio & GPU Cloud Cluster",
    overview:
      "A fast-paced, high-impact bootcamp taking engineers from AI fundamentals to architecting production autonomous agent swarms, enterprise RAG systems, and fine-tuning open-source LLMs on high-end GPU clusters.",
    careerOutcomes: {
      targetRoles: [
        "Generative AI Systems Engineer",
        "LLM Applications Architect",
        "Autonomous Agent Developer",
        "AI Solutions Consultant",
      ],
      averageSalaryRange: "$95,000 – $145,000 / yr",
      hiringPartners: ["AI Innovations Lab", "Enterprise Tech Venture", "DeepMind Alumni Group", "Global AI Labs"],
    },
    prerequisites: [
      "Comfortable with Python programming (data structures, async, APIs)",
      "Basic understanding of vector math (dot products, cosine similarity)",
      "Curiosity and willingness to work with bleeding-edge AI models and toolchains",
    ],
    technologies: [
      "Python 3.12",
      "PyTorch",
      "Hugging Face",
      "LangChain",
      "LangGraph",
      "ChromaDB",
      "Pinecone",
      "vLLM",
      "Ollama",
      "LoRA / QLoRA",
      "Unsloth",
      "Ragas Evaluation",
    ],
    modules: [
      {
        id: "mod-1",
        number: 1,
        duration: "Weeks 1–4",
        title: "Deep Learning Foundations & Transformer Architectures",
        summary:
          "Understand the mathematical foundations of modern AI: self-attention mechanisms, tokenization, embeddings, and transformer encoders/decoders.",
        topics: [
          "PyTorch tensor operations, autograd, and GPU acceleration with CUDA",
          "The Transformer architecture: Scaled dot-product attention, multi-head attention & positional encodings",
          "Tokenization algorithms (BPE, WordPiece, SentencePiece) and vocabulary design",
          "Hugging Face Transformers pipeline: Loading, inferring, and analyzing open-source weights",
          "Prompt engineering mechanics: Few-shot prompting, Chain-of-Thought (CoT), and structured JSON outputs",
        ],
        handsOnLab: {
          title: "From-Scratch Mini-Transformer & Attention Visualizer",
          description:
            "Implement a multi-head self-attention layer and transformer block from scratch in PyTorch, generating dynamic heatmaps showing token cross-attention on technical prose.",
        },
        technologies: ["Python", "PyTorch", "Hugging Face", "CUDA", "Matplotlib"],
      },
      {
        id: "mod-2",
        number: 2,
        duration: "Weeks 5–9",
        title: "Enterprise RAG & High-Performance Vector Databases",
        summary:
          "Build zero-hallucination Retrieval-Augmented Generation architectures capable of indexing enterprise repositories and documents.",
        topics: [
          "Embedding models: Dense embeddings (OpenAI, BGE, Nomic) vs Sparse BM25 lexical search",
          "Document ingestion pipelines: Recursive chunking, semantic chunking & table extraction",
          "Vector database operations: ChromaDB, Pinecone, and Qdrant indexing & HNSW search",
          "Hybrid search fusion (Reciprocal Rank Fusion - RRF) and cross-encoder rerankers (Cohere Rerank)",
          "Automated hallucination detection and evaluation benchmarks using Ragas & TruLens",
        ],
        handsOnLab: {
          title: "Multi-Source Legal & Regulatory Document Intelligence Engine",
          description:
            "Build an enterprise document knowledge base that parses 1,000+ page corporate filings, performs hybrid dense/sparse search, reranks results, and generates grounded responses with pinpoint citations.",
        },
        technologies: ["LangChain", "ChromaDB", "Pinecone", "Cohere", "Ragas", "FastAPI"],
      },
      {
        id: "mod-3",
        number: 3,
        duration: "Weeks 10–15",
        title: "Autonomous Multi-Agent Systems & Tool-Calling",
        summary:
          "Design collaborative AI agents that reason, plan, use shell tools, run Python scripts, and coordinate in multi-agent workflows.",
        topics: [
          "ReAct (Reason + Act) loop mechanics and Plan-and-Solve patterns",
          "Stateful agent workflows using LangGraph: Cyclic graphs, human-in-the-loop breakpoints & checkpoints",
          "Function calling / Tool use: Web search, database query generation, and code sandbox execution",
          "Multi-agent orchestration: Supervisor architectures, peer-to-peer debates, and swarm consensus",
          "Guardrails and security: Preventing prompt injections, jailbreaks, and sensitive data leakage (NeMo Guardrails)",
        ],
        handsOnLab: {
          title: "Autonomous Software Engineering Swarm (Architect, Coder & QA Agent)",
          description:
            "Develop a collaborative 3-agent software team in LangGraph that reads GitHub issue tickets, writes Python code in a sandboxed Docker environment, runs automated unit tests, and iterates until all tests pass.",
        },
        technologies: ["LangGraph", "LangSmith", "Docker Sandbox", "NeMo Guardrails", "OpenAI / Claude APIs"],
      },
      {
        id: "mod-4",
        number: 4,
        duration: "Weeks 16–20",
        title: "Fine-Tuning Open LLMs & High-Throughput Inference",
        summary:
          "Fine-tune open-weight models (Llama 3.3, Mistral, Qwen) using parameter-efficient fine-tuning (PEFT/QLoRA) and deploy them with vLLM.",
        topics: [
          "Dataset curation: Synthetic data generation, instruction tuning datasets & formatting (ChatML, Alpaca)",
          "Parameter-Efficient Fine-Tuning: LoRA, QLoRA, and 4-bit/8-bit quantization mechanics",
          "Accelerated training with Unsloth and Hugging Face SFTTrainer on cloud GPUs",
          "Evaluation: Perplexity metrics, benchmark suites (MMLU, GSM8K), and LLM-as-a-Judge evaluations",
          "Production model serving with vLLM, PagedAttention, continuous batching, and streaming APIs",
        ],
        handsOnLab: {
          title: "Fine-Tuning and Serving a Specialized Medical / Financial LLM",
          description:
            "Fine-tune an open-source 8B model with QLoRA on a curated domain-specific instruction dataset using an H100 GPU, evaluate zero-shot performance improvement, and deploy with vLLM delivering 85+ tokens/sec.",
        },
        technologies: ["Unsloth", "LoRA/QLoRA", "vLLM", "Ollama", "Triton Server", "Hugging Face Hub"],
      },
    ],
    capstoneProject: {
      title: "OmniAgent: Enterprise Autonomous Copilot for Tech Due Diligence",
      description:
        "Fellows build a production-ready, multi-agent AI system that ingests confidential startup git repositories, financial decks, and architecture docs, runs automated code security audits, and synthesizes a comprehensive investor report with source citations.",
      deliverables: [
        "Multi-agent LangGraph workflow with human-in-the-loop review",
        "Hybrid RAG pipeline indexing codebase ASTs and vector representations",
        "Fine-tuned domain LLM running locally with vLLM backend",
        "Interactive React frontend with streaming markdown and agent reasoning traces",
      ],
    },
  },

  "react-fullstack-architecture": {
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
  },

  "data-science-ml": {
    courseId: "data-science-ml",
    title: "Data Science & Machine Learning Engineering Specialization",
    category: "Data Science",
    badge: "INDUSTRY CERTIFIED",
    duration: "6 Months · 190 Lab Hours",
    intake: "Nov 10, 2026",
    rating: 4.94,
    reviewsCount: 96,
    level: "Data Professionals",
    format: "Hybrid · Analytics Lab & Weekend Deep-Dives",
    overview:
      "A rigorous, mathematically grounded program transforming data analysts and developers into Lead Data Scientists and Machine Learning Engineers capable of training, tuning, and deploying production predictive pipelines.",
    careerOutcomes: {
      targetRoles: [
        "Lead Machine Learning Engineer",
        "Senior Data Scientist",
        "Applied AI Researcher",
        "MLOps Platform Specialist",
      ],
      averageSalaryRange: "$90,000 – $140,000 / yr",
      hiringPartners: ["Enterprise Analytics Hubs", "FinTech Giants", "Healthcare Tech Labs", "Global Advisory Firms"],
    },
    prerequisites: [
      "Foundational Python skills (loops, functions, libraries)",
      "Basic college-level mathematics (linear algebra, derivatives, statistics)",
      "Experience querying tabular data with SQL or Excel",
    ],
    technologies: [
      "Python 3.12",
      "NumPy",
      "Pandas",
      "Scikit-Learn",
      "PyTorch",
      "XGBoost",
      "LightGBM",
      "Optuna",
      "MLflow",
      "FastAPI",
      "Docker",
      "Evidently AI",
    ],
    modules: [
      {
        id: "mod-1",
        number: 1,
        duration: "Weeks 1–5",
        title: "Statistical Inference & Advanced Exploratory Data Analysis",
        summary:
          "Formulate rigorous hypotheses, conduct A/B testing power analysis, and uncover actionable insights from messy real-world datasets.",
        topics: [
          "Probability distributions, central limit theorem, and confidence intervals",
          "Frequentist vs Bayesian statistical inference & A/B testing power calculations",
          "Advanced data wrangling with Pandas: Multi-indexing, window functions & vectorized operations",
          "Exploratory Data Analysis (EDA) pipelines and automated profiling",
          "Interactive data storytelling with Plotly, Seaborn, and statistical visualizations",
        ],
        handsOnLab: {
          title: "Healthcare Clinical Trial Statistical Efficacy Analysis",
          description:
            "Analyze clinical trial datasets across 50,000 patient records, calculating statistical significance, confounding variables, and survival rate distributions.",
        },
        technologies: ["Python", "NumPy", "Pandas", "SciPy", "Statsmodels", "Plotly"],
      },
      {
        id: "mod-2",
        number: 2,
        duration: "Weeks 6–12",
        title: "Supervised & Unsupervised Machine Learning Systems",
        summary:
          "Master regression, classification, clustering, ensemble modeling, and state-of-the-art gradient boosted trees.",
        topics: [
          "Linear regression, regularizations (Ridge/Lasso/ElasticNet), and logistic classification",
          "Tree-based algorithms: Decision trees, Random Forests, and Gradient Boosting (XGBoost, LightGBM, CatBoost)",
          "Feature engineering: Target encoding, interaction terms, PCA dimensionality reduction, and t-SNE",
          "Unsupervised learning: K-Means, DBSCAN, Gaussian Mixture Models & anomaly detection",
          "Hyperparameter optimization with Bayesian search using Optuna",
        ],
        handsOnLab: {
          title: "Credit Card Fraud Anomaly Detection & Churn Engine",
          description:
            "Train an ensemble model on highly imbalanced fraud data (0.17% positive rate), engineering 35+ behavioral features and achieving a 0.94 Precision-Recall AUC score.",
        },
        technologies: ["Scikit-Learn", "XGBoost", "LightGBM", "Optuna", "SHAP"],
      },
      {
        id: "mod-3",
        number: 3,
        duration: "Weeks 13–18",
        title: "Deep Learning Foundations & Neural Networks with PyTorch",
        summary:
          "Build and train multi-layer perceptrons, convolutional neural networks, and sequence models using PyTorch.",
        topics: [
          "Neural network mathematics: Forward pass, backpropagation, and gradient descent optimization (AdamW)",
          "Overfitting mitigations: Dropout, batch normalization, weight decay & early stopping",
          "Convolutional Neural Networks (CNNs) for computer vision and transfer learning with ResNet",
          "Recurrent networks & LSTMs for time-series forecasting and sequence modeling",
          "Explainable AI: Model interpretability using SHAP values, LIME, and feature attribution",
        ],
        handsOnLab: {
          title: "Industrial Sensor Fault Prediction & Anomaly Forecaster",
          description:
            "Build an LSTM neural network that monitors multi-sensor factory IoT telemetry, predicting mechanical component failures 72 hours before breakdown.",
        },
        technologies: ["PyTorch", "Torchvision", "CUDA", "TensorBoard", "SHAP"],
      },
      {
        id: "mod-4",
        number: 4,
        duration: "Weeks 19–24",
        title: "Production MLOps, CI/CD & Model Monitoring",
        summary:
          "Take models from Jupyter notebooks into production containerized APIs with automated data drift and performance monitoring.",
        topics: [
          "Experiment tracking and model versioning with MLflow Model Registry",
          "Packaging models into high-performance REST APIs with FastAPI and Pydantic validation",
          "Containerizing inference services with multi-stage Docker builds",
          "Data drift and model decay detection with Evidently AI and Prometheus metrics",
          "Automated model retraining pipelines triggered by performance degradation",
        ],
        handsOnLab: {
          title: "End-to-End Automated MLOps Deployment with Live Drift Alerts",
          description:
            "Package a trained customer churn model into a Dockerized FastAPI service, instrument with MLflow tracking, and configure automated alerts when input feature distributions drift over 15%.",
        },
        technologies: ["MLflow", "FastAPI", "Docker", "Evidently AI", "GitHub Actions"],
      },
    ],
    capstoneProject: {
      title: "Predictive Healthcare Triage & Patient Risk Stratification Platform",
      description:
        "Fellows engineer an end-to-end clinical machine learning solution that predicts 30-day hospital readmission risks, providing doctors with explainable feature breakdowns and live probability scores.",
      deliverables: [
        "Rigorous EDA report with statistical hypotheses testing",
        "Optimized ensemble model with Optuna hyperparameter tuning",
        "Dockerized REST API serving live predictions in sub-15ms",
        "Evidently AI dashboard monitoring real-time data drift and fairness metrics",
      ],
    },
  },

  "bigdata-spark-bigquery": {
    courseId: "bigdata-spark-bigquery",
    title: "Big Data Engineering with Apache Spark & Google BigQuery",
    category: "Data Science",
    badge: "HIGH DEMAND",
    duration: "5 Months · 150 Lab Hours",
    intake: "Oct 28, 2026",
    rating: 4.91,
    reviewsCount: 79,
    level: "Software & Data Engineers",
    format: "Cloud Data Lab & Intensive Live Sprints",
    overview:
      "A hands-on, enterprise-scale engineering program focused on processing terabyte-to-petabyte datasets using Apache Spark clusters, Google Cloud BigQuery, DBT transformation models, and Kafka streaming pipelines.",
    careerOutcomes: {
      targetRoles: [
        "Lead Big Data Engineer",
        "Cloud Data Warehouse Architect",
        "Streaming Pipeline Specialist",
        "Analytics Platform Engineer",
      ],
      averageSalaryRange: "$90,000 – $140,000 / yr",
      hiringPartners: ["Google Cloud Premier Partners", "Global Telecommunications", "E-Commerce Platforms", "Data Consultancies"],
    },
    prerequisites: [
      "Solid proficiency in SQL (joins, aggregations, window functions)",
      "Intermediate programming skills in Python",
      "Basic understanding of distributed systems and cloud platforms",
    ],
    technologies: [
      "Apache Spark",
      "PySpark",
      "Google BigQuery",
      "DBT (Dataform)",
      "Apache Kafka",
      "Apache Iceberg",
      "Google Cloud Storage",
      "Cloud Composer (Airflow)",
      "Docker",
    ],
    modules: [
      {
        id: "mod-1",
        number: 1,
        duration: "Weeks 1–5",
        title: "Distributed Data Processing with Apache Spark & PySpark",
        summary:
          "Master Apache Spark internals: Catalyst query optimizer, Tungsten memory management, shuffles, and broadcast joins.",
        topics: [
          "Spark architecture: Drivers, Executors, Cluster Managers (YARN/Kubernetes)",
          "DataFrame transformations, lazy evaluation, and execution plans (EXPLAIN)",
          "Avoiding expensive shuffles: Partitioning strategies, bucket joins & broadcast variables",
          "Handling skewed datasets with salting techniques and adaptive query execution (AQE)",
          "Data lake file formats: Parquet, ORC, Snappy compression & schema evolution",
        ],
        handsOnLab: {
          title: "Processing 500M Taxi & Mobility Trip Records with PySpark",
          description:
            "Write an optimized PySpark pipeline that ingests 150GB of raw JSON mobility records, resolves data skews via salting, and writes compacted Parquet files in under 3 minutes.",
        },
        technologies: ["Apache Spark", "PySpark", "Parquet", "Docker", "Jupyter"],
      },
      {
        id: "mod-2",
        number: 2,
        duration: "Weeks 6–10",
        title: "Petabyte-Scale Warehousing with Google BigQuery",
        summary:
          "Architect performant, cost-optimized enterprise data warehouses on Google Cloud BigQuery.",
        topics: [
          "BigQuery architecture: Capacitor columnar storage, Borg compute & Jupiter network",
          "Partitioning and clustering strategies to minimize scanned byte costs by up to 95%",
          "Materialized views, authorized views, and row/column-level security policies",
          "BigQuery BigLake and federated queries across Iceberg tables on Cloud Storage",
          "Slot management: On-demand pricing vs Reservations, autoscaling & query cost governance",
        ],
        handsOnLab: {
          title: "Multi-Million User Behavioral Warehouse Optimization",
          description:
            "Design an optimized BigQuery warehouse schema for a global streaming service, reducing daily query execution scan costs from $450/day to under $18/day.",
        },
        technologies: ["Google BigQuery", "Google Cloud Platform", "BigLake", "SQL"],
      },
      {
        id: "mod-3",
        number: 3,
        duration: "Weeks 11–15",
        title: "Modern ELT Pipelines with DBT & Lakehouse Catalogs",
        summary:
          "Build modular, maintainable, version-controlled SQL transformation DAGs with automated testing and documentation.",
        topics: [
          "The Modern Data Stack: ELT vs ETL and software engineering best practices for data",
          "DBT core concepts: Models, Sources, Seeds, Snapshots (SCD Type 2) & Jinja macros",
          "Incremental models: Timestamp vs unique-key strategies for massive data loads",
          "Automated data quality testing: Schema tests, singular tests, and freshness checks",
          "Apache Iceberg lakehouse tables: Time travel queries, ACID transactions & metadata inspection",
        ],
        handsOnLab: {
          title: "Enterprise DBT Analytics Warehouse for SaaS Subscriptions",
          description:
            "Build an end-to-end DBT pipeline with 30+ staging, intermediate, and mart models, generating automated lineage graphs and passing 100% data freshness tests.",
        },
        technologies: ["DBT", "SQL", "Apache Iceberg", "GitHub Actions", "Jinja"],
      },
      {
        id: "mod-4",
        number: 4,
        duration: "Weeks 16–20",
        title: "Streaming Pipelines with Kafka & Apache Airflow Orchestration",
        summary:
          "Process real-time streaming event data and orchestrate complex dependency DAGs with Cloud Composer / Airflow.",
        topics: [
          "Event streaming with Apache Kafka: Topics, Partitions, Consumer Groups & Offsets",
          "Spark Structured Streaming: Watermarking, sliding windows & event-time processing",
          "Orchestrating batch pipelines with Apache Airflow / Cloud Composer DAGs",
          "Idempotency, retries, alerting (Slack/PagerDuty), and SLA monitoring in Airflow",
          "End-to-end CI/CD for data pipelines with automated test validation",
        ],
        handsOnLab: {
          title: "Real-Time Clickstream Ingestion & Fraud Alert Pipeline",
          description:
            "Build a streaming pipeline that ingests 5,000 Kafka events/second, aggregates user sessions with Spark Structured Streaming, and streams live metrics into BigQuery dashboards.",
        },
        technologies: ["Apache Kafka", "Spark Streaming", "Apache Airflow", "GCP Composer", "Docker"],
      },
    ],
    capstoneProject: {
      title: "Global E-Commerce Omnichannel Data Platform & Real-Time Lakehouse",
      description:
        "Fellows architect a complete cloud lakehouse on GCP that combines streaming telemetry from Kafka with batch financial data in BigQuery, curated by DBT models and orchestrated by Airflow DAGs.",
      deliverables: [
        "Distributed PySpark data lake ingestion engine",
        "Modular DBT analytics models with automated data quality assertions",
        "Airflow DAG orchestration with automated error notifications",
        "Real-time streaming dashboard powered by BigQuery BI Engine",
      ],
    },
  },

  "kubernetes-devops-cloud": {
    courseId: "kubernetes-devops-cloud",
    title: "Cloud-Native Kubernetes, Terraform & DevOps Orchestration",
    category: "Cloud & DevOps",
    badge: "ENTERPRISE ESSENTIAL",
    duration: "4 Months · 130 Lab Hours",
    intake: "Nov 15, 2026",
    rating: 4.95,
    reviewsCount: 110,
    level: "DevOps & Backend Engineers",
    format: "Hands-on Cloud Labs & Real-World Outage Drills",
    overview:
      "A battle-tested cloud-native infrastructure program covering Infrastructure as Code (Terraform), enterprise Kubernetes management, GitOps with ArgoCD, Istio service mesh, observability with Prometheus/Grafana, and zero-trust cloud security.",
    careerOutcomes: {
      targetRoles: [
        "Lead DevOps Engineer",
        "Site Reliability Engineer (SRE)",
        "Cloud Infrastructure Architect",
        "Platform Operations Specialist",
      ],
      averageSalaryRange: "$95,000 – $145,000 / yr",
      hiringPartners: ["Cloud Native Giants", "Global Financial Systems", "Enterprise SaaS", "Consulting Firms"],
    },
    prerequisites: [
      "Comfortable with Linux terminal commands and shell scripting (Bash)",
      "Basic understanding of networking (TCP/IP, DNS, Subnets, CIDR blocks)",
      "Familiarity with basic Docker containers and Git workflows",
    ],
    technologies: [
      "Kubernetes",
      "Terraform",
      "Docker",
      "Helm",
      "ArgoCD",
      "Istio",
      "Prometheus",
      "Grafana",
      "Loki",
      "AWS / Azure / GCP",
      "GitHub Actions",
    ],
    modules: [
      {
        id: "mod-1",
        number: 1,
        duration: "Weeks 1–4",
        title: "Infrastructure as Code (IaC) with Modern Terraform",
        summary:
          "Provision fault-tolerant, multi-region cloud infrastructures declaratively with modular Terraform.",
        topics: [
          "Terraform syntax (HCL), providers, resources, data sources & variables",
          "State management: Remote backends (S3/GCS with DynamoDB locks) & state migration",
          "Writing reusable production modules with input validations and outputs",
          "Multi-environment topologies (Dev, Staging, Prod) with Terraform Workspaces and Terragrunt",
          "Security & policy compliance: Static analysis with tfsec and Trivy",
        ],
        handsOnLab: {
          title: "Multi-Region Enterprise AWS VPC & Secure Bastion Infrastructure",
          description:
            "Write modular Terraform to spin up a high-availability VPC across 3 Availability Zones with private subnets, NAT gateways, automated route tables, and strict security groups.",
        },
        technologies: ["Terraform", "Terragrunt", "AWS / Azure", "tfsec", "Trivy"],
      },
      {
        id: "mod-2",
        number: 2,
        duration: "Weeks 5–9",
        title: "Production Kubernetes Cluster Architecture & Helm",
        summary:
          "Deploy, manage, and scale microservices within high-availability Kubernetes clusters.",
        topics: [
          "Kubernetes control plane vs worker nodes: API server, etcd, scheduler & kubelet",
          "Workload controllers: Pods, Deployments, ReplicaSets, StatefulSets & DaemonSets",
          "Networking deep-dive: ClusterIP, NodePort, LoadBalancer, Ingress & NetworkPolicies",
          "Storage abstractions: PersistentVolumes (PV), PersistentVolumeClaims (PVC) & StorageClasses",
          "Packaging enterprise applications with Helm: Templates, values files, and chart dependencies",
        ],
        handsOnLab: {
          title: "Deploying a Resilient Multi-Tier Microservices Mesh on Kubernetes",
          description:
            "Author custom Helm charts for an e-commerce platform with Redis stateful caching, configure ingress TLS certificates, and implement Horizontal Pod Autoscalers (HPA).",
        },
        technologies: ["Kubernetes", "Helm", "kubectl", "Minikube / k3s", "Docker"],
      },
      {
        id: "mod-3",
        number: 3,
        duration: "Weeks 10–13",
        title: "GitOps Continuous Delivery & Istio Service Mesh",
        summary:
          "Automate declarative cluster reconciliations with ArgoCD and implement traffic shifting with Istio.",
        topics: [
          "The GitOps philosophy: Git as the single source of truth for infrastructure state",
          "Setting up ArgoCD: Applications, ApplicationSets & automated drift healing",
          "Service mesh fundamentals: Envoy sidecar proxies and Istio control plane (Istiod)",
          "Advanced traffic management: Canary releases, blue-green deployments & circuit breaking",
          "Mutual TLS (mTLS) zero-trust encryption and authorization policies across microservices",
        ],
        handsOnLab: {
          title: "Zero-Downtime Canary Release Pipeline with ArgoCD & Istio",
          description:
            "Set up an automated GitOps deployment that pushes updates to an Istio mesh, dynamically shifting 10% of user traffic to a canary version and automatically rolling back on HTTP 500 error spikes.",
        },
        technologies: ["ArgoCD", "Istio", "Envoy", "GitHub Actions", "GitOps"],
      },
      {
        id: "mod-4",
        number: 4,
        duration: "Weeks 14–16",
        title: "Enterprise Observability, SRE Practices & Chaos Drills",
        summary:
          "Monitor cluster metrics, aggregate logs, define SLOs/SLIs, and participate in live incident drills.",
        topics: [
          "Metrics collection with Prometheus and PromQL query language",
          "Custom Grafana operational dashboards for Golden Signals (Latency, Traffic, Errors, Saturation)",
          "Centralized distributed logging with Grafana Loki and Promtail",
          "Defining Service Level Objectives (SLOs), Service Level Indicators (SLIs), and error budgets",
          "Chaos engineering: Simulating node failures, network latency, and automated recovery",
        ],
        handsOnLab: {
          title: "Full-Stack SRE Incident Response & Live Outage Drill",
          description:
            "Simulate a live production cluster outage with network partition and disk exhaustion; diagnose root cause using Prometheus alerts and Loki logs, and execute automated remediation.",
        },
        technologies: ["Prometheus", "Grafana", "Loki", "Chaos Mesh", "PagerDuty"],
      },
    ],
    capstoneProject: {
      title: "CloudForge: Enterprise High-Availability Platform as a Service (PaaS)",
      description:
        "Fellows engineer a production-ready cloud platform from zero: provisioning cloud infrastructure via Terraform, deploying a multi-node Kubernetes cluster with ArgoCD GitOps, securing it with Istio mTLS, and setting up full Prometheus/Grafana observability.",
      deliverables: [
        "Modular Terraform codebase creating secure cloud VPC and Kubernetes cluster",
        "ArgoCD GitOps repository managing Helm chart deployments",
        "Istio service mesh routing with automated canary deployment rules",
        "Grafana dashboards tracking cluster health, SLO error budgets, and system alerts",
      ],
    },
  },
  "cybersecurity-devsecops": {
    courseId: "cybersecurity-devsecops",
    title: "Enterprise Cybersecurity, Penetration Testing & DevSecOps",
    category: "Cybersecurity",
    badge: "DEFENSE & DEVSECOPS",
    duration: "6 Months · 175 Lab Hours",
    intake: "Nov 5, 2026",
    rating: 4.97,
    reviewsCount: 118,
    level: "Intermediate to Advanced",
    format: "Hybrid · Offensive & Defensive Cyber Labs",
    overview:
      "A rigorous, hands-on masterclass taking engineers into offensive security, penetration testing, web application security (OWASP Top 10), Zero-Trust architecture, and automated DevSecOps CI/CD security pipelines.",
    careerOutcomes: {
      targetRoles: [
        "Security Engineer / Application Security Analyst",
        "Penetration Tester / Ethical Hacker",
        "DevSecOps Architect",
        "SOC Threat Analyst",
      ],
      averageSalaryRange: "$95,000 – $145,000 / yr",
      hiringPartners: ["CrowdStrike Partner Network", "FinTech Security Labs", "CyberDefense Hubs", "Enterprise Cloud SOC"],
    },
    prerequisites: [
      "Basic understanding of Linux command-line and networking fundamentals (TCP/IP, DNS, HTTP)",
      "Familiarity with at least one programming or scripting language (Python, JavaScript, Bash, or C#)",
      "Fundamental grasp of web applications and REST APIs",
    ],
    technologies: [
      "Kali Linux",
      "Wireshark",
      "Metasploit",
      "Burp Suite",
      "OWASP ZAP",
      "Nmap",
      "SonarQube",
      "Trivy",
      "Vault by HashiCorp",
      "Docker Security",
      "Python Security",
      "OpenID Connect & OAuth2",
    ],
    modules: [
      {
        id: "mod-1",
        number: 1,
        duration: "Weeks 1–4",
        title: "Network Security, Packet Analysis & Threat Reconnaissance",
        summary:
          "Master network protocols, active & passive reconnaissance, port scanning, traffic analysis, and firewall evasion.",
        topics: [
          "TCP/IP protocol deep dive, packet framing, and packet crafting with Scapy",
          "Advanced network discovery and vulnerability scanning with Nmap",
          "Deep packet inspection and live traffic analysis using Wireshark",
          "Man-in-the-Middle (MitM) attacks, ARP poisoning, and SSL stripping defenses",
          "Network segmentation, IDS/IPS configuration (Snort/Suricata), and firewall rules",
        ],
        handsOnLab: {
          title: "Enterprise Network Penetration & Packet Analysis Lab",
          description:
            "Perform passive and active intelligence gathering against an isolated enterprise network subnet, capture encrypted vs unencrypted credentials, and draft an executive remediation brief.",
        },
        technologies: ["Kali Linux", "Wireshark", "Nmap", "Scapy", "Snort"],
      },
      {
        id: "mod-2",
        number: 2,
        duration: "Weeks 5–9",
        title: "Web Application Security & OWASP Top 10 Exploitation",
        summary:
          "Audit and exploit web vulnerabilities with Burp Suite, SQL injection, XSS, CSRF, and broken access controls.",
        topics: [
          "OWASP Top 10 vulnerability deep dive: Injection (SQLi, NoSQLi, Command Injection)",
          "Cross-Site Scripting (Reflected, Stored, DOM XSS) & CSRF mitigation",
          "Broken Object Level Authorization (BOLA) and modern API security flaws",
          "Interception proxies: Advanced automated and manual testing using Burp Suite Professional",
          "Secure session management, JWT signing vulnerabilities, and token forgery defense",
        ],
        handsOnLab: {
          title: "OWASP Vulnerability Assessment & Exploit Development Lab",
          description:
            "Conduct a full black-box and grey-box security audit against a vulnerable multi-tier web application, write proof-of-concept exploits, and patch the application code.",
        },
        technologies: ["Burp Suite", "OWASP ZAP", "SQLmap", "Postman Security", "JWT Tools"],
      },
      {
        id: "mod-3",
        number: 3,
        duration: "Weeks 10–13",
        title: "Cloud Security, IAM Governance & Zero-Trust Architecture",
        summary:
          "Harden cloud infrastructure across AWS/Azure, configure least-privilege IAM, and deploy Zero-Trust networks.",
        topics: [
          "Cloud shared responsibility model & attack surface analysis (AWS/Azure/GCP)",
          "Least privilege Identity & Access Management (IAM), role assumption & STS tokens",
          "Secrets management and dynamic credentials using HashiCorp Vault",
          "Container and Kubernetes security: Pod Security Standards, image scanning, and runtime alerts (Falco)",
          "Zero-Trust Architecture principles: Identity verification, micro-segmentation & mTLS",
        ],
        handsOnLab: {
          title: "Zero-Trust Cloud & Secrets Hardening Lab",
          description:
            "Deploy HashiCorp Vault into a Kubernetes cluster, configure dynamic PostgreSQL credentials, and enforce strict Zero-Trust network policies between microservices.",
        },
        technologies: ["HashiCorp Vault", "Kubernetes RBAC", "Falco", "Trivy", "Terraform Security"],
      },
      {
        id: "mod-4",
        number: 4,
        duration: "Weeks 14–16",
        title: "DevSecOps Pipelines, Automated SAST/DAST & Threat Hunting",
        summary:
          "Shift security left by integrating automated security scans into CI/CD pipelines and analyzing SIEM logs.",
        topics: [
          "DevSecOps philosophy: Shifting left in GitHub Actions and GitLab CI",
          "Static Application Security Testing (SAST) with SonarQube and Semgrep",
          "Software Bill of Materials (SBOM) and Software Supply Chain Security",
          "Dynamic Application Security Testing (DAST) automated pipeline runs",
          "SOC logging, SIEM threat hunting, and incident response runbooks",
        ],
        handsOnLab: {
          title: "Automated DevSecOps CI/CD Pipeline Lab",
          description:
            "Build an end-to-end GitHub Actions pipeline that blocks pull requests containing vulnerable dependencies (Trivy), security bugs (Semgrep), or exposed hardcoded API secrets.",
        },
        technologies: ["GitHub Actions", "SonarQube", "Semgrep", "Trivy", "SIEM Tools"],
      },
    ],
    capstoneProject: {
      title: "Enterprise Red Team vs Blue Team Capstone Simulation",
      description:
        "Fellows execute an end-to-end security engagement: perform ethical penetration testing on a staging enterprise banking environment, document vulnerabilities, and subsequently deploy defensive DevSecOps controls and HashiCorp Vault secrets to completely remediate all attack vectors.",
      deliverables: [
        "Professional Penetration Testing Report with risk-rated CVE findings",
        "Automated GitHub Actions DevSecOps security pipeline",
        "Remediated and hardened application source code and cloud configuration",
      ],
    },
  },
};

/**
 * Helper function to retrieve syllabus or generate a dynamic fallback for custom courses
 */
export function getProgramSyllabus(courseId: string, fallbackCourseTitle?: string, fallbackCategory?: string): ProgramSyllabusDetails {
  if (PROGRAM_SYLLABI[courseId]) {
    return PROGRAM_SYLLABI[courseId];
  }

  // Fallback generator for courses without an explicit static entry
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
