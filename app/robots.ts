import type { MetadataRoute } from "next";

// Halaman internal (/jadwal, /pasien, dst) sengaja di-disallow dari crawler —
// itu bukan konten publik, cuma landing page ("/") yang boleh ke-index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/login",
        "/undangan/",
        "/jadwal",
        "/pasien",
        "/kasir",
        "/dashboard",
        "/pengaturan",
      ],
    },
    sitemap: "https://pulihfisioterapi.id/sitemap.xml",
  };
}
