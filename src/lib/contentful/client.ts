import { createClient } from "contentful";

// Delivery client (published content)
export const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || "",
});

// Preview client (draft content)
export const contentfulPreviewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || "",
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN || "",
  host: "preview.contentful.com",
});

export function getClient(preview = false) {
  return preview ? contentfulPreviewClient : contentfulClient;
}
