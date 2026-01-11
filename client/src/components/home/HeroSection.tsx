import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Code2,
  Layers,
  Zap,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import heroImage from "@assets/image.png";
import abstractBg from "@assets/abstract_digital_project_cover.png";

interface HeroSectionProps {
  scrollToWork: () => void;
  scrollToContact: () => void;
}

export function HeroSection({
  scrollToWork,
  scrollToContact,
}: HeroSectionProps) {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);
  const [bgLoaded, setBgLoaded] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);

  return (
    <section className="relative min-h-[90vh] md:min-h-[95vh] flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/95 z-10" />
        <motion.img
          style={{ opacity, scale }}
          src={abstractBg}
          alt=""
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            bgLoaded ? "opacity-40" : "opacity-0"
          }`}
          loading="eager"
          onLoad={() => setBgLoaded(true)}
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-10" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 z-20 grid lg:grid-cols-2 gap-8 md:gap-12 items-center py-8 md:py-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6 md:space-y-8"
        >
          <div className="space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge
                variant="outline"
                className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm border-primary/50 text-primary bg-primary/10 backdrop-blur-md hover:bg-primary/20 transition-colors"
                data-testid="badge-available"
              >
                <Sparkles className="w-3 h-3 mr-1.5 md:mr-2" />
                Available for hire
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-7xl font-bold font-heading leading-[1.1]"
            >
              Crafting Digital <br />
              <span className="text-gradient-primary inline-block">
                Experiences
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm md:text-lg text-muted-foreground max-w-xl leading-relaxed"
            >
              I build accessible, pixel-perfect, and performant web applications
              with a focus on polished UI/UX interactions.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4"
          >
            <Button
              size="lg"
              onClick={scrollToWork}
              className="cursor-pointer h-12 md:h-14 px-6 md:px-8 text-sm md:text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all group w-full sm:w-auto"
              data-testid="button-view-work"
            >
              View My Work
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer h-12 md:h-14 px-6 md:px-8 text-sm md:text-lg rounded-full border-white/10 hover:bg-white/5 hover:border-primary/50 backdrop-blur-md transition-all w-full sm:w-auto"
              data-testid="button-contact"
              onClick={scrollToContact}
            >
              Contact Me
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-6 md:pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4"
          >
            <FeatureCard
              icon={Code2}
              title="Clean Code"
              subtitle="Best practices"
            />
            <FeatureCard icon={Zap} title="Fast" subtitle="Optimized" />
            <FeatureCard
              icon={Layers}
              title="Scalable"
              subtitle="Architecture"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="relative hidden lg:block"
        >
          <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-sm p-4 lg:p-6 rotate-2 hover:rotate-0 transition-all duration-500 hover:scale-105 group">
            <img
              src={heroImage}
              alt="Developer"
              className="rounded-xl w-full max-w-md mx-auto"
              loading="eager"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-purple-500/20 blur-3xl -z-10 rounded-full transform translate-y-10 group-hover:scale-110 transition-transform duration-500" />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-muted-foreground transition-colors group cursor-pointer"
        >
          <span className="text-xs md:text-sm font-medium">
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-y-1 transition-transform" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: any;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-white/5 border border-white/5 hover:border-primary/30 transition-colors">
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="font-semibold text-xs md:text-sm truncate">{title}</div>
        <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
      </div>
    </div>
  );
}
