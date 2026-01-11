import type { Express } from "express";
import { requireAuth } from "./auth.routes";
import { storage } from "../storage";
import { insertProfileSchema } from "@shared/schema";
import { fromError } from "zod-validation-error";

export function registerProfileRoutes(app: Express) {
  // Profile API
  app.get("/api/profile", requireAuth, async (req, res) => {
    try {
      const profileData = await storage.getProfile();
      res.json(profileData || null);
    } catch {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profileData = await storage.updateProfile(validatedData);
      res.json(profileData);
    } catch (error: any) {
      if (error.name === "ZodError") {
        const validationError = fromError(error);
        return res.status(400).json({ error: validationError.toString() });
      }
      res.status(500).json({ error: "Failed to update profile" });
    }
  });
}
