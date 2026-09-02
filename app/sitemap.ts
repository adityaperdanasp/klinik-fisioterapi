import type { MetadataRoute } from "next";

// Cuma landing page yang masuk sitemap — halaman internal butuh login,
// nggak ada gunanya buat search engine index.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://pulihfisioterapi.id",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
