import type { Express } from "express";
import { requireAuth } from "./auth.routes";
import { storage } from "../storage";
import { insertSettingsSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export function registerSettingsRoutes(app: Express) {
  // Protected settings routes
  app.get("/api/settings", requireAuth, async (req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings || null);
    } catch {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.put("/api/settings", requireAuth, async (req, res) => {
    try {
      const validatedData = insertSettingsSchema.parse(req.body);
      const settings = await storage.updateSettings(validatedData);
      res.json(settings);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: "Failed to update settings" });
    }
  });
}
