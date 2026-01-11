import { useState, useEffect } from "react";
import { LoginDialog } from "@/components/LoginDialog";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "./ScrollToTop";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (id: string) => {
    const element = document.querySelector(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
        <Header
          scrolled={scrolled}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          setShowLoginDialog={setShowLoginDialog}
          scrollToSection={scrollToSection}
        />

        <main className="pt-14 md:pt-16 min-h-screen">{children}</main>

        <Footer />

        <ScrollToTop show={showScrollTop} onClick={scrollToTop} />
      </div>
    </>
  );
}
