import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => void;
  onEdit: (project: Project) => void;
}

export function ProjectCard({ project, onDelete, onEdit }: ProjectCardProps) {
  return (
    <div
      className="group bg-card border border-white/10 rounded-xl overflow-hidden hover:border-primary/50 transition-colors"
      data-testid={`project-card-${project.id}`}
    >
      <div className="aspect-video relative overflow-hidden bg-muted/20">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors touch-manipulation"
          >
            <Globe className="w-5 h-5" />
          </a>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors touch-manipulation">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-card border-white/10"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onEdit(project)}
              >
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                className="text-destructive cursor-pointer focus:text-destructive"
                onClick={() => onDelete(project.id)}
                data-testid={`button-delete-${project.id}`}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="p-4 sm:p-5 space-y-2 sm:space-y-3">
        <h3
          className="font-bold font-heading text-base sm:text-lg truncate"
          data-testid={`text-title-${project.id}`}
        >
          {project.title}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
        {project.description && (
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
      </div>
    </div>
  );
}
