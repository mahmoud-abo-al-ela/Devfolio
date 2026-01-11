import { Globe } from "lucide-react";

export function ProjectsEmptyState() {
  return (
    <div
      className="border border-white/10 rounded-md overflow-hidden bg-card/50 p-12 text-center"
      data-testid="empty-state"
    >
      <Globe className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
      <p className="text-muted-foreground text-lg mb-2">No projects yet</p>
      <p className="text-muted-foreground text-sm">
        Click "Add Project" and paste a URL to automatically capture a preview.
      </p>
    </div>
  );
}
