import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { type Skill } from "@shared/schema";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

interface SkillsSectionProps {
  skills: Skill[];
  isLoading?: boolean;
}

export function SkillsSection({
  skills,
  isLoading = false,
}: SkillsSectionProps) {
  // Don't show section if no skills and not loading
  if (!isLoading && skills.length === 0) {
    return null;
  }

  // Group skills by category (split comma-separated categories)
  const categorizedSkills = useMemo(() => {
    const categories: Record<string, Skill[]> = {};

    skills.forEach((skill) => {
      // Split categories by comma and trim whitespace
      const skillCategories = skill.category
        .split(",")
        .map((cat) => cat.trim())
        .filter((cat) => cat.length > 0);

      // Add skill to each category
      skillCategories.forEach((category) => {
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(skill);
      });
    });

    return categories;
  }, [skills]);

  const categories = Object.keys(categorizedSkills).sort();
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState<Record<string, number>>({});

  const ITEMS_PER_PAGE = 6;

  // Get current page for active tab
  const getCurrentPage = (tab: string) => currentPage[tab] || 1;

  // Get paginated skills for a category
  const getPaginatedSkills = (categorySkills: Skill[], tab: string) => {
    const page = getCurrentPage(tab);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return categorySkills.slice(startIndex, endIndex);
  };

  // Get total pages for a category
  const getTotalPages = (categorySkills: Skill[]) => {
    return Math.ceil(categorySkills.length / ITEMS_PER_PAGE);
  };

  // Handle page change
  const handlePageChange = (tab: string, page: number) => {
    setCurrentPage((prev) => ({ ...prev, [tab]: page }));
    // Scroll to skills section
    document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" });
  };

  // Reset page when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (!currentPage[tab]) {
      setCurrentPage((prev) => ({ ...prev, [tab]: 1 }));
    }
  };

  return (
    <section
      id="skills"
      className="py-12 md:py-20 bg-gradient-to-b from-secondary/30 via-secondary/20 to-background border-y border-white/5 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      <div className="absolute top-1/2 left-0 w-64 h-64 md:w-96 md:h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-purple-500/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8 md:mb-10 lg:mb-12 text-center max-w-3xl mx-auto"
        >
          <Badge
            variant="outline"
            className="mb-3 md:mb-4 text-xs md:text-sm border-primary/30 text-primary bg-primary/5"
          >
            My Toolkit
          </Badge>
          <h2 className="text-3xl md:text-6xl font-bold font-heading mb-4 md:mb-6">
            Technical Expertise
          </h2>
          <p className="text-sm md:text-lg text-muted-foreground px-4">
            My stack is modern and performant. I focus on the React ecosystem
            but am always learning new technologies.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="p-4 md:p-6 rounded-2xl bg-card/50 border border-white/5 animate-pulse h-24 md:h-32"
              />
            ))}
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="w-full justify-center flex-wrap h-auto gap-1.5 md:gap-2 bg-secondary/50 p-1.5 md:p-2 mb-6 md:mb-8 overflow-x-auto">
              <TabsTrigger
                value="All"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer text-xs md:text-sm px-2.5 md:px-3 py-1.5 md:py-2 whitespace-nowrap"
              >
                All
                <Badge variant="secondary" className="ml-1.5 md:ml-2 text-xs">
                  {skills.length}
                </Badge>
              </TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground cursor-pointer text-xs md:text-sm px-2.5 md:px-3 py-1.5 md:py-2 whitespace-nowrap"
                >
                  {category}
                  <Badge variant="secondary" className="ml-1.5 md:ml-2 text-xs">
                    {categorizedSkills[category].length}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="All" className="mt-0">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {getPaginatedSkills(skills, "All").map((skill, index) => (
                  <SkillCard key={skill.id} skill={skill} index={index} />
                ))}
              </div>
              {getTotalPages(skills) > 1 && (
                <SkillsPagination
                  currentPage={getCurrentPage("All")}
                  totalPages={getTotalPages(skills)}
                  onPageChange={(page) => handlePageChange("All", page)}
                />
              )}
            </TabsContent>

            {categories.map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {getPaginatedSkills(
                    categorizedSkills[category],
                    category
                  ).map((skill, index) => (
                    <SkillCard key={skill.id} skill={skill} index={index} />
                  ))}
                </div>
                {getTotalPages(categorizedSkills[category]) > 1 && (
                  <SkillsPagination
                    currentPage={getCurrentPage(category)}
                    totalPages={getTotalPages(categorizedSkills[category])}
                    onPageChange={(page) => handlePageChange(category, page)}
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </section>
  );
}

function SkillCard({ skill, index }: { skill: Skill; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="group p-4 md:p-6 rounded-xl md:rounded-2xl bg-card/50 backdrop-blur-sm border border-white/5 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/5"
      data-testid={`skill-card-${skill.name.toLowerCase()}`}
    >
      <div className="flex justify-between items-center mb-3 md:mb-4 gap-2">
        <div className="flex-1 min-w-0">
          <span className="font-bold text-base md:text-lg group-hover:text-primary transition-colors truncate block">
            {skill.name}
          </span>
        </div>
        <span className="font-mono text-primary text-base md:text-lg font-bold flex-shrink-0">
          {skill.level}%
        </span>
      </div>
      <div className="h-2 md:h-2.5 bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.05 }}
          viewport={{ once: true }}
          className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full relative"
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function SkillsPagination({
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
      className="mt-6 md:mt-8"
    >
      <Pagination>
        <PaginationContent className="gap-1 md:gap-2">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={cn(
                "h-9 md:h-10 px-2 md:px-4 text-xs md:text-sm",
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-primary/10"
              )}
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
                  className={cn(
                    "h-9 md:h-10 w-9 md:w-10 text-xs md:text-sm",
                    currentPage === page
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "cursor-pointer hover:bg-primary/10"
                  )}
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
              className={cn(
                "h-9 md:h-10 px-2 md:px-4 text-xs md:text-sm",
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer hover:bg-primary/10"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </motion.div>
  );
}
