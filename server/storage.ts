import {
  type User,
  type InsertUser,
  type Project,
  type InsertProject,
  type Profile,
  type InsertProfile,
  type Skill,
  type InsertSkill,
  type Settings,
  type InsertSettings,
  users,
  projects,
  profile,
  skills,
  settings,
} from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "../db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(
    id: number,
    project: Partial<InsertProject>
  ): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;

  getProfile(): Promise<Profile | undefined>;
  updateProfile(data: InsertProfile): Promise<Profile>;

  getAllSkills(): Promise<Skill[]>;
  getSkill(id: number): Promise<Skill | undefined>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(
    id: number,
    skill: Partial<InsertSkill>
  ): Promise<Skill | undefined>;
  deleteSkill(id: number): Promise<boolean>;

  getSettings(): Promise<Settings | undefined>;
  updateSettings(data: InsertSettings): Promise<Settings>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db
      .select()
      .from(users)
      .where(eq(users.email, username))
      .limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getAllProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    return result[0];
  }

  async createProject(project: InsertProject): Promise<Project> {
    const result = await db.insert(projects).values(project).returning();
    return result[0];
  }

  async updateProject(
    id: number,
    project: Partial<InsertProject>
  ): Promise<Project | undefined> {
    const result = await db
      .update(projects)
      .set(project)
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return result.length > 0;
  }

  async getProfile(): Promise<Profile | undefined> {
    const result = await db.select().from(profile).limit(1);
    return result[0];
  }

  async updateProfile(data: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (existing) {
      const result = await db
        .update(profile)
        .set(data)
        .where(eq(profile.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(profile).values(data).returning();
      return result[0];
    }
  }

  async getAllSkills(): Promise<Skill[]> {
    return await db.select().from(skills).orderBy(skills.order);
  }

  async getSkill(id: number): Promise<Skill | undefined> {
    const result = await db
      .select()
      .from(skills)
      .where(eq(skills.id, id))
      .limit(1);
    return result[0];
  }

  async createSkill(skill: InsertSkill): Promise<Skill> {
    // Get the max order and add 1
    const allSkills = await this.getAllSkills();
    const maxOrder =
      allSkills.length > 0 ? Math.max(...allSkills.map((s) => s.order)) : -1;

    const result = await db
      .insert(skills)
      .values({ ...skill, order: maxOrder + 1 })
      .returning();
    return result[0];
  }

  async updateSkill(
    id: number,
    skill: Partial<InsertSkill>
  ): Promise<Skill | undefined> {
    const result = await db
      .update(skills)
      .set(skill)
      .where(eq(skills.id, id))
      .returning();
    return result[0];
  }

  async deleteSkill(id: number): Promise<boolean> {
    const result = await db.delete(skills).where(eq(skills.id, id)).returning();
    return result.length > 0;
  }

  async updateSkillsOrder(skillIds: number[]): Promise<void> {
    await db.transaction(async (tx) => {
      for (let i = 0; i < skillIds.length; i++) {
        await tx
          .update(skills)
          .set({ order: i })
          .where(eq(skills.id, skillIds[i]));
      }
    });
  }

  async getSettings(): Promise<Settings | undefined> {
    const result = await db.select().from(settings).limit(1);
    return result[0];
  }

  async updateSettings(data: InsertSettings): Promise<Settings> {
    const existing = await this.getSettings();
    if (existing) {
      const result = await db
        .update(settings)
        .set(data)
        .where(eq(settings.id, existing.id))
        .returning();
      return result[0];
    } else {
      const result = await db.insert(settings).values(data).returning();
      return result[0];
    }
  }
}

export const storage = new DatabaseStorage();
