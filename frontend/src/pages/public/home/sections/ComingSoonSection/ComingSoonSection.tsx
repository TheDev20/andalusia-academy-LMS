import { useState } from "react";
import { Calendar, Bell, Sparkles, ArrowRight } from "lucide-react";
import Badge from "../../../../../components/common/Badge";
import SectionHeading from "../../../../../components/ui/SectionHeading";
import "./ComingSoonSection.css";

export interface UpcomingProgram {
  id: string;
  title: string;
  track: string;
  targetAudience: string;
  launchDate: string;
  seatsLimit: string;
  highlight: string;
  badge: string;
}

export default function ComingSoonSection() {
  const [emailInput, setEmailInput] = useState("");
  const [subscribedProgram, setSubscribedProgram] =
    useState<UpcomingProgram | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const upcomingPrograms = [
    {
      id: "autonomous-agents",
      title: "Autonomous Multi-Agent AI Systems & Tool-Calling Architectures",
      track: "Artificial Intelligence & Agents",
      targetAudience: "Software Engineers, AI Practitioners & Tech Leads",
      launchDate: "December 2026",
      seatsLimit: "Limited to 20 Cohort Fellows",
      highlight:
        "Build production-grade collaborative multi-agent frameworks with memory, planning, code execution sandboxes, and verification.",
      badge: "NEXT-GEN AI",
    },
    {
      id: "quantum-computing",
      title: "Quantum Computing & Post-Quantum Cryptography Algorithms",
      track: "Advanced Computing",
      targetAudience: "Systems Engineers & Research Scientists",
      launchDate: "January 2027",
      seatsLimit: "18 Engineers per Intake",
      highlight:
        "Hands-on quantum circuit simulations using Qiskit, quantum key distribution protocols, and post-quantum encryption standards.",
      badge: "RESEARCH TRACK",
    },
    {
      id: "rust-distributed-systems",
      title: "High-Frequency Distributed Systems & Concurrency in Rust",
      track: "Systems Engineering",
      targetAudience: "Backend Developers & Infrastructure Engineers",
      launchDate: "February 2027",
      seatsLimit: "Hybrid 25 Seats",
      highlight:
        "Zero-cost abstractions, memory-safe multithreading, raft consensus algorithms, and ultra-low-latency network servers.",
      badge: "HIGH DEMAND",
    },
  ];

  const handleNotifyMe = (program: UpcomingProgram) => {
    setSubscribedProgram(program);
    setSubmitted(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      return;
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSubscribedProgram(null);
      setEmailInput("");
    }, 4000);
  };

  return (
    <section
      className="coming-soon-section"
      aria-label="Upcoming Programs and Bootcamps"
    >
      <div className="section-container">
        <SectionHeading
          title={
            <>
              Previewing Upcoming <em>Tech Bootcamps & Cohorts</em>
            </>
          }
          subtitle="Stay on the cutting edge of software development, AI, and distributed systems. Pre-register your interest for priority seat reservation and early applicant tuition benefits."
        />

        <div className="coming-soon-grid">
          {upcomingPrograms.map((prog) => (
            <div key={prog.id} className="coming-soon-card">
              <div className="coming-soon-card-top">
                <Badge variant="bronze" dot>
                  {prog.badge}
                </Badge>
                <div className="launch-tag">
                  <Calendar size={14} aria-hidden="true" />
                  <span>{prog.launchDate}</span>
                </div>
              </div>

              <span className="prog-track-label">{prog.track}</span>
              <h3 className="prog-title">{prog.title}</h3>
              <p className="prog-highlight">{prog.highlight}</p>

              <div className="prog-details-meta">
                <div className="prog-target">
                  <span className="meta-label">Ideal For:</span>
                  <span className="meta-val">{prog.targetAudience}</span>
                </div>
                <div className="prog-capacity">
                  <span className="meta-label">Capacity:</span>
                  <span className="meta-val">{prog.seatsLimit}</span>
                </div>
              </div>

              <button
                type="button"
                className="btn-pre-register"
                onClick={() => handleNotifyMe(prog)}
              >
                <Bell size={14} aria-hidden="true" />
                <span>Notify Me When Applications Open</span>
              </button>
            </div>
          ))}
        </div>

        {/* Priority Notification Modal / Drawer */}
        {subscribedProgram && (
          <div className="priority-drawer-overlay">
            <div className="priority-drawer-card">
              <div className="drawer-header">
                <div className="drawer-badge">
                  <Sparkles size={16} aria-hidden="true" />
                  <span>Priority Waitlist Enrollment</span>
                </div>
                <button
                  type="button"
                  className="drawer-close-btn"
                  onClick={() => setSubscribedProgram(null)}
                >
                  ✕
                </button>
              </div>

              <h4>{subscribedProgram.title}</h4>
              <p className="drawer-desc">
                Be the first to receive the official syllabus, interview
                requirements, and early-bird registration access before public
                intake launch.
              </p>

              {submitted ? (
                <div className="drawer-success">
                  <Sparkles size={32} className="success-icon" />
                  <h5>You're on the priority waitlist!</h5>
                  <p>
                    We'll notify you at <strong>{emailInput}</strong> as soon as
                    applications open.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="drawer-form">
                  <label htmlFor="priority-email">
                    Your Work or Personal Email
                  </label>
                  <input
                    id="priority-email"
                    type="email"
                    required
                    placeholder="e.g. dev.engineer@example.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <button type="submit" className="btn-drawer-submit">
                    <span>Confirm Priority Notification</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
