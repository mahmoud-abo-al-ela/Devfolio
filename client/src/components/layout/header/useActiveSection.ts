import { useState, useEffect } from "react";

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["skills", "work", "contact"];
      const scrollPosition = window.scrollY + 100; // Offset for header

      // Check if we're at the top
      if (window.scrollY < 200) {
        setActiveSection("");
        return;
      }

      // Find which section is currently in view
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return activeSection;
}
