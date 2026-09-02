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

// Structured data (Schema.org) — bantu Google nampilin alamat/jam di hasil
// pencarian langsung, bukan cuma judul-deskripsi biasa. Jam operasional di
// bawah ini PLACEHOLDER (belum dikonfirmasi user) — samain sama section
// "Jam Operasional" di LandingPageClient.tsx kalau nanti diganti.
const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "MedicalClinic",
  name: "Pulih Fisioterapi",
  image: "https://pulihfisioterapi.id/photos/hero-athlete-knee.jpg",
  url: "https://pulihfisioterapi.id",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Ruko Concordia & Trafalgar Blok SE1 No. 29, Ciangsana",
    addressLocality: "Kec. Gn. Putri, Kabupaten Bogor",
    addressRegion: "Jawa Barat",
    postalCode: "16968",
    addressCountry: "ID",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "20:00",
    },
  ],
};

export default function Page() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <LandingPageClient />
    </>
  );
}
