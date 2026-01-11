import type { Express } from "express";
import { registerAuthRoutes } from "./auth.routes";
import { registerPublicRoutes } from "./public.routes";
import { registerProjectRoutes } from "./projects.routes";
import { registerProfileRoutes } from "./profile.routes";
import { registerSkillRoutes } from "./skills.routes";
import { registerSettingsRoutes } from "./settings.routes";
import { registerAnalyticsRoutes } from "./analytics.routes";
import uploadRoutes from "./upload.routes";

export function registerAllRoutes(app: Express) {
  // Register all route modules
  registerAuthRoutes(app);
  registerPublicRoutes(app);
  registerProjectRoutes(app);
  registerProfileRoutes(app);
  registerSkillRoutes(app);
  registerSettingsRoutes(app);
  registerAnalyticsRoutes(app);

  // Upload routes
  app.use("/api/upload", uploadRoutes);
}
