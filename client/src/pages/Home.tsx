import MainLayout from "@/components/layout/MainLayout";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  fetchPublicProjects,
  fetchPublicSkills,
  incrementView,
} from "@/lib/api";
import { HeroSection } from "@/components/home/HeroSection";
import { SkillsSection } from "@/components/home/SkillsSection";
import { ProjectsSection } from "@/components/home/ProjectsSection";
import { CTASection } from "@/components/home/CTASection";
import heroImage from "@assets/image.png";
import abstractBg from "@assets/abstract_digital_project_cover.png";

export default function Home() {
  const [imagesLoaded, setImagesLoaded] = useState(false);

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: fetchPublicProjects,
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ["public-skills"],
    queryFn: fetchPublicSkills,
  });

  // Preload hero images
  useEffect(() => {
    const images = [heroImage, abstractBg];
    let loaded = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === images.length) {
          setImagesLoaded(true);
        }
      };
      img.onerror = () => {
        loaded++;
        if (loaded === images.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  // Track page view
  useEffect(() => {
    incrementView();
  }, []);

  const scrollToWork = () => {
    document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToContact = () => {
    document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
  };

  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="relative w-16 h-16 mx-auto">
            <motion.div
              className="absolute inset-0 border-4 border-primary/20 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
          <p className="text-muted-foreground font-medium">Loading...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <MainLayout>
      <HeroSection
        scrollToWork={scrollToWork}
        scrollToContact={scrollToContact}
      />
      <SkillsSection skills={skills} isLoading={skillsLoading} />
      <ProjectsSection projects={projects} isLoading={projectsLoading} />
      <CTASection />
    </MainLayout>
  );
}
