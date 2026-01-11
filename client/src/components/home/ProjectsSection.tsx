import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rocket } from "lucide-react";
import ProjectCard from "@/components/ui/ProjectCard";
import { type Project } from "@shared/schema";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface ProjectsSectionProps {
  projects: Project[];
  isLoading: boolean;
}

export function ProjectsSection({ projects, isLoading }: ProjectsSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 3 : 6;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = projects.slice(startIndex, endIndex);

  // Reset to page 1 when switching between mobile/desktop
  useEffect(() => {
    setCurrentPage(1);
  }, [isMobile]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <section id="work" className="py-12 md:py-20 pb-6 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <div className="max-w-2xl">
            <Badge
              variant="outline"
              className="mb-2 text-xs md:text-sm border-primary/30 text-primary bg-primary/5"
            >
              Portfolio
            </Badge>
            <h2 className="text-3xl md:text-6xl font-bold font-heading mb-3 md:mb-4">
              Selected Work
            </h2>
            <p className="text-sm md:text-lg text-muted-foreground">
              A collection of projects that I'm proud of. Each one represents a
              unique challenge and solution.
            </p>
          </div>
        </motion.div>

        {isLoading ? (
          <LoadingProjects />
        ) : projects.length === 0 ? (
          <EmptyProjects />
        ) : (
          <>
            <ProjectGrid projects={paginatedProjects} />
            {totalPages > 1 && (
              <ProjectsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}

function LoadingProjects() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const skeletonCount = isMobile ? 3 : 6;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="h-80 md:h-96 rounded-xl md:rounded-2xl bg-card/50 border border-white/5 animate-pulse"
        />
      ))}
    </div>
  );
}

function EmptyProjects() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8 md:py-20 px-4 md:px-6 rounded-xl md:rounded-2xl bg-card/30 border border-white/5 border-dashed"
      data-testid="empty-projects"
    >
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 md:mb-6">
        <Rocket className="w-8 h-8 md:w-10 md:h-10 text-primary" />
      </div>
      <p className="text-muted-foreground text-base md:text-lg mb-3 md:mb-4">
        No projects yet.
      </p>
    </motion.div>
  );
}

function ProjectGrid({ projects }: { projects: Project[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <ProjectCard project={project} />
        </motion.div>
      ))}
    </div>
  );
}

function ProjectsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];

    if (totalPages <= 5) {
      // Show all pages if 5 or fewer (better for mobile)
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 md:mt-12"
    >
      <Pagination>
        <PaginationContent className="gap-1 md:gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50 h-9 md:h-10 px-2 md:px-4 text-xs md:text-sm"
                  : "cursor-pointer hover:bg-primary/10 h-9 md:h-10 px-2 md:px-4 text-xs md:text-sm"
              }
            />
          </PaginationItem>

          {getPageNumbers().map((page, index) =>
            page === "ellipsis" ? (
              <PaginationItem
                key={`ellipsis-${index}`}
                className="hidden sm:block"
              >
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => onPageChange(page)}
                  isActive={currentPage === page}
                  className={
                    currentPage === page
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 h-9 md:h-10 w-9 md:w-10 text-xs md:text-sm"
                      : "cursor-pointer hover:bg-primary/10 h-9 md:h-10 w-9 md:w-10 text-xs md:text-sm"
                  }
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          )}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && onPageChange(currentPage + 1)
              }
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50 h-9 md:h-10 px-2 md:px-4 text-xs md:text-sm"
                  : "cursor-pointer hover:bg-primary/10 h-9 md:h-10 px-2 md:px-4 text-xs md:text-sm"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
}
