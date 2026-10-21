import { Cpu, Award, CheckCircle } from "lucide-react";
import { ProgramSyllabusDetails } from "../../types";
import "./SyllabusLabs.css";

interface SyllabusLabsSectionProps {
  syllabus: ProgramSyllabusDetails;
}

export function SyllabusLabsSection({ syllabus }: SyllabusLabsSectionProps) {
  const capstone = syllabus.capstoneProject || {
    title: "Production Multi-Agent RAG Orchestration Platform",
    description:
      "Design, build, benchmark, and deploy a distributed multi-agent system capable of document analysis, real-time tool calling, and high-throughput vector retrieval.",
    deliverables: [
      "End-to-end containerized Docker & Kubernetes deployment",
      "Benchmarked retrieval precision & answer latency against Ragas metrics",
      "Fine-tuned local LLM adapter with QLoRA for domain-specific accuracy",
      "Production-ready API documentation and portfolio walkthrough",
    ],
  };

  return (
    <section id="labs" aria-labelledby="labs-heading" className="syllabus-labs-section">
      <div className="labs-header">
        <h2 id="labs-heading" className="labs-heading">
          Build it on real GPU infrastructure
        </h2>
        <p className="labs-subtitle">
          {syllabus.duration} in the hands-on AI Studio and GPU cloud cluster, ending in an industry-grade capstone you can proudly show to technical hiring managers.
        </p>
      </div>

      <div className="labs-cards-grid">
        {/* Capstone Card */}
        <div className="capstone-main-card">
          <div className="capstone-badge-row">
            <span className="capstone-tag">
              <Award size={15} aria-hidden="true" /> Capstone Project
            </span>
          </div>

          <h3 className="capstone-title">{capstone.title}</h3>
          <p className="capstone-desc">{capstone.description}</p>

          <div className="capstone-deliverables-wrap">
            <h4 className="deliverables-title">Key Project Deliverables:</h4>
            <ul className="deliverables-list">
              {capstone.deliverables.map((item: string, idx: number) => (
                <li key={idx} className="deliverable-item">
                  <CheckCircle size={17} className="deliverable-check" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Infrastructure Highlights Card */}
        <div className="infra-highlight-card">
          <div className="infra-icon-wrap">
            <Cpu size={24} aria-hidden="true" />
          </div>
          <h3 className="infra-title">Dedicated Lab Cloud Compute</h3>
          <p className="infra-desc">
            Every enrolled student receives dedicated cloud GPU instance access (NVIDIA H100 / A100 clusters) pre-configured with CUDA drivers, PyTorch, Hugging Face endpoints, and vector search indices.
          </p>

          <div className="infra-stats-row">
            <div className="infra-stat">
              <span className="stat-num">160h</span>
              <span className="stat-desc">Hands-on Labs</span>
            </div>
            <div className="infra-stat">
              <span className="stat-num">100%</span>
              <span className="stat-desc">Cloud-Hosted</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
