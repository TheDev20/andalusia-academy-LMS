import React, { useState } from 'react';
import SectionHeading from '../../../components/ui/SectionHeading';
import Badge from '../../../components/common/Badge';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Building,
  GraduationCap,
  ShieldAlert,
  Terminal,
  Code2
} from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    profession: 'Software Engineer / Developer',
    inquiryType: 'Software Engineering & Web Cohorts',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: 'What coding prerequisites are required before enrolling in advanced tracks?',
      a: 'Introductory tracks (like Web Development Foundations or Python Basics) require no prior engineering experience. Advanced cohorts (such as ASP.NET Core Enterprise Microservices, Applied Generative AI, or Kubernetes Orchestration) assume familiarity with fundamental programming constructs, git, and object-oriented or scripting paradigms. A brief diagnostic skills assessment is offered during admissions.'
    },
    {
      q: 'How do physical offline cohort sessions interact with the online LMS platform?',
      a: 'Andalusia Academy combines physical classroom cohort meetings with a modern LMS platform. Course offerings include scheduled weekly sessions in our campus computing studios in Cairo, Alexandria, or Jeddah, while assignments, private resources, attendance records, code submissions, and lecture replays are tracked directly inside your personal Learner Portal.'
    },
    {
      q: 'Are diplomas and certificates recognized by regional and global tech employers?',
      a: 'Yes. All programs culminate in verified certificates and publicly shareable portfolio capstones. Our curricula are mapped directly to industry job roles (Full-Stack Engineer, AI Practitioner, Data Engineer) and aligned with official Microsoft, AWS, and Google Cloud certification objectives.'
    },
    {
      q: 'Are flexible tuition payment plans or installments available?',
      a: 'Yes. We offer flexible zero-interest installment options over 3 to 12 months with leading regional banks and digital payment providers, as well as merit scholarships and corporate sponsorship packages.'
    },
    {
      q: 'What career placement and hiring assistance does Andalusia Academy provide?',
      a: 'Graduating learners receive comprehensive portfolio and code reviews, technical mock interview simulations, and direct introductions through our regional tech hiring network across 240+ partner tech companies in Egypt, the Gulf, and remote global employers.'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  return (
    <div className="contact-page">
      {/* Contact Hero */}
      <section className="contact-hero-section">
        <div className="section-container">
          <div className="contact-hero-content">
            <Badge variant="bronze" dot>CONNECT WITH OUR ADMISSIONS ADVISORS</Badge>
            <h1 className="contact-title">
              We Are Here to Guide Your <em>Engineering Journey.</em>
            </h1>
            <p className="contact-subtitle">
              Have questions regarding track prerequisites, cohort schedules, campus lab facilities, corporate enterprise bootcamps, or tuition installments? Reach out to our technical admissions team today.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form & Hubs Section */}
      <section className="contact-form-section">
        <div className="section-container">
          <div className="contact-split-layout">
            {/* Left: Contact Form */}
            <div className="contact-form-card">
              <div className="form-card-header">
                <h3>Submit an Academic Inquiry</h3>
                <p>Fill out the form below and an admissions advisor will contact you within 24 business hours.</p>
              </div>

              {submitted ? (
                <div className="inquiry-success-state">
                  <CheckCircle2 size={48} className="success-icon" aria-hidden="true" />
                  <h4>Inquiry Successfully Received!</h4>
                  <p>
                    Thank you, <strong>{formData.name}</strong>. An admissions coordinator will review your request for <em>{formData.inquiryType}</em> and reach out to you at <strong>{formData.email}</strong> or <strong>{formData.phone}</strong> shortly.
                  </p>
                  <button
                    type="button"
                    className="btn-new-inquiry"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        email: '',
                        phone: '',
                        profession: 'Software Engineer / Developer',
                        inquiryType: 'Software Engineering & Web Cohorts',
                        message: ''
                      });
                    }}
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form className="inquiry-form" onSubmit={handleSubmit}>
                  <div className="form-row-2">
                    <div className="input-group">
                      <label htmlFor="inquiry-name">Full Name *</label>
                      <input
                        id="inquiry-name"
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="inquiry-email">Email Address *</label>
                      <input
                        id="inquiry-email"
                        type="email"
                        required
                        placeholder="you@company-or-personal.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="input-group">
                      <label htmlFor="inquiry-phone">Phone / WhatsApp Number *</label>
                      <input
                        id="inquiry-phone"
                        type="tel"
                        required
                        placeholder="+20 1X XXXX XXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div className="input-group">
                      <label htmlFor="inquiry-profession">Professional Background</label>
                      <select
                        id="inquiry-profession"
                        value={formData.profession}
                        onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      >
                        <option>Software Engineer / Full-Stack Developer</option>
                        <option>AI / Machine Learning Practitioner</option>
                        <option>Data Scientist / Data Analyst</option>
                        <option>Cloud / DevOps Engineer</option>
                        <option>Cybersecurity Specialist</option>
                        <option>Engineering Manager / CTO</option>
                        <option>University Student / Tech Enthusiast</option>
                        <option>Other Professional</option>
                      </select>
                    </div>
                  </div>

                  <div className="input-group">
                    <label htmlFor="inquiry-type">Inquiry Subject *</label>
                    <select
                      id="inquiry-type"
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    >
                      <option>Software Engineering & Web Cohorts</option>
                      <option>Applied Generative AI & ML Programs</option>
                      <option>Data Science & BigQuery Track</option>
                      <option>Cloud Architecture & DevOps</option>
                      <option>Corporate Enterprise Training Proposals</option>
                      <option>Campus Tech Studio Visit</option>
                      <option>Certificate Verification</option>
                      <option>Technical Support Desk</option>
                    </select>
                  </div>

                  <div className="input-group">
                    <label htmlFor="inquiry-message">How can our academic team assist you? *</label>
                    <textarea
                      id="inquiry-message"
                      rows={4}
                      required
                      placeholder="Please mention your current technical background, target course, or upcoming intake preferences..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn-submit-inquiry">
                    <span>Submit Inquiry to Academic Team</span>
                    <Send size={16} aria-hidden="true" />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Direct Channels & Hubs */}
            <div className="contact-info-panel">
              <div className="hotline-card">
                <div className="hotline-icon">
                  <Phone size={24} aria-hidden="true" />
                </div>
                <div>
                  <span className="hotline-label">Technical Admissions Hotline</span>
                  <div className="hotline-number">16781</div>
                  <span className="hotline-hours">Sun – Thu: 9:00 AM – 6:00 PM (EET)</span>
                </div>
              </div>

              <h4 className="hubs-heading">Academy Campuses & Tech Studios</h4>

              <div className="campus-cards-list">
                <div className="campus-item">
                  <div className="campus-icon">
                    <Building size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h5>Cairo Tech Hub & Computing Studios</h5>
                    <p className="campus-address">
                      Andalusia Tech Hub, Ring Road (Near Carrefour Maadi), Cairo, Egypt
                    </p>
                    <div className="campus-details">
                      <span>Direct: +20 2 2520 6000</span>
                      <span>·</span>
                      <span>admissions.cairo@andalusia-academy.com</span>
                    </div>
                  </div>
                </div>

                <div className="campus-item">
                  <div className="campus-icon">
                    <Building size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h5>Alexandria Software Innovation Center</h5>
                    <p className="campus-address">
                      Andalusia Center Smouha, Victor Emmanuel Square, Alexandria, Egypt
                    </p>
                    <div className="campus-details">
                      <span>Direct: +20 3 427 6000</span>
                      <span>·</span>
                      <span>alex@andalusia-academy.com</span>
                    </div>
                  </div>
                </div>

                <div className="campus-item">
                  <div className="campus-icon">
                    <Building size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h5>Saudi Arabia Regional Hub</h5>
                    <p className="campus-address">
                      Andalusia Center Al-Jamiah, Al-Sirah Al-Atirah St, Jeddah, Saudi Arabia
                    </p>
                    <div className="campus-details">
                      <span>Direct: +966 12 680 6666</span>
                      <span>·</span>
                      <span>ksa@andalusia-academy.com</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Departmental Contacts */}
              <div className="dept-contacts-card">
                <div className="dept-item">
                  <span className="dept-title">Registrar & Credentials Desk:</span>
                  <a href="mailto:registrar@andalusia-academy.com">registrar@andalusia-academy.com</a>
                </div>
                <div className="dept-item">
                  <span className="dept-title">Corporate & Enterprise Contracts:</span>
                  <a href="mailto:corporate@andalusia-academy.com">corporate@andalusia-academy.com</a>
                </div>
                <div className="dept-item">
                  <span className="dept-title">Technical Support & LMS Desk:</span>
                  <a href="mailto:support@andalusia-academy.com">support@andalusia-academy.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="contact-faq-section">
        <div className="section-container">
          <SectionHeading
            badgeText="FREQUENTLY ASKED QUESTIONS"
            title={<>Answers to Common <em>Admissions & Program Inquiries</em></>}
            subtitle="Everything you need to know about enrollments, coding prerequisites, offline cohorts, and credentials."
          />

          <div className="faq-accordion-wrap">
            {faqs.map((faq, fIdx) => {
              const isOpen = activeFaq === fIdx;
              return (
                <div key={fIdx} className={`faq-item ${isOpen ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => toggleFaq(fIdx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className="faq-chevron" aria-hidden="true" />
                  </button>
                  {isOpen && (
                    <div className="faq-answer-content">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
