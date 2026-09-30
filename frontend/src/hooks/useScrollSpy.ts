import { useEffect, useState } from "react";

export function useScrollSpy(
  sectionIds: readonly string[],
  offset = 160,
  enabled = true
): string {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] || "");

  useEffect(() => {
    if (!enabled || sectionIds.length === 0) return;

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + offset;
      let current = sectionIds[0] || "";

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScrollSpy, { passive: true });
    handleScrollSpy();
    return () => window.removeEventListener("scroll", handleScrollSpy);
  }, [sectionIds, offset, enabled]);

  return activeSection;
}
