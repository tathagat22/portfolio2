import { getClient } from "./client";
import type {
  ISiteSettingsFields,
  IHeroSectionFields,
  IShowreelFields,
  IAboutSectionFields,
  IProjectFields,
  IExperienceFields,
  ISkillFields,
} from "./types";

export async function getSiteSettings() {
  const client = getClient();
  const entries = await client.getEntries<ISiteSettingsFields>({
    content_type: "siteSettings",
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getHeroSection() {
  const client = getClient();
  const entries = await client.getEntries<IHeroSectionFields>({
    content_type: "heroSection",
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getShowreel() {
  const client = getClient();
  const entries = await client.getEntries<IShowreelFields>({
    content_type: "showreel",
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getAboutSection() {
  const client = getClient();
  const entries = await client.getEntries<IAboutSectionFields>({
    content_type: "aboutSection",
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getProjects() {
  const client = getClient();
  const entries = await client.getEntries<IProjectFields>({
    content_type: "project",
    order: ["fields.sortOrder"],
  });
  return entries.items;
}

export async function getProjectBySlug(slug: string) {
  const client = getClient();
  const entries = await client.getEntries<IProjectFields>({
    content_type: "project",
    "fields.slug": slug,
    limit: 1,
  });
  return entries.items[0] || null;
}

export async function getExperiences() {
  const client = getClient();
  const entries = await client.getEntries<IExperienceFields>({
    content_type: "experience",
    order: ["fields.sortOrder"],
  });
  return entries.items;
}

export async function getSkills() {
  const client = getClient();
  const entries = await client.getEntries<ISkillFields>({
    content_type: "skill",
    order: ["fields.sortOrder"],
  });
  return entries.items;
}
