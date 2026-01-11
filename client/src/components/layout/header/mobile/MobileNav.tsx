import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { LogIn, LayoutDashboard, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

interface NavItem {
  id: string;
  label: string;
}

interface MobileNavProps {
  mobileMenuOpen: boolean;
  activeSection: string;
  scrollToSection: (id: string) => void;
  isAuthenticated: boolean;
  setShowLoginDialog: (show: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  onLogout: () => void;
}

const navItems: NavItem[] = [
  { id: "skills", label: "Skills" },
  { id: "work", label: "Work" },
  { id: "contact", label: "Contact" },
];

export function MobileNav({
  mobileMenuOpen,
  activeSection,
  scrollToSection,
  isAuthenticated,
  setShowLoginDialog,
  setMobileMenuOpen,
  onLogout,
}: MobileNavProps) {
  return (
    <AnimatePresence>
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl"
        >
          <nav className="container mx-auto px-4 sm:px-6 py-4 md:py-6 flex flex-col gap-2 md:gap-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  // Small delay to let menu close animation start before scrolling
                  setTimeout(() => scrollToSection(`#${item.id}`), 100);
                }}
                className={cn(
                  "text-left text-sm md:text-base font-medium transition-colors py-2.5 md:py-3 px-2 rounded-lg hover:bg-white/5",
                  activeSection === item.id
                    ? "text-primary bg-primary/10"
                    : "hover:text-primary"
                )}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 md:pt-4 border-t border-white/5 space-y-2">
              {
                isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start h-10 md:h-11"
                      >
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start h-10 md:h-11 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </>
                ) : null /* Hide login button - auto-redirect happens in ProtectedRoute */
              }
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
