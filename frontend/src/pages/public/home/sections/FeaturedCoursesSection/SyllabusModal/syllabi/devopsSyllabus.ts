import { ProgramSyllabusDetails } from "./types";

export const devopsSyllabus: ProgramSyllabusDetails = {
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
};
