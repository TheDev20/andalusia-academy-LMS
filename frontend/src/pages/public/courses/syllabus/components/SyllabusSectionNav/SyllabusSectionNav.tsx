import { useState, useEffect } from "react";
import "./SyllabusSectionNav.css";

interface SyllabusSectionNavProps {
  modulesCount: number;
  technologiesCount: number;
}

export function SyllabusSectionNav({
  modulesCount,
  technologiesCount,
}: SyllabusSectionNavProps) {
  const [activeSection, setActiveSection] = useState<string>("curriculum");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["curriculum", "labs", "tech", "outcomes"];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setActiveSection(id);
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -80; // Account for sticky nav
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="syllabus-sticky-nav-wrapper">
      <nav aria-label="Course sections" className="syllabus-section-nav">
        <a
          href="#curriculum"
          className={`section-tab-item ${activeSection === "curriculum" ? "is-active" : ""}`}
          onClick={(e) => scrollToSection(e, "curriculum")}
        >
          Curriculum &amp; Modules
          <span className="tab-pill-badge">{modulesCount}</span>
        </a>

        <a
          href="#labs"
          className={`section-tab-item ${activeSection === "labs" ? "is-active" : ""}`}
          onClick={(e) => scrollToSection(e, "labs")}
        >
          Hands-on Labs &amp; Capstone
        </a>

        <a
          href="#tech"
          className={`section-tab-item ${activeSection === "tech" ? "is-active" : ""}`}
          onClick={(e) => scrollToSection(e, "tech")}
        >
          Technologies Mastered
          <span className="tab-pill-badge">{technologiesCount}</span>
        </a>

        <a
          href="#outcomes"
          className={`section-tab-item ${activeSection === "outcomes" ? "is-active" : ""}`}
          onClick={(e) => scrollToSection(e, "outcomes")}
        >
          Career Outcomes &amp; Prerequisites
        </a>
      </nav>
    </div>
  );
}
