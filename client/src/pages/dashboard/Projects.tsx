import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api";
import { ProjectDialog } from "@/components/dashboard/projects/ProjectDialog";
import { ProjectCard } from "@/components/dashboard/projects/ProjectCard";
import { ProjectsEmptyState } from "@/components/dashboard/projects/ProjectsEmptyState";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import type { Project } from "@shared/schema";

const MOBILE_ITEMS_PER_PAGE = 3;
const DESKTOP_ITEMS_PER_PAGE = 6;

export default function Projects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Calculate pagination based on screen size
  const ITEMS_PER_PAGE = isMobile
    ? MOBILE_ITEMS_PER_PAGE
    : DESKTOP_ITEMS_PER_PAGE;
  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  // Reset to page 1 when projects change
  const handleProjectsChange = () => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  };

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      handleProjectsChange();
      toast({
        title: "Project created",
        description: "Your new project has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setOpen(false);
      setEditingProject(null);
      handleProjectsChange();
      toast({
        title: "Project updated",
        description: "Your project has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      handleProjectsChange();
      toast({
        title: "Project deleted",
        description: "The project has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    if (editingProject) {
      updateMutation.mutate({
        id: editingProject.id,
        data: {
          title: values.title,
          description: values.description,
          imageUrl: values.imageUrl,
          link: values.link,
          tags: values.tags,
        },
      });
    } else {
      createMutation.mutate({
        title: values.title,
        description: values.description,
        imageUrl: values.imageUrl,
        link: values.link,
        tags: values.tags,
      });
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setOpen(true);
  };

  const handleCloseDialog = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setEditingProject(null);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-heading">
            Projects
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage your portfolio projects.
            {projects.length > 0 && (
              <span className="ml-1">({projects.length} total)</span>
            )}
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary/90 cursor-pointer w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isLoading ? (
        <div className="border border-white/10 rounded-md overflow-hidden bg-card/50 p-8">
          <p className="text-center text-muted-foreground">
            Loading projects...
          </p>
        </div>
      ) : projects.length === 0 ? (
        <ProjectsEmptyState />
      ) : (
        <>
          <div className="grid gap-4 sm:gap-5 lg:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {currentProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, projects.length)} of {projects.length}{" "}
                projects
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="cursor-pointer touch-manipulation"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 cursor-pointer touch-manipulation ${
                          currentPage === page
                            ? "bg-primary hover:bg-primary/90"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="cursor-pointer touch-manipulation"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ProjectDialog
        open={open}
        onOpenChange={handleCloseDialog}
        onSubmit={handleSubmit}
        isPending={createMutation.isPending || updateMutation.isPending}
        editingProject={editingProject}
      />
    </DashboardLayout>
  );
}
