import { ProgramSyllabusDetails } from "./types";

export const aspnetSyllabus: ProgramSyllabusDetails = {
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
};
