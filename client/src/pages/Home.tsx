import MainLayout from "@/components/layout/MainLayout";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchPublicProjects,
  fetchPublicSkills,
  incrementView,
} from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { CTASection } from "@/components/home/CTASection";

export default function Home() {
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: fetchPublicProjects,
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ["public-skills"],
    queryFn: fetchPublicSkills,
  });

  // Track page view
  useEffect(() => {
    incrementView().catch(console.error);
  }, []);

  const scrollToWork = () => {
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <MainLayout>
        <HeroSection
          scrollToWork={scrollToWork}
          scrollToContact={scrollToContact}
        />
        <SkillsSection skills={skills} isLoading={skillsLoading} />
        <ProjectsSection projects={projects} isLoading={projectsLoading} />
        <CTASection />
      </MainLayout>
    </>
  );
}
