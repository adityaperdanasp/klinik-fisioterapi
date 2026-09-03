import type { Metadata } from "next";
import { LandingPageClient } from "./LandingPageClient";

const TITLE = "Pulih Fisioterapi — Klinik Fisioterapi Spesialis Cedera Otot Bekasi";
const DESCRIPTION =
  "Fisioterapi spesialis cedera otot di Ciangsana, Gunung Putri (Bekasi/Bogor). Ditangani langsung fisioterapis berpengalaman dan berlisensi (STR). Booking konsultasi via WhatsApp.";

export const metadata: Metadata = {
  // Favicon TIDAK perlu didaftarin manual di sini — app/icon.png +
  // app/favicon.ico udah otomatis kepake Next.js lewat konvensi file
  // (muncul sebagai route /icon.png di build), declare ulang di sini
  // cuma bikin redundant/berpotensi bentrok. Sama juga buat og:image/
  // twitter:image — app/opengraph-image.tsx (branded, generated via
  // next/og) otomatis kepake buat dua-duanya, jangan declare `images`
  // manual di sini lagi (dulu foto hero mentah, sekarang digantiin).
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "https://pulihfisioterapi.id",
    siteName: "Pulih Fisioterapi",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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

// FAQPage structured data — beda dari FAQ yang ke-render di UI (dictionary
// CONTENT.id.faq di LandingPageClient.tsx, client-side), teks di bawah ini
// DUPLIKAT manual (Bahasa Indonesia doang, samain sama bahasa default
// SSR-nya) — kalau ubah FAQ di UI, samain juga di sini. Bantu Google
// nampilin accordion FAQ langsung di hasil pencarian.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Apakah saya perlu rujukan dokter untuk booking sesi fisioterapi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tidak wajib. Anda bisa langsung booking konsultasi awal, fisioterapis kami akan melakukan evaluasi untuk menentukan rencana terapi yang tepat.",
      },
    },
    {
      "@type": "Question",
      name: "Berapa lama satu sesi terapi berlangsung?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Setiap sesi berlangsung sekitar 50 menit, mencakup evaluasi kondisi terkini dan penanganan langsung oleh fisioterapis.",
      },
    },
    {
      "@type": "Question",
      name: "Bagaimana cara reschedule atau membatalkan jadwal?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hubungi kami via WhatsApp sesegera mungkin sebelum jadwal Anda, kami akan bantu atur ulang sesuai ketersediaan ruang dan fisioterapis.",
      },
    },
    {
      "@type": "Question",
      name: "Apakah fisioterapis di sini berlisensi resmi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Ya, seluruh fisioterapis kami memiliki STR (Surat Tanda Registrasi) yang aktif.",
      },
    },
    {
      "@type": "Question",
      name: "Apa yang harus saya bawa atau kenakan saat sesi pertama?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Kenakan pakaian yang nyaman dan memungkinkan pergerakan bebas pada area yang akan ditangani. Bawa hasil pemeriksaan medis sebelumnya jika ada.",
      },
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
      {/* eslint-disable-next-line react/no-danger */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <LandingPageClient />
    </>
  );
}
