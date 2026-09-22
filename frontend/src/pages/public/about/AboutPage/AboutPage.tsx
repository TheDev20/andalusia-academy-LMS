import './AboutPage.css';
import React from 'react';
import SectionHeading from '../../../../components/ui/SectionHeading';
import Badge from '../../../../components/common/Badge';
import {
  ShieldCheck,
  Award,
  Code2,
  Target,
  Sparkles,
  Users2,
  Building,
  GraduationCap,
  ArrowRight,
  Cpu,
  Database,
  Cloud
} from 'lucide-react';
import { NavigateFunction } from '../../../../types/navigation';

export interface AboutPageProps {
  onNavigate?: NavigateFunction;
}

export default function AboutPage({ onNavigate }: AboutPageProps) {
  const pillars = [
    {
      icon: Code2,
      title: 'Production-Grade Engineering Rigor',
      desc: 'Our curricula are built strictly upon production software standards, Domain-Driven Design (DDD), Clean Architecture, and enterprise code quality.'
    },
    {
      icon: Sparkles,
      title: 'Project-First & Applied Labs',
      desc: 'Theory without practice is forgotten. Trainees build deployed web apps, microservices, AI agents, and data pipelines with continuous code reviews.'
    },
    {
      icon: Users2,
      title: 'Senior Practitioner Mentorship',
      desc: 'Learn directly from principal engineers, AI researchers, and technical directors actively designing high-scale distributed systems in industry.'
    },
    {
      icon: Award,
      title: 'Verified Technical Diplomas',
      desc: 'Every cohort and course delivers verifiable technical credentials, accredited lab hours, and comprehensive public GitHub portfolio capstones.'
    }
  ];

  const faculty = [
    {
      name: 'Eng. Kareem Hegazy',
      role: 'Dean of Technology & Principal Systems Architect',
      creds: 'M.Sc. Computer Science, Ex-BigTech Principal Engineer',
      bio: 'Over 18 years leading distributed backend systems, enterprise .NET microservices, and high-concurrency cloud architectures.',
      img: '/images/tech-lab.jpg'
    },
    {
      name: 'Dr. Mona El-Shinnawy',
      role: 'Director of AI & Machine Learning Research',
      creds: 'Ph.D. in Neural Networks & Computational Intelligence',
      bio: 'Pioneer in applied Generative AI, transformer architectures, and autonomous agent systems across North Africa and the Gulf.',
      img: '/images/tech-hero.jpg'
    },
    {
      name: 'Eng. Tarek Mansour',
      role: 'Lead Cloud Architecture & DevOps Director',
      creds: 'Certified Kubernetes Administrator (CKA), AWS Solutions Architect Pro',
      bio: 'Guided enterprise cloud migrations and zero-downtime CI/CD automation across prominent regional financial institutions.',
      img: '/images/tech-lab.jpg'
    },
    {
      name: 'Eng. Sarah Abdelrahman',
      role: 'Head of Big Data & Analytics Engineering',
      creds: 'Google Cloud Certified Professional Data Engineer',
      bio: 'Specialist in petabyte-scale data lakes, Apache Spark streaming, and automated modern data stack pipelines.',
      img: '/images/tech-hero.jpg'
    }
  ];

  const milestones = [
    { year: '2004', title: 'Academic Center Inception', desc: 'Founded to deliver specialized professional technical and workforce education.' },
    { year: '2014', title: 'Software Engineering Expansion', desc: 'Introduced enterprise software engineering, full-stack, and database architecture bootcamps.' },
    { year: '2020', title: 'AI & Cloud Computing Labs', desc: 'Unveiled regional computing studios dedicated to machine learning, big data, and cloud infrastructure.' },
    { year: '2026', title: 'Phase 1 Modular LMS Launch', desc: 'Deployed state-of-the-art hybrid LMS platform with physical cohort sessions across Cairo, Alexandria, and Jeddah.' }
  ];

  return (
    <div className="about-page">
      {/* About Hero */}
      <section className="about-hero-section">
        <div className="section-container">
          <div className="about-hero-content">
            <Badge variant="bronze" dot>OUR HERITAGE & MISSION</Badge>
            <h1 className="about-title">
              Rooted in Engineering, Dedicated to <em>Technical Distinction.</em>
            </h1>
            <p className="about-subtitle">
              Andalusia Academy is the premier technical and professional learning institute. For more than two decades, we have bridged the gap between academic computer science and the fast-moving reality of modern software engineering, artificial intelligence, and big data.
            </p>
          </div>

          <div className="about-hero-stats">
            <div className="a-stat">
              <span className="a-stat-num">20+</span>
              <span className="a-stat-label">Years of Educational Heritage</span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">18,500+</span>
              <span className="a-stat-label">Graduated Developers & Tech Alumni</span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">100%</span>
              <span className="a-stat-label">Industry-Grounded Faculty & Leads</span>
            </div>
            <div className="a-stat">
              <span className="a-stat-num">3</span>
              <span className="a-stat-label">Campus Tech Hubs (Cairo, Alex, Jeddah)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="about-mission-section">
        <div className="section-container">
          <div className="mission-vision-grid">
            <div className="mission-card">
              <div className="mv-icon-frame">
                <Target size={28} aria-hidden="true" />
              </div>
              <h3>Our Engineering Mission</h3>
              <p>
                To empower developers, data scientists, and engineers through transformative, hands-on technical education, fostering a culture of continuous learning, clean code, and architectural excellence that directly elevates regional tech ecosystems.
              </p>
            </div>

            <div className="vision-card">
              <div className="mv-icon-frame">
                <Sparkles size={28} aria-hidden="true" />
              </div>
              <h3>Our Vision for Tech Education</h3>
              <p>
                To be the Middle East's preeminent technology academy, internationally recognized for producing world-class software engineers, AI researchers, and tech leaders who shape the future of digital software systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values / Pillars */}
      <section className="about-pillars-section">
        <div className="section-container">
          <SectionHeading
            title={<>The Principles That Guide <em>Every Tech Curriculum</em></>}
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
                  <h4>{pillar.title}</h4>
                  <p>{pillar.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modern Tech Labs & Facilities */}
      <section className="about-facilities-section">
        <div className="section-container">
          <div className="facilities-layout">
            <div className="facilities-text">
              <Badge variant="bronze" dot>INNOVATION & CODING STUDIOS</Badge>
              <h2>State-of-the-Art Computing Labs & Offline Cohort Studios</h2>
              <p>
                Our physical campus tech hubs feature high-performance workstations, GPU-accelerated AI training clusters, collaborative pair-programming stations, and high-speed dedicated dev environments where instructors and peers collaborate in real time.
              </p>
              <div className="facility-bullets">
                <div className="f-bullet">
                  <span className="clean-dot-accent" />
                  <span>Dual-monitor development bays with enterprise development toolchains</span>
                </div>
                <div className="f-bullet">
                  <span className="clean-dot-accent" />
                  <span>On-premise GPU clusters for local LLM fine-tuning & model training</span>
                </div>
                <div className="f-bullet">
                  <span className="clean-dot-accent" />
                  <span>Offline evening & weekend cohorts led by dedicated senior engineering mentors</span>
                </div>
              </div>
              <a
                href="#contact"
                className="btn-facility-tour"
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate('contact');
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

      {/* Faculty & Leadership */}
      <section className="about-faculty-section">
        <div className="section-container">
          <SectionHeading
            title={<>Distinguished Engineering <em>Faculty & Mentors</em></>}
            subtitle="Our instructors are practicing senior software architects, AI researchers, and tech leads passionate about accelerating the next generation."
          />

          <div className="faculty-grid">
            {faculty.map((member, idx) => (
              <div key={idx} className="faculty-card">
                <div className="faculty-img-wrap">
                  <img src={member.img} alt={member.name} loading="lazy" />
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

      {/* Timeline of Excellence */}
      <section className="about-timeline-section">
        <div className="section-container">
          <SectionHeading
            title={<>Two Decades of <em>Technology Education Evolution</em></>}
          />

          <div className="timeline-strip">
            {milestones.map((m, idx) => (
              <div key={idx} className="timeline-node">
                <span className="node-year">{m.year}</span>
                <span className="node-dot" />
                <h4 className="node-title">{m.title}</h4>
                <p className="node-desc">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
