import type { Express } from "express";
import { requireAuth } from "./auth.routes";
import { storage } from "../storage";
import { insertSkillSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export function registerSkillRoutes(app: Express) {
  // Protected skill routes
  app.get("/api/skills", requireAuth, async (req, res) => {
    try {
      const skills = await storage.getAllSkills();
      res.json(skills);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.post("/api/skills", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validatedData);
      res.status(201).json(skill);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error creating skill:", error);
      res.status(500).json({ error: "Failed to create skill" });
    }
  });

  app.patch("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, validatedData);

      if (!skill) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.json(skill);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      console.error("Error updating skill:", error);
      res.status(500).json({ error: "Failed to update skill" });
    }
  });

  app.delete("/api/skills/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteSkill(id);

      if (!success) {
        return res.status(404).json({ error: "Skill not found" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ error: "Failed to delete skill" });
    }
  });

  app.post("/api/skills/reorder", requireAuth, async (req, res) => {
    try {
      const { skillIds } = req.body;
      if (!Array.isArray(skillIds)) {
        return res.status(400).json({ error: "skillIds must be an array" });
      }
      await storage.updateSkillsOrder(skillIds);
      res.json({ success: true });
    } catch (error) {
      console.error("Error reordering skills:", error);
      res.status(500).json({ error: "Failed to reorder skills" });
    }
  });
}
