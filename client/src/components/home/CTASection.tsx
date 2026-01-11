import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicSettings, incrementContactInquiry } from "@/lib/api";

export function CTASection() {
  const { data: settings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: fetchPublicSettings,
  });

  const handleContactClick = () => {
    if (settings?.email) {
      incrementContactInquiry().catch(console.error);
      window.location.href = `mailto:${settings.email}`;
    }
  };

  const handleResumeClick = () => {
    if (settings?.resumeUrl) {
      window.open(settings.resumeUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section id="contact" className="py-12 md:py-24 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-background" />
      <div className="absolute inset-0 bg-grid-white/[0.02]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-primary/20 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <Badge
            variant="outline"
            className="mb-4 md:mb-6 text-xs md:text-sm border-primary/30 text-primary bg-primary/5 px-3 py-1.5 md:px-4 md:py-2"
          >
            Let's Connect
          </Badge>
          <h2 className="text-2xl md:text-6xl font-bold font-heading mb-6 md:mb-8 leading-tight px-4">
            Have a project in mind? <br />
            <span className="text-gradient-primary">
              Let's build something great.
            </span>
          </h2>
          <p className="text-sm md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-2xl mx-auto px-4">
            I'm always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4">
            <Button
              size="lg"
              onClick={handleContactClick}
              disabled={!settings?.email}
              className="cursor-pointer h-12 md:h-14 lg:h-16 px-6 md:px-8 lg:px-10 text-base md:text-lg lg:text-xl rounded-full bg-foreground text-background hover:bg-white/90 shadow-2xl hover:scale-105 transition-all group disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
              data-testid="button-get-in-touch"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            {settings?.resumeUrl && (
              <Button
                size="lg"
                variant="outline"
                onClick={handleResumeClick}
                className="cursor-pointer h-12 md:h-14 lg:h-16 px-6 md:px-8 lg:px-10 text-base md:text-lg lg:text-xl rounded-full border-white/20 hover:bg-white/5 hover:border-primary/50 backdrop-blur-md w-full sm:w-auto"
              >
                View Resume
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
