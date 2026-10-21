import { ProgramSyllabusDetails } from "./types";

export const bigDataSyllabus: ProgramSyllabusDetails = {
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
};
