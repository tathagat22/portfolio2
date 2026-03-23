import type { EntryFieldTypes } from "contentful";

// Site Settings
export interface ISiteSettingsFields {
  contentTypeId: "siteSettings";
  fields: {
    siteName: EntryFieldTypes.Text;
    tagline: EntryFieldTypes.Text;
    email: EntryFieldTypes.Text;
    phone: EntryFieldTypes.Text;
    linkedIn?: EntryFieldTypes.Text;
    artStation?: EntryFieldTypes.Text;
    instagram?: EntryFieldTypes.Text;
  };
}

// Hero Section
export interface IHeroSectionFields {
  contentTypeId: "heroSection";
  fields: {
    headingLine1: EntryFieldTypes.Text;
    headingLine2: EntryFieldTypes.Text;
    subtitle: EntryFieldTypes.Text;
    scrollPromptText?: EntryFieldTypes.Text;
  };
}

// Showreel
export interface IShowreelFields {
  contentTypeId: "showreel";
  fields: {
    title: EntryFieldTypes.Text;
    videoUrl?: EntryFieldTypes.Text;
    description?: EntryFieldTypes.Text;
  };
}

// About Section
export interface IAboutSectionFields {
  contentTypeId: "aboutSection";
  fields: {
    heading: EntryFieldTypes.Text;
    bioText: EntryFieldTypes.RichText;
  };
}

// Project
export interface IProjectFields {
  contentTypeId: "project";
  fields: {
    title: EntryFieldTypes.Text;
    slug: EntryFieldTypes.Text;
    category: EntryFieldTypes.Text;
    shortDescription: EntryFieldTypes.Text;
    fullDescription?: EntryFieldTypes.RichText;
    toolsUsed?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    featured: EntryFieldTypes.Boolean;
    sortOrder: EntryFieldTypes.Integer;
  };
}

// Experience
export interface IExperienceFields {
  contentTypeId: "experience";
  fields: {
    company: EntryFieldTypes.Text;
    role: EntryFieldTypes.Text;
    startDate: EntryFieldTypes.Date;
    endDate?: EntryFieldTypes.Date;
    description: EntryFieldTypes.RichText;
    sortOrder: EntryFieldTypes.Integer;
  };
}

// Skill
export interface ISkillFields {
  contentTypeId: "skill";
  fields: {
    name: EntryFieldTypes.Text;
    proficiency: EntryFieldTypes.Integer;
    category: EntryFieldTypes.Text;
    sortOrder: EntryFieldTypes.Integer;
  };
}
