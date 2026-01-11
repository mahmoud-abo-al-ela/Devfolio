import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  serial,
  timestamp,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  googleId: text("google_id").unique(),
  avatar: text("avatar"),
  isAllowed: boolean("is_allowed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  name: true,
  googleId: true,
  avatar: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  link: text("link").notNull(),
  tags: text("tags")
    .array()
    .notNull()
    .default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const profile = pgTable("profile", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").notNull(),
  email: text("email").notNull(),
  github: text("github"),
  linkedin: text("linkedin"),
  twitter: text("twitter"),
});

export const insertProfileSchema = createInsertSchema(profile).omit({
  id: true,
});

export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profile.$inferSelect;

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: integer("level").notNull(),
  category: text("category").notNull().default("Other"),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSkillSchema = createInsertSchema(skills).omit({
  id: true,
  createdAt: true,
  order: true,
});

export type InsertSkill = z.infer<typeof insertSkillSchema>;
export type Skill = typeof skills.$inferSelect;

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  githubUrl: text("github_url"),
  linkedinUrl: text("linkedin_url"),
  resumeUrl: text("resume_url"),
  email: text("email"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertSettingsSchema = createInsertSchema(settings).omit({
  id: true,
  updatedAt: true,
});

export type InsertSettings = z.infer<typeof insertSettingsSchema>;
export type Settings = typeof settings.$inferSelect;

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  totalViews: integer("total_views").notNull().default(0),
  projectClicks: integer("project_clicks").notNull().default(0),
  contactInquiries: integer("contact_inquiries").notNull().default(0),
  previousMonthViews: integer("previous_month_views").notNull().default(0),
  previousMonthClicks: integer("previous_month_clicks").notNull().default(0),
  previousMonthInquiries: integer("previous_month_inquiries")
    .notNull()
    .default(0),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  updatedAt: true,
});

export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analytics.$inferSelect;

export const dailyViews = pgTable("daily_views", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(), // Format: YYYY-MM-DD
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDailyViewsSchema = createInsertSchema(dailyViews).omit({
  id: true,
  createdAt: true,
});

export type InsertDailyViews = z.infer<typeof insertDailyViewsSchema>;
export type DailyViews = typeof dailyViews.$inferSelect;
