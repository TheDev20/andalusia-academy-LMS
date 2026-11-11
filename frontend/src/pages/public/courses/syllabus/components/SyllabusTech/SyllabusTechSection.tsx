import { Terminal } from "lucide-react";
import { ProgramSyllabusDetails } from "../../types";
import { getTechLogoUrl } from "../../techLogos";
import "./SyllabusTech.css";

interface SyllabusTechSectionProps {
  syllabus: ProgramSyllabusDetails;
}

export function SyllabusTechSection({ syllabus }: SyllabusTechSectionProps) {
  const count = syllabus.technologies.length;

  return (
    <section id="tech" aria-labelledby="tech-heading" className="syllabus-tech-section">
      <div className="tech-header">
        <h2 id="tech-heading" className="tech-heading">
          {count} technologies you will master
        </h2>
        <p className="tech-subtitle">
          Industry-standard libraries, frameworks, and tools taught hands-on throughout the modules and capstone projects.
        </p>
      </div>

      <div className="tech-chips-container">
        {syllabus.technologies.map((techName: string, idx: number) => {
          const logoUrl = getTechLogoUrl(techName);
          return (
            <div key={idx} className="tech-chip-item">
              <span className="tech-chip-icon">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt=""
                    width={16}
                    height={16}
                    loading="lazy"
                    className="tech-chip-logo"
                  />
                ) : (
                  <Terminal size={16} aria-hidden="true" />
                )}
              </span>
              <span className="tech-chip-name">{techName}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
