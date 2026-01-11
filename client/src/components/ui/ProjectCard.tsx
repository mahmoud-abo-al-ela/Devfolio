import { motion } from "framer-motion";
import { type Project } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, Globe } from "lucide-react";
import { useState } from "react";
import { incrementProjectClick } from "@/lib/api";

export default function ProjectCard({ project }: { project: Project }) {
  const [imageError, setImageError] = useState(false);

  const handleClick = () => {
    incrementProjectClick().catch(console.error);
  };

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block"
      onClick={handleClick}
      data-testid={`link-project-${project.id}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="group relative overflow-hidden rounded-xl border border-white/10 bg-card hover:border-primary/50 transition-colors cursor-pointer h-full"
        data-testid={`card-project-${project.id}`}
      >
        <div className="w-full overflow-hidden bg-muted/20 relative">
          {imageError ? (
            <div className="h-full w-full flex items-center justify-center">
              <Globe className="w-12 h-12 text-muted-foreground/30" />
            </div>
          ) : (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              onError={() => setImageError(true)}
            />
          )}
          {/* Hover overlay - only visible on desktop */}
          <div className="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center backdrop-blur-sm pointer-events-none">
            <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View Project <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <h3
              className="text-base md:text-xl font-bold font-heading mb-2 group-hover:text-primary transition-colors"
              data-testid={`text-title-${project.id}`}
            >
              {project.title}
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="bg-primary/10 text-primary text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {project.description && (
            <p
              className="text-muted-foreground line-clamp-2 text-sm md:text-base"
              data-testid={`text-description-${project.id}`}
            >
              {project.description}
            </p>
          )}
        </div>
      </motion.div>
    </a>
  );
}
