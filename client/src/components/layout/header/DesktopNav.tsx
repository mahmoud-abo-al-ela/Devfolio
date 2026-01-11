import { cn } from "@/lib/utils";

interface NavItem {
  id: string;
  label: string;
}

interface DesktopNavProps {
  activeSection: string;
  scrollToSection: (id: string) => void;
}

const navItems: NavItem[] = [
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export function DesktopNav({
  activeSection,
  scrollToSection,
}: DesktopNavProps) {
  return (
    <nav className="hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(`#${item.id}`)}
          className={cn(
            "text-sm font-medium transition-colors relative group cursor-pointer",
            activeSection === item.id ? "text-primary" : "hover:text-primary"
          )}
        >
          {item.label}
          <span
            className={cn(
              "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all",
              activeSection === item.id ? "w-full" : "w-0 group-hover:w-full"
            )}
          />
        </button>
      ))}
    </nav>
  );
}
