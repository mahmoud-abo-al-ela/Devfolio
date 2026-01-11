import type { Express } from "express";
import { db } from "../../db";
import { analytics, dailyViews } from "@shared/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "./auth.routes";

export function registerAnalyticsRoutes(app: Express) {
  // Get analytics data
  app.get("/api/analytics", requireAuth, async (req, res) => {
    try {
      const result = await db.select().from(analytics).limit(1);

      if (result.length === 0) {
        // Initialize analytics if not exists with some sample data
        const [newAnalytics] = await db
          .insert(analytics)
          .values({
            totalViews: 0,
            projectClicks: 0,
            contactInquiries: 0,
            previousMonthViews: 0,
            previousMonthClicks: 0,
            previousMonthInquiries: 0,
          })
          .returning();
        return res.json(newAnalytics);
      }

      res.json(result[0]);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Get daily views for chart
  app.get("/api/analytics/daily-views", requireAuth, async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 7;

      const result = await db
        .select()
        .from(dailyViews)
        .orderBy(desc(dailyViews.date))
        .limit(days);

      res.json(result.reverse());
    } catch (error) {
      console.error("Error fetching daily views:", error);
      res.status(500).json({ error: "Failed to fetch daily views" });
    }
  });

  // Update analytics data
  app.put("/api/analytics", requireAuth, async (req, res) => {
    try {
      const {
        totalViews,
        projectClicks,
        contactInquiries,
        previousMonthViews,
        previousMonthClicks,
        previousMonthInquiries,
      } = req.body;

      const result = await db.select().from(analytics).limit(1);

      if (result.length === 0) {
        const [newAnalytics] = await db
          .insert(analytics)
          .values({
            totalViews: totalViews || 0,
            projectClicks: projectClicks || 0,
            contactInquiries: contactInquiries || 0,
            previousMonthViews: previousMonthViews || 0,
            previousMonthClicks: previousMonthClicks || 0,
            previousMonthInquiries: previousMonthInquiries || 0,
          })
          .returning();
        return res.json(newAnalytics);
      }

      const [updated] = await db
        .update(analytics)
        .set({
          totalViews,
          projectClicks,
          contactInquiries,
          previousMonthViews,
          previousMonthClicks,
          previousMonthInquiries,
          updatedAt: new Date(),
        })
        .where(eq(analytics.id, result[0].id))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error("Error updating analytics:", error);
      res.status(500).json({ error: "Failed to update analytics" });
    }
  });

  // Increment view count (public endpoint)
  app.post("/api/analytics/view", async (_req, res) => {
    try {
      // Update total views
      const result = await db.select().from(analytics).limit(1);

      if (result.length === 0) {
        await db.insert(analytics).values({
          totalViews: 1,
          projectClicks: 0,
          contactInquiries: 0,
        });
      } else {
        await db
          .update(analytics)
          .set({
            totalViews: result[0].totalViews + 1,
            updatedAt: new Date(),
          })
          .where(eq(analytics.id, result[0].id));
      }

      // Update daily views
      const today = new Date().toISOString().split("T")[0];
      const dailyResult = await db
        .select()
        .from(dailyViews)
        .where(eq(dailyViews.date, today))
        .limit(1);

      if (dailyResult.length === 0) {
        await db.insert(dailyViews).values({
          date: today,
          views: 1,
        });
      } else {
        await db
          .update(dailyViews)
          .set({
            views: dailyResult[0].views + 1,
          })
          .where(eq(dailyViews.id, dailyResult[0].id));
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing view:", error);
      res.status(500).json({ error: "Failed to increment view" });
    }
  });

  // Increment project click count (public endpoint)
  app.post("/api/analytics/project-click", async (_req, res) => {
    try {
      const result = await db.select().from(analytics).limit(1);

      if (result.length === 0) {
        const [newAnalytics] = await db
          .insert(analytics)
          .values({
            totalViews: 0,
            projectClicks: 1,
            contactInquiries: 0,
            previousMonthViews: 0,
            previousMonthClicks: 0,
            previousMonthInquiries: 0,
          })
          .returning();
        return res.json(newAnalytics);
      }

      const [updated] = await db
        .update(analytics)
        .set({
          projectClicks: result[0].projectClicks + 1,
          updatedAt: new Date(),
        })
        .where(eq(analytics.id, result[0].id))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error("Error incrementing project click:", error);
      res.status(500).json({ error: "Failed to increment project click" });
    }
  });

  // Increment contact inquiry count (public endpoint)
  app.post("/api/analytics/contact", async (_req, res) => {
    try {
      const result = await db.select().from(analytics).limit(1);

      if (result.length === 0) {
        const [newAnalytics] = await db
          .insert(analytics)
          .values({
            totalViews: 0,
            projectClicks: 0,
            contactInquiries: 1,
            previousMonthViews: 0,
            previousMonthClicks: 0,
            previousMonthInquiries: 0,
          })
          .returning();
        return res.json(newAnalytics);
      }

      const [updated] = await db
        .update(analytics)
        .set({
          contactInquiries: result[0].contactInquiries + 1,
          updatedAt: new Date(),
        })
        .where(eq(analytics.id, result[0].id))
        .returning();

      res.json(updated);
    } catch (error) {
      console.error("Error incrementing contact inquiry:", error);
      res.status(500).json({ error: "Failed to increment contact inquiry" });
    }
  });
}
