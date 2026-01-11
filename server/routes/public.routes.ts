import type { Express } from "express";
import { storage } from "../storage";

export function registerPublicRoutes(app: Express) {
  // Public endpoints (no auth required)

  // Public skills endpoint for home page
  app.get("/api/public/skills", async (req, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  // Public projects endpoint for home page
  app.get("/api/public/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  // Public settings endpoint for home page
  app.get("/api/public/settings", async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || null);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });
}
