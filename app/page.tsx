import type { Metadata } from "next";
import { LandingPageClient } from "./LandingPageClient";

const TITLE = "Pulih Fisioterapi — Klinik Fisioterapi Spesialis Cedera Otot Bekasi";
const DESCRIPTION =
  "Fisioterapi spesialis cedera otot di Ciangsana, Gunung Putri (Bekasi/Bogor). Ditangani langsung fisioterapis berpengalaman dan berlisensi (STR). Booking konsultasi via WhatsApp.";

export const metadata: Metadata = {
  // Favicon TIDAK perlu didaftarin manual di sini — app/icon.png +
  // app/favicon.ico udah otomatis kepake Next.js lewat konvensi file
  // (muncul sebagai route /icon.png di build), declare ulang di sini
  // cuma bikin redundant/berpotensi bentrok.
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pulihfisioterapi.id",
    siteName: "Pulih Fisioterapi",
    images: [{ url: "/photos/hero-athlete-knee.jpg", width: 1200, height: 800 }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/photos/hero-athlete-knee.jpg"],
  },
};

export default function Page() {
  return <LandingPageClient />;
}
