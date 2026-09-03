"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import { Logo } from "./components/Logo";

const WHATSAPP_NUMBER = "6281322043022";
const CONTACT_EMAIL = "cs@pulihfisioterapi.id";
const CLINIC_ADDRESS =
  "Ruko Concordia & Trafalgar Blok SE1 No. 29, Ciangsana, Kec. Gn. Putri, Kabupaten Bogor, Jawa Barat 16968";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CLINIC_ADDRESS)}`;
const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps?q=${encodeURIComponent(CLINIC_ADDRESS)}&output=embed`;

// Design system: warm cream / earth-tone palette (light) + versi gelapnya
// (dark), inspired by the calm luxury-wellness reference the user shared —
// colors and layout genre are ours to reuse, copy/photos are original.
//
// Kontras warna (WCAG) di-audit pakai perhitungan luminance manual buat
// dua-duanya. Light: `earth` (#96754A) di atas cream cuma ~3.4-3.9:1, GAGAL
// AA teks normal — dipakai `earthDark` (#7A5D39, 4.9-6.1:1) buat semua teks/
// tombol kecil, `earth` yang lebih terang cuma buat dekorasi besar (large
// text WCAG, ambang 3:1). Dark: semua pasangan di bawah lolos AA (7-14.5:1).
const LIGHT_COLOR = {
  bg: "#FAF5EE",
  bgAlt: "#F1E6D6",
  accentBright: "#96754A",
  accent: "#7A5D39",
  ink: "#231F1A",
  muted: "#57503F",
};

