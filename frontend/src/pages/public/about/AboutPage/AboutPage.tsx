import { Target, Sparkles, ArrowRight } from "lucide-react";
import { NavigateFunction } from "../../../../types/navigation";
import Badge from "../../../../components/common/Badge";
import SectionHeading from "../../../../components/ui/SectionHeading";
import { pillars, faculty, milestones } from "./index";
import "./AboutPage.css";
export interface AboutPageProps {
  onNavigate?: NavigateFunction;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  return (
    <div className="about-page">
      <section className="about-hero-section">
        <div className="section-container">
          <div className="about-hero-content">
            <Badge variant="bronze" dot>
              OUR HERITAGE &amp; MISSION
            </Badge>
            <h1 className="about-title">
              Rooted in Engineering, Dedicated to{" "}
              <em>Technical Distinction.</em>
            </h1>
            <p className="about-subtitle">
              Andalusia Academy is the premier technical and professional
              learning institute. For more than two decades, we have bridged the
              gap between academic computer science and the fast-moving reality
              of modern software engineering, artificial intelligence, and big
              data.
            </p>
          </div>
          <div className="about-hero-stats">
            <div className="a-stat">
              <span className="a-stat-num">20+</span>
              <span className="a-stat-label">
                Years of Educational Heritage
              </span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">18,500+</span>
              <span className="a-stat-label">
                Graduated Developers &amp; Tech Alumni
              </span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">100%</span>
              <span className="a-stat-label">
                Industry-Grounded Faculty &amp; Leads
              </span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">3</span>
              <span className="a-stat-label">
                Campus Tech Hubs (Cairo, Alex, Jeddah)
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission-section">
        <div className="section-container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="mv-icon-frame">
                <Target size={32} aria-hidden="true" />
              </div>
              <h2>Our Engineering Mission</h2>
              <p>
                To empower developers, data scientists, and engineers through
                transformative, hands-on technical education, fostering a
                culture of continuous learning, clean code, and architectural
                excellence that directly elevates regional tech ecosystems.
              </p>
            </div>
            <div className="vision-card">
              <div className="mv-icon-frame">
                <Sparkles size={32} aria-hidden="true" />
              </div>
              <h2>Our Vision for Tech Education</h2>
              <p>
                To be the Middle East's preeminent technology academy,
                internationally recognized for producing world-class software
                engineers, AI researchers, and tech leaders who shape the future
                of digital software systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-pillars-section">
        <div className="section-container">
          <SectionHeading
            title={
              <>
                The Principles That Guide <em>Every Tech Curriculum</em>
              </>
            }
            subtitle="How Andalusia Academy shapes engineers who build with precision, clean code, and leadership."
          />
          <div className="pillars-grid">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="pillar-item-card">
                  <div className="p-icon-wrap">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-facilities-section">
        <div className="section-container">
          <div className="facilities-layout">
            <div className="facilities-text">
              <Badge variant="bronze" dot>
                INNOVATION &amp; CODING STUDIOS
              </Badge>
              <h2>State-of-the-Art Computing Labs &amp; Offline Cohort Studios</h2>
              <p>
                Our physical campus tech hubs feature high-performance
                workstations, GPU-accelerated AI training clusters,
                collaborative pair-programming stations, and high-speed
                dedicated dev environments where instructors and peers
                collaborate in real time.
              </p>
              <div className="facility-bullets">
                <div className="f-bullet">
                  <span className="clean-dot-accent" />
                  <span>
                    Dual-monitor development bays with enterprise development
                    toolchains
                  </span>
                </div>
                <div className="f-bullet">
                  <span className="clean-dot-accent" />
                  <span>
                    On-premise GPU clusters for local LLM fine-tuning &amp; model
                    training
                  </span>
                </div>
                <div className="f-bullet">
                  <span className="clean-dot-accent" />
                  <span>
                    Offline evening &amp; weekend cohorts led by dedicated senior
                    engineering mentors
                  </span>
                </div>
              </div>
              <a
                href="#contact"
                className="btn-facility-tour"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate("contact");
                  }
                }}
              >
                <span>Visit Our Campus Tech Studios</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
            <div className="facilities-visual">
              <img
                src="/images/tech-hero.jpg"
                alt="Andalusia Academy Modern Tech Lab and Coding Innovation Environment"
                className="facility-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="faculty" className="about-faculty-section">
        <div className="section-container">
          <SectionHeading
            title={
              <>
                Distinguished Engineering <em>Faculty &amp; Mentors</em>
              </>
            }
            subtitle="Our instructors are practicing senior software architects, AI researchers, and tech leads passionate about accelerating the next generation."
          />
          <div className="faculty-grid">
            {faculty.map((member, idx) => (
              <div key={idx} className="faculty-card">
                <div className="faculty-img-wrap">
                  <img src={member.img} alt={member.name} loading="lazy" />
                  <div className="faculty-avatar-monogram" aria-hidden="true">
                    {member.initials}
                  </div>
                  <div className="faculty-badge-role">{member.creds}</div>
                </div>
                <div className="faculty-info">
                  <h3 className="faculty-name">{member.name}</h3>
                  <span className="faculty-title">{member.role}</span>
                  <p className="faculty-bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-timeline-section">
        <div className="section-container">
          <SectionHeading
            title={
              <>
                Two Decades of <em>Technology Education Evolution</em>
              </>
            }
          />
          <div className="timeline-strip">
            {milestones.map((m, idx) => (
              <div key={idx} className="timeline-node">
                <span className="node-year">{m.year}</span>
                <span className="node-dot" />
                <h3 className="node-title">{m.title}</h3>
                <p className="node-desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
