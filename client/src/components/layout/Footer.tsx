import { Github, Linkedin, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchPublicSettings } from "@/lib/api";

export function Footer() {
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["public-settings"],
    queryFn: fetchPublicSettings,
  });

  return (
    <footer className="relative border-t border-white/5 bg-gradient-to-b from-background to-background/50 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      <div className="container mx-auto px-4 py-16">
        {/* Brand Section */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <span className="text-2xl font-bold font-heading tracking-tight inline-block hover:scale-105 transition-transform">
            Dev<span className="text-primary">Folio</span>
          </span>
          <p className="text-muted-foreground max-w-md text-sm md:text-base">
            Building exceptional digital experiences with modern web
            technologies. Let's create something amazing together.
          </p>
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3 pt-2">
              {settings?.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 flex items-center justify-center transition-all group"
                >
                  <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
              {settings?.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 flex items-center justify-center transition-all group"
                >
                  <Linkedin className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
              {settings?.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-primary/20 border border-white/10 hover:border-primary/50 flex items-center justify-center transition-all group"
                >
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} DevFolio. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
