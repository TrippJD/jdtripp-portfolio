import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

// One page for now. No lastModified: reading the current date during prerender
// isn't allowed with Cache Components, and search engines don't need it here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, changeFrequency: "monthly", priority: 1 }];
}
