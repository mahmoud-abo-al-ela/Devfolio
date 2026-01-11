import {
  type Project,
  type Profile,
  type Skill,
  type Settings,
  type Analytics,
} from "@shared/schema";
import { apiClient } from "./api-client";

export async function fetchProjects(): Promise<Project[]> {
  return apiClient("/api/projects");
}

export async function createProject(
  project: Omit<Project, "id" | "createdAt">
): Promise<Project> {
  return apiClient("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export async function updateProject(
  id: number,
  project: Partial<Omit<Project, "id" | "createdAt">>
): Promise<Project> {
  return apiClient(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id: number): Promise<void> {
  return apiClient(`/api/projects/${id}`, {
    method: "DELETE",
  });
}

export async function fetchProfile(): Promise<Profile | null> {
  return apiClient("/api/profile");
}

export async function updateProfile(
  profile: Omit<Profile, "id">
): Promise<Profile> {
  return apiClient("/api/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

export async function fetchSkills(): Promise<Skill[]> {
  return apiClient("/api/skills");
}

export async function createSkill(
  skill: Omit<Skill, "id" | "createdAt" | "order">
): Promise<Skill> {
  return apiClient("/api/skills", {
    method: "POST",
    body: JSON.stringify(skill),
  });
}

export async function updateSkill(
  id: number,
  skill: Partial<Omit<Skill, "id" | "createdAt" | "order">>
): Promise<Skill> {
  return apiClient(`/api/skills/${id}`, {
    method: "PATCH",
    body: JSON.stringify(skill),
  });
}

export async function deleteSkill(id: number): Promise<void> {
  return apiClient(`/api/skills/${id}`, {
    method: "DELETE",
  });
}

export async function reorderSkills(skillIds: number[]): Promise<void> {
  return apiClient("/api/skills/reorder", {
    method: "POST",
    body: JSON.stringify({ skillIds }),
  });
}

export async function fetchSettings(): Promise<Settings | null> {
  return apiClient("/api/settings");
}

export async function updateSettings(
  settings: Omit<Settings, "id" | "updatedAt">
): Promise<Settings> {
  return apiClient("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

// Analytics endpoints
export async function fetchAnalytics(): Promise<Analytics> {
  return apiClient("/api/analytics");
}

export async function fetchDailyViews(days: number = 7): Promise<any[]> {
  return apiClient(`/api/analytics/daily-views?days=${days}`);
}

export async function updateAnalytics(
  analytics: Omit<Analytics, "id" | "updatedAt">
): Promise<Analytics> {
  return apiClient("/api/analytics", {
    method: "PUT",
    body: JSON.stringify(analytics),
  });
}

export async function incrementView(): Promise<void> {
  return apiClient("/api/analytics/view", {
    method: "POST",
  });
}

export async function incrementProjectClick(): Promise<void> {
  return apiClient("/api/analytics/project-click", {
    method: "POST",
  });
}

export async function incrementContactInquiry(): Promise<void> {
  return apiClient("/api/analytics/contact", {
    method: "POST",
  });
}

// Public endpoints (no auth required)
export async function fetchPublicSkills(): Promise<Skill[]> {
  return apiClient("/api/public/skills");
}

export async function fetchPublicProjects(): Promise<Project[]> {
  return apiClient("/api/public/projects");
}

export async function fetchPublicSettings(): Promise<Settings | null> {
  return apiClient("/api/public/settings");
}