const DARK_COLOR = {
  bg: "#1D1A16",
  bgAlt: "#26221D",
  accentBright: "#C79A6A",
  accent: "#D3A972",
  ink: "#F2EAE0",
  muted: "#B9AC9A",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

type Lang = "id" | "en";
type Theme = "light" | "dark";

// Aset (foto/video) nggak beda antar bahasa — cuma teksnya yang beda. Data
// ini dipisah dari CONTENT (dictionary teks di bawah) terus digabung lagi
// pas render lewat index array yang sama.
const SERVICE_ASSETS = [
  { image: "/photos/service-cedera-otot.jpg" },
  { image: "/photos/service-rehab-olahraga.jpg", imagePosition: "center 85%" },
  { image: "/photos/service-nyeri-sendi.jpg" },
  { image: "/photos/service-konsultasi.jpg" },
];

const HERO_IMAGE = "/photos/hero-athlete-knee.jpg";

const GALLERY: { type: "image" | "video"; src: string }[] = [
  { type: "video", src: "/videos/hands-therapy.mp4" },
  { type: "image", src: "/photos/gallery-elderly-home.jpg" },
  { type: "image", src: "/photos/gallery-consultation.jpg" },
  { type: "video", src: "/videos/foot-therapy.mp4" },
];

// Foto placeholder (stok) sampai ada foto staff asli — lihat catatan di CLAUDE.md.
// Nama orang nggak diterjemahin, sama di kedua bahasa.
const TEAM = [
  { name: "Erwin", photo: "/team/erwin.jpg" },
  { name: "Mia", photo: "/team/mia.jpg" },
  { name: "Fitria", photo: "/team/fitria.jpg" },
  { name: "Dhea", photo: "/team/dhea.jpg" },
];

// Testimoni PLACEHOLDER — nama & kutipan REKAAN, belum ada testimoni pasien
// asli. Sama kayak foto tim, ini WAJIB diganti sebelum go-live publik (lihat
// TODO di CLAUDE.md). Sengaja nggak dibikin mirip widget review platform
// tertentu (nggak ada bintang/logo Google dsb) — biar jelas ini kutipan di
// halaman sendiri, bukan klaim "review terverifikasi" dari pihak ketiga.
const TESTIMONIAL_ASSETS = [{ initials: "BS" }, { initials: "RW" }, { initials: "AF" }];

const SECTION_IDS = ["layanan", "alur", "tim", "faq", "lokasi"] as const;

const CONTENT: Record<
  Lang,
  {
    nav: { layanan: string; alur: string; tim: string; faq: string; lokasi: string };
    bookBtn: string;
    banner: { text: string; link: string };
    hero: { badge: string; titleLine1: string; titleItalic: string; desc: string; cta: string; heroAlt: string; trustChips: string[] };
    features: { title: string; description: string }[];
    trust: { label: string; heading: string; desc: string; link: string };
    steps: { heading: string; items: { number: string; title: string; description: string }[] };
    services: { heading: string; ctaLabel: string; items: { title: string; description: string }[] };
    about: { heading: string; desc: string };
    team: { heading: string; role: string };
    testimonials: { heading: string; items: { name: string; note: string; quote: string }[] };
    gallery: { heading: string; alt: string[] };
    faq: { heading: string; items: { q: string; a: string }[] };
    location: { heading: string; mapLink: string; chatBtn: string; hoursHeading: string; hoursSchedule: string; hoursNote: string };
    footer: { desc: string; navHeading: string; contactHeading: string; loginStaff: string };
    whatsapp: { book: string; ask: string; visit: string; consultPrefix: (title: string) => string };
    backToTop: string;
    waFloatLabel: string;
    themeToggle: string;
  }
> = {
  id: {
    nav: { layanan: "Layanan", alur: "Alur Pelayanan", tim: "Tim", faq: "FAQ", lokasi: "Lokasi" },
    bookBtn: "Book Appointment",
    banner: { text: "Kini hadir di Ciangsana, Gunung Putri —", link: "lihat lokasi" },
    hero: {
      badge: "Spesialis Cedera Otot · Bekasi",
      titleLine1: "Pulih, bergerak,",
      titleItalic: "kembali utuh.",
      desc: "Fisioterapi spesialis cedera otot, ditangani langsung oleh fisioterapis berpengalaman dan berlisensi (STR) — untuk memulihkan mobilitas dan kualitas hidup Anda.",
      cta: "Jadwalkan Konsultasi",
      heroAlt: "Fisioterapis menangani pasien",
      trustChips: ["Tanpa rujukan dokter", "Respon cepat via WA", "Fisioterapis berlisensi (STR)"],
    },
    features: [
      { title: "Sesi 1-on-1", description: "Setiap sesi ditangani langsung oleh satu fisioterapis, fokus penuh ke kondisi Anda." },
      { title: "Program Personal", description: "Rencana terapi disusun sesuai kondisi dan target pemulihan — bukan program generik." },
      { title: "Fisioterapis Berlisensi", description: "Ditangani oleh fisioterapis dengan STR (Surat Tanda Registrasi) resmi." },
    ],
    trust: {
      label: "Fisioterapis Bersertifikat & Berlisensi Resmi",
      heading: "Fisioterapi yang disesuaikan untuk Anda",
      desc: "Setiap pasien punya riwayat dan kondisi yang berbeda. Kami menyusun evaluasi dan rencana terapi secara personal — bukan satu program untuk semua orang — supaya pemulihan Anda lebih tepat sasaran.",
      link: "Lihat layanan kami →",
    },
    steps: {
      heading: "Empat langkah menuju pulih",
      items: [
        { number: "01", title: "Konsultasi Awal", description: "Ceritakan keluhan Anda ke fisioterapis kami. Kami periksa langsung untuk menemukan akar masalah cedera otot Anda." },
        { number: "02", title: "Rencana Terapi", description: "Program pemulihan disusun sesuai kondisi dan target Anda — bukan pendekatan yang sama untuk semua orang." },
        { number: "03", title: "Sesi Terapi", description: "Penanganan langsung oleh fisioterapis: manajemen nyeri, mobilisasi otot, sampai latihan penguatan bertahap." },
        { number: "04", title: "Pantau Progres", description: "Perkembangan dicek tiap sesi, supaya pemulihan tetap terarah dan hasilnya bertahan lama." },
      ],
    },
    services: {
      heading: "Layanan kami",
      ctaLabel: "Konsultasi sekarang →",
      items: [
        { title: "Terapi Cedera Otot", description: "Penanganan cedera otot akut maupun kronis dengan pendekatan berbasis evaluasi fisioterapis." },
        { title: "Rehabilitasi Pasca Cedera Olahraga", description: "Program pemulihan bertahap untuk kembali beraktivitas dan berolahraga dengan aman." },
        { title: "Terapi Nyeri Otot & Sendi", description: "Penanganan nyeri punggung, bahu, lutut, dan sendi lain akibat aktivitas atau postur." },
        { title: "Konsultasi & Evaluasi Awal", description: "Pemeriksaan awal untuk menentukan diagnosa dan rencana terapi yang tepat." },
      ],
    },
    about: {
      heading: "Tentang Pulih Fisioterapi",
      desc: "Kami klinik fisioterapi yang fokus menangani cedera otot — dari cedera olahraga sampai nyeri akibat aktivitas harian. Pendekatan kami mengutamakan evaluasi menyeluruh dan gerak aktif sebagai bagian dari proses pemulihan, bukan sekadar modalitas pasif.",
    },
    team: { heading: "Tim fisioterapis kami", role: "Fisioterapis" },
    testimonials: {
      heading: "Kata pasien kami",
      items: [
        { name: "Budi S.", note: "Pemulihan cedera lutut lari", quote: "Setelah beberapa sesi, lutut saya jauh lebih stabil buat lari lagi. Fisioterapisnya sabar jelasin tiap gerakan." },
        { name: "Rina W.", note: "Nyeri punggung kerja kantoran", quote: "Nyeri punggung yang udah bertahun-tahun akhirnya ketemu akar masalahnya. Programnya jelas, bukan cuma dipijat doang." },
        { name: "Ahmad F.", note: "Cedera bahu bulu tangkis", quote: "Bisa balik main bulu tangkis lagi tanpa nyeri. Progresnya kecek tiap sesi, jadi kerasa arahnya." },
      ],
    },
    gallery: {
      heading: "Galeri",
      alt: [
        "Terapi manual pada tangan pasien",
        "Kunjungan terapi lansia di rumah",
        "Sesi konsultasi dengan fisioterapis",
        "Terapi manual pada kaki pasien",
      ],
    },
    faq: {
      heading: "Pertanyaan umum",
      items: [
        { q: "Apakah saya perlu rujukan dokter untuk booking sesi fisioterapi?", a: "Tidak wajib. Anda bisa langsung booking konsultasi awal, fisioterapis kami akan melakukan evaluasi untuk menentukan rencana terapi yang tepat." },
        { q: "Berapa lama satu sesi terapi berlangsung?", a: "Setiap sesi berlangsung sekitar 50 menit, mencakup evaluasi kondisi terkini dan penanganan langsung oleh fisioterapis." },
        { q: "Bagaimana cara reschedule atau membatalkan jadwal?", a: "Hubungi kami via WhatsApp sesegera mungkin sebelum jadwal Anda, kami akan bantu atur ulang sesuai ketersediaan ruang dan fisioterapis." },
        { q: "Apakah fisioterapis di sini berlisensi resmi?", a: "Ya, seluruh fisioterapis kami memiliki STR (Surat Tanda Registrasi) yang aktif." },
        { q: "Apa yang harus saya bawa atau kenakan saat sesi pertama?", a: "Kenakan pakaian yang nyaman dan memungkinkan pergerakan bebas pada area yang akan ditangani. Bawa hasil pemeriksaan medis sebelumnya jika ada." },
      ],
    },
    location: {
      heading: "Lokasi",
      mapLink: "Buka di Google Maps",
      chatBtn: "Chat WhatsApp",
      hoursHeading: "Jam Operasional",
      hoursSchedule: "Senin – Sabtu, 08.00 – 20.00",
      hoursNote: "(placeholder — konfirmasi jam pasti sebelum publikasi)",
    },
    footer: {
      desc: "Klinik fisioterapi spesialis cedera otot, ditangani fisioterapis berlisensi (STR).",
      navHeading: "Navigasi",
      contactHeading: "Kontak",
      loginStaff: "Login Staff",
    },
    whatsapp: {
      book: "Halo, saya ingin booking sesi fisioterapi.",
      ask: "Halo, saya ingin tanya-tanya soal fisioterapi.",
      visit: "Halo, saya mau tanya soal jadwal kunjungan & lokasi klinik.",
      consultPrefix: (title) => `Halo, saya ingin konsultasi soal ${title.toLowerCase()}.`,
    },
    backToTop: "Kembali ke atas",
    waFloatLabel: "Chat WhatsApp",
    themeToggle: "Ganti tampilan gelap/terang",
  },
  en: {
    nav: { layanan: "Services", alur: "Our Process", tim: "Team", faq: "FAQ", lokasi: "Location" },
    bookBtn: "Book Appointment",
    banner: { text: "Now open in Ciangsana, Gunung Putri —", link: "view location" },
    hero: {
      badge: "Muscle Injury Specialist · Bekasi",
      titleLine1: "Heal, move,",
      titleItalic: "feel whole again.",
      desc: "Specialized muscle injury physiotherapy, treated directly by experienced, licensed physiotherapists (STR) — to restore your mobility and quality of life.",
      cta: "Schedule a Consultation",
      heroAlt: "Physiotherapist treating a patient",
      trustChips: ["No doctor referral needed", "Fast response via WhatsApp", "Licensed physiotherapists (STR)"],
    },
    features: [
      { title: "1-on-1 Sessions", description: "Every session is handled by one dedicated physiotherapist, fully focused on your condition." },
      { title: "Personalized Program", description: "Treatment plans built around your condition and recovery goals — never a one-size-fits-all program." },
      { title: "Licensed Physiotherapists", description: "Treated by physiotherapists holding an official STR registration license." },
    ],
    trust: {
      label: "Certified & Officially Licensed Physiotherapists",
      heading: "Physiotherapy tailored to you",
      desc: "Every patient has a different history and condition. We build each evaluation and treatment plan individually — never one program for everyone — so your recovery stays on target.",
      link: "See our services →",
    },
    steps: {
      heading: "Four steps to recovery",
      items: [
        { number: "01", title: "Initial Consultation", description: "Tell our physiotherapist about your complaint. We examine you directly to find the root cause of your muscle injury." },
        { number: "02", title: "Treatment Plan", description: "A recovery program built around your condition and goals — not a one-size-fits-all approach." },
        { number: "03", title: "Therapy Session", description: "Hands-on treatment from your physiotherapist: pain management, muscle mobilization, and progressive strengthening exercises." },
        { number: "04", title: "Progress Monitoring", description: "Your progress is checked every session, keeping recovery on track for lasting results." },
      ],
    },
    services: {
      heading: "Our Services",
      ctaLabel: "Consult now →",
      items: [
        { title: "Muscle Injury Therapy", description: "Treatment for both acute and chronic muscle injuries, based on thorough physiotherapist evaluation." },
        { title: "Post-Sports Injury Rehabilitation", description: "A gradual recovery program to safely return to activity and sport." },
        { title: "Muscle & Joint Pain Therapy", description: "Treatment for back, shoulder, knee, and other joint pain caused by activity or posture." },
        { title: "Consultation & Initial Evaluation", description: "An initial exam to determine the right diagnosis and treatment plan." },
      ],
    },
    about: {
      heading: "About Pulih Fisioterapi",
      desc: "We're a physiotherapy clinic focused on muscle injuries — from sports injuries to pain from everyday activity. Our approach prioritizes thorough evaluation and active movement as part of recovery, not just passive treatment.",
    },
    team: { heading: "Our Physiotherapy Team", role: "Physiotherapist" },
    testimonials: {
      heading: "What our patients say",
      items: [
        { name: "Budi S.", note: "Recovered from a running knee injury", quote: "After a few sessions my knee felt far more stable for running again. The physiotherapist patiently explained every movement." },
        { name: "Rina W.", note: "Office-work back pain", quote: "Years of back pain and we finally found the root cause. The program was structured, not just a massage." },
        { name: "Ahmad F.", note: "Badminton shoulder injury", quote: "I'm back playing badminton pain-free. Progress was checked every session, so I could feel it moving in the right direction." },
      ],
    },
    gallery: {
      heading: "Gallery",
      alt: [
        "Manual therapy on a patient's hand",
        "Home visit therapy for an elderly patient",
        "Consultation session with a physiotherapist",
        "Manual therapy on a patient's foot",
      ],
    },
    faq: {
      heading: "Frequently Asked Questions",
      items: [
        { q: "Do I need a doctor's referral to book a physiotherapy session?", a: "Not required. You can book an initial consultation directly — our physiotherapist will evaluate you to determine the right treatment plan." },
        { q: "How long does one therapy session last?", a: "Each session lasts about 50 minutes, including a check on your current condition and hands-on treatment from your physiotherapist." },
        { q: "How do I reschedule or cancel my appointment?", a: "Message us on WhatsApp as early as possible before your appointment, and we'll help reschedule based on room and physiotherapist availability." },
        { q: "Are the physiotherapists here officially licensed?", a: "Yes, all our physiotherapists hold an active STR (official registration license)." },
        { q: "What should I bring or wear for my first session?", a: "Wear comfortable clothing that allows free movement in the area being treated. Bring any previous medical exam results, if you have them." },
      ],
    },
    location: {
      heading: "Location",
      mapLink: "Open in Google Maps",
      chatBtn: "Chat on WhatsApp",
      hoursHeading: "Opening Hours",
      hoursSchedule: "Mon – Sat, 8:00 AM – 8:00 PM",
      hoursNote: "(placeholder — confirm exact hours before publishing)",
    },
    footer: {
      desc: "A muscle injury specialist physiotherapy clinic, treated by licensed (STR) physiotherapists.",
      navHeading: "Navigation",
      contactHeading: "Contact",
      loginStaff: "Staff Login",
    },
    whatsapp: {
      book: "Hi, I'd like to book a physiotherapy session.",
      ask: "Hi, I have some questions about physiotherapy.",
      visit: "Hi, I'd like to ask about visiting hours & the clinic's location.",
      consultPrefix: (title) => `Hi, I'd like to consult about ${title.toLowerCase()}.`,
    },
    backToTop: "Back to top",
    waFloatLabel: "Chat on WhatsApp",
    themeToggle: "Toggle dark/light mode",
  },
};

function whatsappLink(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

// Fade-in-on-scroll — dipakai bungkus konten tiap section biar halaman
// kerasa lebih hidup pas di-scroll, bukan statis muncul semua sekaligus.
function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Hormatin "reduce motion" OS-nya user — jangan nunggu observer sama
    // sekali, langsung tampilin. CSS global (globals.css) juga udah matiin
    // transition-duration buat kasus ini, ini nambahin biar kontennya nggak
    // perlu "nunggu" scroll-in dulu (bukan cuma animasinya doang yang mati).
    if (typeof IntersectionObserver === "undefined" || window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);

    // Fallback keamanan: animasi ini progressive enhancement doang, BUKAN
    // fitur yang boleh bikin konten permanen nggak keliatan. Kalau observer-nya
    // entah kenapa nggak pernah fire (tab background, browser/extension aneh,
    // dll), paksa muncul aja setelah 1.5 detik — daripada teks ilang selamanya.
    const fallback = setTimeout(() => setVisible(true), 1500);

    return () => {
      obs.disconnect();
      clearTimeout(fallback);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      {children}
    </div>
  );
}

// Foto/video galeri pakai shimmer abu-abu sampai asetnya beneran selesai
// dimuat — biar nggak blank kosong dulu baru nongol mendadak.
function ShimmerMedia({
  children,
  bgAlt,
  ready,
  className = "",
}: {
  children: React.ReactNode;
  bgAlt: string;
  ready: boolean;
  className?: string;
}) {
  // `ready` dikontrol dari luar (LandingPageClient) lewat onLoad/onLoadedData
  // di elemen media di dalam `children` — komponen ini murni presentational,
  // nggak perlu tau caranya, cuma nampilin shimmer sampai `ready` jadi true.
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`} style={{ backgroundColor: bgAlt }}>
      {!ready && (
        <div
          className="absolute inset-0 animate-pulse"
          style={{ background: `linear-gradient(90deg, ${bgAlt}, rgba(255,255,255,0.35), ${bgAlt})` }}
        />
      )}
      <div style={{ opacity: ready ? 1 : 0, transition: "opacity 0.4s ease" }}>{children}</div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" width="26" height="26" fill="#fff" aria-hidden="true">
      <path d="M16.004 3C9.377 3 4 8.373 4 15c0 2.34.673 4.523 1.837 6.37L4 29l7.82-1.805A11.94 11.94 0 0 0 16.004 27C22.63 27 28 21.627 28 15S22.63 3 16.004 3Zm6.99 16.98c-.29.82-1.44 1.51-2.36 1.7-.63.13-1.45.24-4.22-.9-3.54-1.47-5.82-5.06-6-5.3-.18-.24-1.43-1.9-1.43-3.63 0-1.72.9-2.57 1.22-2.92.29-.32.64-.4.86-.4.21 0 .43 0 .62.01.2.01.46-.08.72.55.29.7.98 2.42 1.06 2.6.08.18.13.39.03.62-.1.24-.15.39-.3.6-.15.2-.31.46-.44.62-.15.18-.3.38-.13.68.17.3.75 1.24 1.62 2.01 1.11.99 2.05 1.3 2.35 1.45.29.14.46.12.63-.08.17-.2.72-.84.91-1.13.19-.29.38-.24.63-.14.26.09 1.65.78 1.93.92.29.14.48.21.55.33.07.13.07.72-.22 1.44Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export function LandingPageClient() {
  const [lang, setLang] = useState<Lang>("id");
  const [theme, setTheme] = useState<Theme>("light");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [mediaReady, setMediaReady] = useState<Record<number, boolean>>({});

  // Toggle bahasa client-side — SSR/first paint selalu Indonesia (default),
  // baru dikoreksi ke pilihan tersimpan (kalau ada) setelah hydrate. Ini
  // trade-off yang disadari: versi Inggris nggak ke-index Google (beda dari
  // pendekatan /en URL terpisah), tapi jauh lebih simpel buat sekarang.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pulih_lang");
      if (saved === "en" || saved === "id") setLang(saved);
    } catch {
      // localStorage bisa nggak ke-akses (private mode dll) — abaikan, tetap default id.
    }
  }, []);

  // Tema: default ikutin preferensi sistem (prefers-color-scheme), user bisa
  // override manual lewat tombol — pilihan manual itu yang disimpen & menang
  // di kunjungan berikutnya.
  useEffect(() => {
    try {
      const saved = localStorage.getItem("pulih_theme");
      if (saved === "light" || saved === "dark") {
        setTheme(saved);
        return;
      }
    } catch {
      // lanjut ke system preference di bawah kalau localStorage nggak ke-akses.
    }
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Scroll-spy: nav link section yang lagi keliatan di-bold otomatis.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const observers = SECTION_IDS.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  // Tombol "kembali ke atas" cuma muncul setelah scroll lumayan jauh.
  useEffect(() => {
    function onScroll() {
      setShowBackToTop(window.scrollY > 600);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleLang() {
    const next: Lang = lang === "id" ? "en" : "id";
    setLang(next);
    try {
      localStorage.setItem("pulih_lang", next);
    } catch {
      // nggak masalah kalau gagal disimpan, cuma nggak keinget pas kunjungan berikutnya.
    }
  }

  function toggleTheme() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
    try {
      localStorage.setItem("pulih_theme", next);
    } catch {
      // nggak masalah kalau gagal disimpan.
    }
  }

  const t = CONTENT[lang];
  const COLOR = theme === "dark" ? DARK_COLOR : LIGHT_COLOR;
  const hairline = theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(46,40,34,0.08)";

  function navLinkStyle(id: string): React.CSSProperties {
    return {
      color: activeSection === id ? COLOR.accent : "inherit",
      fontWeight: activeSection === id ? 700 : undefined,
      transition: "color 0.2s ease",
    };
  }

  function markReady(i: number) {
    setMediaReady((prev) => (prev[i] ? prev : { ...prev, [i]: true }));
  }

  const ToolbarToggles = (
    <>
      <button
        type="button"
        onClick={toggleTheme}
        className="flex h-8 w-8 items-center justify-center rounded-full border"
        style={{ borderColor: COLOR.accent, color: COLOR.accent }}
        aria-label={t.themeToggle}
      >
        {theme === "light" ? <MoonIcon /> : <SunIcon />}
      </button>
      <button
        type="button"
        onClick={toggleLang}
        className="rounded-full border px-3 py-1.5 text-xs font-semibold"
        style={{ borderColor: COLOR.accent, color: COLOR.accent }}
        aria-label={lang === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      >
        {lang === "id" ? "EN" : "ID"}
      </button>
    </>
  );

  return (
    <div
      className={`${fraunces.variable} ${plexSans.variable} min-h-screen pb-[76px] sm:pb-0`}
      style={{ backgroundColor: COLOR.bg, color: COLOR.ink, fontFamily: "var(--font-body)", transition: "background-color 0.2s ease, color 0.2s ease" }}
    >
      {/* React 19 otomatis hoist <link>/<meta> ke <head> biarpun dirender dari
          sini (Client Component) — dipakai buat preconnect ke domain WhatsApp
          (satu-satunya resource eksternal di halaman ini; font udah self-host
          lewat next/font, jadi nggak butuh preconnect ke Google Fonts lagi). */}
      <link rel="preconnect" href="https://wa.me" />
      <link rel="dns-prefetch" href="https://wa.me" />

      {/* Skip-to-content — standar aksesibilitas dasar buat pengguna keyboard/
          screen-reader, biar nggak wajib Tab lewatin semua link nav dulu.
          Tersembunyi visual sampai di-fokus (klik Tab pertama kali). */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        style={{ backgroundColor: COLOR.accent }}
      >
        Langsung ke konten utama
      </a>

      <header
        className="sticky top-0 z-40 border-b"
        style={{ borderColor: hairline, backgroundColor: COLOR.bg, transition: "background-color 0.2s ease, border-color 0.2s ease" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Logo variant={theme === "dark" ? "light" : "dark"} />
          <nav
            className="hidden items-center gap-8 text-sm font-semibold sm:flex"
            style={{ color: COLOR.ink }}
          >
            <a href="#layanan" style={navLinkStyle("layanan")}>
              {t.nav.layanan}
            </a>
            <a href="#alur" style={navLinkStyle("alur")}>
              {t.nav.alur}
            </a>
            <a href="#tim" style={navLinkStyle("tim")}>
              {t.nav.tim}
            </a>
            <a href="#faq" style={navLinkStyle("faq")}>
              {t.nav.faq}
            </a>
            <a href="#lokasi" style={navLinkStyle("lokasi")}>
              {t.nav.lokasi}
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {ToolbarToggles}
            <a
              href={whatsappLink(t.whatsapp.book)}
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-white"
              style={{ backgroundColor: COLOR.accent }}
            >
              {t.bookBtn}
            </a>
          </div>
        </div>
      </header>

      <div
        id="main-content"
        className="border-b py-3 text-center text-sm"
        style={{ borderColor: hairline, backgroundColor: COLOR.bgAlt, color: COLOR.muted }}
      >
        {t.banner.text}{" "}
        <a
          href={GOOGLE_MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline"
          style={{ color: COLOR.accent }}
        >
          {t.banner.link}
        </a>
      </div>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 py-20 sm:py-28 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: COLOR.accent }}>
            {t.hero.badge}
          </p>
          <h1
            className="mt-5 text-4xl leading-[1.15] sm:text-5xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {t.hero.titleLine1}
            <br />
            <span className="italic" style={{ fontWeight: 400 }}>
              {t.hero.titleItalic}
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed" style={{ color: COLOR.muted }}>
            {t.hero.desc}
          </p>
          <a
            href={whatsappLink(t.whatsapp.book)}
            className="mt-9 inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
            style={{ backgroundColor: COLOR.accent }}
          >
            {t.hero.cta}
          </a>
          <ul className="mt-5 flex flex-wrap gap-2">
            {t.hero.trustChips.map((chip) => (
              <li
                key={chip}
                className="rounded-full px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: COLOR.bgAlt, color: COLOR.muted }}
              >
                {chip}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative h-[420px] w-full overflow-hidden rounded-2xl">
          <Image
            src={HERO_IMAGE}
            alt={t.hero.heroAlt}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: COLOR.bgAlt }}>
        <Reveal className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:grid-cols-3">
          {t.features.map((f) => (
            <div key={f.title} className="text-center sm:text-left">
              <h3 className="text-lg" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                {f.description}
              </p>
            </div>
          ))}
        </Reveal>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-4 py-24 lg:grid-cols-2">
        <div className="order-2 text-center lg:order-1 lg:text-left">
          <span
            className="text-7xl sm:text-8xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: COLOR.accentBright }}
          >
            STR
          </span>
          <p className="mt-2 text-sm" style={{ color: COLOR.muted }}>
            {t.trust.label}
          </p>
        </div>
        <div className="order-1 lg:order-2">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.trust.heading}
          </h2>
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            {t.trust.desc}
          </p>
          <a
            href="#layanan"
            className="mt-5 inline-flex items-center gap-1 text-sm font-semibold"
            style={{ color: COLOR.accent }}
          >
            {t.trust.link}
          </a>
        </div>
      </section>

      <section id="alur" className="py-24" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2
            className="text-center text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {t.steps.heading}
          </h2>
          <Reveal className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.steps.items.map((s) => (
              <div key={s.number} className="rounded-2xl p-7" style={{ backgroundColor: COLOR.bg }}>
                <span
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-display)", fontWeight: 500, color: COLOR.accent }}
                >
                  {s.number}
                </span>
                <h3 className="mt-3 text-base font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                  {s.description}
                </p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="layanan" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.services.heading}
          </h2>
          <Reveal className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {t.services.items.map((s, i) => {
              const asset = SERVICE_ASSETS[i];
              return (
                <div key={s.title} className="overflow-hidden rounded-2xl" style={{ backgroundColor: COLOR.bgAlt }}>
                  <div className="relative h-48 w-full">
                    <Image
                      src={asset.image}
                      alt={s.title}
                      fill
                      loading="lazy"
                      className="object-cover"
                      style={{ objectPosition: asset.imagePosition ?? "center" }}
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                  <div className="p-7">
                    <h3 className="text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                      {s.description}
                    </p>
                    <a
                      href={whatsappLink(t.whatsapp.consultPrefix(s.title))}
                      className="mt-4 inline-block text-sm font-semibold"
                      style={{ color: COLOR.accent }}
                    >
                      {t.services.ctaLabel}
                    </a>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      <section className="py-20" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.about.heading}
          </h2>
          <p className="mt-4 leading-relaxed" style={{ color: COLOR.muted }}>
            {t.about.desc}
          </p>
        </div>
      </section>

      <section id="tim" className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.team.heading}
          </h2>
          <Reveal className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {TEAM.map((m) => (
              <div key={m.name} className="overflow-hidden rounded-2xl text-center" style={{ backgroundColor: COLOR.bgAlt }}>
                <div className="relative h-56 w-full">
                  <Image
                    src={m.photo}
                    alt={`${m.name} — ${t.team.role}`}
                    fill
                    loading="lazy"
                    className="object-cover"
                    style={{ objectPosition: "50% 15%" }}
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold">{m.name}</h3>
                  <p className="mt-1 text-sm" style={{ color: COLOR.muted }}>
                    {t.team.role}
                  </p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-24" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.testimonials.heading}
          </h2>
          <Reveal className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {t.testimonials.items.map((ts, i) => (
              <div key={ts.name} className="rounded-2xl p-7" style={{ backgroundColor: COLOR.bg }}>
                <p className="text-sm leading-relaxed italic" style={{ color: COLOR.ink }}>
                  &ldquo;{ts.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: COLOR.accent }}
                    aria-hidden="true"
                  >
                    {TESTIMONIAL_ASSETS[i].initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{ts.name}</p>
                    <p className="text-xs" style={{ color: COLOR.muted }}>
                      {ts.note}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.gallery.heading}
          </h2>
          <Reveal className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {GALLERY.map((item, i) => (
              <ShimmerMedia
                key={item.src}
                bgAlt={COLOR.bgAlt}
                ready={!!mediaReady[i]}
                className="h-40 sm:h-52"
              >
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => markReady(i)}
                    className="h-40 w-full object-cover sm:h-52"
                  />
                ) : (
                  <div className="relative h-40 w-full sm:h-52">
                    <Image
                      src={item.src}
                      alt={t.gallery.alt[i] ?? t.gallery.heading}
                      fill
                      loading="lazy"
                      onLoad={() => markReady(i)}
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                  </div>
                )}
              </ShimmerMedia>
            ))}
          </Reveal>
        </div>
      </section>

      <section id="faq" className="py-24" style={{ backgroundColor: COLOR.bgAlt }}>
        <div className="mx-auto max-w-3xl px-4">
          <h2
            className="text-center text-3xl sm:text-4xl"
            style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}
          >
            {t.faq.heading}
          </h2>
          <div className="mt-12 divide-y" style={{ borderColor: hairline }}>
            {t.faq.items.map((f) => (
              <details key={f.q} className="group py-5" style={{ borderColor: hairline }}>
                <summary className="flex cursor-pointer list-none items-center justify-between text-base font-semibold">
                  {f.q}
                  <span className="ml-4 text-xl" style={{ color: COLOR.accent }}>
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed" style={{ color: COLOR.muted }}>
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section id="lokasi" className="py-24 text-center">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-3xl sm:text-4xl" style={{ fontFamily: "var(--font-display)", fontWeight: 500 }}>
            {t.location.heading}
          </h2>
          <p className="mt-3" style={{ color: COLOR.muted }}>
            {CLINIC_ADDRESS}
          </p>
          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-semibold underline"
            style={{ color: COLOR.accent }}
          >
            {t.location.mapLink}
          </a>

          <div className="mt-8 overflow-hidden rounded-2xl" style={{ backgroundColor: COLOR.bgAlt }}>
            <iframe
              src={GOOGLE_MAPS_EMBED_URL}
              title={t.location.heading}
              width="100%"
              height="300"
              loading="lazy"
              style={{ border: 0, display: "block" }}
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="mt-8 inline-block rounded-2xl px-6 py-4 text-left" style={{ backgroundColor: COLOR.bgAlt }}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: COLOR.accent }}>
              {t.location.hoursHeading}
            </p>
            <p className="mt-1 text-sm font-medium">{t.location.hoursSchedule}</p>
            <p className="mt-1 text-xs" style={{ color: COLOR.muted }}>
              {t.location.hoursNote}
            </p>
          </div>

          <div className="mt-8">
            <a
              href={whatsappLink(t.whatsapp.visit)}
              className="inline-block rounded-full px-8 py-3.5 text-sm font-semibold text-white"
              style={{ backgroundColor: COLOR.accent }}
            >
              {t.location.chatBtn}
            </a>
          </div>
        </div>
      </section>

      <footer className="py-16" style={{ backgroundColor: LIGHT_COLOR.ink, color: "rgba(255,255,255,0.6)" }}>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:grid-cols-3">
          <div>
            <Logo variant="light" />
            <p className="mt-3 max-w-xs text-sm">{t.footer.desc}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">{t.footer.navHeading}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#layanan" className="hover:text-white">
                  {t.nav.layanan}
                </a>
              </li>
              <li>
                <a href="#alur" className="hover:text-white">
                  {t.nav.alur}
                </a>
              </li>
              <li>
                <a href="#tim" className="hover:text-white">
                  {t.nav.tim}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white">
                  {t.nav.faq}
                </a>
              </li>
              <li>
                <a href="#lokasi" className="hover:text-white">
                  {t.nav.lokasi}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wide text-white">{t.footer.contactHeading}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li>{CLINIC_ADDRESS}</li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-6xl border-t px-4 pt-6 text-center text-xs" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          © {new Date().getFullYear()} Pulih Fisioterapi ·{" "}
          <a href="/login" className="hover:text-white">
            {t.footer.loginStaff}
          </a>
        </div>
      </footer>

      {/* Bar CTA sticky KHUSUS mobile — booking jadi selalu 1 jempolan
          diraih pas scroll panjang di HP. Tombol WA mengambang (di bawah)
          sengaja di-hide di mobile (`sm:hidden` di situ) biar nggak
          numpuk/tabrakan visual sama bar ini — fungsinya udah kegantiin. */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 border-t p-3 sm:hidden"
        style={{ backgroundColor: COLOR.bg, borderColor: hairline }}
      >
        <a
          href={whatsappLink(t.whatsapp.book)}
          className="flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-white"
          style={{ backgroundColor: COLOR.accent }}
        >
          <WhatsAppIcon />
          {t.bookBtn}
        </a>
      </div>

      {/* Tombol mengambang: WhatsApp selalu keliatan (desktop — di mobile
          kegantiin bar sticky di atas), "kembali ke atas" cuma muncul
          setelah scroll jauh. Ijo #25D366 sengaja dipertahankan (bukan
          earth-tone) — itu warna resmi WhatsApp, orang langsung kenal
          ikonnya, sama kayak badge status emerald yang juga dipertahankan. */}
      <a
        href={whatsappLink(t.whatsapp.ask)}
        className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 sm:flex"
        style={{ backgroundColor: "#25D366" }}
        aria-label={t.waFloatLabel}
      >
        <WhatsAppIcon />
      </a>

      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-[88px] right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full text-lg shadow-lg transition-transform hover:scale-105 sm:bottom-24"
          style={{ backgroundColor: COLOR.ink, color: COLOR.bg }}
          aria-label={t.backToTop}
        >
          ↑
        </button>
      )}
    </div>
  );
}
