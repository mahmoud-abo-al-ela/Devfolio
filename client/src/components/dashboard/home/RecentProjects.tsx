import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type Project } from "@shared/schema";

interface RecentProjectsProps {
  projects: Project[];
}

export function RecentProjects({ projects }: RecentProjectsProps) {
  return (
    <Card className="lg:col-span-3 bg-card border-white/5">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Recent Projects</CardTitle>
      </CardHeader>
      <CardContent>
        {projects.length === 0 ? (
          <div
            className="text-center py-2 text-muted-foreground"
            data-testid="empty-recent-projects"
          >
            <p className="text-sm">No projects yet</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {projects.slice(0, 4).map((project) => (
              <div
                key={project.id}
                className="flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg hover:bg-white/5 transition-colors"
                data-testid={`recent-project-${project.id}`}
              >
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-heading truncate">
                    {project.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {project.tags.join(", ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
