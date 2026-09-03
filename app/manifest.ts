import type { MetadataRoute } from "next";

// Konvensi Next.js — auto-generate /manifest.webmanifest. Ini yang bikin
// Android bisa "Add to Home Screen" beneran (mode standalone, bukan cuma
// bookmark biasa). iOS pakai app/apple-icon.png terpisah (Safari nggak
// baca manifest.json buat home-screen icon).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Pulih Fisioterapi",
    short_name: "Pulih Fisioterapi",
    description:
      "Klinik fisioterapi spesialis cedera otot di Ciangsana, Gunung Putri (Bekasi/Bogor).",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF5EE",
    theme_color: "#FAF5EE",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
