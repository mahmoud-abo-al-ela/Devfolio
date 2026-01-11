import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Logo } from "./header/Logo";
import { DesktopNav } from "./header/DesktopNav";
import { UserMenu } from "./header/UserMenu";
import { MobileMenuButton } from "./header/mobile/MobileMenuButton";
import { MobileNav } from "./header/mobile/MobileNav";
import { useActiveSection } from "./header/useActiveSection";

interface HeaderProps {
  scrolled: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setShowLoginDialog: (show: boolean) => void;
  scrollToSection: (id: string) => void;
}

export function Header({
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  setShowLoginDialog,
  scrollToSection,
}: HeaderProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const activeSection = useActiveSection();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5"
          : "border-b border-white/5 bg-background/80 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center justify-between">
        <Logo />

        <DesktopNav
          activeSection={activeSection}
          scrollToSection={scrollToSection}
        />

        <div className="hidden md:flex items-center gap-4">
          <UserMenu
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={handleLogout}
            onLoginClick={() => setShowLoginDialog(true)}
          />
        </div>

        <MobileMenuButton
          mobileMenuOpen={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        />
      </div>

      <MobileNav
        mobileMenuOpen={mobileMenuOpen}
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isAuthenticated={isAuthenticated}
        setShowLoginDialog={setShowLoginDialog}
        setMobileMenuOpen={setMobileMenuOpen}
        onLogout={handleLogout}
      />
    </motion.header>
  );
}
